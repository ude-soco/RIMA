from django.urls import conf
from .DataExtractor import ConferenceDataCollector  as dataCollector 
from .models import (Author, Author_has_Papers, Event_has_Topic
                    ,Conf_Event_Topic
                    ,Conference_Event
                    ,Conference
                    ,Conference_Event_Paper
                    ,Conf_Event_keyword
                    ,Event_has_keyword
                    ,Author_Event_keyword
                    ,Author_has_Keyword
                    ,Author_Event_Topic
                    ,Author_has_Topic, PreloadedConferenceList)                  
from .serializers import ConferenceEventSerializer
from .TopicExtractor import getData,createConcatenatedColumn
from .topicutils import listToString
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter
from django.db.models import Q
import json
import operator
from collections import Counter
import base64
from matplotlib_venn import venn2, venn2_circles, venn2_unweighted
from matplotlib import pyplot as plt
from django.conf import settings
import re 

# Authentication headers
headers_windows = {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7',
                   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                   'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
                   'Accept-Encoding': 'none',
                   'Accept-Language': 'en-US,en;q=0.8',
                   'Connection': 'keep-alive'}


def split_restapi_url(url_path,split_char):
    print("the url path is:", url_path)
    url_path = url_path.replace("%20", " ")
    topics_split = url_path.split(split_char)
    return topics_split 


def getConferenceData(conference_name_abbr):
    result_data = {'series':[]}
    conference_events_result_data = []
    conference_events_years = []

    conference_preloaded_model_data = PreloadedConferenceList.objects.filter(conference_name_abbr = conference_name_abbr)[0]
    conference_events_model_objs = Conference_Event.objects.filter(conference_name_abbr = conference_name_abbr)
    conference_papers_model_objs = Conference_Event_Paper.objects.filter(conference_name_abbr = conference_name_abbr)
    author_has_papers_objs = Author_has_Papers.objects.filter(conference_name_abbr = conference_name_abbr)

    conference_full_name = conference_preloaded_model_data.conference_full_name
    conference_url = conference_preloaded_model_data.conference_url
    no_of_events = conference_events_model_objs.count()
    no_of_all_papers = conference_papers_model_objs.count()
    no_of_all_authors = author_has_papers_objs.values_list('author_id').distinct().count()

    event_based_papers_data = {'name': '', 'data':[]}
    event_based_papers_data['name'] = 'number of papers'
    event_based_authors_data = {'name':'' , 'data':[]}
    event_based_authors_data['name'] = 'number of authors'

    for conference_event in conference_events_model_objs:
        no_of_event_papers = Conference_Event_Paper.objects.filter(conference_event_name_abbr = conference_event.conference_event_name_abbr).count()
        no_of_event_authors = Author_has_Papers.objects.filter(conference_event_name_abbr =  conference_event.conference_event_name_abbr).values_list('author_id').distinct().count()

        event_based_papers_data['data'].append(no_of_event_papers)
        event_based_authors_data['data'].append(no_of_event_authors)

        conference_events_years.append(conference_event.conference_event_name_abbr)

    result_data['series'].append(event_based_papers_data)
    result_data['series'] .append(event_based_authors_data)
    
    #result_data['series'] = conference_events_result_data,
    result_data['conference_events'] = conference_events_years
    result_data['other_data'] = {
        'conference_full_name': conference_full_name,
        'conference_url' :conference_url,
        'no_of_events': no_of_events,
        'no_of_all_papers':no_of_all_papers,
        'no_of_all_authors': no_of_all_authors

    }


    print('!!!! Conference Data !!!!')
    print(conference_name_abbr)
    print(conference_full_name)
    print(conference_url)
    print(no_of_events)
    print(no_of_all_papers)
    print(no_of_all_authors)

    print(result_data)
    print('!!!! Conference Data !!!!')
    

    return result_data


def getConferencesList():
    data = []
    conferences = Conference.objects.all()
    for conference in conferences:
        conference_events = Conference_Event.objects.filter(
                            conference_name_abbr = conference.conference_name_abbr).values_list(
                            'conference_event_name_abbr',
                            flat=True)
        
        data.append({
            'platform_name' : conference.platform_name.platform_name,
            'platform_url' : conference.platform_name.platform_url,
            'conference_name_abbr' : conference.conference_name_abbr,
            'conference_url' : conference.conference_url,
            'no_of_events': conference_events.count(),
        })

    return data 


def addDataToConfEventModel(conference_name_abbr):
    conf_list = []
    conf_url = ""
    conf_complete_name = ""
    valid_events_urls_list = []
    conf_list,conf_url,conf_complete_name,valid_events_urls_list = dataCollector.construct_confList(conference_name_abbr,headers_windows)
    conf_list.sort()
    valid_events_urls_list.sort()
    stored_conferences = Conference.objects.filter(conference_name_abbr=conference_name_abbr).count()
    index = 0
    if stored_conferences:
        conference_obj = Conference.objects.get(conference_name_abbr=conference_name_abbr)
        if len(conf_list) != 0 and len(valid_events_urls_list) != 0:
            for event in valid_events_urls_list:
                conference_event = Conference_Event.objects.create(
                conference_event_name_abbr=conf_list[index],
                conference_event_url=event,
                conference_name_abbr=conference_obj
                )
                index+=1
                conference_event.save()

def addDataToConfPaperAndAuthorModels(conference_name_abbr,conf_event_name_abbr):
    conference_obj = Conference.objects.get(conference_name_abbr=conference_name_abbr)    
    conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr=conf_event_name_abbr)

    conference_event_url  = conference_event_obj.conference_event_url

    data = dataCollector.fetch_all_dois_ids(conference_name_abbr,conf_event_name_abbr, conference_event_url,headers_windows)
    data = dataCollector.extract_papers_data(data)

    for paper_data in data['paper_data']:
        if Conference_Event_Paper.objects.filter(paper_id = paper_data['paperId']).exists():
            pass
        else:
            event_paper = Conference_Event_Paper.objects.create(
            conference_event_name_abbr = conference_event_obj,
            paper_id = paper_data['paperId'],
            paper_doi = paper_data['doi'],
            title = paper_data['title'],
            url = paper_data['url'],
            year = paper_data['year'],
            abstract = paper_data['abstract'],
            #no_of_cititations = paper_data['doi'],
            citiations = len(paper_data['citations']),
            paper_venu = paper_data['venue'],
            conference_name_abbr = conference_name_abbr
            )
            event_paper.save()
            authors = paper_data['authors']

            print('###########++++++++++######### AUTHOR TEST ##################++++++++++++++############')
            print(conference_event_url)
            print(authors)
            print('###########++++++++++######### AUTHOR TEST ##################++++++++++++++############')

            for author_data in authors:
                print(author_data)
                if author_data['authorId']:
                    addDataToAuthorModels(author_data,event_paper,conference_obj,conference_event_obj)
                print(author_data)
    
   
    #print(data['paper_data'][1])

def addDataToAuthorModels(author_data,paper_obj,conference_obj,conference_event_obj):
    stored_author_check = Author.objects.filter(semantic_scolar_author_id = author_data['authorId']).exists()
    if not stored_author_check:
        author_obj = Author.objects.create(semantic_scolar_author_id = author_data['authorId'],author_name=author_data['name'],author_url=author_data['url'])
        author_has_papers_obj = Author_has_Papers(author_id=author_obj
                                                    ,paper_id=paper_obj
                                                    ,conference_name_abbr=conference_obj
                                                    ,conference_event_name_abbr=conference_event_obj)
    else:
        author_obj= Author.objects.get(semantic_scolar_author_id = author_data['authorId'])
        author_has_papers_obj = Author_has_Papers(author_id=author_obj
                                                    ,paper_id=paper_obj
                                                    ,conference_name_abbr=conference_obj
                                                    ,conference_event_name_abbr=conference_event_obj)

    author_has_papers_obj.save()    
    

def getAuthorsData(conference_name_abbr="", conference_event_name_abbr =""):
    data = []

    if conference_event_name_abbr == "":
        author_has_papers_objs = Author_has_Papers.objects.filter(conference_name_abbr_id=conference_name_abbr
                                                                ).values_list('author_id', flat=True
                                                                ).order_by('author_id').distinct()
    else:
        author_has_papers_objs = Author_has_Papers.objects.filter(conference_event_name_abbr_id=conference_event_name_abbr
                                                                ).values_list('author_id', flat=True
                                                                ).order_by('author_id').distinct()

    print(author_has_papers_objs, 'author_has_papers_objs')

    for author_obj in author_has_papers_objs:
        author_model_data = Author.objects.get(semantic_scolar_author_id=author_obj)
        author_event_papers_objs = Author_has_Papers.objects.filter(author_id_id=author_model_data.semantic_scolar_author_id
                                                                        ,conference_name_abbr=conference_name_abbr
                                                                        ).values_list()
       
        data.append({
            'semantic_scholar_author_id':author_model_data.semantic_scolar_author_id,
            'name':author_model_data.author_name,
            'semantic_scholar_url':author_model_data.author_url,
            'no_of_papers':len(author_event_papers_objs),
            'conference_name': conference_name_abbr,
        })

    sorted_data = sorted(data, key=lambda k: k['no_of_papers'], reverse=True)
    return sorted_data

def getAuthorInterests(publications_list,author_id,keyword_or_topic,num = 30):
    abstract_title_str = ""
    keywords = {}
    topics = {}
    
    for publication in publications_list:
        if publication['title'] and publication['abstract']:
                abstract_title_str +=  publication['title'] + " " + publication['abstract']

    if keyword_or_topic == 'keyword':
        keywords = getKeyword(abstract_title_str, 'Yake', num)
        return keywords

    elif keyword_or_topic == 'topic':
        
        keywords = getKeyword(abstract_title_str, 'Yake', num)
        relation, topics = wikifilter(keywords)

        return topics

    return ""


def getAuthorPublicationsInConf(author_id, conference_name_abbr, conference_event_name_abbr =""):
    result_data = []
    if conference_event_name_abbr == "":
        author_has_papers_objs = Author_has_Papers.objects.filter(conference_name_abbr_id=conference_name_abbr,author_id_id=author_id)
    else:
        print('here',conference_event_name_abbr)
        author_has_papers_objs = Author_has_Papers.objects.filter(conference_event_name_abbr_id=conference_event_name_abbr,author_id_id=author_id)
        print('here',author_has_papers_objs)


    for author_has_papers_obj in author_has_papers_objs:
        paper_data = Conference_Event_Paper.objects.get(paper_id=author_has_papers_obj.paper_id_id)
        result_data.append({
            'semantic_scholar_paper_id': paper_data.paper_id,
            'paper_doi':paper_data.paper_doi,
            'title':paper_data.title,
            'abstract':paper_data.abstract,
            'semantic_scholar_url':paper_data.url,
            'conference_event':paper_data.conference_event_name_abbr_id,
        })
   
    sorted_data = sorted(result_data, key=lambda k: k['conference_event'], reverse=True)
    return sorted_data


def addDataToAuthorKeywordAndTopicModels(conference_event_name_abbr):
    authors_publications_dicts_list = []
    abstract_title_str = ""

    authors_publications_event_objs = Author_has_Papers.objects.filter(conference_event_name_abbr_id = conference_event_name_abbr).values_list('author_id', flat=True).order_by('author_id').distinct()
    print(authors_publications_event_objs.count())
    
    for author in  authors_publications_event_objs:
        authors_publications_objs = Author_has_Papers.objects.filter(author_id_id =author)

        for author_publications_obj in authors_publications_objs:
            publication_obj = Conference_Event_Paper.objects.get(paper_id = author_publications_obj.paper_id_id)
            if publication_obj.title and publication_obj.abstract:
                abstract_title_str +=  publication_obj.title + " " + publication_obj.abstract

        keywords = getKeyword(abstract_title_str, 'Yake', 30)
        conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr=conference_event_name_abbr)
        author_obj = Author.objects.get(semantic_scolar_author_id =author)
        for key,value in keywords.items():
            stored_keyword_check = Author_Event_keyword.objects.filter(keyword = key).exists()
            
            if not stored_keyword_check:
                author_event_keyword_obj = Author_Event_keyword.objects.create(keyword=key,algorithm='Yake')
            else:
                author_event_keyword_obj = Author_Event_keyword.objects.get(keyword = key)

            stored_has_keyword_check = Author_has_Keyword.objects.filter(author_id = author_obj,
                                                                        keyword_id =author_event_keyword_obj,
                                                                        conference_event_name_abbr = conference_event_obj).exists()
            if not stored_has_keyword_check:                                                         
                author_has_keyword_obj = Author_has_Keyword(author_id = author_obj,
                                                            keyword_id =author_event_keyword_obj,
                                                            weight = value,
                                                            conference_event_name_abbr = conference_event_obj)
            else:
                pass
            
            author_has_keyword_obj.save()

        relation, topics = wikifilter(keywords)
        for key,value in topics.items():
            stored_topic_check = Author_Event_Topic.objects.filter(topic = key).exists()
            if not stored_topic_check:
                conf_event_topic_obj = Author_Event_Topic.objects.create(topic=key,algorithm='Yake')
            else:
                conf_event_topic_obj = Author_Event_Topic.objects.get(topic = key)
            
            stored_has_topic_check = Author_has_Topic.objects.filter(author_id = author_obj,
                                                                    topic_id =conf_event_topic_obj,
                                                                    conference_event_name_abbr = conference_event_obj).exists()
            if not  stored_has_topic_check:                                                      
                event_has_topic_obj = Author_has_Topic(author_id = author_obj,
                                                        topic_id =conf_event_topic_obj,
                                                        weight = value,
                                                        conference_event_name_abbr = conference_event_obj)
            else:
                pass                
                                        
            event_has_topic_obj.save()

        abstract_title_str = ""   
        
    #print(authors_publications_dicts_list[:3])

  
    return ""


def addDataToConferenceKeywordAndTopicModels(conference_event_name_abbr):
    abstract_title_str = ""
    conference_event_papers_data = []

    conference_event_papers_data = getEventPapersData(conference_event_name_abbr)

    if conference_event_papers_data:
        for paper_data in conference_event_papers_data:
            if paper_data.title and paper_data.abstract:
                abstract_title_str +=  paper_data.title + " " + paper_data.abstract 

    print(abstract_title_str)
    keywords = getKeyword(abstract_title_str, 'Yake', 30)

    print('KEYWORDS FIRST TEST', keywords)
    conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr =conference_event_name_abbr )
    for key,value in keywords.items():
        stored_keyword_check = Conf_Event_keyword.objects.filter(keyword = key).exists()
        if not stored_keyword_check:
            conf_event_keyword_obj = Conf_Event_keyword.objects.create(keyword=key,algorithm='Yake')
            event_has_keyword_obj = Event_has_keyword(conference_event_name_abbr=conference_event_obj,
                                                    keyword_id =conf_event_keyword_obj,
                                                    weight = value)
        else:
            stored_keyword_obj = Conf_Event_keyword.objects.get(keyword = key)
            event_has_keyword_obj = Event_has_keyword(conference_event_name_abbr=conference_event_obj,
                                                    keyword_id =stored_keyword_obj,
                                                    weight = value)
        event_has_keyword_obj.save()
    
    
    relation, final = wikifilter(keywords)
    for key,value in final.items():
        stored_topic_check = Conf_Event_Topic.objects.filter(topic = key).exists()
        if not stored_topic_check:
            conf_event_topic_obj = Conf_Event_Topic.objects.create(topic=key,algorithm='Yake')
            event_has_topic_obj = Event_has_Topic(conference_event_name_abbr=conference_event_obj,
                                                    topic_id =conf_event_topic_obj,
                                                    weight = value)
        else:
            stored_topic_check = Conf_Event_Topic.objects.get(topic = key)
            event_has_topic_obj = Event_has_Topic(conference_event_name_abbr=conference_event_obj,
                                                    topic_id =stored_topic_check,
                                                    weight = value)
        event_has_topic_obj.save()
    #print(' relation  WIKIS FIRST TEST', relation)
    print('final TOPICS WIKIS FIRST TEST', final)
   

    return True




def getEventPapersData(conference_event_name_abbr):
    conference_event_papers_data = []

    conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr=conference_event_name_abbr)
    if conference_event_obj:
        conference_event_papers_data = Conference_Event_Paper.objects.filter(conference_event_name_abbr=conference_event_obj)
       # print('PAPERS DATA',conference_event_papers_data)   
    return conference_event_papers_data




def getKeywordsfromModels(conference_event_name_abbr):
    data = []
    event_has_keyword_objs = Event_has_keyword.objects.filter(conference_event_name_abbr=conference_event_name_abbr)

    for event_has_keyword_obj in event_has_keyword_objs:
        conf_event_keyword_obj = Conf_Event_keyword.objects.get(keyword_id=event_has_keyword_obj.keyword_id_id)
        data.append({
            'keyword' : conf_event_keyword_obj.keyword,
            'weight' : event_has_keyword_obj.weight,

        })
        
    sorted_data = sorted(data, key=lambda k: k['weight'],reverse=True)    
    return sorted_data

def getTopicsfromModels(conference_event_name_abbr):
    data = []
    event_has_topic_objs = Event_has_Topic.objects.filter(conference_event_name_abbr=conference_event_name_abbr)

    for event_has_topic_obj in event_has_topic_objs:
        conf_event_topic_obj = Conf_Event_Topic.objects.get(topic_id=event_has_topic_obj.topic_id_id)
        data.append({
            'topic' : conf_event_topic_obj.topic,
            'weight' : event_has_topic_obj.weight,

        })
    sorted_data = sorted(data, key=lambda k: k['weight'],reverse=True)   

    #print(' **** READ TOPICS TEST **** ',sorted_data, ' **** READ TOPICS TEST **** ')
    return  sorted_data


def getAbstractbasedonKeyword(conference_event_name_abbr,keyword):
    conference_event_papers_data = getEventPapersData(conference_event_name_abbr)
    filtered_conference_event_papers_data = conference_event_papers_data.filter(Q(abstract__icontains=keyword)
                                               | Q(title__icontains=keyword))
    #print('KEYWORD DATA *********************** ' , filtered_conference_event_papers_data)

    titles_abstracts = []
    if filtered_conference_event_papers_data:
        for paper_data in filtered_conference_event_papers_data:
            if paper_data.title and paper_data.abstract:
                titles_abstracts.append({
                    'title': paper_data.title,
                    'abstarct': paper_data.abstract,
                    'year' : paper_data.year,
                    'venue': paper_data.paper_venu,
                    'paper_id': paper_data.paper_id
                }) 
    
   # print('titles_abstracts *********************** ' , titles_abstracts)

    return titles_abstracts

# can be removed
def getSharedWordsBetweenEventsOld(conference_events_list,keyword_or_topic):
    models_data = []
    first_event = conference_events_list[0]
    shared_word = []
    dict_list = []
    result_data = []
    models_data_first_event = []
    conference_event_data = []

    if keyword_or_topic == 'topic':
        models_data_first_event = getTopicsfromModels(first_event)
    elif keyword_or_topic == 'keyword':
        models_data_first_event = getKeywordsfromModels(first_event)


    for model_data in models_data_first_event:
        models_data.append({
            'word': model_data[keyword_or_topic],
            'weight': [model_data['weight']],
        })

    for conference_event in conference_events_list[1:]:
        if keyword_or_topic == 'topic':
            conference_event_data = getTopicsfromModels(conference_event)
        elif keyword_or_topic == 'keyword':
            conference_event_data = getKeywordsfromModels(conference_event)

        for filter_word in conference_event_data:
            shared_word = list(filter(lambda event: event['word'] == filter_word[keyword_or_topic], models_data))
            index = next((i for i, item in enumerate(models_data) if item["word"] == filter_word[keyword_or_topic]), None)
            if shared_word:
                models_data[index]['weight'].append(filter_word['weight'])

    for model_data in models_data: 
        if len(model_data['weight']) == len(conference_events_list):   
            dict_list.append(model_data)
    
    result_data.append(dict_list)
    result_data.append(conference_events_list)

    print('result_data stacked bar')
    print(result_data)
    print('result_data stacked bar')

    return result_data



def getSharedWordsBetweenEvents(conference_events_list,keyword_or_topic):
    shared_words = []
    shared_words_final_data = []
    result_data = []
    conference_event_data = []
    all_words = []

    for conference_event in conference_events_list:
        if keyword_or_topic == 'topic':
            conference_event_data = getTopicsfromModels(conference_event)
        elif keyword_or_topic == 'keyword':
            conference_event_data = getKeywordsfromModels(conference_event)

        for data in conference_event_data:
            all_words.append(data[keyword_or_topic])


    shared_words = list(set([word for word in all_words if all_words.count(word) == len(conference_events_list)]))

    for word in shared_words:
        words_weights = []
        for conference_event in conference_events_list:
            conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr = conference_event)
            conf_event_word_data = getWordWeightEventBased([conference_event_obj],word,keyword_or_topic)
            words_weights.append(conf_event_word_data[0]['weight'])
        shared_words_final_data.append({
            'word': word,
            'weight': words_weights
        })

    #result_data.append(shared_words_final_data)
    #result_data.append(conference_events_list)
    result_data = [shared_words_final_data,conference_events_list]

    print('result_data stacked bar NEW')
    print(result_data)
    print('result_data stacked bar NEW')
 
    return result_data


def getSharedWordsBetweenConferences(conferences_list,keyword_or_topic):
    conferences_words = []
    one_conference_words = []
    models_words = []
    shared_words = []

    for conference in conferences_list:
        conference_event_objs = Conference_Event.objects.filter(conference_name_abbr = conference)
        for conference_event in conference_event_objs:
            if keyword_or_topic == 'topic':
                models_words = getTopicsfromModels(conference_event.conference_event_name_abbr)
            elif keyword_or_topic == 'keyword':
                models_words = getKeywordsfromModels(conference_event.conference_event_name_abbr)

            for word in models_words[:10]:
                one_conference_words.append(word[keyword_or_topic])
        conferences_words.append(one_conference_words)
        one_conference_words=[]


    print('conferences_words')
    print(conferences_words)    
    print('conferences_words')


    shared_words = set.intersection(*map(set,conferences_words)) 

    print('shared_words')
    print(shared_words)    
    print('shared_words')

    

    return shared_words


def getWordWeightEventBased(conference_event_objs,word,keyword_or_topic):
    result_data = []

    if keyword_or_topic == 'topic':
        word_object = Conf_Event_Topic.objects.get(topic=word)
    elif keyword_or_topic == 'keyword':
        word_object = Conf_Event_keyword.objects.get(keyword=word)

    print('topic_object')
    print(word_object)
    print('topic_object')

    for conference_event in conference_event_objs:
        if keyword_or_topic == 'topic':
            check_exist = Conf_Event_Topic.objects.filter(conference_event_name_abbr=conference_event.conference_event_name_abbr, topic_id=word_object.topic_id).exists()
            if check_exist:
                weight = Event_has_Topic.objects.get(conference_event_name_abbr=conference_event.conference_event_name_abbr, topic_id=word_object.topic_id).weight
                result_data.append({
                    'word': word,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'weight':weight,
                    'year' : re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })
            else:
                result_data.append({
                    'word': word,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'weight':0,
                    'year' : re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })

        elif keyword_or_topic == 'keyword':
            check_exist = Conf_Event_keyword.objects.filter(conference_event_name_abbr=conference_event.conference_event_name_abbr, keyword_id=word_object.keyword_id).exists()
            if check_exist:
                weight = Event_has_keyword.objects.get(conference_event_name_abbr=conference_event.conference_event_name_abbr, keyword_id=word_object.keyword_id).weight
                result_data.append({
                    'word': word,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'weight':weight,
                    'year' : re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })
            else:
                result_data.append({
                    'word': word,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'weight':0,
                    'year' : re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })
    #print('############## Weights #################')
    #print(result_data)
    #print('############## Weights #################')
    
    return result_data


def getYearsRangeOfConferences(conferences_list, all_or_shared):
    years = []
    result_data = []
    years_filtering_list = []
    years_filtering_list = []

    for conference in conferences_list:
        conference_obj = Conference.objects.get(conference_name_abbr=conference)
        conference_event_objs = Conference_Event.objects.filter(conference_name_abbr = conference_obj)
        intermediate_list = []
        for conference_event_obj in conference_event_objs:
            confernece_year = re.sub("[^0-9]", "", conference_event_obj.conference_event_name_abbr.split('-')[0])
            if re.match("^\d{2}$", confernece_year):
                confernece_year = '19' + confernece_year
            intermediate_list.append(confernece_year)
        years.append(intermediate_list)

    
    if all_or_shared == 'shared':
        for years_list in years:
            years_list = list(set(years_list))
            years_filtering_list.append(years_list)
        years_filtering_list = [y for x in years_filtering_list for y in x]
        result_data = list(set([year for year in years_filtering_list if years_filtering_list.count(year) == len(conferences_list)]))
    elif all_or_shared == 'all':
        result_data = sorted(list(set().union(*years)))
    
    print('#################### result_data ######################')
    print(result_data)
    print('#################### result_data ######################')

    
    return result_data



def generateVennPhoto(list_words_first_event,list_words_second_event,list_intersect_first_and_second,first_event,second_event, keyword_or_topic):
    
    print('################### TEST VENN ###################')
    print(list_words_first_event)
    print('+++++++++')
    print(list_words_second_event)
    print('+++++++++')
    print(list_intersect_first_and_second)

    print('################### TEST VENN ###################')
    fig, ax = plt.subplots()

    ax.set_title('Common '+ keyword_or_topic + 's between ' + str(first_event) + ' and ' + str(second_event),fontsize=12)

    v = venn2_unweighted(subsets=(40, 40, 25),
                            set_labels=[str(first_event), str(second_event)])
    v.get_patch_by_id('10').set_alpha(0.3)
    v.get_patch_by_id('10').set_color('#86AD41')
    v.get_patch_by_id('01').set_alpha(0.3)
    v.get_patch_by_id('01').set_color('#7DC3A1')
    v.get_patch_by_id('11').set_alpha(0.3)
    v.get_patch_by_id('11').set_color('#3A675C')
    v.get_label_by_id('10').set_text('\n'.join(
        list(set(list_words_first_event) - set(list_words_second_event))))
    label1 = v.get_label_by_id('10')
    label1.set_fontsize(7)
    v.get_label_by_id('01').set_text('\n'.join(
        list(set(list_words_second_event) - set(list_words_first_event))))
    label2 = v.get_label_by_id('01')
    label2.set_fontsize(7)
    v.get_label_by_id('11').set_text('\n'.join(list_intersect_first_and_second))
    label3 = v.get_label_by_id('11')
    label3.set_fontsize(7)
    plt.axis('off')
    plt.savefig(settings.TEMP_DIR + '/venn.png')
    with open(settings.TEMP_DIR + '/venn.png', "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')

    ctx = image_data

    return ctx

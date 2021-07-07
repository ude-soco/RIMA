from .DataExtractor import ConferenceDataCollector  as dataCollector 
from .models import Event_has_Topic,Conf_Event_Topic,Conference_Event, Conference,Conference_Event_Paper,Conf_Event_keyword,Event_has_keyword
from .serializers import ConferenceEventSerializer
from .TopicExtractor import getData,createConcatenatedColumn
from .topicutils import listToString
import json
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter
import operator
from django.db.models import Q


# Authentication headers
headers_windows = {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7',
                   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                   'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
                   'Accept-Encoding': 'none',
                   'Accept-Language': 'en-US,en;q=0.8',
                   'Connection': 'keep-alive'}


def split_restapi_url(url_path):
    print("the url path is:", url_path)
    url_path = url_path.replace("%20", " ")
    topics_split = url_path.split(r"/")
    return topics_split 


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

def addDataToConfPaperModel(conference_name_abbr,conf_event_name_abbr):    
    conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr=conf_event_name_abbr)
    conference_event_url  = conference_event_obj.conference_event_url
    data = dataCollector.fetch_all_dois_ids(conference_name_abbr,conf_event_name_abbr, conference_event_url,headers_windows)
    data = dataCollector.extract_papers_data(data)
    for paper_data in data['paper_data']:
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
        )
        event_paper.save()
    
    print(conference_event_url)
    #print(data['paper_data'][1])
   

def getEventPapersData(conference_event_name_abbr):
    conference_event_papers_data = []

    conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr=conference_event_name_abbr)
    if conference_event_obj:
        conference_event_papers_data = Conference_Event_Paper.objects.filter(conference_event_name_abbr=conference_event_obj)
       # print('PAPERS DATA',conference_event_papers_data)   
    return conference_event_papers_data


def addDatatoKeywordAndTopicModels(conference_event_name_abbr):
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
    #print('final TOPICS WIKIS FIRST TEST', final)
   

    return True


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
                }) 
    
   # print('titles_abstracts *********************** ' , titles_abstracts)

    return titles_abstracts

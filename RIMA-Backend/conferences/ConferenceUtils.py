from .DataExtractor import ConferenceDataCollector  as dataCollector 
from .models import Conference_Event, Conference,Conference_Event_Paper,Conf_Event_keyword,Event_has_keyword
from .serializers import ConferenceEventSerializer
from .TopicExtractor import getData,createConcatenatedColumn
from .topicutils import listToString
import json
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter


# Authentication headers
headers_windows = {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7',
                   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                   'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
                   'Accept-Encoding': 'none',
                   'Accept-Language': 'en-US,en;q=0.8',
                   'Connection': 'keep-alive'}


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
    abstract_title_str = ""
    conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr=conference_event_name_abbr)
    if conference_event_obj:
        conference_event_papers_data = Conference_Event_Paper.objects.filter(conference_event_name_abbr=conference_event_obj)
        if conference_event_papers_data:
            for paper_data in conference_event_papers_data:
                if paper_data.title and paper_data.abstract:
                    abstract_title_str +=  paper_data.title + " " + paper_data.abstract   
    return abstract_title_str


def addDatatoKeywordAndTopicModels(conference_event_name_abbr):
    abstract_title_str = ""
    abstract_title_str = getEventPapersData(conference_event_name_abbr)
    print(abstract_title_str)
    keywords = getKeyword(abstract_title_str, 'Yake', 30)
    print('KEYWORDS FIRST TEST', keywords)
    conference_event_obj = Conference_Event.objects.get(conference_event_name_abbr =conference_event_name_abbr )
    for key,value in keywords.items():
        stored_keyword_check = Conf_Event_keyword.objects.filter(keywrod = key).exists()
        if not stored_keyword_check:
            conf_event_keyword_obj = Conf_Event_keyword.objects.create(keywrod=key,algorithm='Yake')
            event_has_keyword_obj = Event_has_keyword(conference_event_name_abbr=conference_event_obj,
                                                    keyword_id =conf_event_keyword_obj,
                                                    wiegth = value)
        else:
            stored_keyword_obj = Conf_Event_keyword.objects.get(keywrod = key)
            event_has_keyword_obj = Event_has_keyword(conference_event_name_abbr=conference_event_obj,
                                                    keyword_id =stored_keyword_obj,
                                                    wiegth = value)
        event_has_keyword_obj.save()
    
    
    #relation, final = wikifilter(keywords)
    
    #print(' relation  WIKIS FIRST TEST', relation)
    #print('final TOPICS WIKIS FIRST TEST', final)
   

    return True
#done by Basem
from urllib.request import urlopen,Request
from bs4 import BeautifulSoup
import requests
import re
import urllib.error 
import urllib.parse

# Selenium Import
from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException




# global variables
# Authentication headers_windows (tested only on for Windows 10 Home OS! ) 
headers_windows = {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7',
                   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                   'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
                   'Accept-Encoding': 'none',
                   'Accept-Language': 'en-US,en;q=0.8',
                   'Connection': 'keep-alive'}

# conference related variables
conference_name = f''

# URLs
dblp_url = f'https://dblp.org/db/conf/'
semantic_scholar_url_api = f'https://api.semanticscholar.org/v1/paper/'
semantic_scholar_url_search = f'https://www.semanticscholar.org'
semantic_scholar_search_url_api =f'https://api.semanticscholar.org/graph/v1/paper/search?query='

# regex
conference_events = r'\/%s\d+(\-[1-9])*\.' # examples: aied2020-1, edm2020, lak2020 , lak 2020, aadebug93 ... etc




def fetch_soup(url):
    """scraps the html content of a given web-page

    Args:
        url (str): the URL of the page whose HTML needs to be scrapped

    Returns:
        obj: Beautifulsoup Object of the page
    """    
    try:
        raw_request = Request(url,headers=headers_windows)
        resp = urlopen(raw_request)
        html = resp.read()
        soup = BeautifulSoup(html,'html.parser')
        soup.prettify()
    
    except urllib.error.HTTPError as e:
        print('   ****    ')
        print(e)
        print('please check the name of the conference')
    else:
        print('   ****    ')
        print( 'A page was downloaded successfully')
        return soup


def fetch_confernces_names_listed_in_html(platform, index):
    """gets all conferences list from dblp

    Args:
        platform (str): the name of the platform where the conference names reside. For example, dblp
        index (int): starts from 1 and increased by 100 to navigate bestween the conference lists 

    Returns:
        list: list of dicts with general data of every conference collected
    """    
    preloaded_data = []
    conference_list_element =  ""
    if platform == 'dblp':
        url = f'https://dblp.org/db/conf/index.html?pos=' + f'{index}'
        soup =  fetch_soup(url)
        conference_list_element = soup.find("div", {"class": "hide-body"}).find_all("a")
        for inner_element in conference_list_element:
            preloaded_data.append({
              'conference_url' : inner_element["href"],
              'conference_name_abbr' : inner_element["href"].split(r"/")[-2],
              'conference_full_name' : inner_element.text,    
            })    
    return preloaded_data


def search_publicationid_in_semscholar_api_search(semscholar_titles):
    """Uses Semantic Scholar API Keyword Search to fetch paper IDs -- used so far for a list of less than 80 titles

    Args:
        semscholar_titles (list): list of paper titles

    Returns:
        list: list of paper IDs
    """    
    print(' ')
    print('****','titles list length',len(semscholar_titles), '****')
    print('****','Searching ids of ',len(semscholar_titles), ' publications using Keyword API Search' , '****')
    print(' ')   
    publications_ids = []
    
    for title in semscholar_titles:
        paper_data = requests.get(f'{semantic_scholar_search_url_api}{title}').json()

        if 'data' in paper_data:
            print(paper_data['data'][0]['paperId'])
            publications_ids.append(paper_data['data'][0]['paperId'])

    print(' ')
    print(' **** ','ids list length',publications_ids, ' **** ')
    print(' ')
    
    return publications_ids


def search_publicationid_in_semscholar_selenium(semscholar_titles):
    """Uses Selenium to fetch paper IDs -- used so far for a list of more than 80 titles

    Args:
        semscholar_titles (list): list of paper titles

    Returns:
        list: list of paper IDs
    """    
    print(' ')
    print('****','titles list length',len(semscholar_titles), '****')
    print('****','Searching ids of ',len(semscholar_titles), ' publications using Selenium' , '****')
    print(' ')   
    publications_ids = []
    elements_list = []
    option = webdriver.ChromeOptions()
    option.add_argument('headless')
    PATH = "C:\Program Files (x86)\chromedriver.exe"
    driver = webdriver.Chrome(PATH,options=option)

    for title in semscholar_titles:
        driver.get(semantic_scholar_url_search)
        search = driver.find_element_by_name("q")
        search.send_keys(title)
        search.send_keys(Keys.RETURN)                           
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME , "result-page")))
            elements_list = element.find_elements_by_tag_name("div")
            id = elements_list[0].get_attribute('data-paper-id')
            print(id)
            publications_ids.append(id)
        except TimeoutException:
            print('Timeout - No tag found in this page')
    print(' ')
    print(' **** ','ids list length',len(publications_ids), ' **** ')
    print(' ')
    return publications_ids

def fetch_data_from_html_tags(conf_name,soup,html_element,element_dict, inner_tag , inner_tag_arribute, if_doi, is_recursive):
    """Fetch data from different html tags

    Args:
        conf_name (str): the name of the conference
        soup (obj): Beautifulsoup Object of the page
        html_element (str): html search tag
        element_dict (dict): tag with specific value 
        inner_tag (str): html inner tag in a searched tag 
        inner_tag_arribute (str): html inner tag attribute in a searched tag
        if_doi (bool): true, if the DOIs are to be exctracted
        is_recursive (bool): true, if the paper IDs are to be exctracted using Selenium or Semantic Scholar API Keyword Search 

    Returns:
        different datatypes based on the case
    """    
    links_list  = []
    loop_must_break = False
    semscholar_titles = []
    conf_events_complete_names = []
    conf_complete_name = '' 
    print(' ')
    print('html tags: ',html_element,' **** ',element_dict,' **** ',links_list,' **** ', inner_tag ,' **** ', inner_tag_arribute)   
    print(' ')
    found_elements = soup.find_all(html_element, element_dict)
    
    # if dois are not available in dblp -> the publication IDs are fetched from semanticscholar
    if html_element == "cite" and is_recursive:
        for matched_elements in found_elements:
            semscholar_titles.append(matched_elements.find_all('span',{"class": "title"})[0].text)
        if len(semscholar_titles) > 80:    
            return search_publicationid_in_semscholar_selenium(conf_name,semscholar_titles)
        elif len(semscholar_titles) <= 80:
            return search_publicationid_in_semscholar_api_search(semscholar_titles)
    elif html_element == "nav":
        for matched_elements in found_elements:
            for element in matched_elements:
                if inner_tag == "a":
                    searched_text = element.find(inner_tag)[inner_tag_arribute]
                    if if_doi:
                        if element.select("li:nth-of-type(2)")[0].has_attr('data-doi'):
                            links_list.append(element.select("li:nth-of-type(2)")[0]['data-doi'])
                        else:
                            print(' ')
                            print('**** text has no DOI -> Searching for the publication id in Semantic Scholar: ****')
                            print('**** this may take up to 5 mins ****')
                            print(' ')
                            return fetch_data_from_html_tags(conf_name,soup,"cite",{"class": "data"},"","",False,True)
                            loop_must_break = True
                            break
                    else:
                        links_list.append(searched_text)
            if loop_must_break: 
                break 
    elif html_element == "h1":
        conf_complete_name = found_elements[0].text
        print(conf_complete_name)
        return conf_complete_name
    return links_list

 
def construct_confList(conf_name):
    """constructs confernce list based on the availabe years of the conference on dblp.

    Args:
        conf_name (str): conference name abbreviation. For example, LAK

    Returns:
        list: names of the conference events
        str : dblp conference URL
        str : conference complete name
        list : valid conference event URLs 
    """    
    print(' ')
    print('  ****  ','Conference: ', conf_name , '  ****  ')
    print(' ')
    conf_list = []
    conf_events_all_urls = []
    valid_events_urls =[]
    soup = []
    conf_url = f'{dblp_url}{conf_name}'
    conf_complete_name = ""
    try:
        
        soup = fetch_soup(conf_url)
        if soup :
            conf_complete_name = fetch_data_from_html_tags(conf_name,soup,"h1",{},"" ,"",False,False)
            conf_events_all_urls = fetch_data_from_html_tags(conf_name,soup,"nav",{"class": "publ"},"a" ,"href",False,False)
        print('**** conference url: ',conf_url, ' ****')
        print(' ')
        print('**** all links ****')
        print(' ')
        if len(conf_events_all_urls) != 0:
            for event_url in conf_events_all_urls:
                match = re.search(conference_events % conf_name, event_url,re.IGNORECASE)
                if match:
                    print(event_url,'    contains valid conference event')
                    valid_events_urls.append(event_url)
                    print(' ')
                    conf = event_url[match.start():match.end()]
                    conf_list.append(conf[1:-1])    # [1:-1] removes the dot at the end and "/" from the beginning 
                else: 
                    print(event_url,'    contains no valid conference event')
        return list(set(conf_list)),conf_url, conf_complete_name, valid_events_urls  # removing duplicates
    
    except AttributeError as error:
        # Output expected AttributeErrors.
        print('   ****    ')
        print(error) 
        print('NoneType Error please, check the searched attribute or pattern')


def fetch_all_dois_ids(conference_name_abbr,conf_event_name_abbr, url):
    """fetch all dois or ids of conference publications

    Args:
        conference_name_abbr (str): conference name abbreviation whose paper IDs/DOIs are to be collected
        conf_event_name_abbr ([type]): conference event name abbreviation whose paper IDs/DOIs are to be collected
        url (str): conference event URL

    Returns:
        dict: conference complete name, conference event name and list of paper DOIs/IDs
    """    
    data = {
            'conf_event_complete_name': '',
            'conf_event_name_abbr' : '',
            'dois-ids' : [] 
           }
    try:
        event_html = fetch_soup(url)
        if event_html:
            dois_ids  = fetch_data_from_html_tags(conference_name_abbr,event_html,"nav",{"class": "publ"},"a","href",True,False)
            conf_event_complete_name = fetch_data_from_html_tags(conference_name_abbr,event_html,"h1",{},"" ,"",False,False)

            print(' ')
            print(' **** ','Publications\' dois/ids of the conference event: **** ')
            for index in range(len(dois_ids)):
                print('doi/id ',index+1,' ', dois_ids[index])

            data['dois-ids'] = dois_ids
            data['conf_event_complete_name'] = conf_event_complete_name
            data['conf_event_name_abbr'] = conf_event_name_abbr
    except AttributeError as error:
        print('   ****    ')
        print('NoneType Error please, check the searched attribute or pattern')
    return data





def extract_papers_data(data_dict_event):
    """fetchs paper data from semantic scholar AP given their list of dois or ids
       examples:
            #DOI-https://api.semanticscholar.org/v1/paper/10.1038/nrn3241
            #ID-https://api.semanticscholar.org/v1/paper/0796f6cd7f0403a854d67d525e9b32af3b277331

    Args:
        data_dict_event (dict): contains list of paper DOIs/IDs

    Returns:
        dict: contains paper data
    """    
    data_dict_event['paper_data'] = []
    for value in data_dict_event['dois-ids']:
        paper_data = requests.get(f'{semantic_scholar_url_api}{value}').json()
        data_dict_event['paper_data'].append(paper_data)
    return data_dict_event



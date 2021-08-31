#done by Basem

#!django-admin --version
from urllib.request import urlopen,Request
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
import json
import os
import pickle
import numpy as np
from requests.exceptions import HTTPError
import urllib.error 
import urllib.parse

# Selenium Import
from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
import time

import json
from collections import defaultdict



# global variables

'''
These global variables are mainly for collecting conferneces' data listed in dblp (dblp.org/db/conf/index.html),
whereas the publications' Data are collected from Semantic Scholar (semanticscholar.org) with the of Semantic Scholar API.
Two ways are used based on my observations for the URL patterns of the conferences as well as the publications:
  -> Using the publications' dois, if they are directly available in dblp.
  -> Searching for the publication in Semantic Scholar with its available name in dblp.
  
'''
# Authentication Headers (tested only on for Windows 10 Home OS! ) 
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



# pulls the pages html content
def fetch_soup(url,headers):
    try:
        raw_request = Request(url,headers=headers)
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

# get all conferences list from dblp based on the index Ex.: index=1, index=101, index=201, ... etc
#  -> can be extended to other platforms
# https://dblp.org/db/conf/index.html?pos=1
def fetch_confernces_names_listed_in_html(platform, index):
    preloaded_data = []
    conference_list_element =  ""
    if platform == 'dblp':
        url = f'https://dblp.org/db/conf/index.html?pos=' + f'{index}'
        soup =  fetch_soup(url,headers_windows)
        conference_list_element = soup.find("div", {"class": "hide-body"}).find_all("a")
        for inner_element in conference_list_element:
            preloaded_data.append({
              'conference_url' : inner_element["href"],
              'conference_name_abbr' : inner_element["href"].split(r"/")[-2],
              'conference_full_name' : inner_element.text,    
            })    
    return preloaded_data


def search_publicationid_in_semscholar_api_search(conf_name,semscholar_titles):
    print(' ')
    print('****','titles list length',len(semscholar_titles), '****')
    print('****','Searching ids of ',len(semscholar_titles), ' publications using Keyword API Search' , '****')
    print(' ')   
    publications_ids = []
    elements_list = []
    
    for title in semscholar_titles:
        paper_data = requests.get(f'{semantic_scholar_search_url_api}{title}').json()

        if 'data' in paper_data:
            print(paper_data['data'][0]['paperId'])
            publications_ids.append(paper_data['data'][0]['paperId'])

    print(' ')
    print(' **** ','ids list length',publications_ids, ' **** ')
    print(' ')
    
    return publications_ids

# needs selenium

def search_publicationid_in_semscholar_selenium(conf_name,semscholar_titles):
    """[summary]

    Args:
        conf_name ([type]): [description]
        semscholar_titles ([type]): [description]

    Returns:
        [type]: [description]
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

def fetch_dois_ids_from_html(conf_name,soup,html_element,element_dict, inner_tag , inner_tag_arribute, if_doi, is_recursive,headers):
    links_list  = []
    loop_must_break = False
    semscholar_titles = []
    conf_events_complete_names = []
    conf_complete_name = '' 
    print(' ')
    print('html tags: ',html_element,' **** ',element_dict,' **** ',links_list,' **** ', inner_tag ,' **** ', inner_tag_arribute)   
    print(' ')
    found_elements = soup.find_all(html_element, element_dict)
    
    # if dois are not available in dblp -> the publications ids are fetched from semanticscholar
    if html_element == "cite" and is_recursive:
        for matched_elements in found_elements:
            semscholar_titles.append(matched_elements.find_all('span',{"class": "title"})[0].text)
        if len(semscholar_titles) > 80:    
            return search_publicationid_in_semscholar_selenium(conf_name,semscholar_titles)
        elif len(semscholar_titles) <= 80:
            return search_publicationid_in_semscholar_api_search(conf_name,semscholar_titles)
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
                            return fetch_dois_ids_from_html(conf_name,soup,"cite",{"class": "data"},"","",False,True,headers)
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




# constructs confernce list based on the availabe years of the conference on dblp. 
def construct_confList(conf_name,headers):
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
        
        soup = fetch_soup(conf_url,headers)
        if soup :
            conf_complete_name = fetch_dois_ids_from_html(conf_name,soup,"h1",{},"" ,"",False,False,headers)
            conf_events_all_urls = fetch_dois_ids_from_html(conf_name,soup,"nav",{"class": "publ"},"a" ,"href",False,False,headers)
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


# fetch conference html content from dblp based on a specific year oder multiple years. 
def fetch_events_html_raw_data(conf_name,years,headers):
    matching_conf_event = []
    conf_list = []
    complete_soup = []
    

    try:
        conf_list,conf_url,conf_complete_name = construct_confList(conf_name,headers) # construct conference list
        conf_list.sort()
        print(' ')
        print('A list of all the available events of the conference: ', conf_name)
        print(conf_list)
        print(' ')
        if conf_list:
            for year in years:
                matching_conf_event.append([available_year for available_year in conf_list if str(year) in available_year])  # check if year is valid
            
            matching_conf_event_flat = sum(matching_conf_event,[])
            if not matching_conf_event_flat:
                print('   ****    ')
                print("The Conference %s was not held in year" % conf_name,year)
            else:
                print('   ****    ')
                for conf_event in matching_conf_event_flat:
                    complete_soup.append(fetch_soup(f'{dblp_url}{conf_name}/{conf_event}',headers))
                print("The Conference %s has the event/s :  " % conf_name )
                print(matching_conf_event_flat)
                return complete_soup, matching_conf_event_flat,conf_url,conf_complete_name 
            
    except AttributeError as error:
        print(error)   


# fetch all dois or ids of the conference publications
def fetch_all_dois_ids_old(conf_name, years,headers):
    complete_doi_ids_dict= {}
    complete_events_names_dict = {}
    conf_event_url = f''
    #conf_event_url_list = []
    try:
        events_html,available_years_list,conf_url,conf_complete_name = fetch_events_html_raw_data(conf_name,years,headers)
        if events_html:
            for index in range(len(events_html)):
                soup = events_html[index]
                dois_ids  = fetch_dois_ids_from_html(conf_name,soup,"nav",{"class": "publ"},"a","href",True,False,headers)
                conf_event_complete_name = fetch_dois_ids_from_html(conf_name,soup,"h1",{},"" ,"",False,False,headers)

                print(' ')
                print(' **** ','Publications\' dois/ids of the conference event: ', available_years_list[index] ,': **** ')
                conf_event_url = f'{dblp_url}{conf_name}/{available_years_list[index]}'
                complete_events_names_dict.setdefault(conf_event_complete_name, []).append(conf_event_url)
                

                print(complete_events_names_dict.items())
                
                #print(conf_event_url)
                #conf_event_url_list.append(conf_event_url)
                for index in range(len(dois_ids)):
                    print('doi/id ',index+1,' ', dois_ids[index])
                    #complete_doi_ids_dict.append(dois_ids[index])
                    complete_doi_ids_dict.setdefault(conf_event_url, []).append(dois_ids[index])

            
            
    except AttributeError as error:
        print('   ****    ')
        print('NoneType Error please, check the searched attribute or pattern')
    return complete_doi_ids_dict, conf_url ,conf_complete_name,complete_events_names_dict


# fetch all dois or ids of the conference publications
def fetch_all_dois_ids(conference_name_abbr,conf_event_name_abbr, url,headers):
    data = {
            'conf_event_complete_name': '',
            'conf_event_name_abbr' : '',
            'dois-ids' : [] 
           }
    try:
        event_html = fetch_soup(url,headers)
        if event_html:
            dois_ids  = fetch_dois_ids_from_html(conference_name_abbr,event_html,"nav",{"class": "publ"},"a","href",True,False,headers)
            conf_event_complete_name = fetch_dois_ids_from_html(conference_name_abbr,event_html,"h1",{},"" ,"",False,False,headers)

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



#DOI-https://api.semanticscholar.org/v1/paper/10.1038/nrn3241
#ID-https://api.semanticscholar.org/v1/paper/0796f6cd7f0403a854d67d525e9b32af3b277331
#fetching paper data from semantic scholar AP given their list of dois or ids
def extract_papers_data(data_dict_event):
    data_dict_event['paper_data'] = []
    for value in data_dict_event['dois-ids']:
        paper_data = requests.get(f'{semantic_scholar_url_api}{value}').json()
        data_dict_event['paper_data'].append(paper_data)
    return data_dict_event
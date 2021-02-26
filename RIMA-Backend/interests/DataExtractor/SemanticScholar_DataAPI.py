# Done by Swarna - Extracting data from Semantic Scholar
# Elephant SQL Details - just in case,if there is any problem,user can check by logging into the particular url
# DB URL - https://api.elephantsql.com/console/9d1e1117-ddbf-47b0-a1cc-9afd7507a175/browser
# login credentials - email:sampletestte@gmail.com
#password- P86PZSaec8Hua@Q

# In[298]:

#!django-admin --version

# In[6]:

from urllib.request import urlopen, Request
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
import json
import os
import urllib.parse as up
import psycopg2
import pickle
import numpy as np

# In[222]:


def make_conflist(start, end):
    list_years = []
    for val in range(start, end + 1):
        list_years.append(str(val))
    append_str = 'lak'
    pre_res = [append_str + sub for sub in list_years]
    return pre_res


# In[242]:
'''
Parsing the dblp index here to get only LAK Conference data
'''


def fetch_raw_data(year):
    raw_request = Request(f'https://dblp.org/db/conf/lak/{year}')
    #raw_request.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:78.0) Gecko/20100101 Firefox/78.0')
    raw_request.add_header(
        'Accept',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    )
    resp = urlopen(raw_request)
    html = resp.read()
    # print(html)
    soup = BeautifulSoup(html, 'html.parser')
    soup.prettify()
    return soup


# In[243]:


def fetch_links(value):
    doi_urls_list = []
    if value == 'lak2017':
        print("2017")
        for link in fetch_raw_data(value).findAll("a"):
            if link.has_attr('href'):
                # print(link['href'])
                if "dl.acm.org" in link['href']:
                    # print(link['href'])
                    doi_urls_list.append(link['href'])
    else:
        for link in fetch_raw_data(value).findAll("a", {"itemprop": "url"}):
            doi_urls_list.append(link['href'])
        # print(link['href'])
    return doi_urls_list


# In[250]:


def extract_doi(value):
    doi_refined = []
    for val in fetch_links(value):
        if "dl.acm.org/citation" in val or "doi" in val:
            doi_refined.append(val)
            print("link")
            print(val)
    return doi_refined


# In[251]:

fullist_dois = []
for value in make_conflist(2011, 2020):
    fetch_raw_data(value)
    fetch_links(value)
    fullist_dois.append(extract_doi(value))

# In[252]:

flatList_dois = [item for elem in fullist_dois for item in elem]

# In[253]:

len(flatList_dois)

# In[259]:

for val in flatList_dois:
    if "twitter" in val or "reddit" in val or "linkedin" in val or "mendeley" in val or "https://twitter.com" in val or "https://www.mendeley.com" in val:
        flatList_dois.remove(val)

# In[260]:

for val in flatList_dois:
    print(val)

# In[269]:

extracted = [
    string.replace("https://doi.org/", "") for string in flatList_dois
]

# In[270]:

extracted_dois = [
    string.replace("http://dl.acm.org/citation.cfm?id=", "10.1145/3027385.")
    for string in extracted
]

# In[273]:

len(extracted_dois)

# In[305]:

# DOI-https://api.semanticscholar.org/v1/paper/10.1038/nrn3241
# fetching papers from semantic scholar API
list_paperdata = []
for val in extracted_dois[0:100]:
    paper_data = requests.get(
        f"https://api.semanticscholar.org/v1/paper/{val}").json()
    list_paperdata.append(paper_data)

# In[435]:

for val in extracted_dois[830:840]:
    paper_data = requests.get(
        f"https://api.semanticscholar.org/v1/paper/{val}").json()
    list_paperdata.append(paper_data)

# In[442]:

# list_paperdata[832]
#del list_paperdata[803::]
# extracted_dois[270]

# In[518]:

#dataset = ['hello','test']
with open("semanticscholar.txt", "w", encoding="utf-8") as f:
    for listitem in list_paperdata:
        f.write(str(listitem))

# In[461]:


def convert_list_to_string(org_list, seperator=','):
    """ Convert list to string, by joining all item in list with given separator.
        Returns the concatenated string """
    return seperator.join(org_list)


# In[525]:
# Inserting data in the database

i = 0
for val in list_paperdata[616:]:
    if 'doi' in val:
        print(i)
        authorName = []
        authorId = []
        paperid = val['paperId']
        print(paperid)
        title = str(val['title'])
        title = title.replace('"', '')
        title = title.replace("'", "")
        print(title)
        abstract = str(val['abstract'])
        abstract = abstract.replace('"', '')
        abstract = abstract.replace("'", "")
        print(abstract)
        venue = str(val['venue'])
        venue = venue.replace('"', '')
        venue = venue.replace("'", "")
        print(venue)
        year = str(val['year'])
        year = year.replace('"', '')
        year = year.replace("'", "")
        print(year)
        # year=re.sub("'","",year)
        print(year)
        url = val['url']
        print(url)
        for author in val['authors']:
            author['name'] = author['name'].replace("'", "")
            authorName.append(author['name'])
            if author['authorId'] != None:
                authorId.append(author['authorId'])

        authorNames = convert_list_to_string(authorName)
        print(authorNames)
        authorIds = convert_list_to_string(authorId)
        print(authorIds)
        doi = str(val['doi'])
        print(doi)
        i += 1
        try:
            up.uses_netloc.append("postgres")
            url = up.urlparse(
                "postgres://yrrhzsue:E7FQJw6yw3mha6BvbimQJVNWGRR7Lwn6@ruby.db.elephantsql.com:5432/yrrhzsue"
            )
            conn = psycopg2.connect(database=url.path[1:],
                                    user=url.username,
                                    password=url.password,
                                    host=url.hostname,
                                    port=url.port)
            cursor = conn.cursor()
            postgreSQL_insert_Query = "insert into LAKData(id,title,abstract,venue,year,authors,authorids,dois) values('" + str(
                paperid) + "','" + str(title) + "','" + str(
                    abstract) + "','" + str(venue) + "','" + str(
                        year) + "','" + str(authorNames) + "','" + str(
                            authorIds) + "','" + str(doi) + "')"
            cursor.execute(postgreSQL_insert_Query)
            conn.commit()
        #mobile_records = cursor.fetchall()
        # for val in mobile_records:
        #   print(val)
        except (Exception, psycopg2.Error) as error:
            print("Error while fetching data from PostgreSQL", error)
        finally:
            # closing database connection.
            if (conn):
                cursor.close()
                conn.close()
                print("PostgreSQL connection is closed")

# ## Creating a DB Connection

# In[531]:

try:
    up.uses_netloc.append("postgres")
    url = up.urlparse(
        "postgres://yrrhzsue:E7FQJw6yw3mha6BvbimQJVNWGRR7Lwn6@ruby.db.elephantsql.com:5432/yrrhzsue"
    )
    conn = psycopg2.connect(database=url.path[1:],
                            user=url.username,
                            password=url.password,
                            host=url.hostname,
                            port=url.port)
    cursor = conn.cursor()
    postgreSQL_select_Query = "select * from LAKData"
    cursor.execute(postgreSQL_select_Query)
    mobile_records = cursor.fetchall()
    #sql_command = "SELECT * FROM {}.{};".format(str(schema), str(table))
    data_f1 = pd.read_sql(postgreSQL_select_Query, conn)
    # for val in mobile_records:
    # print(val)
except (Exception, psycopg2.Error) as error:
    print("Error while fetching data from PostgreSQL", error)
finally:
    # closing database connection.
    if (conn):
        cursor.close()
        conn.close()
        print("PostgreSQL connection is closed")

# In[532]:

data_f1.to_csv(r"C:\Users\GOLLAKOTA\Thesis\apidata.csv")

# In[533]:

data_test = data_f1

# In[535]:

data_test

# In[ ]:

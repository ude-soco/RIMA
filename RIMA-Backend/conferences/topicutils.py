#Done by Swarna
# Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK 
import json
import urllib.parse as up
import psycopg2
import pandas as pd
import numpy as np
import time
import os
import requests
import operator
from collections import Counter
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter
from interests.update_interests import update_interest_models, normalize
from itertools import combinations
import mpld3
import base64
#from plotly.offline import plot
from matplotlib_venn import venn2, venn2_circles, venn2_unweighted
from matplotlib import pyplot as plt
import matplotlib
from collections import defaultdict
from sklearn.preprocessing import StandardScaler, MinMaxScaler, Normalizer, RobustScaler
matplotlib.use("SVG")
from interests.Semantic_Similarity.Word_Embedding.IMsim import calculate_similarity
from interests.Semantic_Similarity.WikiLink_Measure.Wiki import wikisim
#import plotly.graph_objects as go
#import plotly.express as px
from pprint import pprint
from django.conf import settings
from . import ConferenceUtils as confutils



'''
BAB get conf events/years
'''
# BAB 08.06.2021:: Extension for other conferences other than LAK 

def getConfEvents(conferenceName):
    print("start")
    query = "select distinct year from Topics"
    #print(createConcatenatedColumn())
    lak_data = getTopics(conferenceName,"", query)
    events_list = lak_data['year']
    
    print(
        "******************************************************************************"
    )
    
    print(events_list)
    list_confEvents = [{
        "value": a,
        "label": a
    } for a in events_list]

    print('list_confEvents', list_confEvents)
    return list_confEvents

#BAB 08.06.2021
def getTopics(conferenceName,year, query):
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
        postgreSQL_select_Query = query
        #cursor.execute(postgreSQL_select_Query)
        #lak_records = cursor.fetchall()
        #sql_command = "SELECT * FROM {}.{};".format(str(schema), str(table))
        data_lak = pd.read_sql(postgreSQL_select_Query, conn)
        print('getTopics data_lak')
        print(data_lak)
        print(type(data_lak))
    #for val in mobile_records:
    #print(val)
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)
    finally:
        #closing database connection.
        if (conn):
            cursor.close()
            conn.close()
            print("PostgreSQL connection is closed")
    return data_lak


'''
method to get top 5/10 keywords for topic cloud
'''

#BAB 08.06.2021
# to be removed  Wordcloud
def applyTopicMiningKeyword(conferenceName,year, number):
    print("start")
    query = "select * from Topics where year='" + str(year) + "'"
    #print(createConcatenatedColumn())
    lak_data = getTopics(conferenceName,year, query)
    topics_list = lak_data['keywords'].values[0]
    topics_list = topics_list.replace("{", "")
    topics_list = topics_list.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    for key, value in topics_list_ref.items():
        value = int(value)
        topics_list_ref[key] = value

    if "Result disambiguation" in topics_list_ref.keys():
        topics_list_ref.pop("Result disambiguation")

    sorted_topics_tuple = sorted(topics_list_ref.items(),
                                 reverse=True,
                                 key=operator.itemgetter(1))
    print(sorted_topics_tuple)
    list_topics_y1 = [{
        "text": a[0],
        "value": a[1]
    } for a in sorted_topics_tuple]

    newlist = [{
        "text": key,
        "value": val
    } for key, val in topics_list_ref.items()]


    if number == "5":
        return list_topics_y1[0:5]
    else:
        return list_topics_y1[0:10]
    #keys = list(dict(wikis).keys())
    return list_topics_y1[0:10]


'''
method to fetch top 5/10 topics for the topiccloud
'''

#BAB 08.06.2021
# to be removed  Word cloud
def applyTopicMiningTopic(conferenceName,year, number):
    print("start")
    query = "select * from Topics where year='" + str(year) + "'"
    #print(createConcatenatedColumn())
    lak_data = getTopics(conferenceName,year, query)
    topics_list = lak_data['topics'].values[0]
    topics_list = topics_list.replace("{", "")
    topics_list = topics_list.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    for key, value in topics_list_ref.items():
        value = int(value)
        topics_list_ref[key] = value

    if "Result disambiguation" in topics_list_ref.keys():
        topics_list_ref.pop("Result disambiguation")

    sorted_topics_tuple = sorted(topics_list_ref.items(),
                                 reverse=True,
                                 key=operator.itemgetter(1))
    print(sorted_topics_tuple)
    list_topics_y1 = [{
        "text": a[0],
        "value": a[1]
    } for a in sorted_topics_tuple]

    newlist = [{
        "text": key,
        "value": val
    } for key, val in topics_list_ref.items()]

    if number == "5":
        return list_topics_y1[0:5]
    else:
        return list_topics_y1[0:10]
    #keys = list(dict(wikis).keys())
    return list_topics_y1[0:10]


# Function to convert
# to be removed
def listToString(s):

    # initialize an empty string
    str1 = " "

    # return string
    return (str1.join(s))


'''
get top 10 keywords for the bar chart
'''

# to be removed wordcloud
def getTopKeywords(conferenceName, year):
    query = "select t.keywords,t.year,l.abstract,l.title from Topics t join LAKData l on l.year=t.year where t.year='" + str(
        year) + "'"
    lak_data = getTopics(conferenceName,year, query)
    lak_data[
        "titleandabstract"] = lak_data["title"] + " " + lak_data["abstract"]
    topics_list = lak_data['keywords'].values[0]
    topics_list = topics_list.replace("{", "")
    topics_list = topics_list.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    if "Result disambiguation" in topics_list_ref.keys():
        topics_list_ref.pop("Result disambiguation")

    for key, value in topics_list_ref.items():
        value = int(value)
        topics_list_ref[key] = value

    print(topics_list_ref)
    sorted_topics_tuple = sorted(topics_list_ref.items(),
                                 reverse=True,
                                 key=operator.itemgetter(1))
    sorted_topics_dict = {}
    for ele in sorted_topics_tuple:
        sorted_topics_dict[ele[0]] = ele[1]
    for key, val in sorted_topics_dict.items():
        freq = 0
        for abstract in list(lak_data['titleandabstract'].values):
            freq += abstract.lower().count(key.lower())

            #print("the freq of ",key," is ",freq)
        print("freq", freq)
        sorted_topics_dict[key] = int(freq)
        print(sorted_topics_dict[key])
        print(key, " is:", sorted_topics_dict[key])
    for key, val in sorted_topics_dict.items():
        print(key, "::", val)
    list_keywords = []
    list_weights = []
    if len(list(sorted_topics_dict)) >= 10:
        for val in list(sorted_topics_dict)[0:10]:
            list_keywords.append(val)
            list_weights.append(sorted_topics_dict[val])
    else:
        for val in list(sorted_topics_dict):
            list_keywords.append(val)
            list_weights.append(sorted_topics_dict[val])

    return list_keywords, list_weights


'''
top 10 topics for bar chart and also the data as per the bar chart
'''

# to be removed LakBar
def getTopTopics(conferenceName,year):
    print("Bar chart...")
    query = "select t.topics,t.year,l.abstract,l.title from Topics t join LAKData l on l.year=t.year where t.year='" + str(
        year) + "'"
    lak_data = getTopics(conferenceName,year, query)
    lak_data[
        "titleandabstract"] = lak_data["title"] + " " + lak_data["abstract"]
    topics_list = lak_data['topics'].values[0]
    topics_list = topics_list.replace("{", "")
    topics_list = topics_list.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    if "Result disambiguation" in topics_list_ref.keys():
        topics_list_ref.pop("Result disambiguation")
    for key, value in topics_list_ref.items():
        value = int(value)
        topics_list_ref[key] = value
    print(topics_list_ref)
    sorted_topics_tuple = sorted(topics_list_ref.items(),
                                 reverse=True,
                                 key=operator.itemgetter(1))
    sorted_topics_dict = {}
    for ele in sorted_topics_tuple:
        sorted_topics_dict[ele[0]] = ele[1]
    print("sorted dict", sorted_topics_dict)

    for key, val in sorted_topics_dict.items():
        freq = 0
        for abstract in list(lak_data['titleandabstract'].values):
            freq += abstract.lower().count(key.lower())

        print("freq", freq)
        if freq != 0:
            (sorted_topics_dict.copy())[key] = int(freq)
            print(sorted_topics_dict[key])
            print(key, " is:", sorted_topics_dict[key])

        else:
            sorted_topics_dict.copy().pop(key)

    sorted_topics_dict = sorted_topics_dict.copy()
    for key, val in sorted_topics_dict.items():
        print(key, "::", val)

    list_keywords = []
    list_weights = []
    if len(list(sorted_topics_dict)) >= 10:
        for val in list(sorted_topics_dict)[0:10]:
            list_keywords.append(val)
            list_weights.append(sorted_topics_dict[val])
    else:
        for val in list(sorted_topics_dict):
            list_keywords.append(val)
            list_weights.append(sorted_topics_dict[val])

    return list_keywords, list_weights


'''
get top 10 topics in sorted order
'''


def getPaperswithTopics(year):
    query = "select year,topics from Topics where year='" + year + "'"
    lak_data = getTopics(year, query)
    topics = lak_data["topics"].values[0]
    topics_list = topics.replace("{", "")
    topics_list = topics_list.replace("}", "")
    topics_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    if "Result disambiguation" in topics_list_ref.keys():
        topics_list_ref.pop("Result disambiguation")
    list_dictkeys = topics_list_ref.keys()
    list_dict = [{
        "value": key,
        "label": key
    } for key, val in topics_list_ref.items()]
    return list_dictkeys, list_dict


'''
get top 10 keywords in sorted order
'''


def getPaperswithKeys(year):
    query = "select year,keywords from Topics where year='" + year + "'"
    lak_data = getTopics(year, query)
    topics = lak_data["keywords"].values[0]
    topics_list = topics.replace("{", "")
    topics_list = topics_list.replace("}", "")
    topics_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    if "Result disambiguation" in topics_list_ref.keys():
        topics_list_ref.pop("Result disambiguation")
    list_dictkeys = topics_list_ref.keys()
    list_dict = [{
        "value": key,
        "label": key
    } for key, val in topics_list_ref.items()]
    return list_dictkeys, list_dict


'''
get the top 10 papers for the selected topic in LAK Bar Chart
'''

# to be removed Lak Bar
def getTopicDetails(topic, year):
    lak_abstract = getText('2011')
    print('lak_abstract ****************************************** ',lak_abstract,' ***************************** lak_abstract')
    topic = topic.replace("%20", " ")
    lak_abstract["titleAndAbstract"] = lak_abstract[
        "title"] + " " + lak_abstract["abstract"]
    weights_list = [2] * len(list(lak_abstract['titleAndAbstract'].values))
    dict_freqs = {}
    list_freqs = []
    for text, title in zip(list(lak_abstract['titleAndAbstract'].values),
                           list(lak_abstract['title'].values)):
        count = 0

        if ((text.lower()).count(topic.lower()) > 0):

            count = (text.lower()).count(topic.lower())

        dict_freqs.update({title: count})
        list_freqs.append(dict_freqs)
    for key in dict_freqs:
        dict_freqs[key] = int(dict_freqs[key])
    sorted_dict = dict(
        sorted(dict_freqs.items(), reverse=True, key=operator.itemgetter(1)))
    sorted_dict = {k: sorted_dict[k] for k in list(sorted_dict)[:10]}
    print("-------------------", sorted_dict)
    myDict = {key: val for key, val in sorted_dict.items() if val != 0}

    print('Final myDict *********** ', myDict, ' ********** Final myDict')

    return myDict.keys(), myDict.values()

# to be removed  LAkbar
def getTopicDetails1(topic, year):
    print("*************************")
    topic_list_search = getPaperswithTopics(year)[0]
    print(topic_list_search)
    lak_abstract = getText(year)
    lak_abstract["titleAndAbstract"] = lak_abstract[
        "title"] + " " + lak_abstract["abstract"]
    list_details = []
    dict_vals = {}
    list_tpcfreq = []
    list_titles = []
    weights_list = [2] * len(list(lak_abstract['titleAndAbstract'].values))
    dict_freqs = {}

    for key in list(lak_abstract['titleAndAbstract'].values):

        if topic.lower() in key.lower():
            #print(val.lower(),":::::::::::::::::::::::::",key.lower())
            list_tpcfreq.append(key.lower().count(topic.lower()))
            alldetails_df = lak_abstract[lak_abstract["titleAndAbstract"] ==
                                         key]
            list_titles.append(alldetails_df["title"].values[0])
            dict_vals = {
                "title": alldetails_df["title"].values[0],
                "abstract": alldetails_df["abstract"].values[0]
            }
            list_details.append(dict_vals)
            dict_freqs.update({
                key.lower().count(topic.lower()):
                alldetails_df["title"].values[0]
            })

    #dict_final={"label":list_details,"value":weights_list}
    sorted_dict = dict(
        sorted(dict_freqs.items(), reverse=True, key=operator.itemgetter(0)))
    sorted_dict = {k: sorted_dict[k] for k in list(sorted_dict)[:10]}
    freqcount = sum(list_tpcfreq)
    for value in list_tpcfreq:
        value = value / freqcount

# list_dict_freqs={"title":list_titles,"frequency":list_tpcfreq}
    list_final = []
    #d={}
    for val, weight in zip(list_details, weights_list):
        d = {}
        d['label'] = str(val).replace("{",
                                      "").replace("}",
                                                  "").replace(',', '\n', 1)
        d['value'] = weight
        list_final.append(d)

    return list_final, len(
        list_final), sorted_dict.keys(), sorted_dict.values()
'''
get the top 10 papers for the selected keyword in LAK Bar Chart
'''

# to be removed lakBAR
def getKeyDetails(topic, year):
    lak_abstract = getText(year)
    topic = topic.replace("%20", " ")

    lak_abstract["titleAndAbstract"] = lak_abstract[
        "title"] + " " + lak_abstract["abstract"]
    weights_list = [2] * len(list(lak_abstract['titleAndAbstract'].values))
    dict_freqs = {}
    list_freqs = []
    for text, title in zip(list(lak_abstract['titleAndAbstract'].values),
                           list(lak_abstract['title'].values)):
        count = 0

        if ((text.lower()).count(topic.lower()) > 0):

            count = (text.lower()).count(topic.lower())

        dict_freqs.update({title: count})
        list_freqs.append(dict_freqs)
    for key in dict_freqs:
        dict_freqs[key] = int(dict_freqs[key])
    sorted_dict = dict(
        sorted(dict_freqs.items(), reverse=True, key=operator.itemgetter(1)))
    sorted_dict = {k: sorted_dict[k] for k in list(sorted_dict)[:10]}
    print("-------------------", sorted_dict)

    return sorted_dict.keys(), sorted_dict.values()

# to be removed LAKBAR
def getKeyDetails1(keyword, year):
    print("*************************")
    print(keyword)
    print(year)
    topic_list_search = getPaperswithTopics(year)[0]
    print(topic_list_search)
    lak_abstract = getText(year)
    lak_abstract["titleAndAbstract"] = lak_abstract[
        "title"] + " " + lak_abstract["abstract"]

    list_details = []
    dict_vals = {}
    list_tpcfreq = []
    list_titles = []
    weights_list = [2] * len(list(lak_abstract['titleAndAbstract'].values))
    dict_freqs = {}

    for key in list(lak_abstract['titleAndAbstract'].values):

        if key.lower().find(keyword.lower()) != -1:
            #print(val.lower(),":::::::::::::::::::::::::",key.lower())
            list_tpcfreq.append(key.lower().count(keyword.lower()))

            alldetails_df = lak_abstract[lak_abstract["titleAndAbstract"] ==
                                         key]
            list_titles.append(alldetails_df["title"].values[0])
            dict_vals = {
                "title": alldetails_df["title"].values[0],
                "abstract": alldetails_df["abstract"].values[0]
            }
            list_details.append(dict_vals)
            dict_freqs.update({
                key.lower().count(keyword.lower()):
                alldetails_df["title"].values[0]
            })

    #dict_final={"label":list_details,"value":weights_list}
    sorted_dict = dict(
        sorted(dict_freqs.items(), reverse=True, key=operator.itemgetter(0)))
    sorted_dict = {k: sorted_dict[k] for k in list(sorted_dict)[:10]}
    freqcount = sum(list_tpcfreq)
    for value in list_tpcfreq:
        value = value / freqcount

# list_dict_freqs={"title":list_titles,"frequency":list_tpcfreq}
    list_final = []
    #d={}
    for val, weight in zip(list_details, weights_list):
        d = {}
        d['label'] = str(val).replace("{",
                                      "").replace("}",
                                                  "").replace(',', '\n', 1)
        d['value'] = weight
        list_final.append(d)

    return list_final, len(
        list_final), sorted_dict.keys(), sorted_dict.values()
'''
get all the LAK Data from database specific to a particular year
'''

# to be removed LAK Bar
def getText(year):
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
        postgreSQL_select_Query = "select * from LAKData where year='" + year + "'"
        cursor.execute(postgreSQL_select_Query)
        lak_records = cursor.fetchall()
        #sql_command = "SELECT * FROM {}.{};".format(str(schema), str(table))
        data_lak = pd.read_sql(postgreSQL_select_Query, conn)
    #for val in mobile_records:
    #print(val)
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)
    finally:
        #closing database connection.
        if (conn):
            cursor.close()
            conn.close()
            print("PostgreSQL connection is closed")
    return data_lak


def compareTopics(year1, year2):
    year1 = "2013"
    year2 = "2012"
    query_year1 = "select * from Topics where year='" + str(year1) + "'"
    query_year2 = "select * from Topics where year='" + str(year2) + "'"
    data_year1 = getTopics(year1, query_year1)
    data_year2 = getTopics(year2, query_year2)
    topics_year1 = data_year1["topics"].values[0]
    topics_list_year1 = topics_year1.replace("{", "")
    topics_list_year1 = topics_list_year1.replace("}", "")
    topics_list_ref_year1 = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list_year1.split(', ')
    }
    if "Result disambiguation" in topics_list_ref_year1.keys():
        topics_list_ref_year1.pop("Result disambiguation")

    list_dictkeys_year1 = topics_list_ref_year1.keys()
    topics_year2 = data_year2["topics"].values[0]
    topics_list_year2 = topics_year2.replace("{", "")
    topics_list_year2 = topics_list_year2.replace("}", "")
    topics_list_ref_year2 = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list_year2.split(', ')
    }
    if "Result disambiguation" in topics_list_ref_year2.keys():
        topics_list_ref_year2.pop("Result disambiguation")

    list_dictkeys_year2 = topics_list_ref_year2.keys()

    print(calculate_similarity(["learning analytics"], ["learning analytics"]))
    return "success"

# to be removed Area chart
def getAllKeywordsAllYears(conferenceName):
    query = "select keywords from Topics"
    topics = getTopics(conferenceName,"", query)
    list_topics = []
    list_topics_flat = []
    print(len(topics["keywords"].values))
    for val in list(topics["keywords"].values):
        print("the value is:", val)
        topics_list = val.replace("{", "")
        topics_list = topics_list.replace("}", "")
        topics_list_ref = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list.split(', ')
        }
        if "Result disambiguation" in topics_list_ref.keys():
            topics_list_ref.pop("Result disambiguation")

        list_topics.append(topics_list_ref.keys())
    flatList_topics = [item for elem in list_topics for item in elem]
    list_dict = [{
        "value": val,
        "label": val
    } for val in list(set(flatList_topics))]
    return list_dict

# to be removed Area chart
def getAllTopicsAllYears(conferenceName):
    query = "select topics from Topics"
    topics = getTopics(conferenceName,"", query)
    list_topics = []
    list_topics_flat = []
    print(len(topics["topics"].values))
    for val in list(topics["topics"].values):
        print("the value is:", val)
        topics_list = val.replace("{", "")
        topics_list = topics_list.replace("}", "")
        topics_list_ref = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list.split(', ')
        }
        if "Result disambiguation" in topics_list_ref.keys():
            topics_list_ref.pop("Result disambiguation")

        list_topics.append(topics_list_ref.keys())
    flatList_topics = [item for elem in list_topics for item in elem]
    list_dict = [{
        "value": val,
        "label": val
    } for val in list(set(flatList_topics))]
    return list_dict


def getKeyWeightsAllYears(conferenceName,topic):
    topic1 = topic
    topic = topic.lower()
    query = "select distinct(t.keywords),t.year from Topics t join LAKData l on t.year=l.year where lower(t.keywords) like '%" + topic + "%'"
    topics_yearwise = getTopics(conferenceName,"", query)
    list_dicts = []
    for val in topics_yearwise["keywords"].values:
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
        list_dicts.append(topics_list_ref_year1)
    topics_yearwise["newtopics"] = list_dicts
    #topics_yearwise["topicswithyear"]=topics_yearwise["topics"]+","+topics_yearwise["year"]
    print(topics_yearwise["newtopics"], topics_yearwise["year"])
    topics_yearwise.newtopics = topics_yearwise.newtopics.apply(
        lambda x: list(x.items()))
    topics_yearwise = topics_yearwise.explode('newtopics')
    topics_yearwise[['topic', 'weight'
                     ]] = pd.DataFrame(topics_yearwise.newtopics.tolist(),
                                       index=topics_yearwise.index)
    topics_yearwise = topics_yearwise[['topic', 'weight', 'year']]
    #topics_yearwise['year'] = '1/1/' +topics_yearwise['year'].astype(str)
    #topics_yearwise=topics_yearwise.drop_duplicates()
    topics_yearwise = topics_yearwise.sort_values(by='year')
    df_singletopic = topics_yearwise[topics_yearwise['topic'] == topic1]
    df_singletopic = df_singletopic.drop_duplicates()
    print(df_singletopic)
    return df_singletopic['weight'].values, df_singletopic['year'].values

#BAB
def getTopicWeightsAllYears(conferenceName,topic):

    topic1 = topic
    topic = topic.lower()
    query = "select distinct(t.topics),t.year from Topics t join LAKData l on t.year=l.year where lower(t.topics) like '%" + topic + "%'"
    topics_yearwise = getTopics(conferenceName,"", query)
    list_dicts = []
    for val in topics_yearwise["topics"].values:
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
        list_dicts.append(topics_list_ref_year1)
    topics_yearwise["newtopics"] = list_dicts
    #topics_yearwise["topicswithyear"]=topics_yearwise["topics"]+","+topics_yearwise["year"]
    print(topics_yearwise["newtopics"], topics_yearwise["year"])
    topics_yearwise.newtopics = topics_yearwise.newtopics.apply(
        lambda x: list(x.items()))
    topics_yearwise = topics_yearwise.explode('newtopics')
    topics_yearwise[['topic', 'weight'
                     ]] = pd.DataFrame(topics_yearwise.newtopics.tolist(),
                                       index=topics_yearwise.index)
    topics_yearwise = topics_yearwise[['topic', 'weight', 'year']]
    #topics_yearwise['year'] = '1/1/' +topics_yearwise['year'].astype(str)
    #topics_yearwise=topics_yearwise.drop_duplicates()
    topics_yearwise = topics_yearwise.sort_values(by='year')
    df_singletopic = topics_yearwise[topics_yearwise['topic'] == topic1]
    df_singletopic = df_singletopic.drop_duplicates()
    print(df_singletopic)
    return df_singletopic['weight'].values, df_singletopic['year'].values


'''
method to get keyword data for pie chart
'''

#BAB
def getDataForPieKeys(conferenceName,year, number):
    query = "select distinct(t.keywords) from Topics t join LAKData l on t.year=l.year where t.year='" + year + "'"
    topics_yearwise = getTopics(conferenceName,"", query)
    list_dicts = []
    for val in topics_yearwise["keywords"].values:
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
        list_dicts.append(topics_list_ref_year1)
    topics_yearwise["newtopics"] = list_dicts
    #topics_yearwise["topicswithyear"]=topics_yearwise["topics"]+","+topics_yearwise["year"]
    print(topics_yearwise["newtopics"])
    topics_yearwise.newtopics = topics_yearwise.newtopics.apply(
        lambda x: list(x.items()))
    topics_yearwise = topics_yearwise.explode('newtopics')
    topics_yearwise[['topic', 'weight'
                     ]] = pd.DataFrame(topics_yearwise.newtopics.tolist(),
                                       index=topics_yearwise.index)
    topics_yearwise = topics_yearwise[['topic', 'weight']]
    #topics_yearwise['year'] = '1/1/' +topics_yearwise['year'].astype(str)
    #topics_yearwise=topics_yearwise.drop_duplicates()
    topics_yearwise['weight'] = topics_yearwise['weight'].astype(int)
    topics_yearwise = topics_yearwise.sort_values(by=['weight'],
                                                  ascending=False)
    topics_yearwise[['weight']] = MinMaxScaler().fit_transform(
        topics_yearwise[['weight']])
    topics_yearwise['percent'] = (topics_yearwise['weight'] /
                                  topics_yearwise['weight'].sum()) * 100
    # topics_yearwise['percent']=topics_yearwise['percent'].astype(str)
    topics_yearwise['percent'] = topics_yearwise['percent'].apply(np.floor)
    if number == "5":
        topics_yearwise = topics_yearwise.head(5)
    else:
        if len(topics_yearwise['topic'].values) > 10:
            topics_yearwise = topics_yearwise.head(10)
        else:
            pass
    return topics_yearwise['topic'].values, topics_yearwise['percent'].values


'''
method to get data for pie chart - topics
'''


def getDataForPieTopics(conferenceName,year, number):
    print(year, number)
    query = "select distinct(t.topics) from Topics t join LAKData l on t.year=l.year where t.year='" + year + "'"
    topics_yearwise = getTopics(conferenceName,"", query)
    list_dicts = []
    for val in topics_yearwise["topics"].values:
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
        list_dicts.append(topics_list_ref_year1)
    topics_yearwise["newtopics"] = list_dicts
    #topics_yearwise["topicswithyear"]=topics_yearwise["topics"]+","+topics_yearwise["year"]
    print(topics_yearwise["newtopics"])
    topics_yearwise.newtopics = topics_yearwise.newtopics.apply(
        lambda x: list(x.items()))
    topics_yearwise = topics_yearwise.explode('newtopics')
    topics_yearwise[['topic', 'weight'
                     ]] = pd.DataFrame(topics_yearwise.newtopics.tolist(),
                                       index=topics_yearwise.index)
    topics_yearwise = topics_yearwise[['topic', 'weight']]
    #topics_yearwise['year'] = '1/1/' +topics_yearwise['year'].astype(str)
    #topics_yearwise=topics_yearwise.drop_duplicates()
    topics_yearwise['weight'] = topics_yearwise['weight'].astype(int)
    topics_yearwise = topics_yearwise.sort_values(by=['weight'],
                                                  ascending=False)

    print('********** PERCENT 0 *****************')
    print(topics_yearwise['weight'])
    print('********** PERCENT  0 *****************')

    """
    topics_yearwise[['weight']] = MinMaxScaler().fit_transform(
        topics_yearwise[['weight']])

    print('********** PERCENT 1 *****************')
    print(topics_yearwise['weight'])
    print('********** PERCENT  1 *****************')

    print('********** PERCENT 2  *****************')
    print(topics_yearwise['weight'].sum())
    print('********** PERCENT 2 *****************')

    topics_yearwise['percent'] = (topics_yearwise['weight'] /
                                  topics_yearwise['weight'].sum()) * 100
    # topics_yearwise['percent']=topics_yearwise['percent'].astype(str)
    topics_yearwise['percent'] = topics_yearwise['percent'].apply(np.floor)

    print('********** PERCENT 3  *****************')
    print(topics_yearwise['percent'])
    print('********** PERCENT  3 *****************')
    
    if number == "5":
        topics_yearwise = topics_yearwise.head(5)
    else:
        if len(topics_yearwise['topic'].values) > 10:
            topics_yearwise = topics_yearwise.head(10)
        else:
            pass

    print('********** PERCENT 4  *****************')
    print(topics_yearwise.head(5))
    print('********** PERCENT  4 *****************')

"""
    return topics_yearwise['topic'][:10], topics_yearwise['weight'][:10]


'''
method to get keyword weights over all years
'''

#BAB
def getMultipleYearKeyJourney(conferenceName,listoftopics):
    try:
        list_weights = []
        list_years = []
        lak_years = [
            '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018',
            '2019', '2020'
        ]
        for val in listoftopics:
            weights, years = getKeyWeightsAllYears(conferenceName,val)
            list_weights.append(list(weights))
            list_years.append(list(years))

        list1_modified = []
        for l1, l2 in zip(list_weights, list_years):
            l1 = iter(l1)
            sub_list = [
                next(l1) if str(index + 2011) in l2 else '0'
                for index in range(10)
            ]
            list1_modified.append(sub_list)
        print(list1_modified)
        return list1_modified, lak_years
    except:
        return None


'''
method to get topic weights over all years
'''
#BAB
def getMultipleYearTopicJourney(conferenceName,listoftopics):

    list_weights = []
    list_years = []
    lak_years = [
        '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019',
        '2020'
    ]
    for val in listoftopics:
        weights, years = getTopicWeightsAllYears(conferenceName,val)
        list_weights.append(list(weights))
        list_years.append(list(years))
    print(list_weights)
    print(list_years)
    list1_modified = []
    for l1, l2 in zip(list_weights, list_years):
        l1 = iter(l1)
        sub_list = [
            next(l1) if str(index + 2011) in l2 else '0' for index in range(10)
        ]
        list1_modified.append(sub_list)
    return list1_modified, lak_years

# lakbar to be removed
def getPaperIDFromPaperTitle(title):
    #title="Towards visual analytics for teachers dynamic diagnostic pedagogical decision-making"
    query = "select id from LAKData where title like'" + title + "%'"
    lak_id = getTopics("","", query)
    print(lak_id)
    val = lak_id['id'].values[0]
    paper_data = requests.get(
        f"https://api.semanticscholar.org/v1/paper/{val}").json()
    url = paper_data['url']
    return url


'''
get author specific collaboration based on the selected author
'''


def getAuthorFromAuthorName(author, topic, year):
    topic = topic.lower()
    query = "select authors,authorids from LAKData where authors like '%" + author + "%' and year='" + year + "'"
    lak_id = getTopics("", year,query)

    authors_mod = pd.DataFrame({
        'authors':
        np.hstack(lak_id['authors'].str.split(',')),
        'authorids':
        np.hstack(lak_id['authorids'].str.split(','))
    })
    print(authors_mod)
    authorid = authors_mod[authors_mod['authors'] == author]
    print(authorid)
    authorprof = authorid['authorids'].values[0]
    print(authorprof)
    #author_data=requests.get(f"https://api.semanticscholar.org/v1/author/{authorprof}").json()
    auth_url = f"https://www.semanticscholar.org/author/144973020/{authorprof}"
    query1 = "select id,title,abstract,authors,authorids from LAKData where authors like '%" + author + "%' and year='" + year + "'"
    lak_count = getTopics("",year, query1)
    lak_count[
        'titleAndAbstract'] = lak_count['title'] + " " + lak_count['abstract']
    #count=len(lak_count['id'].values)
    print("the dataframe of paperids", lak_count)
    l_papers = []
    l_titles = []
    l_authors = []
    l_authorids = []
    count = 0
    for val, id, authors, titles, authorids in zip(
            list(lak_count['titleAndAbstract'].values),
            list(lak_count['id'].values), list(lak_count['authors'].values),
            list(lak_count['title'].values),
            list(lak_count['authorids'].values)):
        if topic.lower() in val.lower():
            l_papers.append(f"https://www.semanticscholar.org/paper/{id}")
            l_titles.append(titles)
            l_authors.append(authors)
            l_authorids.append(authorids)
            count = count + 1

    return auth_url, count, l_papers, l_authors, l_titles, l_authorids


def getAuthorsDict():
    query = "select authors from LAKData"
    authors = getTopics("","", query)
    list_auth_sub = []
    list_auth_single = []
    list_authors = list(authors['authors'].values)
    #list_authors=list_authors[0:5]
    for val in list_authors:
        print("original val:", val)
        if "," not in val:
            list_auth_single.append(val)
        if "," in val:
            #print("value containing , is:",val)
            list_temp = []
            list_temp = val.split(",")
            for value in list_temp:
                print("temp", value)
                list_auth_sub.append(value)

    list_auth_sub += list_auth_single
    list_auth_sub = list(set(list_auth_sub))
    list_auths = []
    for val in list_auth_sub:
        dict_temp = {"value": val, "label": val}
        list_auths.append(dict_temp)
    return list_auths


'''
obtain topics for compare authors bar chart
'''


def getAuthorsForYear(year):
    query = ""
    if year == 'all years':
        query = "select authors from LAKData"
    else:
        query = "select authors from LAKData where year='" + year + "'"
    authors = getTopics("",year, query)
    list_auth_sub = []
    list_auth_single = []
    list_authors = list(authors['authors'].values)
    #list_authors=list_authors[0:5]
    for val in list_authors:

        if "," not in val:
            list_auth_single.append(val)
        if "," in val:
            #print("value containing , is:",val)
            list_temp = []
            list_temp = val.split(",")
            for value in list_temp:

                list_auth_sub.append(value)

    list_auth_sub += list_auth_single
    list_auth_sub = list(set(list_auth_sub))
    list_auths = []
    for val in list_auth_sub:
        dict_temp = {"value": val, "label": val}
        list_auths.append(dict_temp)
    return list_auths

# to be removed
def getAllAuthors():
    query = 'select authors from LAKData'
    authors = getTopics("", "",query)

    list_auth_sub = []
    list_auth_single = []
    list_authors = list(authors['authors'].values)
    #list_authors=list_authors[0:5]
    for val in list_authors:
        print("original val:", val)
        if "," not in val:
            list_auth_single.append(val)
        if "," in val:
            #print("value containing , is:",val)
            list_temp = []
            list_temp = val.split(",")
            for value in list_temp:
                print("temp", value)
                list_auth_sub.append(value)

    list_auth_sub += list_auth_single
    list_auth_sub = list(set(list_auth_sub))

    return list_auth_sub


def getAllAuthorsDict():
    list_authors = getAllAuthors()
    print(list_authors)
    list_dicts = []
    dict_authors = {}
    for val in list_authors:
        dict_authors = {"label": val, "value": val}
        list_dicts.append(dict_authors)
    return list_dicts


def getTopicEvoultion():
    query = "select topics,year from Topics"
    topics_yearwise = getTopics("", "",query)
    list_dicts = []
    for val in list(topics_yearwise["topics"].values):
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
        list_dicts.append(topics_list_ref_year1)
    topics_yearwise["newtopics"] = list_dicts
    #topics_yearwise["topicswithyear"]=topics_yearwise["topics"]+","+topics_yearwise["year"]
    print(topics_yearwise["newtopics"])
    topics_yearwise.newtopics = topics_yearwise.newtopics.apply(
        lambda x: list(x.items()))
    topics_yearwise = topics_yearwise.explode('newtopics')
    topics_yearwise[['topic', 'weight'
                     ]] = pd.DataFrame(topics_yearwise.newtopics.tolist(),
                                       index=topics_yearwise.index)
    topics_yearwise = topics_yearwise[['topic', 'weight', 'year']]
    #topics_yearwise[['weight']]=Normalizer().fit_transform(topics_yearwise[['weight']])
    df_sankey_small = topics_yearwise.groupby('year').apply(
        lambda x: x.ffill().bfill()).drop_duplicates()
    df_sankey_small = df_sankey_small.pivot(index='topic',
                                            columns='year',
                                            values='weight')
    df_sankey_small = df_sankey_small.fillna('0')
    df_sankey_small = df_sankey_small.reset_index()
    print(df_sankey_small)
    #df_sankey_small[["2011","2012","2013","2014","2015","2016","2017","2018","2019","2020"]]=StandardScaler().fit_transform(df_sankey_small[["2011","2012","2013","2014","2015","2016","2017","2018","2019","2020"]])
    list_subdicts = []
    list_dicts = []
    list_columns = list(df_sankey_small.columns)

    list_values = list(df_sankey_small.values)

    return list_values


'''
obtain common keywords for conference venn diagram
'''


def generateVennDataKeys(conferenName,year1, year2):
    query_year1 = "select keywords from Topics where year='" + year1 + "'"
    topics_yearwise1 = getTopics(conferenName,"", query_year1)
    list_dicts = []
    for val in list(topics_yearwise1["keywords"].values):
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
    for keys, items in topics_list_ref_year1.items():
        topics_list_ref_year1[keys] = int(items)
    sorted_topics_tuple = sorted(topics_list_ref_year1.items(),
                                 reverse=True,
                                 key=operator.itemgetter(1))
    list_topics_y1 = [{a[0]: a[1]} for a in sorted_topics_tuple]
    keys = []
    for d in list_topics_y1:
        keys.extend(d)

    list_topics_y1 = keys[0:10]
    print(list_topics_y1)
    query_year2 = "select keywords from Topics where year='" + year2 + "'"
    topics_yearwise2 = getTopics(conferenName,"", query_year2)
    list_dicts = []
    for val in list(topics_yearwise2["keywords"].values):
        topics_list_year2 = val.replace("{", "")
        topics_list_year2 = topics_list_year2.replace("}", "")
        topics_list_ref_year2 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year2.split(', ')
        }
    for keys, items in topics_list_ref_year2.items():
        topics_list_ref_year2[keys] = int(items)
    sorted_topics_tuple2 = sorted(topics_list_ref_year2.items(),
                                  reverse=True,
                                  key=operator.itemgetter(1))
    list_topics_y2 = [{a[0]: a[1]} for a in sorted_topics_tuple2]
    keys = []
    for d in list_topics_y2:
        keys.extend(d)

    list_topics_y2 = keys[0:10]
    print(list_topics_y2)
    list_intersect_y1y2 = list(
        set(list_topics_y1).intersection(set(list_topics_y2)))
    list(set(list_topics_y1) - set(list_topics_y2))

    fig, ax = plt.subplots()

    ax.set_title('Common keywords for the years ' + str(year1) + ' and ' + str(year2),fontsize=12)
    
    v = venn2_unweighted(subsets=(40, 40, 25),
                         set_labels=[str(year1), str(year2)])
    v.get_patch_by_id('10').set_alpha(0.3)
    v.get_patch_by_id('10').set_color('#86AD41')
    v.get_patch_by_id('01').set_alpha(0.3)
    v.get_patch_by_id('01').set_color('#7DC3A1')
    v.get_patch_by_id('11').set_alpha(0.3)
    v.get_patch_by_id('11').set_color('#3A675C')
    v.get_label_by_id('10').set_text('\n'.join(
        list(set(list_topics_y1) - set(list_topics_y2))))
    label1 = v.get_label_by_id('10')
    label1.set_fontsize(7)
    v.get_label_by_id('01').set_text('\n'.join(
        list(set(list_topics_y2) - set(list_topics_y1))))
    label2 = v.get_label_by_id('01')
    label2.set_fontsize(7)
    v.get_label_by_id('11').set_text('\n'.join(list_intersect_y1y2))
    label3 = v.get_label_by_id('11')
    label3.set_fontsize(7)
    plt.axis('off')
    plt.savefig(settings.TEMP_DIR + '/venn.png')
    with open(settings.TEMP_DIR + '/venn.png', "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')

    ctx = image_data

    return ctx


'''
Obtain common topics for conference venn data
'''


def generateVennData(conferenName,year1, year2):
    query_year1 = "select topics from Topics where year='" + year1 + "'"
    topics_yearwise1 = getTopics(conferenName,"", query_year1)
    list_dicts = []
    for val in list(topics_yearwise1["topics"].values):
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
    for keys, items in topics_list_ref_year1.items():
        topics_list_ref_year1[keys] = int(items)
    sorted_topics_tuple = sorted(topics_list_ref_year1.items(),
                                 reverse=True,
                                 key=operator.itemgetter(1))
    list_topics_y1 = [{a[0]: a[1]} for a in sorted_topics_tuple]
    keys = []
    for d in list_topics_y1:
        keys.extend(d)

    list_topics_y1 = keys[0:10]
    print(list_topics_y1)
    query_year2 = "select topics from Topics where year='" + year2 + "'"
    topics_yearwise2 = getTopics(conferenName,"", query_year2)
    list_dicts = []
    for val in list(topics_yearwise2["topics"].values):
        topics_list_year2 = val.replace("{", "")
        topics_list_year2 = topics_list_year2.replace("}", "")
        topics_list_ref_year2 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year2.split(', ')
        }
    for keys, items in topics_list_ref_year2.items():
        topics_list_ref_year2[keys] = int(items)
    sorted_topics_tuple2 = sorted(topics_list_ref_year2.items(),
                                  reverse=True,
                                  key=operator.itemgetter(1))
    list_topics_y2 = [{a[0]: a[1]} for a in sorted_topics_tuple2]
    keys = []
    for d in list_topics_y2:
        keys.extend(d)

    list_topics_y2 = keys[0:10]
    print(list_topics_y2)
    list_intersect_y1y2 = list(
        set(list_topics_y1).intersection(set(list_topics_y2)))
    list(set(list_topics_y1) - set(list_topics_y2))

    

    ctx = confutils.generate_venn_photo(list_topics_y1,list_topics_y2,list_intersect_y1y2,year1,year2,'topic')

    return ctx


'''
get all topics for the author network
'''


def getAllTopics(year):
    query = "select distinct topics from Topics where year='" + year + "'"
    lak_keywords = getTopics("",year, query)
    list_allkeys = []
    for val in list(lak_keywords['topics'].values):
        topics_list = val.replace("{", "")
        topics_list = topics_list.replace("}", "")
        print(
            "******************************************************************************"
        )
        topics_list_ref = {}
        topics_list_ref = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list.split(', ')
        }
        for keys, items in topics_list_ref.items():
            topics_list_ref[keys] = int(items)
        sorted_topics_tuple = sorted(topics_list_ref.items(),
                                     reverse=True,
                                     key=operator.itemgetter(1))
        sorted_topics_dict = {}
        print(sorted_topics_tuple)
        for ele in sorted_topics_tuple[0:10]:
            sorted_topics_dict[ele[0]] = ele[1]
            list_allkeys.append(sorted_topics_dict.keys())
    flatList = [item for elem in list_allkeys for item in elem]
    list_keys = list(set(flatList))
    if "Result disambiguation" in list_keys:
        list_keys.pop("Result disambiguation")

    list_dict = [{"value": val, "label": val} for val in list(set(list_keys))]
    return list_dict


'''
get all keywords for author network
'''


def getAllKeywords(year):
    query = "select keywords from Topics where year='" + year + "'"
    lak_keywords = getTopics("", "",query)
    list_allkeys = []
    for val in list(lak_keywords['keywords'].values):
        topics_list = val.replace("{", "")
        topics_list = topics_list.replace("}", "")
        print(
            "******************************************************************************"
        )
        topics_list_ref = {}
        topics_list_ref = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list.split(', ')
        }
        for keys, items in topics_list_ref.items():
            topics_list_ref[keys] = int(items)
        sorted_topics_tuple = sorted(topics_list_ref.items(),
                                     reverse=True,
                                     key=operator.itemgetter(1))
        sorted_topics_dict = {}
        print(sorted_topics_tuple)
        for ele in sorted_topics_tuple[0:10]:
            sorted_topics_dict[ele[0]] = ele[1]
            list_allkeys.append(sorted_topics_dict.keys())
    flatList = [item for elem in list_allkeys for item in elem]
    list_keys = list(set(flatList))
    if "Result disambiguation" in list_keys:
        list_keys.pop("Result disambiguation")

    list_dict = [{"value": val, "label": val} for val in list(set(list_keys))]
    return list_dict


'''
get topics for the author network
'''


def searchForTopics(year, keyword):
    try:
        keyword = keyword.lower()
        query = "select t.topics,l.title,l.abstract,l.authors from LAKData l join Topics t on l.year=t.year where t.year='" + year + "' and lower(t.topics) like '%" + keyword + "%'"
        lak_data = getTopics("", "",query)
        lak_data["titleAndAbstract"] = lak_data["title"] + " " + lak_data[
            "abstract"]
        list_titles = []
        for val1, val2 in zip(list(lak_data["titleAndAbstract"].values),
                              lak_data["title"]):
            if keyword in val1:
                val1.count(keyword)
                list_titles.append(val2)
        list_titles = list(set(list_titles))
        query = "select authors from LAKData where title in" + str(
            tuple(list_titles)) + "and year='" + year + "'"
        lak_authors = getTopics("", "",query)
        split_authors = []
        list_pairs = []
        list_edges = []
        for val in list(lak_authors['authors'].values):
            if "," not in val:
                list_pairs.append(val)
            elif "," in val:
                list_edges.append(val)

        list_listedges = []
        for val in list_edges:
            if "," in val:
                split_list = val.split(",")
                list_listedges.append(split_list)

        result = []
        result = [{
            'source': start,
            'target': end
        } for points in list_listedges
                  for start, end in combinations(points, 2)]
        print(result)

        flatList = [item for elem in list_listedges for item in elem]
        flatList_val = list(set(flatList))

        d = {}

        for inner in result:

            d.setdefault(frozenset(inner.values()), []).append(inner)
        l2 = [v[0] for _, v in d.items()]
        list_nodes = []
        query = "select authors from LAKData where year='" + year + "' and (lower(abstract) like '%" + keyword + "%' or lower(title) like '%" + keyword + "%')"
        lak = getTopics("", "",query)
        for val in flatList_val:
            #count=flatList.count(val)
            count = lak.authors.str.count(val).sum()
            list_nodes.append({"id": val, "size": count * 50})

        if len(result) == 0:
            dict_xy = {
                "nodes": [{
                    "id": "No Data Found",
                    "size": 1000,
                    "x": 100,
                    "y": 200
                }]
            }
        else:
            dict_xy = {"nodes": list_nodes, "links": l2}
    except UnboundLocalError:
        dict_xy = {
            "nodes": [{
                "id": "No Data Found",
                "size": 500,
                "x": 500,
                "y": 200
            }]
        }
    except:
        dict_xy = {
            "nodes": [{
                "id": "No Data Found",
                "size": 500,
                "x": 500,
                "y": 200
            }]
        }

    return dict_xy


'''
method to get keyword data for stacked bar chart across years
'''

#to be removed
def getTopKeysForAllYear(conferenceName,list_of_years):
    # BAB DISTINCT
    query = "select DISTINCT keywords,year from Topics where year in" + str(
        tuple(list_of_years))
    lak_data = getTopics(conferenceName,"", query)
    list_dicts = []
    for val in list(lak_data["keywords"].values):
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
        for key, value in topics_list_ref_year1.items():
            value = int(value)
            topics_list_ref_year1[key] = value
        print(topics_list_ref_year1)
        sorted_topics_tuple = sorted(topics_list_ref_year1.items(),
                                     reverse=True,
                                     key=operator.itemgetter(1))
        sorted_topics_dict = {}
        for ele in sorted_topics_tuple[0:5]:
            sorted_topics_dict[ele[0]] = ele[1]
        list_dicts.append(sorted_topics_dict)

    lak_data["newtopics"] = list_dicts
    #topics_yearwise["topicswithyear"]=topics_yearwise["topics"]+","+topics_yearwise["year"]
    lak_data.newtopics = lak_data.newtopics.apply(lambda x: list(x.items()))
    lak_data = lak_data.explode('newtopics')
    lak_data[['topic', 'weight']] = pd.DataFrame(lak_data.newtopics.tolist(),
                                                 index=lak_data.index)
    lak_data = lak_data[['topic', 'weight', 'year']]
    matrix = lak_data.set_index(['topic', 'year']).unstack(fill_value=0)
    print(matrix)
    return [matrix.values.tolist()] + [matrix.index.tolist()
                                       ] + [matrix.columns.levels[1].tolist()]


'''
method to get topic data for stacked bar chart across years
'''

#BAB
#to be removed
def getTopTopicsForAllYears(conferenceName,list_of_years):
    # BAB DISTINCT
    query = "select DISTINCT topics,year from Topics where year in" + str(
        tuple(list_of_years))
    lak_data = getTopics(conferenceName,"", query)
    print('tuple',str(tuple(list_of_years)))
    print('BAB', lak_data)
    list_dicts = []
    for val in list(lak_data["topics"].values):
        topics_list_year1 = val.replace("{", "")
        topics_list_year1 = topics_list_year1.replace("}", "")
        topics_list_ref_year1 = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list_year1.split(', ')
        }
        for key, value in topics_list_ref_year1.items():
            value = int(value)
            topics_list_ref_year1[key] = value
        print(topics_list_ref_year1)
        sorted_topics_tuple = sorted(topics_list_ref_year1.items(),
                                     reverse=True,
                                     key=operator.itemgetter(1))
        sorted_topics_dict = {}
        for ele in sorted_topics_tuple[0:5]:
            sorted_topics_dict[ele[0]] = ele[1]
        list_dicts.append(sorted_topics_dict)

    lak_data["newtopics"] = list_dicts
    #topics_yearwise["topicswithyear"]=topics_yearwise["topics"]+","+topics_yearwise["year"]
    lak_data.newtopics = lak_data.newtopics.apply(lambda x: list(x.items()))
    lak_data = lak_data.explode('newtopics')
    lak_data[['topic', 'weight']] = pd.DataFrame(lak_data.newtopics.tolist(),
                                                 index=lak_data.index)
    lak_data = lak_data[['topic', 'weight', 'year']]
    matrix = lak_data.set_index(['topic', 'year']).unstack(fill_value=0)
    """
     BAB matrix = lak_data.set_index(['topic', 'year']).unstack(fill_value=0)
    """
    print('**** BAB ****')
    print(matrix)
    print('**** BAB ****')

    return [matrix.values.tolist()] + [matrix.index.tolist()
                                       ] + [matrix.columns.levels[1].tolist()]


'''
get keywords based on author for author network
'''


def searchForKeyword(year, keyword):
    try:
        keyword = keyword.lower()
        query = "select t.keywords,l.title,l.abstract,l.authors from LAKData l join Topics t on l.year=t.year where t.year='" + year + "' and lower(t.keywords) like '%" + keyword + "%'"
        lak_data = getTopics("","", query)
        lak_data["titleAndAbstract"] = lak_data["title"] + " " + lak_data[
            "abstract"]
        list_titles = []
        for val1, val2 in zip(list(lak_data["titleAndAbstract"].values),
                              lak_data["title"]):
            if keyword in val1:
                val1.count(keyword)
                list_titles.append(val2)
        list_titles = list(set(list_titles))
        query = "select authors from LAKData where title in" + str(
            tuple(list_titles)) + "and year='" + year + "'"
        lak_authors = getTopics("", "",query)
        split_authors = []
        list_pairs = []
        list_edges = []
        for val in list(lak_authors['authors'].values):
            if "," not in val:
                list_pairs.append(val)
            elif "," in val:
                list_edges.append(val)

        #dict_xy={"nodes":list_pairs,"links":list_edges}

        print('list_pairs')
        print(list_pairs)
        print('list_pairs')
        print('#####################')
        print('list_edges')
        print(list_edges)
        print('list_edges')

        list_listedges = []
        for val in list_edges:
            if "," in val:
                split_list = val.split(",")
                list_listedges.append(split_list)
        # result = []
        # for val in list_listedges:
        #     for i, start in enumerate(val, 1):
        #         result.append({"source": start, "target": val[i % len(val)]})
        # print(result)

        print('list_listedges')
        print(list_listedges)
        print('list_listedges')

        result = []
        result = [{
            'source': start,
            'target': end
        } for points in list_listedges
                  for start, end in combinations(points, 2)]
        print('result')
        print(len(result))
        print('result')

        flatList = [item for elem in list_listedges for item in elem]
        flatList_val = list(set(flatList))

        print('flatList_val')
        print(flatList_val)
        print('flatList_val')

        d = {}

        for inner in result:

            d.setdefault(frozenset(inner.values()), []).append(inner)
        l2 = [v[0] for _, v in d.items()]
        list_nodes = []
        query = "select authors from LAKData where year='" + year + "' and (lower(abstract) like '%" + keyword + "%' or lower(title) like '%" + keyword + "%')"
        lak = getTopics("", "",query)

        print('lak')
        print(lak)
        print('lak')

        for val in flatList_val:
            #count=flatList.count(val)
            count = lak.authors.str.count(val).sum()
            print('+++++++++++++++++++++++++++++++++++++++++++')
            print('val')
            print(val)
            print('val')
            print('+++++++++++++++++++++++++++++++++++++++++++')
            print('count')
            print(count)
            print('count')
            print('+++++++++++++++++++++++++++++++++++++++++++')

            list_nodes.append({"id": val, "size": count * 70})

        if len(result) == 0:
            dict_xy = {
                "nodes": [{
                    "id": "No Data Found",
                    "size": 1000,
                    "x": 100,
                    "y": 200
                }]
            }
        else:
            dict_xy = {"nodes": list_nodes, "links": l2}
    except UnboundLocalError:
        dict_xy = {
            "nodes": [{
                "id": "No Data Found",
                "size": 500,
                "x": 500,
                "y": 200
            }]
        }
    except:
        dict_xy = {
            "nodes": [{
                "id": "No Data Found",
                "size": 500,
                "x": 500,
                "y": 200
            }]
        }

    print('###################### TEST BAB ######################')
    print(dict_xy)
    print('###################### TEST BAB ######################')
    return dict_xy


# def getTopTopicsForAllYears(list_of_years):
#     query="select topics,year from Topics where year in"+str(tuple(list_of_years))
#     lak_data=getTopics("",query)
#     list_dicts=[]
#     for val in list(lak_data["topics"].values):
#         topics_list_year1=val.replace("{","")
#         topics_list_year1=topics_list_year1.replace("}","")
#         topics_list_ref_year1 = {i.split(': ')[0]: i.split(': ')[1] for i in topics_list_year1.split(', ')}
#         for key,value in topics_list_ref_year1.items():
#             value=int(value)
#             topics_list_ref_year1[key]=value
#         print(topics_list_ref_year1)
#         sorted_topics_tuple = sorted(topics_list_ref_year1.items() , reverse=True, key=operator.itemgetter(1))
#         sorted_topics_dict={}
#         for ele in sorted_topics_tuple[0:5]:
#             sorted_topics_dict[ele[0]]=ele[1]
#         list_dicts.append(sorted_topics_dict)


#     lak_data["newtopics"]=list_dicts
#     #topics_yearwise["topicswithyear"]=topics_yearwise["topics"]+","+topics_yearwise["year"]
#     lak_data.newtopics = lak_data.newtopics.apply(lambda x: list(x.items()))
#     lak_data = lak_data.explode('newtopics')
#     lak_data[['topic', 'weight']] = pd.DataFrame(lak_data.newtopics.tolist(),index=lak_data.index)
#     lak_data = lak_data[['topic', 'weight','year']]
#     matrix = lak_data.set_index(['topic', 'year']).unstack(fill_value=0)
#     print(matrix)
#     return [matrix.values.tolist()]+[matrix.index.tolist()]+[matrix.columns.levels[1].tolist()]
def getFlowChartDataTopics(year, searchword):
    query = "select topics from Topics where year='" + year + "'"
    lak_data = getTopics("", "",query)
    sorted_topics_dict = {}
    sorted_keys_dict = {}

    topics_list = lak_data['topics'].values[0]
    topics_list = topics_list.replace("{", "")
    topics_list = topics_list.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    if "Result disambiguation" in topics_list_ref.keys():
        topics_list_ref.pop("Result disambiguation")

    for key, value in topics_list_ref.items():
        value = int(value)
        topics_list_ref[key] = value
    print(topics_list_ref)
    sorted_topics_tuple = sorted(topics_list_ref.items(),
                                 reverse=True,
                                 key=operator.itemgetter(1))
    for ele in sorted_topics_tuple[0:10]:
        sorted_topics_dict[ele[0]] = ele[1]
    list_nodedata = []
    i = 150
    j = 60
    for val, item in sorted_topics_dict.items():
        list_nodedata.append({"id": val, "size": item * 90})
        i = i + 100
    list_edges = []
    li = list(sorted_topics_dict.keys())

    for elem, next_elem in zip(li, li[1:] + [li[0]]):
        result = {'source': elem, 'target': next_elem}
        list_edges.append(result)

    dict_nodes = {"nodes": list_nodedata, "links": list_edges}

    return dict_nodes


def getFlowChartDataKeywords(year, searchword):
    query = "select keywords from Topics where year='" + year + "'"
    lak_data = getTopics("", "",query)
    sorted_topics_dict = {}
    sorted_keys_dict = {}
    keys_list = lak_data['keywords'].values[0]
    keys_list = keys_list.replace("{", "")
    keys_list = keys_list.replace("}", "")
    print(
        "******************************************************************************"
    )
    keys_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in keys_list.split(', ')
    }
    if "Result disambiguation" in keys_list_ref.keys():
        keys_list_ref.pop("Result disambiguation")

    for key, value in keys_list_ref.items():
        value = int(value)
        keys_list_ref[key] = value
    print(keys_list_ref)
    sorted_keys_tuple = sorted(keys_list_ref.items(),
                               reverse=True,
                               key=operator.itemgetter(1))
    for ele in sorted_keys_tuple[0:10]:
        sorted_keys_dict[ele[0]] = ele[1]
    list_nodedata = []
    i = 150
    j = 60
    for val, item in sorted_keys_dict.items():
        list_nodedata.append({"id": val, "size": item * 90})
        i = i + 100
    list_edges = []
    li = list(sorted_keys_dict.keys())

    for elem, next_elem in zip(li, li[1:] + [li[0]]):
        result = {'source': elem, 'target': next_elem}
        list_edges.append(result)
    dict_nodes = {"nodes": list_nodedata, "links": list_edges}
    return dict_nodes

#BAB 08.06.2021

def get_abstract_based_on_keyword(conferenceName,year, keyword):
    keyword = keyword.lower()
    query = "select abstract,title from LAKData where (lower(abstract) like '%" + keyword + "%' or lower(title) like '%" + keyword + "%') and year='" + year + "'"
    LakAbstract = getTopics(conferenceName,"", query)
    LakAbstract["titleAndAbstract"] = LakAbstract[
        "title"] + "\n" + LakAbstract["abstract"]
    dict_lists = []
    for val in list(LakAbstract["titleAndAbstract"].values):
        if keyword.lower() in val.lower():
            dict_count = {}
            count = val.lower().count(keyword.lower())
            dict_count = {"name": val, "count": count}
            dict_lists.append(dict_count)
    lst = sorted(dict_lists, reverse=True, key=operator.itemgetter('count'))
    list_abs = []
    for val in lst:
        list_abs.append(val['name'])
    list_titles = []
    list_abstracts = []
    for val in list_abs:
        arr = val.split("\n")
        list_titles.append(arr[0])
        list_abstracts.append(arr[1])
    list_papernames = []
    for i in range(0, len(list_titles)):
        list_papernames.append("Paper" + str(i + 1))

    return list_titles, list_abstracts #, list_papernames


def getDataAuthorComparisonKeywords(year, author1, author2):
    query = "select t.keywords,t.year,l.abstract,l.authors,l.title from LAKData l join Topics t on l.year=t.year where (l.authors like '%" + author1 + "%' or l.authors like '%" + author2 + "%') and t.year='" + year + "'"
    lak_topics = getTopics("", "",query)
    lak_topics['titleAndAbstract'] = lak_topics['title'] + " " + lak_topics[
        'abstract']
    list_dicts = []
    for val in list(lak_topics['keywords'].values):
        topics_list = val.replace("{", "")
        topics_list = topics_list.replace("}", "")
        topics_list_ref = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list.split(', ')
        }
        if "Result disambiguation" in topics_list_ref.keys():
            topics_list_ref.pop("Result disambiguation")

        for key, value in topics_list_ref.items():
            value = int(value)
            topics_list_ref[key] = value
        sorted_keys_tuple = sorted(topics_list_ref.items(),
                                   reverse=True,
                                   key=operator.itemgetter(1))

        list_dicts = [{a[0]: a[1]} for a in sorted_keys_tuple]
        #list_dicts.append(topics_list_ref)
    fin_list = [dict(t) for t in {tuple(d.items()) for d in list_dicts}]
    list_keycollector = []
    for val in fin_list:
        list_keycollector.append(val.keys())
    flat_list = [item for sublist in fin_list for item in sublist]
    flat_list = list(set(flat_list))
    flat_list = [t.lower() for t in flat_list]
    list_countdicts = []
    for val in flat_list:
        for abstract, authors, title in zip(
                list(lak_topics['titleAndAbstract'].values),
                list(lak_topics['authors'].values),
                list(lak_topics['year'].values)):
            count = abstract.lower().count(val)
            authors_list = authors.split(",")
            if author1 in authors_list:
                dict_counts = {val: count, "author": author1, "year": title}
                list_countdicts.append(dict_counts)
            if author2 in authors_list:
                dict_counts = {val: count, "author": author2, "year": title}
                list_countdicts.append(dict_counts)
    for d in list_countdicts:
        res = list(d.keys())[0]
        if d[res] == 0:
            d.clear()
    list_countdicts = filter(None, list_countdicts)
    df = pd.DataFrame(list_countdicts)
    df_gp = df.groupby(['author', 'year'], as_index=False).sum()
    # keys except group and author
    keys = df.columns[~df.columns.isin(["author", "year"])]

    # apply aggregation and flatten list of lists
    authors_dict = [el for key in keys for el in agg_key(df_gp, key)]
    print(authors_dict)
    lists = (list(collect(authors_dict)))
    print(lists)
    flag = ""

    if len(lists[0]) < 2:
        if author1 in lists[0]:
            lists[0].insert(1, author2)
            flag = "author1"

        elif author2 in lists[0]:
            lists[0].insert(0, author1)
            flag = "author2"
    else:
        flag = "none"
    print("flag is:", flag)
    for j in range(0, len(lists[2])):
        if len(lists[2][j]) < 2 and flag == "author1":
            lists[2][j].insert(1, 0)
        elif len(lists[2][j]) < 2 and flag == "author2":
            lists[2][j].insert(0, 0)
        else:
            pass

    #[['T. McKay'], ['learning', 'student'], [[4], [16]]]
    print(lists, "after")
    return lists[0], lists[1], lists[2]


def getDataAuthorComparisonTopics(year, author1, author2):
    query = "select t.topics,t.year,l.abstract,l.authors,l.title from LAKData l join Topics t on l.year=t.year where (l.authors like '%" + author1 + "%' or l.authors like '%" + author2 + "%') and t.year='" + year + "'"
    lak_topics = getTopics("", "",query)
    lak_topics['titleAndAbstract'] = lak_topics['title'] + " " + lak_topics[
        'abstract']
    list_dicts = []
    for val in list(lak_topics['topics'].values):
        topics_list = val.replace("{", "")
        topics_list = topics_list.replace("}", "")
        topics_list_ref = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list.split(', ')
        }
        if "Result disambiguation" in topics_list_ref.keys():
            topics_list_ref.pop("Result disambiguation")

        for key, value in topics_list_ref.items():
            value = int(value)
            topics_list_ref[key] = value
        sorted_keys_tuple = sorted(topics_list_ref.items(),
                                   reverse=True,
                                   key=operator.itemgetter(1))

        list_dicts = [{a[0]: a[1]} for a in sorted_keys_tuple]
        #list_dicts.append(topics_list_ref)
    fin_list = [dict(t) for t in {tuple(d.items()) for d in list_dicts}]
    list_keycollector = []
    for val in fin_list:
        list_keycollector.append(val.keys())
    flat_list = [item for sublist in fin_list for item in sublist]
    flat_list = list(set(flat_list))
    flat_list = [t.lower() for t in flat_list]
    list_countdicts = []
    for val in flat_list:
        for abstract, authors, title in zip(
                list(lak_topics['titleAndAbstract'].values),
                list(lak_topics['authors'].values),
                list(lak_topics['year'].values)):
            count = abstract.lower().count(val)
            authors_list = authors.split(",")
            if author1 in authors_list:
                dict_counts = {val: count, "author": author1, "year": title}
                list_countdicts.append(dict_counts)
            if author2 in authors_list:
                dict_counts = {val: count, "author": author2, "year": title}
                list_countdicts.append(dict_counts)
    for d in list_countdicts:
        res = list(d.keys())[0]
        if d[res] == 0:
            d.clear()
    list_countdicts = filter(None, list_countdicts)
    df = pd.DataFrame(list_countdicts)
    df_gp = df.groupby(['author', 'year'], as_index=False).sum()
    # keys except group and author
    keys = df.columns[~df.columns.isin(["author", "year"])]

    # apply aggregation and flatten list of lists
    authors_dict = [el for key in keys for el in agg_key(df_gp, key)]
    lists = (list(collect(authors_dict)))
    print(lists)
    for i in range(0, len(lists)):
        if len(lists[0]) < 2:
            if author1 in lists[0]:
                lists[0].append(author2)
            else:
                lists[0].append(author1)
        if len(lists[1]) < 2:
            lists[1].append('0')
        if len(lists[2][0]) < 2:
            lists[2][0].append(0)
        if len(lists[2][1]) < 2:
            lists[2][1].append(0)
    #[['T. McKay'], ['learning', 'student'], [[4], [16]]]
    print(lists, "after")

    return lists[0], lists[1], lists[2]


def agg_key(df, key):
    return df[df[key] != 0].groupby("author", as_index=False).agg({
        # collect the years
        "year":
        lambda sr: [str(el) for el in sr],
        # sum the key
        key:
        "sum",
    }).to_dict(orient="records")


def collect(records):
    vals = defaultdict(list)
    authors = set()
    for record in records:
        for i, (k, v) in enumerate(record.items()):
            if k == 'author':
                authors.add(v)
            elif i == 2:
                vals[k].append(int(v))

    return (list(authors), list(vals.keys()),
            list(pad_by_max_len(vals.values())))

    return (list(authors), list(vals.keys()),
            list(pad_by_max_len(vals.values())))


def pad_by_max_len(lol):
    lengths = map(len, lol)
    padlength = max(*lengths)
    padded = map(lambda l: pad(l, padlength), lol)

    return padded


def pad(l, padlength):
    return (l + [0] * padlength)[:padlength]


def fetchTopicsuserID(ssuserid, year):
    #ssuserid=2399182
    author_data = requests.get(
        f"https://api.semanticscholar.org/v1/author/{ssuserid}").json()
    print(author_data)
    name = author_data['name']
    list_paperids = []
    for val in author_data['papers']:
        list_paperids.append(val['paperId'])
    paper_abstracts = []
    paper_titles = []
    for val in list_paperids:
        paper_data = requests.get(
            f"https://api.semanticscholar.org/v1/paper/{val}").json()
        print("before", paper_data['abstract'])
        if paper_data['abstract'] != None:
            print("after", paper_data['abstract'])
            paper_abstracts.append(str(paper_data['abstract']))
            paper_titles.append(str(paper_data['title']))
    df_paperdata = pd.DataFrame(list(zip(paper_titles, paper_abstracts)),
                                columns=['title', 'abstract'])
    df_paperdata['title_abstract'] = df_paperdata[
        'title'] + " " + df_paperdata['abstract']
    #df_paperdata=df_paperdata.replace(df_paperdata.Nan,'')
    abs_vals = df_paperdata['title_abstract'].values
    keydata = ' '.join(str(v) for v in abs_vals)
    keywords = getKeyword(keydata, "Yake", 10)
    keywords_noquotes = str(keywords).replace("'", "")
    keywords_noquotes = keywords_noquotes.replace("(", "")
    keywords_noquotes = keywords_noquotes.replace(")", "")
    keywords_noquotes = str(keywords_noquotes).replace("-", "")
    wikis = str(wikifilter(keywords)[1])
    wikis_noquotes = wikis.replace("'", "")
    wikis_noquotes = wikis_noquotes.replace("(", "")
    wikis_noquotes = wikis_noquotes.replace(")", "")
    query = "select topics from Topics where year='" + year + "'"
    lak_topics = getTopics("", "",query)
    wikis_noquotes = wikis_noquotes.replace("{", "")
    wikis_noquotes = wikis_noquotes.replace("}", "")
    print(
        "******************************************************************************"
    )
    wikis_noquotes_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in wikis_noquotes.split(', ')
    }
    for key, value in wikis_noquotes_ref.items():
        value = int(value)
        wikis_noquotes_ref[key] = value
    l_author = wikis_noquotes_ref.keys()
    topics_list = lak_topics['topics'].values[0]
    topics_list = topics_list.replace("{", "")
    topics_list = topics_list.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    for key, value in topics_list_ref.items():
        value = int(value)
        topics_list_ref[key] = value
    if "Result disambiguation" in topics_list_ref.keys():
        topics_list_ref.pop("Result disambiguation")

# list_todict = json.loads(topics_list)
#topics_list_ref=dict(list(topics_list_ref.items())[0: 10])
    sorted_topics_tuple = sorted(topics_list_ref.items(),
                                 reverse=True,
                                 key=operator.itemgetter(1))
    print(sorted_topics_tuple)
    l_conf = []
    for val in sorted_topics_tuple:
        l_conf.append(val[0])
    list_intersect_y1y2 = list(set(l_author).intersection(set(l_conf)))
    list(set(l_author) - set(l_author))
    fig, ax = plt.subplots()

    ax.set_title('Common topics', fontsize=12)
    v = venn2_unweighted(subsets=(40, 40, 25),
                         set_labels=[str(name), "LAK Conference " + year])
    v.get_patch_by_id('10').set_alpha(0.3)
    v.get_patch_by_id('10').set_color('#86AD41')
    v.get_patch_by_id('01').set_alpha(0.3)
    v.get_patch_by_id('01').set_color('#7DC3A1')
    v.get_patch_by_id('11').set_alpha(0.3)
    v.get_patch_by_id('11').set_color('#3A675C')
    v.get_label_by_id('10').set_text('\n'.join(
        list(set(l_author) - set(l_conf))))
    label1 = v.get_label_by_id('10')
    label1.set_fontsize(7)
    v.get_label_by_id('01').set_text('\n'.join(
        list(set(l_conf) - set(l_author))))
    label2 = v.get_label_by_id('01')
    label2.set_fontsize(7)
    v.get_label_by_id('11').set_text('\n'.join(list_intersect_y1y2))
    label3 = v.get_label_by_id('11')
    label3.set_fontsize(7)

    plt.axis('off')
    plt.savefig(settings.TEMP_DIR + '/recommend.png')
    with open(settings.TEMP_DIR + '/recommend.png', "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')

    ctx = image_data
    return ctx


def convertStrtoDict(string):
    if string == '{}':
        return {}.items()
    else:
        topics_list = string.replace("{", "")
        topics_list = topics_list.replace("}", "")
        topics_list_ref = {
            i.split(': ')[0]: i.split(': ')[1]
            for i in topics_list.split(', ')
        }
        return topics_list_ref.items()


def insertData(query):

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

        cursor.execute(query)
        conn.commit()
    #sql_command = "SELECT * FROM {}.{};".format(str(schema), str(table))

    #for val in mobile_records:
    #print(val)
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)
    finally:
        #closing database connection.
        if (conn):
            cursor.close()
            conn.close()
            print("PostgreSQL connection is closed")
    return "success"


def getAuthorIdfromAuthor(author):
    query = "select authors,authorids from LAKData where authors like '%" + author + "%'"
    lak_authors = getTopics("","", query)
    val = list(lak_authors.values)[0]
    val_authors = val[0].split(",")
    val_ids = val[1].split(",")
    index = val_authors.index(author)
    return val_ids[index]


'''
Obtain topic details in author comparision bar chart
'''


def compareAuthors(author1, author2, year, key):
    authorid1 = getAuthorIdfromAuthor(author1)
    authorid2 = getAuthorIdfromAuthor(author2)
    keys = []
    values = []
    sorted_dict1 = {}
    sorted_dict2 = {}
    keywords_a1 = {}
    wikis_a1 = {}
    keywords_a2 = {}
    wikis_a2 = {}
    mainquery1 = ""
    mainquery2 = ""
    if year == 'all years':
        mainquery1 = "select keywords,topics,authorid from AuthorsTab where name='" + author1 + "'"
        mainquery2 = "select keywords,topics,authorid from AuthorsTab where name='" + author2 + "'"
    else:
        mainquery1 = "select keywords,topics,authorid from AuthorsTab where name='" + author1 + "' and year='" + year + "'"
        mainquery2 = "select keywords,topics,authorid from AuthorsTab where name='" + author2 + "' and year='" + year + "'"

    lak_query1 = getTopics("", "",mainquery1)
    lak_query2 = getTopics("", "",mainquery2)
    if len(list(lak_query1.values)) != 0:
        #print("topics",convertStrtoDict(lak_query1['topics'].values[0]))
        sorted_dict1 = dict(
            sorted(convertStrtoDict(lak_query1['topics'].values[0]),
                   reverse=True,
                   key=operator.itemgetter(1)))
        wikis_a1 = {k: sorted_dict1[k] for k in list(sorted_dict1)[0:10]}
        sorted_dict1 = dict(
            sorted(convertStrtoDict(lak_query1['keywords'].values[0]),
                   reverse=True,
                   key=operator.itemgetter(1)))
        keywords_a1 = {k: sorted_dict1[k] for k in list(sorted_dict1)[0:10]}
    else:
        query1 = ""
        if year == 'all years':
            query1 = "select title,abstract from LAKData where authors like '%" + author1 + "%'"
        else:
            query1 = "select title,abstract from LAKData where authors like '%" + author1 + "%' and year='" + year + "'"
        lak_author1_data = getTopics("", "",query1)
        lak_author1_data['titleAndAbs'] = lak_author1_data[
            'title'] + " " + lak_author1_data['abstract']
        abstracts_a1 = list(lak_author1_data['titleAndAbs'].values)
        #keydata_a1 = ' '.join(str(v) for v in abstracts_a1)
        keydata_a1 = ' '.join(abstracts_a1)
        keywords_a1 = getKeyword(keydata_a1, "Yake", 10)
        keywords_noquotes = str(keywords_a1).replace("'", "")
        keywords_noquotes = keywords_noquotes.replace("(", "")
        keywords_noquotes = keywords_noquotes.replace(")", "")
        #print("keys",keywords_a1)
        sorted_dict1 = dict(
            sorted(keywords_a1.items(),
                   reverse=True,
                   key=operator.itemgetter(1)))
        sorted_dict1 = {k: sorted_dict1[k] for k in list(sorted_dict1)[0:10]}
        wikis_a1 = wikifilter(keywords_a1)[1]
        #print("wikis",wikis_a1)
        wikis_noquotes = str(wikis_a1).replace("'", "")
        wikis_noquotes = wikis_noquotes.replace("(", "")
        wikis_noquotes = wikis_noquotes.replace(")", "")
        insert_query = "INSERT INTO AuthorsTab (authorid, name,conference,year,keywords,topics) VALUES ('" + str(
            authorid1
        ) + "','" + author1 + "','" + "LAK" + "','" + year + "','" + str(
            keywords_noquotes) + "','" + str(wikis_noquotes) + "')"
        insertData(insert_query)

    if len(list(lak_query2.values)) != 0:
        sorted_dict2 = dict(
            sorted(convertStrtoDict(lak_query2['topics'].values[0]),
                   reverse=True,
                   key=operator.itemgetter(1)))
        wikis_a2 = {k: sorted_dict2[k] for k in list(sorted_dict2)[0:10]}
        sorted_dict2 = dict(
            sorted(convertStrtoDict(lak_query2['keywords'].values[0]),
                   reverse=True,
                   key=operator.itemgetter(1)))
        keywords_a2 = {k: sorted_dict2[k] for k in list(sorted_dict2)[0:10]}
    else:
        query2 = ""
        if year == 'all years':
            query2 = "select title,abstract from LAKData where authors like '%" + author2 + "%'"
        else:
            query2 = "select title,abstract from LAKData where authors like '%" + author2 + "%' and year='" + year + "'"
        lak_author2_data = getTopics("", "",query2)
        lak_author2_data['titleAndAbs'] = lak_author2_data[
            'title'] + " " + lak_author2_data['abstract']
        abstracts_a2 = list(lak_author2_data['titleAndAbs'].values)
        #keydata_a1 = ' '.join(str(v) for v in abstracts_a1)
        keydata_a2 = ' '.join(abstracts_a2)
        keywords_a2 = getKeyword(keydata_a2, "Yake", 10)
        keywords_noquotes = str(keywords_a2).replace("'", "")
        keywords_noquotes = keywords_noquotes.replace("(", "")
        keywords_noquotes = keywords_noquotes.replace(")", "")
        #print("keys",keywords_a2)
        sorted_dict2 = dict(
            sorted(keywords_a2.items(),
                   reverse=True,
                   key=operator.itemgetter(1)))
        sorted_dict2 = {k: sorted_dict2[k] for k in list(sorted_dict2)[0:10]}
        wikis_a2 = wikifilter(keywords_a2)[1]
        wikis_noquotes = str(wikis_a2).replace("'", "")
        wikis_noquotes = wikis_noquotes.replace("(", "")
        wikis_noquotes = wikis_noquotes.replace(")", "")
        #print("wikis",wikis_a2)
        insert_query = "INSERT INTO AuthorsTab (authorid, name,conference,year,keywords,topics) VALUES ('" + str(
            authorid2
        ) + "','" + author2 + "','" + "LAK" + "','" + year + "','" + str(
            keywords_noquotes) + "','" + str(wikis_noquotes) + "')"
        insertData(insert_query)

    set_intersect_key = list(
        set(keywords_a1.keys()).intersection(set(keywords_a2.keys())))
    set_intersect_wiki = list(
        set(wikis_a1.keys()).intersection(set(wikis_a2.keys())))
    if key == 'keyword':
        authors_dict = {
            k: [sorted_dict1.get(k, 0),
                sorted_dict2.get(k, 0)]
            for k in sorted_dict1.keys() | sorted_dict2.keys()
        }
        keys = authors_dict.keys()
        values = authors_dict.values()
        auths = [author1, author2]


        print(set_intersect_key,'-----------' , keys , '+++++++++' , values, '++++++++', auths, '------------')

        return keys, values, auths, set_intersect_key
    elif key == 'topic':
        authors_dict = {
            k: [wikis_a1.get(k, 0), wikis_a2.get(k, 0)]
            for k in wikis_a1.keys() | wikis_a2.keys()
        }
        keys = authors_dict.keys()
        values = authors_dict.values()
        auths = [author1, author2]
        return keys, values, auths, set_intersect_wiki


'''
method to fetch topics for author conference venn diagram
'''


def authorConfTopicComparison(key, author, year):
    query1 = "select l.title,l.abstract from LAKData l where l.authors like '%" + author + "%'"
    lak_author1_topics = getTopics("", "",query1)
    lak_author1_topics['titleandAbstract'] = lak_author1_topics[
        'title'] + " " + lak_author1_topics['abstract']
    lak_text = ' '.join(list(lak_author1_topics['titleandAbstract'].values))
    keywords = getKeyword(lak_text, "Yake", 20)
    wikis = wikifilter(keywords)[1]
    query2 = ''
    if key == 'key':
        if year == 'all years':
            query2 = "select keywords from Topics"
        else:
            query2 = "select keywords from Topics where year='" + year + "'"
    else:

        if year == 'all years':
            query2 = "select topics from Topics"
        else:
            query2 = "select topics from Topics where year='" + year + "'"
    lak_years = getTopics("", "",query2)
    list_year = []
    if key == 'key':
        list_year = lak_years["keywords"].values[0]
    else:
        list_year = lak_years["topics"].values[0]

    topics_list = list_year.replace("{", "")
    topics_list = topics_list.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref1 = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list.split(', ')
    }
    for key, value in topics_list_ref1.items():
        value = int(value)
        topics_list_ref1[key] = value
    sorted_dict1 = dict(
        sorted(topics_list_ref1.items(),
               reverse=True,
               key=operator.itemgetter(1)))
    sorted_dict1 = {k: sorted_dict1[k] for k in list(sorted_dict1)[0:10]}
    if key == 'key':
        l_author = keywords.keys()

        l_conf = sorted_dict1.keys()

    else:

        l_conf = sorted_dict1.keys()

        l_author = wikis.keys()

    l_conf = list(l_conf)
    l_author = list(l_author)
    l_conf_u = []
    for val in l_conf:
        val = val.title()
        l_conf_u.append(val)
    l_author_u = []
    for val in l_author:
        val = val.title()
        l_author_u.append(val)

    print(l_author_u)
    print(l_conf_u)
    list_intersect_y1y2 = list(set(l_author_u).intersection(set(l_conf_u)))

    fig, ax = plt.subplots()

    ax.set_title('Common topics/keywords', fontsize=12)
    v = venn2_unweighted(
        subsets=(40, 40, 25),
        set_labels=[str(author), "LAK Conference {" + year + "}"])
    v.get_patch_by_id('10').set_alpha(0.3)
    v.get_patch_by_id('10').set_color('#86AD41')
    v.get_patch_by_id('01').set_alpha(0.3)
    v.get_patch_by_id('01').set_color('#7DC3A1')
    v.get_patch_by_id('11').set_alpha(0.3)
    v.get_patch_by_id('11').set_color('#3A675C')
    v.get_label_by_id('10').set_text('\n'.join(
        list(set(l_author_u) - set(l_conf_u))))
    label1 = v.get_label_by_id('10')
    label1.set_fontsize(7)
    v.get_label_by_id('01').set_text('\n'.join(
        list(set(l_conf_u) - set(l_author_u))))
    label2 = v.get_label_by_id('01')
    label2.set_fontsize(7)
    v.get_label_by_id('11').set_text('\n'.join(list_intersect_y1y2))
    label3 = v.get_label_by_id('11')
    label3.set_fontsize(7)
    plt.axis('off')
    plt.savefig(settings.TEMP_DIR + '/recommend.png')
    with open(settings.TEMP_DIR + '/recommend.png', "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')

    ctx = image_data
    return ctx


def getAuthorComparisionData(author1, author2):
    query1 = "select topics from Authors where name='" + author1 + "'"
    lak_author1_topics = getTopics("", "",query1)
    query2 = "select topics from Authors where name='" + author2 + "'"
    lak_author2_topics = getTopics("", "",query2)
    list_author1 = lak_author1_topics["topics"].values[0]
    topics_list1 = list_author1.replace("{", "")
    topics_list1 = topics_list1.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref1 = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list1.split(', ')
    }
    for key, value in topics_list_ref1.items():
        value = int(value)
        topics_list_ref1[key] = value
    sorted_dict1 = dict(
        sorted(topics_list_ref1.items(),
               reverse=True,
               key=operator.itemgetter(1)))
    sorted_dict1 = {k: sorted_dict1[k] for k in list(sorted_dict1)[0:10]}
    list_author2 = lak_author2_topics["topics"].values[0]
    topics_list2 = list_author2.replace("{", "")
    topics_list2 = topics_list2.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref2 = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list2.split(', ')
    }
    for key, value in topics_list_ref2.items():
        value = int(value)
        topics_list_ref2[key] = value
    sorted_dict2 = dict(
        sorted(topics_list_ref2.items(),
               reverse=True,
               key=operator.itemgetter(1)))
    sorted_dict2 = {k: sorted_dict2[k] for k in list(sorted_dict2)[0:10]}
    authors_dict = {
        k: [sorted_dict1.get(k, 0),
            sorted_dict2.get(k, 0)]
        for k in sorted_dict1.keys() | sorted_dict2.keys()
    }
    keys = authors_dict.keys()
    values = authors_dict.values()
    auths = [author1, author2]
    return keys, values, auths


def compareLAKwithAuthortopics(author, year):
    query1 = "select topics from Topics where year='" + year + "'"
    lak_conf = getTopics("", "",query1)
    list_topics_conf = lak_conf["topics"].values[0]
    topics_list1 = list_topics_conf.replace("{", "")
    topics_list1 = topics_list1.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref1 = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list1.split(', ')
    }
    for key, value in topics_list_ref1.items():
        value = int(value)
        topics_list_ref1[key] = value
    sorted_dict1 = dict(
        sorted(topics_list_ref1.items(),
               reverse=True,
               key=operator.itemgetter(1)))
    sorted_dict1 = {k: sorted_dict1[k] for k in list(sorted_dict1)[0:10]}
    query2 = "select topics from Authors where author='" + author + "'"
    lak_auth = getTopics("", "",query2)
    list_topics_auth = lak_auth["topics"].values[0]
    topics_list2 = list_topics_auth.replace("{", "")
    topics_list2 = topics_list2.replace("}", "")
    print(
        "******************************************************************************"
    )
    topics_list_ref2 = {
        i.split(': ')[0]: i.split(': ')[1]
        for i in topics_list2.split(', ')
    }
    for key, value in topics_list_ref2.items():
        value = int(value)
        topics_list_ref2[key] = value
    sorted_dict2 = dict(
        sorted(topics_list_ref2.items(),
               reverse=True,
               key=operator.itemgetter(1)))
    sorted_dict2 = {k: sorted_dict2[k] for k in list(sorted_dict2)[0:10]}
    l_conf = sorted_dict1.keys()
    l_author = sorted_dict2.keys()
    list_intersect_y1y2 = list(set(l_author).intersection(set(l_conf)))
    list(set(l_author) - set(l_author))
    fig, ax = plt.subplots()

    ax.set_title('Common topics', fontsize=12)
    v = venn2_unweighted(subsets=(40, 40, 25),
                         set_labels=[str(name), "LAK Conference" + year])
    v.get_patch_by_id('10').set_alpha(0.3)
    v.get_patch_by_id('10').set_color('#86AD41')
    v.get_patch_by_id('01').set_alpha(0.3)
    v.get_patch_by_id('01').set_color('#7DC3A1')
    v.get_patch_by_id('11').set_alpha(0.3)
    v.get_patch_by_id('11').set_color('#3A675C')
    v.get_label_by_id('10').set_text('\n'.join(
        list(set(l_author) - set(l_conf))))
    label1 = v.get_label_by_id('10')
    label1.set_fontsize(7)
    v.get_label_by_id('01').set_text('\n'.join(
        list(set(l_conf) - set(l_author))))
    label2 = v.get_label_by_id('01')
    label2.set_fontsize(7)
    v.get_label_by_id('11').set_text('\n'.join(list_intersect_y1y2))
    label3 = v.get_label_by_id('11')
    label3.set_fontsize(7)

    plt.axis('off')
    plt.savefig(settings.TEMP_DIR + '/recommend.png')
    with open(settings.TEMP_DIR + '/recommend.png', "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')

    ctx = image_data
    return ctx


    #For demo
def printText():
    return "Hello from Backend!"


    #created by mouadh, sorting tweets based on similarity score
def getsimilarity():
    userinterest = [
        "Learning", "Massive open online course", "Learning analytics",
        "Analytics", "Peer assessment"
    ]

    tweetkeyword = [
        "Educational technology", "Knowledge transfer",
        "Social network analysis", "Learning"
    ]

    sim_scores = calculate_similarity(userinterest, tweetkeyword)

    return sim_scores
    # sim_scores = wikisim(s,t)

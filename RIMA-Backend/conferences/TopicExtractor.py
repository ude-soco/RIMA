#Done by Swarna
import json
import urllib.parse as up
import psycopg2
import pandas as pd
import numpy as np
import requests
import time
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter
from interests.update_interests import update_interest_models, normalize

from interests.Semantic_Similarity.Word_Embedding.IMsim import calculate_similarity
from interests.Semantic_Similarity.WikiLink_Measure.Wiki import wikisim
from .topicutils import listToString


def getData():

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


def createConcatenatedColumn(year):
    print("start take")
    lak_df = getData()
    lak_df = lak_df.query("year=='" + str(year).strip() + "'")
    lak_df['title_and_abstract'] = lak_df['title'] + " " + lak_df['abstract']
    abstract_list = lak_df['title_and_abstract'].tolist()
    #abstract_list_year=lak_df.query()
    return abstract_list


def fetchAllTopics(yearList, algorithm):
    init_time_while = time.time()
    for val in yearList:
        text = createConcatenatedColumn(val)
        keywords = getKeyword(listToString(text), algorithm, 30)
        keywords_noquotes = str(keywords).replace("'", "")
        keywords_noquotes = keywords_noquotes.replace("(", "")
        keywords_noquotes = keywords_noquotes.replace(")", "")
        wikis = str(wikifilter(keywords)[1])
        wikis_noquotes = wikis.replace("'", "")
        wikis_noquotes = wikis_noquotes.replace("(", "")
        wikis_noquotes = wikis_noquotes.replace(")", "")
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

            postgreSQL_insert_Query = "insert into Topics(year,topics,algorithm,keywords) values('" + str(
                val) + "','" + str(wikis_noquotes) + "','" + str(
                    algorithm) + "','" + str(keywords_noquotes) + "')"
            cursor.execute(postgreSQL_insert_Query)
            conn.commit()

        except (Exception, psycopg2.Error) as error:
            print("Error while fetching data from PostgreSQL", error)
        finally:
            #closing database connection.
            if (conn):
                cursor.close()
                conn.close()
                print("PostgreSQL connection is closed")

    fin_time_while = time.time()
    print("Execution time (while loop): ", (fin_time_while - init_time_while))
    return "success"


def fetchTopics(algorithm):
    init_time_while = time.time()
    lak_data = getData()
    lak_data['abstitle'] = lak_data['title'] + " " + lak_data['abstract']
    text = ' '.join(list(lak_data['abstitle'].values))
    print(text)
    keywords = getKeyword(text, algorithm, 30)
    print(keywords)
    keywords_noquotes = str(keywords).replace("'", "")
    keywords_noquotes = keywords_noquotes.replace("(", "")
    keywords_noquotes = keywords_noquotes.replace(")", "")
    wikis = str(wikifilter(keywords)[1])
    wikis_noquotes = wikis.replace("'", "")
    wikis_noquotes = wikis_noquotes.replace("(", "")
    wikis_noquotes = wikis_noquotes.replace(")", "")
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
        postgreSQL_insert_Query = "insert into Topics(year,topics,algorithm,keywords) values('" + str(
            "all years") + "','" + str(wikis_noquotes) + "','" + str(
                algorithm) + "','" + str(keywords_noquotes) + "')"
        cursor.execute(postgreSQL_insert_Query)
        conn.commit()

    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)
    finally:
        #closing database connection.
        if (conn):
            cursor.close()
            conn.close()
            print("PostgreSQL connection is closed")

    fin_time_while = time.time()
    print("Execution time (while loop): ", (fin_time_while - init_time_while))
    return "success"


def getallAuthors():
    lak_data = getData()
    lak_authors = lak_data[['authorids', 'title', 'abstract']]
    list_authors = []
    for val in list(lak_authors['authorids'].values):
        if "," in val:
            split_authors = val.split(",")
            for single in split_authors:
                list_authors.append(single)
        else:
            list_authors.append(val)
    list_authors = list(set(list_authors))
    return list_authors


def fetchData_authorTable():
    authors_list = getallAuthors()
    l_authors = []
    for val in authors_list:
        author_data = requests.get(
            f"https://api.semanticscholar.org/v1/author/{val}").json()
        author_name = author_data['name']
        l_authors.append(author_name)
    return l_authors


def fetchAbstracts_author():
    author_list = getallAuthors()
    print(author_list)
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
        l_abstracts = []
        #254
        i = 0
        for val in author_list:
            postgreSQL_select_Query = "select title,abstract,year from LAKData where authorids like '%" + val + "%'"
            cursor.execute(postgreSQL_select_Query)
            lak_records = cursor.fetchall()
            data_lak = pd.read_sql(postgreSQL_select_Query, conn)
            data_lak['titleAndabstract'] = data_lak['title'] + " " + data_lak[
                'abstract']
            list_abstracts = list(data_lak['titleAndabstract'].values)
            string_abstract = ' '.join(list_abstracts)
            if "'" in string_abstract:
                index = string_abstract.find("'")
                string_abstract = string_abstract[:
                                                  index] + "'" + string_abstract[
                                                      index:]
            val_id_data = requests.get(
                f"https://api.semanticscholar.org/v1/author/{val}").json()
            #print(val_id_data)
            val_id = val_id_data['name']
            conference = "LAK"
            if "'" in val_id:
                index = val_id.find("'")
                val_id = val_id[:index] + "'" + val_id[index:]
            print(val_id)
            # keywords = getKeyword(string_abstract , "Yake", 30)
            # keywords_noquotes=str(keywords).replace("'","")
            # keywords_noquotes=keywords_noquotes.replace("(","")
            # keywords_noquotes=keywords_noquotes.replace(")","")
            # wikis=str(wikifilter(keywords)[1])
            # wikis_noquotes=wikis.replace("'","")
            # wikis_noquotes=wikis_noquotes.replace("(","")
            # wikis_noquotes=wikis_noquotes.replace(")","")
            #postgreSQL_insert_Query = "insert into Authors(authorID ,name ,conference,titlenabs,keywords,topics) values('"+str(val)+"','"+str(val_id)+"','"+str(string_abstract)+"','"+str(conference)+"','"+str(keywords_noquotes)+"','"+str(wikis_noquotes)+"')"
            postgreSQL_insert_Query = "insert into Authors1(authorID ,name ,titlenabs,conference) values('" + str(
                val) + "','" + str(val_id) + "','" + str(
                    data_lak['titleAndabstract'].values[i]) + "','" + str(
                        data_lak['year'].values[i]) + "','" + str(
                            conference) + "')"
            cursor.execute(postgreSQL_insert_Query)
            conn.commit()

    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)
    finally:
        #closing database connection.
        if (conn):
            cursor.close()
            conn.close()
            print("PostgreSQL connection is closed")
    return data_lak


def updateAllTopics():
    algorithm = "Yake"
    fetchTopics(algorithm)


def updateDB():
    yearList = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
    algorithm = "Yake"
    fetchAllTopics(yearList, algorithm)

from .DataExtractor import ConferenceDataCollector as dataCollector
from .models import (Author, Author_has_Papers, Event_has_Topic, Conf_Event_Topic, Conference_Event, Conference, Conference_Event_Paper,
                     Conf_Event_keyword, Event_has_keyword, Author_Event_keyword, Author_has_Keyword, Author_Event_Topic, Author_has_Topic, PreloadedConferenceList)
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter
from django.db.models import Q
import base64
from matplotlib_venn import venn2, venn2_circles, venn2_unweighted
from matplotlib import pyplot as plt
from django.conf import settings
import re
from neo4j import GraphDatabase
from .Neo4jConfig import graphDB_Driver

session = graphDB_Driver.session()


def CreateConference(tx, name, url, platform_name, platform_url):
    cqlNodeQuery = "CREATE CONSTRAINT ON (c:Conference) ASSERT c.conference_name_abbr IS UNIQUE"
    try:
        session.run(cqlNodeQuery)
    except:
        print("**** it has already unique constrain ****")
    tx.run(
        "CREATE (c:Conference {conference_name_abbr : $name,conference_url : $url,platform_name:$platform_name,platform_url:$platform_url})", name=name, url=url, platform_name=platform_name, platform_url=platform_url)


def CreateEvent(tx, name_abbr, url, no_of_papers):
    cqlNodeQuery = "CREATE CONSTRAINT ON (e:Event) ASSERT e.conference_event_name_abbr IS UNIQUE"
    try:
        session.run(cqlNodeQuery)
    except:
        print("**** it has already unique constrain ****")
    tx.run("CREATE (e:Event {conference_event_name_abbr : $name_abbr,conference_event_url : $url,no_of_stored_papers : $no_of_papers})",
           name_abbr=name_abbr, url=url, no_of_papers=no_of_papers)


def Create_has_event(tx, conference, event):
    tx.run(
        "MATCH (c), (e) WHERE c.conference_name_abbr = $conference AND e.conference_event_name_abbr = $event MERGE (c)-[:has_event]->(e);", conference=conference, event=event)


def CreateAuthor(tx, semantic_scolar_author_id, author_name, author_url):
    cqlNodeQuery = "CREATE CONSTRAINT ON (a:Author) ASSERT a.semantic_scolar_author_id IS UNIQUE"
    try:
        session.run(cqlNodeQuery)
    except:
        print("**** it has already unique constrain ****")

    tx.run("CREATE (a:Author {semantic_scolar_author_id : $semantic_scolar_author_id,author_name : $author_name,author_url : $author_url,aliases:'NULL',influentialCitationCount:'NULL',all_papers:'NULL'})",
           semantic_scolar_author_id=semantic_scolar_author_id, author_name=author_name, author_url=author_url,)


def CreatePaper(tx, paper_id, paper_doi, title, urls, years, abstract, citiations, paper_venu):
    cqlNodeQuery = "CREATE CONSTRAINT ON (p:Publication) ASSERT p.paper_id IS UNIQUE"
    try:
        session.run(cqlNodeQuery)
    except:
        print("**** it has already unique constrain ****")

    tx.run("CREATE (p:Publication {paper_id : $paper_id,paper_doi : $paper_doi,title:$title,urls:$urls,years:$years,abstract:$abstract,citiations:$citiations,paper_venu:$paper_venu})",
           paper_id=paper_id, paper_doi=paper_doi, title=title, urls=urls, years=years, abstract=abstract, citiations=citiations, paper_venu=paper_venu)


def Conference_has_paper(tx, conference, paperID):
    tx.run(
        "MATCH (c), (p) WHERE c.conference_name_abbr = $conference AND p.paper_id = $paper_id MERGE (c)-[:has_publication]->(p);", conference=conference, paper_id=paperID)


def Event_has_paper(tx, conference_event_name_abbr, paperID):
    tx.run(
        "MATCH (e), (p) WHERE e.conference_event_name_abbr = $conference_event_name_abbr AND p.paper_id = $paper_id MERGE (e)-[:has_publication]->(p);", conference_event_name_abbr=conference_event_name_abbr, paper_id=paperID)


def Author_has_paper(tx, semantic_scolar_author_id, paperID):
    tx.run(
        "MATCH (a), (p) WHERE a.semantic_scolar_author_id = $semantic_scolar_author_id AND p.paper_id = $paper_id MERGE (a)-[:published]->(p);", semantic_scolar_author_id=semantic_scolar_author_id, paper_id=paperID)


def Event_has_author(tx, event, semantic_scolar_author_id):
    tx.run(
        "MATCH (e), (a) WHERE e.conference_event_name_abbr = $event AND a.semantic_scolar_author_id = $semantic_scolar_author_id MERGE (e)-[:has_author]->(a);", event=event, semantic_scolar_author_id=semantic_scolar_author_id)


def Conference_has_author(tx, conference, semantic_scolar_author_id):
    tx.run(
        "MATCH (c), (a) WHERE c.conference_name_abbr = $conference AND a.semantic_scolar_author_id = $semantic_scolar_author_id MERGE (c)-[:has_author]->(a);", conference=conference, semantic_scolar_author_id=semantic_scolar_author_id)


def CreateCoauthor(tx, authorID, coauthorID):
    tx.run(
        "MATCH (e), (a) WHERE e.semantic_scolar_author_id = $authorID AND a.semantic_scolar_author_id = $coauthorID MERGE (e)-[:co_author]->(a);", authorID=authorID, coauthorID=coauthorID)


def GetConferenceData(tx, conference_name_abbr):
    result = tx.run("MATCH (c:Conference) WHERE c.conference_name_abbr=$conference_name_abbr RETURN c.conference_name_abbr AS conference_name_abbr ,c.conference_url AS conference_url,c.platform_name AS platform_name,c.platform_url AS platform_url",
                    conference_name_abbr=conference_name_abbr)
    values = [record for record in result]

    return values


def GetEventData(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event) WHERE e.conference_event_name_abbr=$conference_event_name_abbr RETURN e.conference_event_name_abbr AS conference_event_name_abbr,e.conference_event_url AS conference_event_url,e.no_of_stored_papers AS no_of_stored_papers ",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def GetConferenceEvents(tx, conference_name_abbr):
    result = tx.run("MATCH (c:Conference)-[:has_event]->(e:Event) WHERE c.conference_name_abbr=$conference_name_abbr RETURN c.conference_name_abbr AS conference_name_abbr, e.conference_event_url AS conference_event_url,e.no_of_stored_papers AS no_of_stored_papers,e.conference_event_name_abbr AS conference_event_name_abbr  ",
                    conference_name_abbr=conference_name_abbr)
    values = [record for record in result]

    return values


def UpdateConferenceEvent(tx, conference_event_name_abbr, nproperty, value):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr}) SET e."+nproperty+"=$value",
                    conference_event_name_abbr=conference_event_name_abbr, value=value)  # change any prop of event


def GetEventPapers(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[:has_publication]->(p:Publication) RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def GetConferences(tx):
    print('11111In')
    result = tx.run(
        "MATCH (c:Conference) RETURN c.conference_name_abbr AS conference_name_abbr ,c.conference_url AS conference_url,c.platform_name AS platform_name,c.platform_url AS platform_url")
    values = [record for record in result]
    print('11111out:', values)

    return values


def GetConferencePapers(tx, conference_name_abbr):
    result = tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_publication]->(p:Publication) RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls",
                    conference_name_abbr=conference_name_abbr)
    values = [record for record in result]

    return values


def GetEventAuthors(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[:has_author]->(a:Author) RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def GetConferenceAuthors(tx, conference_name_abbr):
    result = tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_author]->(a:Author) RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id",
                    conference_name_abbr=conference_name_abbr)
    values = [record for record in result]

    return values


def CreateKeyword(tx, keyword, algorithm):
    cqlNodeQuery = "CREATE CONSTRAINT ON (k:Keyword) ASSERT k.keyword IS UNIQUE"
    try:
        session.run(cqlNodeQuery)
    except:
        print("**** it has already unique constrain ****")
    tx.run("CREATE (k:Keyword {keyword : $keyword,algorithm : $algorithm})",
           keyword=keyword, algorithm=algorithm)


def CreateTopic(tx, topic, algorithm):
    cqlNodeQuery = "CREATE CONSTRAINT ON (t:Topic) ASSERT t.topic IS UNIQUE"
    try:
        session.run(cqlNodeQuery)
    except:
        print("**** it has already unique constrain ****")
    tx.run("CREATE (t:Topic {topic : $topic,algorithm : $algorithm})",
           topic=topic, algorithm=algorithm)


def CreateEvent_has_keyword(tx, event, keyword, weight):
    tx.run(
        "MATCH (e), (k) WHERE e.conference_event_name_abbr = $event AND k.keyword = $keyword MERGE (e)-[:has_keyword { weight: $weight }]->(k);", event=event, keyword=keyword, weight=weight)


def CreateEvent_has_topic(tx, event, topic, weight):
    tx.run(
        "MATCH (e), (t) WHERE e.conference_event_name_abbr = $event AND t.topic = $topic MERGE (e)-[:has_topic { weight: $weight }]->(t);", event=event, topic=topic, weight=weight)


def GetEventKeyword(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[r:has_keyword]->(k:Keyword) RETURN e.conference_event_name_abbr AS conference_event_name_abbr,k.keyword AS keyword,k.algorithm AS algorithm,r.weight AS weight",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def GetEventKeywordWeight(tx, conference_event_name_abbr, keyword):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[r:has_keyword]->(k:Keyword{keyword:$keyword}) RETURN e.conference_event_name_abbr AS conference_event_name_abbr,k.keyword AS keyword,k.algorithm AS algorithm,r.weight AS weight",
                    conference_event_name_abbr=conference_event_name_abbr, keyword=keyword)
    values = [record for record in result]

    return values


def GetEventTopicWeight(tx, conference_event_name_abbr, topic):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[r:has_topic]->(t:Topic{topic:$topic}) RETURN e.conference_event_name_abbr AS conference_event_name_abbr,t.topic AS topic,t.algorithm AS algorithm,r.weight AS weight",
                    conference_event_name_abbr=conference_event_name_abbr, topic=topic)
    values = [record for record in result]

    return values


def GetEventTopic(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[r:has_topic]->(t:Topic) RETURN e.conference_event_name_abbr AS conference_event_name_abbr,t.topic AS topic,t.algorithm AS algorithm,r.weight AS weight",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def GetKeyword(tx, keyword):
    result = tx.run(
        "MATCH (k:Keyword) WHERE k.keyword=$keyword RETURN k.keyword AS keyword ,k.algorithm AS algorithm ", keyword=keyword)
    values = [record for record in result]

    return values


def GetTopic(tx, topics):
    result = tx.run(
        "MATCH (t:Topic) WHERE t.topic=$topics RETURN t.topic AS topic ,t.algorithm AS algorithm ", topics=topics)
    values = [record for record in result]

    return values


def GetAuthorPapers(tx, authorID):
    result = tx.run("MATCH (a:Author{semantic_scolar_author_id:$authorID})-[published]->(p:Publication) RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls,p.years AS years",
                    authorID=authorID)
    values = [record for record in result]

    return values


def GetAuthorsOfPaper(tx, paperID):
    result = tx.run("MATCH (a:Author)-[published]->(p:Publication{paper_id:$paperID}) RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id,p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls,p.years AS years",
                    paperID=paperID)
    values = [record for record in result]

    return values


def GetAuthorEventPapers(tx, authorID, conference_event_name_abbr):
    result = tx.run("MATCH (a:Author{semantic_scolar_author_id:$authorID})-[published]->(p:Publication) RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls,p.years AS years",
                    authorID=authorID)
    values = [record for record in result]

    return values


def GetAuthor(tx, authorID):
    result = tx.run(
        "MATCH (a:author) WHERE a.semantic_scolar_author_id=$semantic_scolar_author_id RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id", semantic_scolar_author_id=authorID)
    values = [record for record in result]

    return values


def CreateAuthor_has_keyword(tx, authorID, keyword, weight):
    tx.run(
        "MATCH (a), (k) WHERE a.semantic_scolar_author_id = $authorID AND k.keyword = $keyword MERGE (a)-[:has_keyword{ weight: $weight }]->(k);", authorID=authorID, keyword=keyword, weight=weight)


def CreateAuthor_has_topic(tx, authorID, topic, weight):
    tx.run(
        "MATCH (a), (t) WHERE a.semantic_scolar_author_id = $authorID AND t.topic = $topic MERGE (a)-[:has_topic{ weight: $weight }]->(t);", authorID=authorID, topic=topic, weight=weight)


def GetPublication(tx, paperID):
    result = tx.run(
        "MATCH (p:Publication) WHERE p.paper_id=$paperID RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls,p.years AS years", paperID=paperID)
    values = [record for record in result]

    return values


def CreatePublication_has_keyword(tx, paper_id, keyword, weight):
    tx.run(
        "MATCH (p), (k) WHERE p.paper_id = $paper_id AND k.keyword = $keyword MERGE (p)-[:has_keyword { weight: $weight }]->(k);", paper_id=paper_id, keyword=keyword, weight=weight)


def CreatePublication_has_topic(tx, paper_id, topic, weight):
    tx.run(
        "MATCH (p), (t) WHERE p.paper_id = $paper_id AND t.topic = $topic MERGE (p)-[:has_topic { weight: $weight }]->(t);", paper_id=paper_id, topic=topic, weight=weight)


def DeleteConference(tx, conference_name_abbr):

    tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_author]->(a:Author)"
           "Detach Delete a", conference_name_abbr=conference_name_abbr)
    tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_publication]->(p:Publication)"
           "Detach Delete p", conference_name_abbr=conference_name_abbr)
    tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_event]->(e:Event)"
           "Detach Delete e", conference_name_abbr=conference_name_abbr)
    tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})"
           "Detach Delete c", conference_name_abbr=conference_name_abbr)
    tx.run("MATCH (n) WHERE NOT (n)--() delete (n)")  # double check

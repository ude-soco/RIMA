from django.conf import settings
from django.conf import settings

session = settings.NEO4J_SESSION.session()


def cql_create_database_labels(tx):
    cql_conference_label = "CREATE CONSTRAINT ON (c:Conference) ASSERT c.conference_name_abbr IS UNIQUE"
    cql_event_label = "CREATE CONSTRAINT ON (e:Event) ASSERT e.conference_event_name_abbr IS UNIQUE"
    cql_publication_label = "CREATE CONSTRAINT ON (p:Publication) ASSERT p.paper_id IS UNIQUE"
    cql_author_label = "CREATE CONSTRAINT ON (a:Author) ASSERT a.semantic_scolar_author_id IS UNIQUE"
    cql_keyword_label = "CREATE CONSTRAINT ON (k:Keyword) ASSERT k.keyword IS UNIQUE"
    cql_topic_label = "CREATE CONSTRAINT ON (t:Topic) ASSERT t.topic IS UNIQUE"
    # add here any new cql label, then add it to queries list
    queries = [cql_conference_label, cql_event_label, cql_publication_label,
               cql_author_label, cql_keyword_label, cql_topic_label]
    for query in queries:
        try:
            session.run(query)
        except:
            pass

# ----------------------------------# Create Nodes Functions #----------------------------------#


# session = graphDB_Driver.session()
session = settings.NEO4J_SESSION.session()


def cql_create_conference(tx, name, url, platform_name, platform_url):
    # cqlNodeQuery = "CREATE CONSTRAINT ON (c:Conference) ASSERT c.conference_name_abbr IS UNIQUE"
    # try:
    #     session.run(cqlNodeQuery)
    # except:
    #     print("**** it has already unique constrain ****")
    tx.run(
        "CREATE (c:Conference {conference_name_abbr : $name,conference_url : $url,platform_name:$platform_name,platform_url:$platform_url})", name=name, url=url, platform_name=platform_name, platform_url=platform_url)


def cql_create_event(tx, name_abbr, url):
    # cqlNodeQuery = "CREATE CONSTRAINT ON (e:Event) ASSERT e.conference_event_name_abbr IS UNIQUE"
    # try:
    #     session.run(cqlNodeQuery)
    # except:
    #     print("**** it has already unique constrain ****")
    tx.run("CREATE (e:Event {conference_event_name_abbr : $name_abbr,conference_event_url : $url})",
           name_abbr=name_abbr, url=url)


def cql_create_author(tx, semantic_scolar_author_id, author_name, author_url):
    # cqlNodeQuery = "CREATE CONSTRAINT ON (a:Author) ASSERT a.semantic_scolar_author_id IS UNIQUE"
    # try:
    #     session.run(cqlNodeQuery)
    # except:
    #     print("**** it has already unique constrain ****")

    tx.run("CREATE (a:Author {semantic_scolar_author_id : $semantic_scolar_author_id,author_name : $author_name,author_url : $author_url,aliases:'NULL',influentialCitationCount:'NULL',all_papers:'NULL'})",
           semantic_scolar_author_id=semantic_scolar_author_id, author_name=author_name, author_url=author_url,)


def cql_create_paper(tx, paper_id, paper_doi, title, urls, years, abstract, citiations, paper_venu):
    # cqlNodeQuery = "CREATE CONSTRAINT ON (p:Publication) ASSERT p.paper_id IS UNIQUE"
    # try:
    #     session.run(cqlNodeQuery)
    # except:
    #     print("**** it has already unique constrain ****")

    tx.run("CREATE (p:Publication {paper_id : $paper_id,paper_doi : $paper_doi,title:$title,urls:$urls,years:$years,abstract:$abstract,citiations:$citiations,paper_venu:$paper_venu})",
           paper_id=paper_id, paper_doi=paper_doi, title=title, urls=urls, years=years, abstract=abstract, citiations=citiations, paper_venu=paper_venu)


def cql_create_keyword(tx, keyword, algorithm):
    # cqlNodeQuery = "CREATE CONSTRAINT ON (k:Keyword) ASSERT k.keyword IS UNIQUE"
    # try:
    #     session.run(cqlNodeQuery)
    # except:
    #     print("**** it has already unique constrain ****")
    tx.run("CREATE (k:Keyword {keyword : $keyword,algorithm : $algorithm})",
           keyword=keyword, algorithm=algorithm)


def cql_create_topic(tx, topic, algorithm):
    # cqlNodeQuery = "CREATE CONSTRAINT ON (t:Topic) ASSERT t.topic IS UNIQUE"
    # try:
    #     session.run(cqlNodeQuery)
    # except:
    #     print("**** it has already unique constrain ****")
    tx.run("CREATE (t:Topic {topic : $topic,algorithm : $algorithm})",
           topic=topic, algorithm=algorithm)
# ----------------------------------# Create Relationships Functions #----------------------------------#


def cql_create_has_event(tx, conference, event):
    tx.run(
        "MATCH (c), (e) WHERE c.conference_name_abbr = $conference AND e.conference_event_name_abbr = $event MERGE (c)-[:has_event]->(e);", conference=conference, event=event)


def cql_conference_has_paper(tx, conference, paperID):
    tx.run(
        "MATCH (c), (p) WHERE c.conference_name_abbr = $conference AND p.paper_id = $paper_id MERGE (c)-[:has_publication]->(p);", conference=conference, paper_id=paperID)


def cql_event_has_paper(tx, conference_event_name_abbr, paperID):
    tx.run(
        "MATCH (e), (p) WHERE e.conference_event_name_abbr = $conference_event_name_abbr AND p.paper_id = $paper_id MERGE (e)-[:has_publication]->(p);", conference_event_name_abbr=conference_event_name_abbr, paper_id=paperID)


def cql_author_has_paper(tx, semantic_scolar_author_id, paperID):
    tx.run(
        "MATCH (a), (p) WHERE a.semantic_scolar_author_id = $semantic_scolar_author_id AND p.paper_id = $paper_id MERGE (a)-[:published]->(p);", semantic_scolar_author_id=semantic_scolar_author_id, paper_id=paperID)


def cql_event_has_author(tx, event, semantic_scolar_author_id):
    tx.run(
        "MATCH (e), (a) WHERE e.conference_event_name_abbr = $event AND a.semantic_scolar_author_id = $semantic_scolar_author_id MERGE (e)-[:has_author]->(a);", event=event, semantic_scolar_author_id=semantic_scolar_author_id)


def cql_conference_has_author(tx, conference, semantic_scolar_author_id):
    tx.run(
        "MATCH (c), (a) WHERE c.conference_name_abbr = $conference AND a.semantic_scolar_author_id = $semantic_scolar_author_id MERGE (c)-[:has_author]->(a);", conference=conference, semantic_scolar_author_id=semantic_scolar_author_id)


def cql_create_coauthor(tx, authorID, coauthorID):
    tx.run(
        "MATCH (e), (a) WHERE e.semantic_scolar_author_id = $authorID AND a.semantic_scolar_author_id = $coauthorID MERGE (e)-[:co_author]->(a);", authorID=authorID, coauthorID=coauthorID)


def cql_create_author_has_keyword(tx, authorID, keyword, weight):
    tx.run(
        "MATCH (a), (k) WHERE a.semantic_scolar_author_id = $authorID AND k.keyword = $keyword MERGE (a)-[:has_keyword{ weight: $weight }]->(k);", authorID=authorID, keyword=keyword, weight=weight)


def cql_create_author_has_topic(tx, authorID, topic, weight):
    tx.run(
        "MATCH (a), (t) WHERE a.semantic_scolar_author_id = $authorID AND t.topic = $topic MERGE (a)-[:has_topic{ weight: $weight }]->(t);", authorID=authorID, topic=topic, weight=weight)


def cql_create_event_has_keyword(tx, event, keyword, weight):
    tx.run(
        "MATCH (e), (k) WHERE e.conference_event_name_abbr = $event AND k.keyword = $keyword MERGE (e)-[:has_keyword { weight: $weight }]->(k);", event=event, keyword=keyword, weight=weight)


def cql_create_event_has_topic(tx, event, topic, weight):
    tx.run(
        "MATCH (e), (t) WHERE e.conference_event_name_abbr = $event AND t.topic = $topic MERGE (e)-[:has_topic {weight:$weight}]->(t);", event=event, topic=topic, weight=weight)


def cql_create_publication_has_keyword(tx, paper_id, keyword, weight):
    tx.run(
        "MATCH (p), (k) WHERE p.paper_id = $paper_id AND k.keyword = $keyword MERGE (p)-[:has_keyword { weight: $weight }]->(k);", paper_id=paper_id, keyword=keyword, weight=weight)


def cql_create_publication_has_topic(tx, paper_id, topic, weight):
    tx.run(
        "MATCH (p), (t) WHERE p.paper_id = $paper_id AND t.topic = $topic MERGE (p)-[:has_topic { weight: $weight }]->(t);", paper_id=paper_id, topic=topic, weight=weight)


# ----------------------------------# Get Functions #----------------------------------#


def cql_get_conference_data(tx, conference_name_abbr):
    result = tx.run("MATCH (c:Conference) WHERE c.conference_name_abbr=$conference_name_abbr RETURN c.conference_name_abbr AS conference_name_abbr ,c.conference_url AS conference_url,c.platform_name AS platform_name,c.platform_url AS platform_url",
                    conference_name_abbr=conference_name_abbr)
    values = [record for record in result]

    return values


def cql_get_event_data(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event) WHERE e.conference_event_name_abbr=$conference_event_name_abbr RETURN e.conference_event_name_abbr AS conference_event_name_abbr,e.conference_event_url AS conference_event_url,e.no_of_stored_papers AS no_of_stored_papers ",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def cql_get_conference_events(tx, conference_name_abbr):
    result = tx.run("MATCH (c:Conference)-[:has_event]->(e:Event) WHERE c.conference_name_abbr=$conference_name_abbr RETURN c.conference_name_abbr AS conference_name_abbr, e.conference_event_url AS conference_event_url,e.no_of_stored_papers AS no_of_stored_papers,e.conference_event_name_abbr AS conference_event_name_abbr  ",
                    conference_name_abbr=conference_name_abbr)
    values = [record for record in result]

    return values


def cql_get_event_papers(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[:has_publication]->(p:Publication) RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def cql_get_conferences(tx):
    result = tx.run(
        "MATCH (c:Conference) RETURN c.conference_name_abbr AS conference_name_abbr ,c.conference_url AS conference_url,c.platform_name AS platform_name,c.platform_url AS platform_url")
    values = [record for record in result]
    return values


def cql_get_conference_papers(tx, conference_name_abbr):
    result = tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_publication]->(p:Publication) RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls",
                    conference_name_abbr=conference_name_abbr)
    values = [record for record in result]

    return values


def cql_get_event_authors(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[:has_author]->(a:Author) RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def cql_get_conference_authors(tx, conference_name_abbr):
    result = tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_author]->(a:Author) RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id",
                    conference_name_abbr=conference_name_abbr)
    values = [record for record in result]

    return values


def cql_get_event_keyword(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[r:has_keyword]->(k:Keyword) RETURN e.conference_event_name_abbr AS conference_event_name_abbr,k.keyword AS keyword,k.algorithm AS algorithm,r.weight AS weight",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def cql_get_event_keyword_weight(tx, conference_event_name_abbr, keyword):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[r:has_keyword]->(k:Keyword{keyword:$keyword}) WITH e.conference_event_name_abbr AS conference_event_name_abbr,k.keyword AS keyword,k.algorithm AS algorithm,r.weight AS weights ORDER BY weights DESC RETURN conference_event_name_abbr , keyword, algorithm, max(weights) as weight",
                    conference_event_name_abbr=conference_event_name_abbr, keyword=keyword)
    values = [record for record in result]

    return values


def cql_get_author_keyword_weight(tx, authorID, keyword):
    result = tx.run("MATCH (a:Author{semantic_scolar_author_id:$authorID})-[r:has_keyword]->(k:Keyword{keyword:$keyword}) WITH a.author_name AS author_name,a.semantic_scolar_author_id AS semantic_scolar_author_id,k.keyword AS keyword,k.algorithm AS algorithm,r.weight AS weights ORDER BY weights DESC RETURN author_name,semantic_scolar_author_id , keyword, algorithm, max(weights) as weight",
                    authorID=authorID, keyword=keyword)
    values = [record for record in result]

    return values


def cql_get_author_topic_weight(tx, authorID, topic):
    result = tx.run("MATCH (a:Author{semantic_scolar_author_id:$authorID})-[r:has_topic]->(t:Topic{topic:$topic}) WITH a.author_name AS author_name,a.semantic_scolar_author_id AS semantic_scolar_author_id,t.topic AS topic,t.algorithm AS algorithm,r.weight AS weights ORDER BY weights DESC RETURN author_name,semantic_scolar_author_id , topic, algorithm, max(weights) as weight",
                    authorID=authorID, topic=topic)
    values = [record for record in result]

    return values


def cql_get_event_topic_weight(tx, conference_event_name_abbr, topic):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[r:has_topic]->(t:Topic{topic:$topic}) RETURN e.conference_event_name_abbr AS conference_event_name_abbr,t.topic AS topic,t.algorithm AS algorithm,r.weight AS weight",
                    conference_event_name_abbr=conference_event_name_abbr, topic=topic)
    values = [record for record in result]

    return values


def cql_get_event_topic(tx, conference_event_name_abbr):
    result = tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr})-[r:has_topic]->(t:Topic) RETURN e.conference_event_name_abbr AS conference_event_name_abbr,t.topic AS topic,t.algorithm AS algorithm,r.weight AS weight",
                    conference_event_name_abbr=conference_event_name_abbr)
    values = [record for record in result]

    return values


def cql_get_keyword(tx, keyword):
    result = tx.run(
        "MATCH (k:Keyword) WHERE k.keyword=$keyword RETURN k.keyword AS keyword ,k.algorithm AS algorithm ", keyword=keyword)
    values = [record for record in result]

    return values


def cql_get_topic(tx, topics):
    result = tx.run(
        "MATCH (t:Topic) WHERE t.topic=$topics RETURN t.topic AS topic ,t.algorithm AS algorithm ", topics=topics)
    values = [record for record in result]

    return values


def cql_get_author_papers(tx, authorID):
    result = tx.run("MATCH (a:Author{semantic_scolar_author_id:$authorID})-[published]->(p:Publication) RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls,p.years AS years",
                    authorID=authorID)
    values = [record for record in result]

    return values


def cql_get_authors_of_papers(tx, paperID):
    result = tx.run("MATCH (a:Author)-[published]->(p:Publication{paper_id:$paperID}) RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id,p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls,p.years AS years",
                    paperID=paperID)
    values = [record for record in result]

    return values


def cql_get_author_event_papers(tx, authorID, conference_event_name_abbr):
    result = tx.run("MATCH(e:Event{conference_event_name_abbr:$event})-[:has_publication]->(p1:Publication) with collect(p1) as papers MATCH (a:Author{semantic_scolar_author_id:$authorID})-[published]->(p:Publication) where p in papers Return p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls,p.years AS years",
                    event=conference_event_name_abbr, authorID=authorID)
    values = [record for record in result]

    return values


def cql_get_author(tx, authorID):
    result = tx.run(
        "MATCH (a:author) WHERE a.semantic_scolar_author_id=$semantic_scolar_author_id RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id", semantic_scolar_author_id=authorID)
    values = [record for record in result]

    return values


def cql_get_publication(tx, paperID):
    result = tx.run(
        "MATCH (p:Publication) WHERE p.paper_id=$paperID RETURN p.abstract AS abstract,p.citiations AS citiations,p.paper_doi AS paper_doi,p.paper_id AS paper_id,p.paper_venu AS paper_venu,p.title AS title,p.urls AS urls,p.years AS years", paperID=paperID)
    values = [record for record in result]

    return values


def cql_check_event_topic_relation(tx, event, topic):
    result = tx.run(
        "MATCH (e:Event{conference_event_name_abbr:$event}) Return exists((e)-[:has_topic]->(:Topic{topic:$topic})) As check", event=event, topic=topic)
    values = [record for record in result]

    return values


def cql_check_event_keyword_relation(tx, event, keyword):
    result = tx.run(
        "MATCH (e:Event{conference_event_name_abbr:$event}) Return exists((e)-[:has_keyword]->(:Keyword{keyword:$keyword})) As check", event=event, keyword=keyword)
    values = [record for record in result]

    return values


def cql_check_author_keyword_relation(tx, authorID, keyword):
    result = tx.run(
        "MATCH (a:Author{semantic_scolar_author_id:$authorID}) Return exists((a)-[:has_keyword]->(:Keyword{keyword:$keyword})) As check", authorID=authorID, keyword=keyword)
    values = [record for record in result]

    return values


def cql_check_author_topic_relation(tx, authorID, topic):
    result = tx.run(
        "MATCH (a:Author{semantic_scolar_author_id:$authorID}) Return exists((a)-[:has_topic]->(:Topic{topic:$topic})) As check", authorID=authorID, topic=topic)
    values = [record for record in result]

    return values


def cql_get_publication_from_keyword(tx, event, keyword):
    result = tx.run(
        "MATCH(e:Event{conference_event_name_abbr:$event})-[:has_publication]->(p1:Publication) with collect(p1) as papers MATCH(p:Publication)-[:has_keyword]->(k:Keyword{keyword:$keyword}) where p in papers Return p.title AS title,p.abstract As abstract", event=event, keyword=keyword)
    values = [record for record in result]

    return values


def cql_get_publication_from_topic(tx, event, topic):
    result = tx.run(
        "MATCH(e:Event{conference_event_name_abbr:$event})-[:has_publication]->(p1:Publication) with collect(p1) as papers MATCH(p:Publication)-[:has_topic]->(t:Topic{topic:$topic}) where p in papers Return p.title AS title,p.abstract As abstract ", event=event, topic=topic)
    values = [record for record in result]

    return values


def cql_get_author_keyword(tx, authorID):
    result = tx.run("MATCH (a:Author{semantic_scolar_author_id:$authorID})-[r:has_keyword]->(k:Keyword) RETURN k.keyword As keyword,r.weight As weight",
                    authorID=authorID)
    values = [record for record in result]

    return values


def cql_get_author_topic(tx, authorID):
    result = tx.run("MATCH (a:Author{semantic_scolar_author_id:$authorID})-[r:has_topic]->(t:Topic) RETURN t.topic As topic,r.weight As weight",
                    authorID=authorID)
    values = [record for record in result]

    return values


def cql_get_author_by_name(tx, author_name):
    result = tx.run(
        "MATCH (a:author) WHERE a.author_name=$author_name RETURN a.aliases AS aliases,a.all_papers AS all_papers,a.author_name AS author_name,a.author_url AS author_url,a.influentialCitationCount AS influentialCitationCount,a.semantic_scolar_author_id AS semantic_scolar_author_id", author_name=author_name)
    values = [record for record in result]

    return values


# ----------------------------------# Update Functions #----------------------------------#

def cql_update_conference_event(tx, conference_event_name_abbr, nproperty, value):
    tx.run("MATCH (e:Event{conference_event_name_abbr:$conference_event_name_abbr}) SET e."+nproperty+"=$value",
           conference_event_name_abbr=conference_event_name_abbr, value=value)  # change any prop of event


def cql_update_event_keyword_relation(tx, event, keyword, weight):
    tx.run(
        "MATCH (e:Event{conference_event_name_abbr:$event})-[r:has_keyword]->(k:Keyword{keyword:$keyword}) SET r.weight=$weight", event=event, keyword=keyword, weight=weight)


def cql_update_author_keyword_relation(tx, authorID, keyword, weight):
    tx.run(
        "MATCH (a:Author{semantic_scolar_author_id:$authorID})-[r:has_keyword]->(k:Keyword{keyword:$keyword}) SET r.weight=$weight", authorID=authorID, keyword=keyword, weight=weight)


def cql_update_author_topic_relation(tx, authorID, topic, weight):
    tx.run(
        "MATCH (a:Author{semantic_scolar_author_id:$authorID})-[r:has_topic]->(k:Topic{topic:$topic}) SET r.weight=$weight", authorID=authorID, topic=topic, weight=weight)


def cql_update_event_topic_relation(tx, event, topic, weight):
    tx.run(
        "MATCH (e:Event{conference_event_name_abbr:$event})-[r:has_topic]->(k:Topic{topic:$topic}) SET r.weight=$weight", event=event, topic=topic, weight=weight)


# ----------------------------------# Delete Functions #----------------------------------#

def cql_delete_conference(tx, conference_name_abbr):

    tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_author]->(a:Author)"
           "Detach Delete a", conference_name_abbr=conference_name_abbr)
    tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_publication]->(p:Publication)"
           "Detach Delete p", conference_name_abbr=conference_name_abbr)
    tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})-[:has_event]->(e:Event)"
           "Detach Delete e", conference_name_abbr=conference_name_abbr)
    tx.run("MATCH (c:Conference{conference_name_abbr:$conference_name_abbr})"
           "Detach Delete c", conference_name_abbr=conference_name_abbr)
    tx.run("MATCH (n) WHERE NOT (n)--() delete (n)")  # double check

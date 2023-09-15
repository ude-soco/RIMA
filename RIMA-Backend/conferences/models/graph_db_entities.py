from neomodel import (StructuredNode, StringProperty, FloatProperty,
                      StructuredRel, RelationshipTo, RelationshipFrom,
                      Relationship)
import json


# The class "HasTopic" is a structured relationship with a weight property.
class HasTopic(StructuredRel):
    weight = FloatProperty()


# The class "Haskeyword" is a subclass of "StructuredRel" and has a property
#  called "weight" of type float.
class Haskeyword(StructuredRel):
    weight = FloatProperty()


# The above class defines a Topic node in a graph database with properties 
# algorithm and topic, and relationships with Event and Author nodes.
class Topic(StructuredNode):
    algorithm = StringProperty()
    topic = StringProperty()

    event = RelationshipFrom('Event', 'HasTopic', model=HasTopic)
    authors = RelationshipFrom('Author', 'HasTopic', model=HasTopic)


# The above class represents a keyword in a Python program, with properties for
#  the algorithm and the keyword itself, and relationships to events and authors.
class Keyword(StructuredNode):
    algorithm = StringProperty()
    keyword = StringProperty()
    event = RelationshipFrom('Event', 'Haskeyword', model=Haskeyword)
    author = RelationshipFrom('Author', 'Haskeyword', model=Haskeyword)


# The `Publication` class represents a publication with properties such as 
# abstract, citations, paper DOI, paper ID, paper venue, title, URLs, and years,
# and relationships with events, keywords, conferences, topics, and authors.
class Publication(StructuredNode):
    abstract = StringProperty()
    citiations = StringProperty()
    paper_doi = StringProperty()
    paper_id = StringProperty()
    paper_venu = StringProperty()
    title = StringProperty()
    urls = StringProperty()
    years = StringProperty()

    published_in = RelationshipFrom("Event", "has_publication")
    keywords = RelationshipTo(Keyword, 'Haskeyword', model=Haskeyword)
    published_in_Confs = RelationshipFrom("Conference", "has_publication")
    topics = RelationshipTo(Topic, 'HasTopic', model=HasTopic)
    authors = RelationshipFrom("Author", "published")


# The above class defines an Author node in a graph database with properties
#  such as semantic_scolar_author_id, aliases, influentialCitationCount, 
# author_name, all_papers, and author_url, and relationships with other nodes
#  such as Publication, Topic, Keyword, and Conference.
class Author(StructuredNode):
    semantic_scolar_author_id = StringProperty(primary_key=True)
    aliases = StringProperty()
    influentialCitationCount = StringProperty(nullable=True)
    author_name = StringProperty()
    all_papers = StringProperty()
    author_url = StringProperty()

    published = RelationshipTo(Publication, "published")
    topics = RelationshipTo(Topic, 'HasTopic', model=HasTopic)
    keywords = RelationshipTo(Keyword, 'Haskeyword', model=Haskeyword)
    co_authors = Relationship("Author", 'co_author')
    published_in_Confs = RelationshipFrom("Conference", "has_author")


# The above class defines an Event node in a graph database, with properties 
# such as conference_event_name_abbr and conference_event_url,
#  and relationships to other nodes such as authors, publications, topics,
#  and keywords.
class Event(StructuredNode):
    conference_event_name_abbr = StringProperty()
    conference_event_url = StringProperty()

    authors = RelationshipTo(Author, 'has_author')
    publications = RelationshipTo(Publication, "has_publication")

    topics = RelationshipTo(Topic, 'HasTopic', model=HasTopic)
    keywords = RelationshipTo(Keyword, 'Haskeyword', model=Haskeyword)


# The Conference class represents a conference and its associated properties
#  and relationships.
class Conference(StructuredNode):
    conference_name_abbr = StringProperty()
    conference_url = StringProperty()
    platform_name = StringProperty()
    platform_url = StringProperty()

    publication = RelationshipTo(Publication, "has_publication")
    authors = RelationshipTo(Author, 'has_author')
    events = RelationshipTo(Event, "has_event")

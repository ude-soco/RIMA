from neomodel import (StructuredNode, StringProperty, FloatProperty,
                      StructuredRel, RelationshipTo, RelationshipFrom,
                      Relationship)
import json


class Has_Topic(StructuredRel):
    weight = FloatProperty()
    # try to use get to retrieve weight.
    # def get(cls, start_node, end_node):
    # rel = cls.match(start_node, end_node).first()
    #    if rel:
    #        return rel.weight
    #    return None


class Has_keyword(StructuredRel):
    weight = FloatProperty()


class Topic(StructuredNode):
    algorithm = StringProperty()
    topic = StringProperty()

    event = RelationshipFrom('Event', 'has_topic', model=Has_Topic)
    authors = RelationshipFrom('Author', 'has_topic', model=Has_Topic)


class Keyword(StructuredNode):
    algorithm = StringProperty()
    keyword = StringProperty()
    event = RelationshipFrom('Event', 'has_keyword', model=Has_keyword)
    author = RelationshipFrom('Author', 'has_keyword', model=Has_keyword)


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
    published_in_Confs = RelationshipFrom("Conference", "has_publication")
    keywords = RelationshipTo(Keyword, 'has_keyword', model=Has_keyword)
    topics = RelationshipTo(Topic, 'has_topic', model=Has_Topic)
    authors = RelationshipFrom("Author", "published")


class Author(StructuredNode):
    semantic_scolar_author_id = StringProperty(primary_key=True)
    aliases = StringProperty()
    influentialCitationCount = StringProperty(nullable=True)
    author_name = StringProperty()
    all_papers = StringProperty()
    author_url = StringProperty()

    def set_aliases(self, x):
        self.aliases = json.dumps(x)

    def get_aliases(self):
        return json.loads(self.aliases)

    def set_all_papers(self, x):
        self.all_papers = json.dumps(x)

    def get_all_papers(self):
        return json.loads(self.all_papers)

    published = RelationshipTo(Publication, "published")
    topics = RelationshipTo(Topic, 'has_topic', model=Has_Topic)
    keywords = RelationshipTo(Keyword, 'has_keyword', model=Has_keyword)
    co_authors = Relationship("Author", 'co_author')


class Event(StructuredNode):
    conference_event_name_abbr = StringProperty()
    conference_event_url = StringProperty()

    authors = RelationshipTo(Author, 'has_author')
    publications = RelationshipTo(Publication, "has_publication")

    topics = RelationshipTo(Topic, 'has_topic', model=Has_Topic)
    keywords = RelationshipTo(Keyword, 'has_keyword', model=Has_keyword)


class Conference(StructuredNode):
    conference_name_abbr = StringProperty()
    platform_name = StringProperty()
    platform_url = StringProperty()

    publication = RelationshipTo(Publication, "has_publication")
    authors = RelationshipTo(Author, 'has_author')
    events = RelationshipTo(Event, "has_event")

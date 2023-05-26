from django.db import models
# import torch
# from transformers import AutoTokenizer, AutoModel

# Create your models here.
from neomodel import StructuredNode, StringProperty, Relationship, RelationshipTo, RelationshipFrom, IntegerProperty, StructuredRel, ArrayProperty, FloatProperty, BooleanProperty


class Authorship(StructuredRel):
    position = IntegerProperty()
    
class Citation(StructuredRel):
    relationship_type = StringProperty(choices={"reference": "reference", "citation": "citation"})
    similarity = FloatProperty()

class Paper(StructuredNode):
    paper_id = StringProperty(unique_index=True)
    title = StringProperty()
    abstract = StringProperty()
    year = IntegerProperty()
    tldr = StringProperty()
    authors = RelationshipTo('Author','AUTHORED_BY', model=Authorship)
    is_fetched = BooleanProperty(default=False)
    study_fields = ArrayProperty()
    topics = ArrayProperty()

    specter_embeddings = ArrayProperty()

    citations = Relationship('Paper', 'CITES', model=Citation)
    
    citation_count = IntegerProperty()
    reference_count = IntegerProperty()

    def get_references(self):
        return self.citations.match(relationship_type="reference")

    def get_citations(self):
        return self.citations.match(relationship_type="citation")


# class Topic(StructuredNode):
#     topic_id = IntegerProperty(unique_index=True)
#     name = StringProperty()  # summary or an explanation of the topic


class Author(StructuredNode):
    name = StringProperty()
    papers = RelationshipFrom('Paper', 'AUTHORED_BY', model=Authorship)
    author_id = StringProperty()
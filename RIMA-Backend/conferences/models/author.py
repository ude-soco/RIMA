import json
from neomodel import (config, StructuredNode, StringProperty, IntegerProperty,
                      UniqueIdProperty, RelationshipTo)


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

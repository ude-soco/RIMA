from neomodel import (config, StructuredNode, StringProperty, IntegerProperty,
                      UniqueIdProperty, RelationshipTo)

from .publication import Publication


class Conference(StructuredNode):
    conference_name_abbr = StringProperty()
    platform_name = StringProperty()
    platform_url = StringProperty()

    publication = RelationshipTo(Publication, "has_publication")

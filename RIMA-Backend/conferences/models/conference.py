from neomodel import (config, StructuredNode, StringProperty, IntegerProperty,
                      UniqueIdProperty, RelationshipTo)


class Conference(StructuredNode):
    uid = UniqueIdProperty()
    conference_name_abbr = StringProperty()
    platform_name = StringProperty()
    platform_url = StringProperty()

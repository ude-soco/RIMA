from neomodel import (config, StructuredNode, StringProperty, IntegerProperty,
                      UniqueIdProperty, RelationshipTo)


class Event(StructuredNode):
    conference_event_name_abbr = StringProperty()
    conference_event_url = StringProperty()

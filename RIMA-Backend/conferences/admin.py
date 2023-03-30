from django.contrib import admin
from conferences.models import *

admin.site.register(Platform)
admin.site.register(Conference)
admin.site.register(Conference_Event)
admin.site.register(Conference_Event_Paper)
admin.site.register(Author)
admin.site.register(PreloadedConferenceList)
admin.site.register(Conf_Event_keyword)
admin.site.register(Event_has_keyword)
admin.site.register(Conf_Event_Topic)
admin.site.register(Event_has_Topic)
admin.site.register(Author_Event_keyword)
admin.site.register(Author_has_Keyword)
admin.site.register(Author_Event_Topic)
admin.site.register(Author_has_Topic)

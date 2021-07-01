from django.contrib import admin
from .models import * 

admin.site.register(Platform)
admin.site.register(Conference)
admin.site.register(Conference_Event)
admin.site.register(Conference_Event_Paper)
admin.site.register(Author)
admin.site.register(PreloadedConferenceList)
admin.site.register(Conf_Event_keyword)
admin.site.register(Event_has_keyword)



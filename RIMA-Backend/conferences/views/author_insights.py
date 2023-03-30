from django.http.response import HttpResponse
from django.conf import settings

session = settings.NEO4J_SESSION.session()

def author_insights_url():
    return HttpResponse("Author Insights.")
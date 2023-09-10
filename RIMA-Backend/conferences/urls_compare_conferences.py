from django.urls import path
from conferences.views import *

urlpatterns = [
    path('allConferences/', getAllAvailabelConfs.as_view()),
    path("allEvents/", getAllAvailabelEvents.as_view()),

]

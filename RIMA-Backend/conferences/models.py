from django.db import models
import json

from django.db.models.deletion import CASCADE


class PreloadedConferenceList(models.Model):

    conference_name_abbr = models.CharField(max_length=255,null=True, blank=True)
    conference_full_name = models.CharField(max_length=255,null=True, blank=True)
    conference_url = models.CharField(max_length=1024, null=True, blank=True)


class Platform(models.Model):
    platform_name = models.CharField(max_length=255,primary_key=True)
    platform_url = models.CharField(max_length=1024, null=True, blank=True)
   
    def __str__(self):
        return self.platform_name

class Conference(models.Model):
    platform_name = models.ForeignKey(Platform,
                                    related_name="conferences",
                                    on_delete=models.CASCADE)
    conference_name_abbr = models.CharField(max_length=100,primary_key=True)
    #conference_full_name = models.CharField(max_length=255,null=True,blank=True)
    conference_url = models.CharField(max_length=1024, null=True, blank=True)
    #conference_event_year = models.IntegerField(null=True,blank=True)


class Conference_Event(models.Model):
    conference_name_abbr = models.ForeignKey(Conference,
                                    related_name="conference_events",
                                    on_delete=models.CASCADE)
    conference_event_name_abbr = models.CharField(max_length=100, primary_key=True)
    conference_event_full_name = models.CharField(max_length=255,null=True,blank=True)
    conference_event_url = models.CharField(max_length=1024, null=True, blank=True)
    no_of_stored_papers = models.IntegerField(null=True,blank=True)

    def __str__(self):
        return self.conference_event_name_abbr

class Conference_Event_Paper(models.Model):
    conference_event_name_abbr = models.ForeignKey(Conference_Event,
                                    related_name="conference_event_papers",
                                    on_delete=models.CASCADE)
    paper_id = models.CharField(max_length=255, primary_key=True)
    paper_doi = models.CharField(max_length=255,null=True,blank=True)                                
    title = models.CharField(max_length=2048, null=True, blank=True)
    url = models.CharField(max_length=1024, null=True, blank=True)
    year = models.IntegerField(null=True)
    abstract = models.TextField(null=True, blank=True, default='')
    no_of_cititations = models.IntegerField(null=True,blank=True)
    citiations = models.CharField(max_length=1024, null=True)
    paper_venu = models.CharField(max_length=100, null=True, blank=True)


    def set_citiations(self, x):
        self.citiations = json.dumps(x)

    def get_citiations(self):
        return json.loads(self.citiations)

    

class Author(models.Model):
    author_id = models.CharField(max_length=255, primary_key=True)
    aliases = models.CharField(max_length=255, null=True)
    influentialCitationCount = models.IntegerField(null=True)
    author_name = models.CharField(max_length=255, null=True)
    all_papers =  models.CharField(max_length=1024, null=True)
    author_url = models.CharField(max_length=1024, null=True, blank=True)
    papers_within_conference = models.ManyToManyField(Conference_Event_Paper)


    def set_aliases(self, x):
        self.aliases = json.dumps(x)

    def get_aliases(self):
        return json.loads(self.aliases)

    def set_all_papers(self, x):
        self.all_papers = json.dumps(x)

    def get_all_papers(self):
        return json.loads(self.all_papers)

class Conf_Event_keyword(models.Model):
    keyword_id = models.AutoField(primary_key=True)
    keywrod = models.CharField(max_length=255, null=True, blank=True)
    algorithm = models.CharField(max_length=255, null=True, blank=True)
    conference_event_name_abbr = models.ManyToManyField(Conference_Event,through = 'Event_has_keyword')


class Event_has_keyword(models.Model):
    conference_event_name_abbr = models.ForeignKey(Conference_Event, on_delete=CASCADE, related_name= 'hasEvents')
    keyword_id = models.ForeignKey(Conf_Event_keyword, on_delete=CASCADE, related_name= 'haskeywords')
    wiegth = models.IntegerField(null=True) 
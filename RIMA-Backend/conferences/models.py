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
    conference_name_abbr = models.CharField(max_length=100, null=True, blank=True)
    
    def set_citiations(self, x):
        self.citiations = json.dumps(x)

    def get_citiations(self):
        return json.loads(self.citiations)

    
class Author(models.Model):
    semantic_scolar_author_id = models.CharField(max_length=255, primary_key=True)
    aliases = models.CharField(max_length=255, null=True)
    influentialCitationCount = models.IntegerField(null=True)
    author_name = models.CharField(max_length=255, null=True)
    all_papers =  models.CharField(max_length=1024, null=True)
    author_url = models.CharField(max_length=1024, null=True, blank=True)
    papers_within_conference = models.ManyToManyField(Conference_Event_Paper, through='Author_has_Papers')

    def set_aliases(self, x):
        self.aliases = json.dumps(x)

    def get_aliases(self):
        return json.loads(self.aliases)

    def set_all_papers(self, x):
        self.all_papers = json.dumps(x)

    def get_all_papers(self):
        return json.loads(self.all_papers)


class Author_has_Papers(models.Model):
    author_id = models.ForeignKey(Author, on_delete=CASCADE)
    paper_id = models.ForeignKey(Conference_Event_Paper, on_delete=CASCADE)
    conference_name_abbr = models.ForeignKey(Conference, on_delete=CASCADE)
    conference_event_name_abbr = models.ForeignKey(Conference_Event, on_delete=CASCADE)
    
    class Meta:
        unique_together = (("conference_event_name_abbr", "author_id","paper_id"),)


class Conf_Event_keyword(models.Model):
    keyword_id = models.AutoField(primary_key=True)
    keyword = models.CharField(max_length=255, null=True, blank=True)
    algorithm = models.CharField(max_length=255, null=True, blank=True)
    conference_event_name_abbr = models.ManyToManyField(Conference_Event,through = 'Event_has_keyword')


class Event_has_keyword(models.Model):
    conference_event_name_abbr = models.ForeignKey(Conference_Event, on_delete=CASCADE, related_name= 'keywords_Events')
    keyword_id = models.ForeignKey(Conf_Event_keyword, on_delete=CASCADE, related_name= 'haskeywords')
    weight = models.IntegerField(null=True) 

    class Meta:
        unique_together = (("conference_event_name_abbr", "keyword_id"),)


class Conf_Event_Topic(models.Model):
    topic_id = models.AutoField(primary_key=True) 
    topic = models.CharField(max_length=255, null=True, blank=True)
    algorithm = models.CharField(max_length=255, null=True, blank=True)
    conference_event_name_abbr = models.ManyToManyField(Conference_Event,through = 'Event_has_Topic')


class Event_has_Topic(models.Model):
    conference_event_name_abbr = models.ForeignKey(Conference_Event, on_delete=CASCADE, related_name= 'Topics_Events')
    topic_id = models.ForeignKey(Conf_Event_Topic, on_delete=CASCADE, related_name= 'hastopics')
    weight = models.IntegerField(null=True)
    
    class Meta:
        unique_together = (("conference_event_name_abbr", "topic_id"),)


class Author_Event_Topic(models.Model):
    topic_id = models.AutoField(primary_key=True) 
    topic = models.CharField(max_length=255, null=True, blank=True)
    algorithm = models.CharField(max_length=255, null=True, blank=True)
    author_id = models.ManyToManyField(Conference_Event,through = 'Author_has_Topic')


class Author_has_Topic(models.Model):
    author_id = models.ForeignKey(Author, on_delete=CASCADE, related_name= 'authors_topics')
    conference_event_name_abbr = models.ForeignKey(Conference_Event, on_delete=CASCADE)
    topic_id = models.ForeignKey(Author_Event_Topic, on_delete=CASCADE, related_name= 'authorhastopics')
    weight = models.IntegerField(null=True)
    
    class Meta:
        unique_together = (("author_id", "topic_id","conference_event_name_abbr"),)


class Author_Event_keyword(models.Model):
    keyword_id = models.AutoField(primary_key=True)
    keyword = models.CharField(max_length=255, null=True, blank=True)
    algorithm = models.CharField(max_length=255, null=True, blank=True)
    author_id = models.ManyToManyField(Conference_Event,through = 'Author_has_Keyword')


class Author_has_Keyword(models.Model):
    author_id = models.ForeignKey(Author, on_delete=CASCADE, related_name= 'authors_keywords')
    conference_event_name_abbr = models.ForeignKey(Conference_Event, on_delete=CASCADE, null=True, blank=True)
    keyword_id = models.ForeignKey(Author_Event_keyword, on_delete=CASCADE, related_name= 'authorhaskeywords')
    weight = models.IntegerField(null=True)
    all_events = models.BooleanField(default=False)
    
    class Meta:
        unique_together = (("author_id", "keyword_id","conference_event_name_abbr"),)
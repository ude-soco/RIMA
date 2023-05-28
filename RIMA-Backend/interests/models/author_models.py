from django.db import models
from accounts.models import User
from .interest_models import Keyword, Paper

class Author(models.Model):
    author_id = models.CharField(max_length=1024, unique=True)
    name = models.CharField(max_length=1024, null=False, blank=False)
    interests_generated = models.BooleanField(default=False)

class Citation(models.Model):
    CITED_BY = "CITED_BY" # user is cited by the author
    REFERENCES = "REFERENCES" # user references the author

    user = models.ForeignKey(User,
                             related_name="citations",
                             on_delete=models.CASCADE)
    author = models.ForeignKey(Author,
                             related_name="author_citations",
                             on_delete=models.CASCADE)
    relation = models.CharField(
        max_length=512,
        choices=[(CITED_BY, CITED_BY), (REFERENCES, REFERENCES)],
    )
    value = models.IntegerField()

class AuthorsInterests(models.Model):
    Keyword = models.ForeignKey(Keyword,
                             related_name="authors_keyword_interests",
                             on_delete=models.CASCADE)
    author = models.ForeignKey(Author,
                             related_name="authors_interests",
                             on_delete=models.CASCADE)
    weight = models.FloatField(default=1)
    paper = models.ManyToManyField(Paper, related_name= "authors_paper_interests")

class PaperAuthor(models.Model):
    paper = models.ForeignKey(Paper,
                             related_name="author",
                             on_delete=models.CASCADE)
    author = models.ForeignKey(Author,
                             related_name="authors_papers",
                             on_delete=models.CASCADE)
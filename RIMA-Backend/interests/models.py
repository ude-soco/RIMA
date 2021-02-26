from django.db import models
from accounts.models import User


class Category(models.Model):
    name = models.CharField(max_length=1024, null=True, blank=True)

    updated_on = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Paper(models.Model):
    user = models.ForeignKey(User,
                             related_name="papers",
                             on_delete=models.CASCADE)
    paper_id = models.CharField(max_length=255,
                                null=True,
                                blank=True,
                                default="manual")
    title = models.CharField(max_length=2048, null=True, blank=True)
    authors = models.CharField(max_length=2048, null=True, blank=True)
    url = models.CharField(max_length=1024, null=True, blank=True)
    year = models.IntegerField()
    abstract = models.TextField(null=True, blank=True, default='')

    used_in_calc = models.BooleanField(default=False)
    updated_on = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)


class Tweet(models.Model):
    user = models.ForeignKey(User,
                             related_name="tweets",
                             on_delete=models.CASCADE)
    id_str = models.CharField(max_length=2048, null=True, blank=True)

    screen_name = models.CharField(max_length=50, null=True, blank=True)
    full_text = models.TextField(null=True, blank=True)
    entities = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    used_in_calc = models.BooleanField(default=False)
    updated_on = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)


class Keyword(models.Model):
    name = models.CharField(max_length=1024)
    original_keyword_name = models.CharField(max_length=1024)
    original_keywords = models.TextField()
    categories = models.ManyToManyField(Category, related_name="keywords")

    updated_on = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        return super().save(*args, **kwargs)


class ShortTermInterest(models.Model):
    TWITTER = "Twitter"
    SCHOLAR = "Scholar"
    MANUAL = "Manual"

    keyword = models.ForeignKey(Keyword,
                                related_name="short_term_models",
                                on_delete=models.CASCADE)
    weight = models.FloatField(default=1)
    source = models.CharField(
        max_length=512,
        choices=[(TWITTER, TWITTER), (SCHOLAR, SCHOLAR), (MANUAL, MANUAL)],
        default=MANUAL,
    )
    user = models.ForeignKey(User,
                             related_name="short_term_interests",
                             on_delete=models.CASCADE)
    tweets = models.ManyToManyField(Tweet,
                                    related_name="tweet_short_term_models")
    papers = models.ManyToManyField(Paper,
                                    related_name="paper_short_term_models")

    model_month = models.IntegerField()
    model_year = models.IntegerField()
    used_in_calc = models.BooleanField(default=False)

    updated_on = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)


class LongTermInterest(models.Model):
    TWITTER = "Twitter"
    SCHOLAR = "Scholar"
    MANUAL = "Manual"

    keyword = models.ForeignKey(Keyword,
                                related_name="long_term_models",
                                on_delete=models.CASCADE)
    weight = models.FloatField(default=1)
    source = models.CharField(max_length=512, default=MANUAL)
    user = models.ForeignKey(User,
                             related_name="long_term_interests",
                             on_delete=models.CASCADE)
    tweets = models.ManyToManyField(Tweet,
                                    related_name="tweet_long_term_models")
    papers = models.ManyToManyField(Paper,
                                    related_name="paper_long_term_models")

    updated_on = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)


class BlacklistedKeyword(models.Model):
    keyword = models.ForeignKey(Keyword,
                                related_name="blacklisted_preference",
                                on_delete=models.CASCADE)
    user = models.ForeignKey(User,
                             related_name="blacklisted_keywords",
                             on_delete=models.CASCADE)

    updated_on = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)

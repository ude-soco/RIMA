from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(null=False, blank=False, unique=True)
    twitter_account_id = models.CharField(max_length=1024,
                                          null=True,
                                          blank=True)
    author_id = models.CharField(max_length=1024, null=True, blank=True)

    __old_twitter_id = None
    __old_author_id = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__old_twitter_id = self.twitter_account_id
        self.__old_author_id = self.author_id

    def save(self, *args, **kwargs):
        from interests.models import ShortTermInterest, LongTermInterest, Tweet, Paper
        super().save(*args, **kwargs)

        # reset all data
        if self.__old_author_id and (self.__old_author_id != self.author_id):
            Paper.objects.filter(user=self).delete()
            ShortTermInterest.objects.filter(user=self).delete()
            LongTermInterest.objects.filter(user=self).delete()

        if self.__old_twitter_id and (self.__old_twitter_id !=
                                      self.twitter_account_id):
            Tweet.objects.filter(user=self).delete()
            ShortTermInterest.objects.filter(user=self).delete()
            LongTermInterest.objects.filter(user=self).delete()

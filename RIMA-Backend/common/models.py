from django.db import models


class TaskLog(models.Model):
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

    name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=255,
        choices=[(RUNNING, RUNNING), (COMPLETED, COMPLETED), (FAILED, FAILED)],
    )
    started_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    ended_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    duration_seconds = models.DecimalField(max_digits=6,
                                           decimal_places=1,
                                           null=True,
                                           blank=True)
    args = models.TextField(null=True, blank=True)
    kwargs = models.TextField(null=True, blank=True)
    error_stack = models.TextField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name_plural = "Task Logs"


class TriggerTask(models.Model):
    IMPORT_TWEETS = "IMPORT_TWEETS"
    IMPORT_PAPERS = "IMPORT_PAPERS"
    IMPORT_TWEETS_FOR_USER = "IMPORT_TWEETS_FOR_USER"
    IMPORT_PAPERS_FOR_USER = "IMPORT_PAPERS_FOR_USER"
    UPDATE_SHORT_TERM_MODEL = "UPDATE_SHORT_TERM_MODEL"
    UPDATE_LONG_TERM_MODEL = "UPDATE_LONG_TERM_MODEL"
    UPDATE_SHORT_TERM_MODEL_FOR_USER = "UPDATE_SHORT_TERM_MODEL_FOR_USER"
    UPDATE_LONG_TERM_MODEL_FOR_USER = "UPDATE_LONG_TERM_MODEL_FOR_USER"
    IMPORT_ALL_DATA = "IMPORT_ALL_DATA"
    IMPORT_PAPER_DATA = "IMPORT_PAPER_DATA"

    task_type = models.CharField(
        max_length=255,
        choices=[
            (IMPORT_TWEETS, IMPORT_TWEETS),
            (IMPORT_PAPERS, IMPORT_PAPERS),
            (IMPORT_TWEETS_FOR_USER, IMPORT_TWEETS_FOR_USER),
            (IMPORT_PAPERS_FOR_USER, IMPORT_PAPERS_FOR_USER),
            (UPDATE_SHORT_TERM_MODEL, UPDATE_SHORT_TERM_MODEL),
            (UPDATE_LONG_TERM_MODEL, UPDATE_LONG_TERM_MODEL),
            (UPDATE_SHORT_TERM_MODEL_FOR_USER,
             UPDATE_SHORT_TERM_MODEL_FOR_USER),
            (UPDATE_LONG_TERM_MODEL_FOR_USER, UPDATE_LONG_TERM_MODEL_FOR_USER),
            (IMPORT_ALL_DATA, IMPORT_ALL_DATA),
            (IMPORT_PAPER_DATA, IMPORT_PAPER_DATA),
        ],
    )
    user_id = models.IntegerField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def save(self, *args, **kwargs):
        from interests.tasks import (
            import_tweets,
            import_papers,
            import_tweets_for_user,
            import_papers_for_user,
            update_short_term_interest_model,
            update_long_term_interest_model,
            update_short_term_interest_model_for_user,
            update_long_term_interest_model_for_user,
            import_user_data,
            import_user_paperdata,
        )

        job_map = {
            self.IMPORT_TWEETS: import_tweets,
            self.IMPORT_PAPERS: import_papers,
            self.IMPORT_TWEETS_FOR_USER: import_tweets_for_user,
            self.IMPORT_PAPERS_FOR_USER: import_papers_for_user,
            self.UPDATE_SHORT_TERM_MODEL: update_short_term_interest_model,
            self.UPDATE_LONG_TERM_MODEL: update_long_term_interest_model,
            self.UPDATE_SHORT_TERM_MODEL_FOR_USER:
            update_short_term_interest_model_for_user,
            self.UPDATE_LONG_TERM_MODEL_FOR_USER:
            update_long_term_interest_model_for_user,
            self.IMPORT_ALL_DATA: import_user_data,
            self.IMPORT_PAPER_DATA: import_user_paperdata,
        }
        if self.user_id:
            job_map[self.task_type].delay(self.user_id)
        else:
            job_map[self.task_type].delay()
        return super().save(*args, **kwargs)

import pytz
from accounts.models import User
from interests.models import ShortTermInterest, BlacklistedPaper
from .tasks import update_short_term_interest_model_for_user, fetch_user_papers_keywords
from interests.utils.interest_utils import fetch_papers_keywords, regenerate_long_term_model
from celery.decorators import task
from common.config import BaseCeleryTask

def remove_papers_for_user(user_id, papers):
    user = User.objects.get(id=user_id)
    for paper in papers:
        paper.user.remove(user)
        paper.save()
        BlacklistedPaper.objects.get_or_create(user=user, paper_id=paper.paper_id)
        # if the paper is not linked to any user, delete from the database
        if not paper.user.all():
             paper.delete()
    return


@task(
    name="regenerate_interest_profile",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def regenerate_interest_profile(user_id):
    fetch_user_papers_keywords(user_id)
    regenerate_short_term_interest_model(user_id)
    manual_regenerate_long_term_model(user_id)
    return

def manual_regenerate_long_term_model (user_id):
    regenerate_long_term_model(user_id)
    return

@task(
    name="regenerate_short_term_interest_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def regenerate_short_term_interest_model(user_id):
    user = User.objects.get(id=user_id)
    ShortTermInterest.objects.filter(user_id=user_id).exclude(papers__in=user.papers.all()).delete()
    update_short_term_interest_model_for_user.delay(user_id)
    return
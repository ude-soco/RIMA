from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
import dotenv
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
dotenv.read_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'interest_miner_api.settings')

app = Celery('interest_miner_api')

# Using a string here means the worker don't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

import celery
from .models import TaskLog


class BaseCeleryTask(celery.Task):
    max_retries = 0

    def __call__(self, *args, **kwargs):
        self.task = TaskLog.objects.create(name=self.name,
                                           status=TaskLog.RUNNING,
                                           args=str(args),
                                           kwargs=str(kwargs))
        print("\n\n----------------  {} --------------------".format(
            self.name))
        return super().__call__(*args, **kwargs)

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        self.task.status = TaskLog.FAILED
        self.task.error_stack = einfo
        self.task.save()
        print("----------------- ENDED -------------------\n\n")

    def on_success(self, retval, task_id, args, kwargs):
        self.task.status = TaskLog.COMPLETED
        self.task.save()
        total_seconds = (self.task.ended_on -
                         self.task.started_on).total_seconds()
        self.task.duration_seconds = total_seconds
        self.task.save()
        print("----------------- ENDED -------------------\n\n")

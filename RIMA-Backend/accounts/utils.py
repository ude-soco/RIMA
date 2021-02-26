from common.models import TaskLog


def import_in_process_for_user(user_id):
    return TaskLog.objects.filter(name='import_user_data',
                                  args=str((user_id, )),
                                  status=TaskLog.RUNNING).exists()

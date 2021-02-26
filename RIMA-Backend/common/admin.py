from django.contrib import admin
from .models import TaskLog, TriggerTask


class TaskAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "started_on", "ended_on",
                    "duration_seconds")
    list_filter = ("name", "status", "started_on", "ended_on")
    ordering = ['-started_on']

    class Meta:
        model = TaskLog


class TriggerTaskAdmin(admin.ModelAdmin):
    list_display = ("task_type", "user_id", "created_at", "updated_at")

    class Meta:
        model = TriggerTask


admin.site.register(TaskLog, TaskAdmin)
admin.site.register(TriggerTask, TriggerTaskAdmin)

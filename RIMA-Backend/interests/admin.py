from django.contrib import admin
from .models import *


class KeywordAdmin(admin.ModelAdmin):
    list_display = ("name", "created_on")

    class Meta:
        model = Keyword


class BlacklistedKeywordAdmin(admin.ModelAdmin):
    list_display = ("user", "keyword", "created_on")

    class Meta:
        model = BlacklistedKeyword


class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "year", "user", "used_in_calc")
    list_filter = ("user", )

    class Meta:
        model = Paper


class TweetAdmin(admin.ModelAdmin):
    list_display = ("id_str", "created_at", "user", "used_in_calc")
    list_filter = ("user", )

    class Meta:
        model = Tweet


class ShortTermInterestAdmin(admin.ModelAdmin):
    list_display = ("keyword", "user", "weight", "created_on")
    list_filter = ("user", )

    class Meta:
        model = ShortTermInterest


class LongTermInterestAdmin(admin.ModelAdmin):
    list_display = ("keyword", "user", "weight", "created_on")
    list_filter = ("user", )

    class Meta:
        model = LongTermInterest


admin.site.register(LongTermInterest, LongTermInterestAdmin)
admin.site.register(ShortTermInterest, ShortTermInterestAdmin)
admin.site.register(Paper, PageAdmin)
admin.site.register(Tweet, TweetAdmin)
admin.site.register(Category)
admin.site.register(BlacklistedKeyword, BlacklistedKeywordAdmin)
admin.site.register(Keyword, KeywordAdmin)

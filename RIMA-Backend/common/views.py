from django.shortcuts import render
from accounts.models import User
from interests.models import Keyword, Paper, Tweet, ShortTermInterest, LongTermInterest
from django.http import HttpResponse


# Create your views here.
def clear_all_app_data(request):
    if request.user.is_superuser:
        User.objects.filter(is_superuser=False).delete()
        Keyword.objects.all().delete()
        Paper.objects.all().delete()
        Tweet.objects.all().delete()
        ShortTermInterest.objects.all().delete()
        LongTermInterest.objects.all().delete()
        return HttpResponse("All app data is cleared")
    return HttpResponse("You must login as admin to access this function")

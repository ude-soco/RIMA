from django.urls import path
from . import views

urlpatterns = [
    path('search_paper/', views.search_paper, name='search_paper'),
    path('add_paper/', views.add_new_paper, name='add_paper'),
]

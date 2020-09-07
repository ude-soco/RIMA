from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view()),
    path('data-import-status/', views.DataLoadStatusView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('register/', views.RegisterView.as_view()),
    path('profile/', views.UserView.as_view()),
    path('user-search/<str:query>/', views.UserSuggestionView.as_view()),
    path('public-profile/<int:pk>/', views.PublicProfileView.as_view()),
]

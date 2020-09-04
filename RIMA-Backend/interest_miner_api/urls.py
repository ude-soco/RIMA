"""interest_miner_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from .api_doc_patterns import doc_patterns
from common.views import clear_all_app_data

schema_view = get_schema_view(
    openapi.Info(
        title="Interest Miner API",
        default_version='v1',
        description="interest extraction tool",
    ),
    url='http://0.0.0.0:8000',
    public=True,
    permission_classes=(permissions.AllowAny,),
    patterns=doc_patterns,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('reset-app-data/', clear_all_app_data),
    path('api/accounts/', include('accounts.urls')),
    path('api/interests/', include('interests.urls')),
    path(
        'swagger(?P<format>\.json|\.yaml)',
        schema_view.without_ui(cache_timeout=0),
        name='schema-json',
    ),
    path(
        'docs/',
        schema_view.with_ui('swagger', cache_timeout=0),
        name='schema-swagger-ui',
    ),
]

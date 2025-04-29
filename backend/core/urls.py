from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    # API
    path('api/', include('tr4cking_rest_api.urls')),
]
from django.urls import path, include
from django.contrib import admin


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),  # Usar admin_site en lugar de admin.site.urls   # API
    path('api/', include('tr4cking_rest_api.urls')),
]
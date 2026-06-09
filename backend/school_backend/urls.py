from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from students.views import CustomTokenObtainPairView, dashboard_stats


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/login", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/dashboard/stats", dashboard_stats, name="dashboard_stats"),
    path("api/", include("students.urls")),
]

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from students.views import StudentViewSet


router = DefaultRouter(trailing_slash=False)
router.register("students", StudentViewSet, basename="students")

urlpatterns = [
    path("", include(router.urls)),
]

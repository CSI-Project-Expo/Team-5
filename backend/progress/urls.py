from django.urls import path
from .views import complete_part,progress_status

urlpatterns = [
    path("complete/",complete_part),
    path("status/",progress_status),
]

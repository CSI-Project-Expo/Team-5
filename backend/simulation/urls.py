from django.urls import path
from .views import brute_force_simulation, sql_injection_simulation

urlpatterns = [
    path("bruteforce/", brute_force_simulation),
    path("sqli/", sql_injection_simulation),
]
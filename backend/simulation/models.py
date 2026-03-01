from django.db import models
from django.conf import settings


class SimulationLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    attack_type = models.CharField(max_length=50)
    input_data = models.TextField()
    success = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.attack_type} - {self.success}"
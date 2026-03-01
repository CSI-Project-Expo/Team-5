from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from progress.models import UserProgress
# Create your models here.
class CustomUser(AbstractUser):
        xp = models.IntegerField(default=0)
        rank = models.CharField(max_length=50, default="Rookie")
        current_level = models.IntegerField(default=1)

        def update_rank(self):
            total = self.userprogress.parts_completed()

            if total == 0:
                self.rank = "RECRUIT"
            elif total <= 2:
                self.rank = "ANALYST"
            elif total <= 4:
                self.rank = "SPECIALIST"
            elif total <= 6:
                self.rank = "DEFENDER"
            elif total <= 8:
                self.rank = "EXPERT"
            elif total <= 12:
                self.rank = "ELITE"
            elif total <= 15:
                self.rank = "MASTER"
            elif total <= 17:
                self.rank = "LEGEND"
            else:
                self.rank = "ELITE (Full Mastery)"

            self.save()
@receiver(post_save, sender=CustomUser)
def create_user_progress(sender, instance, created, **kwargs):
    if created:
        UserProgress.objects.create(user=instance)
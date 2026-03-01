from django.db import models
from django.conf import settings

class UserProgress(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    # 18 parts (Boolean flags)
    bf_l1_p1 = models.BooleanField(default=False)
    bf_l1_p2 = models.BooleanField(default=False)
    bf_l1_p3 = models.BooleanField(default=False)

    bf_l2_p1 = models.BooleanField(default=False)
    bf_l2_p2 = models.BooleanField(default=False)
    bf_l2_p3 = models.BooleanField(default=False)

    bf_l3_p1 = models.BooleanField(default=False)
    bf_l3_p2 = models.BooleanField(default=False)
    bf_l3_p3 = models.BooleanField(default=False)

    sqli_l1_p1 = models.BooleanField(default=False)
    sqli_l1_p2 = models.BooleanField(default=False)
    sqli_l1_p3 = models.BooleanField(default=False)

    sqli_l2_p1 = models.BooleanField(default=False)
    sqli_l2_p2 = models.BooleanField(default=False)
    sqli_l2_p3 = models.BooleanField(default=False)

    sqli_l3_p1 = models.BooleanField(default=False)
    sqli_l3_p2 = models.BooleanField(default=False)
    sqli_l3_p3 = models.BooleanField(default=False)

    def parts_completed(self):
        fields = [
            field.name for field in self._meta.fields
            if isinstance(field, models.BooleanField)
        ]
        return sum([getattr(self, field) for field in fields])
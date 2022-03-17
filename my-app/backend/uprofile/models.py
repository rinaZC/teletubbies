from django.db import models

# Create your models here.


class Uprofile(models.Model):
    username = models.CharField(max_length=120)
    password = models.CharField(max_length=120)
    email = models.CharField(max_length=120)
    favorite = models.CharField(max_length=120, blank=True)
    bios = models.CharField(max_length=120,  blank=True)
    pronouns = models.CharField(max_length=120,  blank=True)
    artist = models.CharField(max_length=120, blank=True)
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.username

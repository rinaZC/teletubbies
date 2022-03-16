from django.db import models

# Create your models here.


class Uprofile(models.Model):
    username = models.CharField(max_length=120)
    password = models.CharField(max_length=120)
    email = models.CharField(max_length=120)
    favorite = models.CharField(max_length=120)
    bios = models.CharField(max_length=120)
    pronouns = models.CharField(max_length=120)
    artist = models.CharField(max_length=120)
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.username

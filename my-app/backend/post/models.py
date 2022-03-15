import imp
from django.db import models

# Create your models here.
class Post(models.Model):
    # iframe code for now
    music = models.TextField()
    description = models.TextField()
    owner = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    # def _str_(self):
    #     return self.title

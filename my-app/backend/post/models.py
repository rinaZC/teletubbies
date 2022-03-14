from django.db import models

# Create your models here.
class Post(models.Model):
    # iframe code for now
    music = models.TextField()
    description = models.TextField()
    date = models.DateField(auto_now=True)

    # def _str_(self):
    #     return self.title

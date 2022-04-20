from django.db import models

# Create your models here.


class Comment(models.Model):
    owner = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    postID = models.IntegerField()
    content = models.TextField()

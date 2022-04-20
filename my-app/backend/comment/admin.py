from django.contrib import admin
from .models import Comment


class CommentAdmin(admin.ModelAdmin):
    list_display = ('date', 'owner', 'postID', 'content')

# Register your models here.


admin.site.register(Comment, CommentAdmin)

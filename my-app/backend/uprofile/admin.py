from django.contrib import admin
from .models import Uprofile

class UprofileAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', 'email', 'favorite', 'bios', 'pronouns', 'artist', 'completed')

# Register your models here.

admin.site.register(Uprofile, UprofileAdmin)
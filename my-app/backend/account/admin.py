from django.contrib import admin
from .models import Accounts

class AccountsAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', 'email', 'favorite', 'completed')

# Register your models here.

admin.site.register(Accounts, AccountsAdmin)
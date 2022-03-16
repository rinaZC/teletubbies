from rest_framework import serializers
from .models import Accounts

class AccountsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounts
        fields = ('id', 'username', 'password', 'email', 'favorite', 'completed')
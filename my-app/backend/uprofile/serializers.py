from rest_framework import serializers
from .models import Uprofile

class UprofileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Uprofile
        fields = ('username', 'password', 'email', 'favorite', 'bios', 'pronouns', 'artist', 'completed')
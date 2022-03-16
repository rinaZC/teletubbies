from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UprofileSerializer
from .models import Uprofile

# Create your views here.

class UprofileView(viewsets.ModelViewSet):
    serializer_class = UprofileSerializer
    queryset = Uprofile.objects.all()
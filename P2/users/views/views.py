from django.contrib.auth.models import User
from rest_framework import generics
from users.serializers import serializers


# Create your views here.
class CreateOrListUsers(generics.ListCreateAPIView):
    serializer_class = serializers.UserSerializer
    queryset = User.objects.all()

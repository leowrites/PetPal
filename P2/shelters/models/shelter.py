from django.db import models
from django.contrib.auth.models import User

class Shelter(models.Model):
    name = models.CharField(max_length=200, default='')
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    contact_email = models.EmailField(default='temp@temporaryfix.com') # TODO: fix when we start db from scratch
    location = models.CharField(max_length=200, default='tempLocation') # TODO: fix when we start db from scratch
    mission_statement = models.TextField(default='tempMissionStatement') # TODO: fix when we start db from scratch
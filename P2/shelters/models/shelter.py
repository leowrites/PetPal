from django.db import models
from users.models import User

class Shelter(models.Model):
    shelter_name = models.CharField(max_length=200, default='')
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    contact_email = models.EmailField()
    location = models.CharField(max_length=200)
    mission_statement = models.TextField() 
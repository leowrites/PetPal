from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
  is_shelter = models.BooleanField(default=False)
  avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
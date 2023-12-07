from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

# Create your models here.
class User(AbstractUser):
    is_shelter = models.BooleanField(default=False)
    avatar = CloudinaryField('avatar', blank=True)
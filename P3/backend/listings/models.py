from django.db import models
from cloudinary.models import CloudinaryField
from django.core.validators import MaxValueValidator

class PetListing(models.Model):
    STATUS_CHOICES = (("available", "Available"), ("not_available", "Not Available"))
    name = models.CharField(max_length=200)
    shelter = models.ForeignKey('shelters.Shelter', related_name="listings", on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="available")
    breed = models.CharField(max_length=200)
    age = models.PositiveSmallIntegerField(validators=[MaxValueValidator(20)])
    image = CloudinaryField('image')
    image2 = CloudinaryField('image')
    image3 = CloudinaryField('image')
    bio = models.TextField()
    medical_history = models.TextField()
    behavior = models.TextField()
    other_notes = models.TextField()
    listed_date = models.DateTimeField(auto_now_add=True)

from django.db import models
from users.models import User
from .shelter import Shelter


class PetListing(models.Model):
    STATUS_CHOICES = (
        ("available", "Available"),
        ("not_available", "Not Available")
    )
    name = models.CharField(max_length=200)
    shelter = models.ForeignKey(Shelter, related_name='listings', on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="available")


class PetApplication(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("denied", "Denied"),
        ("withdrawn", "Withdrawn"),
        ("approved", "Approved"),
    )
    applicant = models.ForeignKey(User, related_name='applications', on_delete=models.CASCADE)
    listing = models.ForeignKey(PetListing, related_name='applications', on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="pending")
    application_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

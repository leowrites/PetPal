from django.db import models
from django.contrib.auth.models import User


class PetListing(models.Model):
    name = models.CharField(max_length=200)
    # shelter = ...  to be added once there is a shelter model


class PetApplication(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("denied", "Denied"),
        ("withdrawn", "Withdrawn"),
    )
    applicant = models.ForeignKey(User, related_name='applications', on_delete=models.CASCADE)
    listing = models.ForeignKey(PetListing, related_name='applications', on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="pending")
    application_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

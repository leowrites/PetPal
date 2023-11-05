from django.db import models


class PetListing(models.Model):
    STATUS_CHOICES = (
        ("available", "Available"),
        ("not_available", "Not Available")
    )
    name = models.CharField(max_length=200)
    # status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="pending")

class PetApplication(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("denied", "Denied"),
        ("withdrawn", "Withdrawn"),
    )
    # applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(PetListing, related_name='applications', on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="pending")
    application_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

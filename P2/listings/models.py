from django.db import models


class PetListing(models.Model):
    STATUS_CHOICES = (("available", "Available"), ("not_available", "Not Available"))
    name = models.CharField(max_length=200)
    shelter = models.ForeignKey('shelters.Shelter', related_name="listings", on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="available")
    breed = models.CharField(max_length=200)
    age = models.PositiveSmallIntegerField()

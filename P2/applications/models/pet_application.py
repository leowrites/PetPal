from django.db import models

class PetApplication(models.Model):
    # applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    # listingId = models.ForeignKey(Listing, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=(
        (1, "Pending"),
        (2, "Accepted"),
        (3, "Denied"),
        (4, "Withdrawn")
    ))
    application_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

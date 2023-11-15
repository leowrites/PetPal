from django.db import models
from users.models import User

from shelters.models import Shelter


class ShelterReview(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]

    rating = models.IntegerField(choices=RATING_CHOICES)
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shelter_reviews')
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name='reviews')
    date_created = models.DateTimeField(auto_now_add=True)
    

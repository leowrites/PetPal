from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.auth.models import User

class Notification(models.Model):
    # associated user
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')

    # notification type
    NOTIFICATION_TYPE = (
        ("applicationMessage", "New Application Message"),
        ("applicationSatusChange", "Application Status Change"),
        ("petListing", "New Pet Listing"),
        ("application", "New Application"),
        ("review", "New Review"),
    )
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE)

    # associated model
    associated_model_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='associated_model')
    associated_model_id = models.PositiveIntegerField()
    associated_model = GenericForeignKey('associated_model_type', 'associated_model_id')

    # notification details
    created = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
from django.db import models
from users.models import User
from shelters.models import PetApplication


class ApplicationComment(models.Model):
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='application_comments')
    application = models.ForeignKey(PetApplication, on_delete=models.CASCADE, related_name='comments')
    date_created = models.DateTimeField(auto_now_add=True)
    

from django.db import models
from .pet_application import PetApplication


class ApplicationQuestion(models.Model):
    question = models.CharField(max_length=1000)

class ApplicationResponse(models.Model):
    answer = models.CharField(max_length=3000) # 3000 chars is approx 500 words
    question = models.ForeignKey(ApplicationQuestion, on_delete=models.CASCADE)
    application = models.ForeignKey(PetApplication, on_delete=models.CASCADE)

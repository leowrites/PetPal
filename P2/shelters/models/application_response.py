from django.db import models
from .pet_application import PetApplication


# each question is owned by a shelter
class Question(models.Model):
    # owner = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.CharField(max_length=1000)


# one question can be used for many listings, one listing can have many questions
class ListingQuestion(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    # listing = models.ForeignKey(PetListing, on_delete=models.CASCADE)


class Answer(models.Model):
    answer = models.CharField(max_length=3000)  # 3000 chars is approx 500 words
    question = models.ForeignKey(ListingQuestion, on_delete=models.CASCADE)
    application = models.ForeignKey(PetApplication, on_delete=models.CASCADE)
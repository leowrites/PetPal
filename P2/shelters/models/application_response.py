from django.db import models
from .pet_application import PetApplication, PetListing


# each question is owned by a shelter
class Question(models.Model):
    # owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # the types here will result in corresponding fields
    FILE = 'FILE'
    CHECKBOX = 'CHECKBOX'
    DATE = 'DATE'
    EMAIL = 'Email'
    TEXT = 'TEXT'
    NUMBER = 'NUMBER'
    QUESTION_TYPE_CHOICES = (
        (FILE, 'File'),
        (CHECKBOX, 'Checkbox'),
        (DATE, 'Date'),
        (EMAIL, 'Email'),
        (TEXT, 'Text'),
        (NUMBER, 'Number')
    )
    question = models.CharField(max_length=1000)
    type = models.CharField(choices=QUESTION_TYPE_CHOICES, max_length=100, default=TEXT)
    required = models.BooleanField(default=True)

    def __str__(self):
        return self.question


class ListingQuestion(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    listing = models.ForeignKey(PetListing, related_name='listing_questions', on_delete=models.CASCADE)
    rank = models.PositiveSmallIntegerField(blank=True, default=0)


class Answer(models.Model):
    answer = models.CharField(max_length=3000)  # 3000 chars is approx 500 words
    question = models.ForeignKey(ListingQuestion, on_delete=models.CASCADE)
    application = models.ForeignKey(PetApplication, related_name='answers', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.question}: {self.answer}'

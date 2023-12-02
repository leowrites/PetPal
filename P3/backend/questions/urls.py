from django.urls import path
from .views import (UpdateOrDestroyShelterQuestion, ListOrCreateShelterQuestion)

app_name = "questions"

urlpatterns = [
    path('', ListOrCreateShelterQuestion.as_view(),
         name='question-list-create'),
    path('<int:question_id>', UpdateOrDestroyShelterQuestion.as_view(),
         name='question-update-delete'),
]

from django.urls import path
from .views import UpdateOrDestroyShelterQuestion

app_name = "questions"

urlpatterns = [
    path('<int:question_id>', UpdateOrDestroyShelterQuestion.as_view(),
         name='question-update-delete'),
]

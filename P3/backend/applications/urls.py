from django.urls import path
from .views import (
    UpdateOrGetPetApplicationDetails, ListOrCreateApplicationComment,
    ListUserApplication)

app_name = "applications"

urlpatterns = [
    path('', ListUserApplication.as_view(), name='pet-application-list'),
    path('<int:application_id>', UpdateOrGetPetApplicationDetails.as_view(),
         name='pet-application-details'),
    path('<int:application_id>/comments', ListOrCreateApplicationComment.as_view(),
         name='application-comment-list-create'),
]

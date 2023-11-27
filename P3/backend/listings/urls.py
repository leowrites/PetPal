from django.urls import path
from .views import (ListPetListing, ListOrCreateAssignedQuestion, RetrieveUpdateOrDestroyAssignedQuestion,
                    RetrieveUpdateOrDeletePetListing, ListOrCreateApplicationForListing)

app_name = "listings"

urlpatterns = [
    path("", ListPetListing.as_view(), name="pet-listing-list"),
    path('<int:listing_id>', RetrieveUpdateOrDeletePetListing.as_view(),
         name='pet-listing-update-destroy'),
    path('<int:listing_id>/questions', ListOrCreateAssignedQuestion.as_view(),
         name='assigned-question-list-create'),
    path('<int:listing_id>/questions/<int:question_id>',
         RetrieveUpdateOrDestroyAssignedQuestion.as_view(), name='assigned-question-delete'),
    path('<int:listing_id>/applications', ListOrCreateApplicationForListing.as_view(),
         name='pet-application-list-create'),
]

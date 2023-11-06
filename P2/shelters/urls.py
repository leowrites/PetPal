
from django.urls import path
from .views import views

app_name = "shelters"

urlpatterns = [
    path('<int:pk>/questions', views.ListOrCreateShelterQuestion.as_view(),
         name='shelter-question-list-create'),
    path('<int:pk>/questions/<int:question_id>', views.UpdateOrDestroyShelterQuestion.as_view(),
         name='shelter-question-update-delete'),
    path('<int:pk>/listings/<int:listing_id>/questions', views.ListOrCreateListingQuestion.as_view(),
         name='listing-question-list-create'),
    path('<int:pk>/listings/<int:listing_id>/questions/<int:question_id>',
         views.RemoveListingQuestion.as_view(), name='listing-question-delete'),
    path('<int:pk>/listings/<int:listing_id>/applications/<int:application_id>', views.GetPetApplicationDetails.as_view(),
         name='pet-application-details'),
    path('<int:pk>/listings/<int:listing_id>/applications', views.ListOrCreateApplicationForListing.as_view(),
         name='pet-application-list-create'),
    path('<int:pk>/listings', views.ListOrCreatePetListing.as_view(),
         name='pet-listing-list-create'),
    path('<int:pk>/listings/<int:listing_id>', views.UpdateOrDeletePetListing.as_view(),
         name='pet-listing-update-destroy'),
    path('', views.ListOrCreateShelter.as_view(), name='shelter-list-create')
]
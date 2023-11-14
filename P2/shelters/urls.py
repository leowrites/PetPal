
from django.urls import path
from .views import views

app_name = "shelters"

urlpatterns = [
     path('<int:pk>/questions', views.ListOrCreateShelterQuestion.as_view(),
          name='shelter-question-list-create'),
     path('<int:pk>/questions/<int:question_id>', views.UpdateOrDestroyShelterQuestion.as_view(),
          name='shelter-question-update-delete'),
     path('<int:pk>/listings/<int:listing_id>/questions', views.ListOrCreateAssignedQuestion.as_view(),
          name='assigned-question-list-create'),
     path('<int:pk>/listings/<int:listing_id>/questions/<int:question_id>',
          views.RetrieveUpdateOrDestroyAssignedQuestion.as_view(), name='assigned-question-delete'),
     path('<int:pk>/listings/<int:listing_id>/applications/<int:application_id>', views.UpdateOrGetPetApplicationDetails.as_view(),
          name='pet-application-details'),
     path('<int:pk>/listings/<int:listing_id>/applications', views.ListOrCreateApplicationForListing.as_view(),
          name='pet-application-list-create'),
     path('<int:pk>/listings', views.ListOrCreatePetListing.as_view(),
          name='pet-listing-list-create'),
     path('<int:pk>/listings/<int:listing_id>', views.RetrieveUpdateOrDeletePetListing.as_view(),
          name='pet-listing-update-destroy'),
     path('', views.ListShelter.as_view(), name='shelter-list-create'),
     path('<int:pk>/reviews', views.ListOrCreateShelterReview.as_view(), name='shelter-review-list-create'),
     path('<int:pk>/listings/<int:listing_id>/applications/<int:application_id>/comments', views.ListOrCreateApplicationComment.as_view(),
          name='application-comment-list-create'),
     path('', views.ListOrCreateShelter.as_view(), name='shelter-list-create'),
     path('<int:pk>', views.ShelterView.as_view(), name='shelter-read-update-delete'),
]
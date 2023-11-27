from django.urls import path
from .views import views

app_name = "shelters"

urlpatterns = [
    path('<int:pk>/questions', views.ListOrCreateShelterQuestion.as_view(),
         name='shelter-question-list-create'),
    path('<int:pk>/listings', views.ListOrCreatePetListing.as_view(),
         name='pet-listing-list-create'),
    path('<int:pk>/reviews', views.ListOrCreateShelterReview.as_view(), name='shelter-review-list-create'),
    path('', views.ListOrCreateShelter.as_view(), name='shelter-list-create'),
    path('<int:pk>', views.ViewOrUpdateOrDestroyShelter.as_view(), name='shelter-read-update-delete'),
]

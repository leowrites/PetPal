from django.urls import path
from .views import ListPetListing

app_name = "listings"

urlpatterns = [
    path("", ListPetListing.as_view(), name="pet-listing-list"),
]

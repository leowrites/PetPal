from django.shortcuts import render
from rest_framework import generics
from .models.pet_application import PetApplication
from .serializers.serializers import PetApplicationSerializer


# Create your views here.
# POST /shetlers/{shelter_id}/listings/{listing_id}/applications/
# for now: /applications
class PetApplicationListByPetListing(generics.ListCreateAPIView):
    queryset = PetApplication.objects.all()
    serializer_class = PetApplicationSerializer


# GET /shelters/{shelter_id}/listings/{listing_id}/applications/{application_id}
# PUT /shelters/{shelter_id}/listings/{listing_id}/applications/{application_id}
class PetApplicationDetails(generics.RetrieveUpdateAPIView):
    queryset = PetApplication.objects.all()
    serializer_class = PetApplicationSerializer


# GET /shelters/{shelter_id}/applications
class PetApplicationListByShelter(generics.ListAPIView):
    queryset = PetApplication.objects.all()
    serializer_class = PetApplicationSerializer

from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from shelters.filters import PetApplicationFilter
from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import ShelterQuestion
from shelters import models
from shelters.serializers import serializers
from notifications.models import Notification
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from shelters.permissions import permissions


class ApplicationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10


# POST /shelters/{shelter_id}/listings/{listing_id}/applications
# GET /shelters/<shelter_id>/listings/<listing_id>/applications
class ListOrCreateApplicationForListing(generics.ListCreateAPIView):
    # Only the owner can get
    permission_classes = [IsAuthenticated,
                          permissions.IsShelterOwner|permissions.IsCreateOnly]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_class = PetApplicationFilter
    ordering_fields = ['application_time', 'last_updated']
    ordering = ['last_updated']
    pagination_class = ApplicationPagination

    def get_serializer_class(self):
        print(self.request.method)
        if self.request.method == 'GET':
            return serializers.PetApplicationSerializer
        else:
            return serializers.PetApplicationFormSerializer

    def get_queryset(self):
        # make sure only owner of this shelter
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, shelter)
        return PetApplication.objects.filter(listing_id=self.kwargs['listing_id'])


# GET /shelters/<shelter_id>/listings/<listing_id>/applications/<application_id>
# PUT /shelters/<shelter_id>/listings/<listing_id>/applications/<application_id>
class UpdateOrGetPetApplicationDetails(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.PetApplicationSerializer
    # only the applicant of this application, or the owner of the listing associated with this application can get the
    # details or make changes to the application
    permission_classes = [IsAuthenticated, permissions.IsApplicationListingOwner | permissions.IsApplicationOwner]

    def get_object(self):
        obj = get_object_or_404(PetApplication, id=self.kwargs['application_id'])
        self.check_object_permissions(self.request, obj)
        return obj


class ListOrCreateShelterQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.ShelterQuestionSerializer
    # only the owner of this shelter can get questions for this shelter, as well as make new ones
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_queryset(self):
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, shelter)
        return ShelterQuestion.objects.filter(shelter=shelter)

    def perform_create(self, serializer):
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, shelter)
        return super().perform_create(serializer)


class UpdateOrDestroyShelterQuestion(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ShelterQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_object(self):
        obj = get_object_or_404(ShelterQuestion, id=self.kwargs['question_id'])
        self.check_object_permissions(self.request, obj.shelter)
        return obj


class ListOrCreateListingQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.AssignedQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_queryset(self):
        # only owner of this listing has permission to list the questions
        self.check_permissions(self.request)
        listing = get_object_or_404(PetListing, id=self.kwargs['listing_id'])
        self.check_object_permissions(self.request, listing.shelter)
        return models.AssignedQuestion.objects.filter(listing=listing)


class RemoveListingQuestion(generics.DestroyAPIView):
    serializer_class = serializers.AssignedQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_object(self):
        question = get_object_or_404(models.AssignedQuestion, id=self.kwargs['question_id'])
        return question

    def destroy(self, request, *args, **kwargs):
        self.check_permissions(request)
        question = get_object_or_404(models.AssignedQuestion, id=self.kwargs['question_id'])
        self.check_object_permissions(self.request, question.listing.shelter)
        return super().destroy(self, request, *args, **kwargs)


class ListOrCreatePetListing(generics.ListCreateAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def perform_create(self, serializer):
        pet_listing = serializer.save()
        for user in User.objects.all():
            if user != pet_listing.shelter.owner:
                notification = Notification.objects.create(
                    user=user,
                    notification_type="petListing",
                    associated_model=pet_listing
                )


class UpdateOrDeletePetListing(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def get_object(self):
        return get_object_or_404(PetListing, id=self.kwargs['listing_id'])


# Shelter
class ListOrCreateShelter(generics.ListCreateAPIView):
    queryset = models.Shelter.objects.all()
    serializer_class = serializers.ShelterSerializer

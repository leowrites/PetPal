from rest_framework import generics, views
from rest_framework.generics import get_object_or_404
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend

from shelters.filters import PetApplicationFilter, PetListingFilter
from shelters.models.pet_application import PetApplication
from listings.models import PetListing
from shelters.models.application_response import ShelterQuestion, AssignedQuestion
from shelters import models
from shelters.serializers import serializers
from notifications.models import Notification
from users.models import User
from django_filters.rest_framework import DjangoFilterBackend
from shelters.permissions import permissions
from users.permissions import permissions as user_permissions


class ApplicationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10


# SHELTERS!!

# POST /shelters
# GET /shelters
class ListOrCreateShelter(generics.ListCreateAPIView):
    queryset = models.Shelter.objects.all()
    ordering = ['shelter_name']
    ordering_fields = ['shelter_name', 'location']
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['shelter_name', 'location']

    def get_serializer_class(self):
        if not self.request or self.request.method == 'GET':
            return serializers.ShelterSerializer
        return serializers.ShelterCreationSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = []
        else:
            permission_classes = [user_permissions.IsNotAuthenticated]
        return [permission() for permission in permission_classes]


# GET /shelters/{shelter_id}
# PUT /shelters/{shelter_id}
# DELETE /shelters/{shelter_id}
class ViewOrUpdateOrDestroyShelter(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ShelterSerializer
    queryset = models.Shelter.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = []
        else:
            permission_classes = [IsAuthenticated, permissions.IsShelterOwner]
        return [permission() for permission in permission_classes]

    def get_object(self):
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, shelter)
        return shelter

    def perform_destroy(self, instance):
        owner = instance.owner
        owner.is_shelter = False
        owner.save()
        instance.delete()


# GET /shelters/<shelter_id>/listings/<listing_id>/applications/<application_id>
# PUT /shelters/<shelter_id>/listings/<listing_id>/applications/<application_id>
class UpdateOrGetPetApplicationDetails(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.PetApplicationGetOrUpdateSerializer
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
        serializer.save(user=self.request.user)


class ListOrCreatePetListing(generics.ListCreateAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def perform_create(self, serializer):
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        if shelter.owner != self.request.user:
            raise PermissionDenied("You do not have permission to create a listing for this shelter")
        serializer.save(shelter=self.request.user.shelter)

    def get_queryset(self):
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        return PetListing.objects.filter(shelter=shelter)

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, permissions.IsShelterOwner]
        return [permission() for permission in permission_classes]


# Shelter reviews
class ListOrCreateShelterReview(generics.ListCreateAPIView):
    serializer_class = serializers.ShelterReviewSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ApplicationPagination

    def get_queryset(self):
        get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        return models.ShelterReview.objects.filter(shelter_id=self.kwargs['pk']) \
            .order_by('-date_created')

    def perform_create(self, serializer):
        get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        serializer.save()

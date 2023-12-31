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
        if self.request is None:
            return serializers.PetApplicationGetOrUpdateSerializer
        if self.request.method == 'GET':
            return serializers.PetApplicationGetOrUpdateSerializer
        else:
            return serializers.PetApplicationPostSerializer

    def get_queryset(self):
        # make sure only owner of this shelter
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, shelter)
        return PetApplication.objects.filter(listing_id=self.kwargs['listing_id'])
    
    def perform_create(self, serializer):
        serializer.save(listing_id=self.kwargs['listing_id'], applicant=self.request.user)


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


class UpdateOrDestroyShelterQuestion(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ShelterQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_object(self):
        obj = get_object_or_404(ShelterQuestion, id=self.kwargs['question_id'], shelter_id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj.shelter)
        return obj


class ListOrCreateAssignedQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.AssignedQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_queryset(self):
        # only owner of this listing has permission to list the questions
        self.check_permissions(self.request)
        listing = get_object_or_404(PetListing, id=self.kwargs['listing_id'])
        self.check_object_permissions(self.request, listing.shelter)
        return models.AssignedQuestion.objects.filter(listing=listing)

    def perform_create(self, serializer):
        # only the owner of the listing has permission to create the questions
        self.check_permissions(self.request)
        listing = get_object_or_404(PetListing, id=self.kwargs['listing_id'])
        self.check_object_permissions(self.request, listing.shelter)
        serializer.save(listing_id=listing.id)


class RetrieveUpdateOrDestroyAssignedQuestion(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.AssignedQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_object(self):
        self.check_permissions(self.request)
        question = get_object_or_404(models.AssignedQuestion, id=self.kwargs['question_id'])
        self.check_object_permissions(self.request, question.listing.shelter)
        question = get_object_or_404(models.AssignedQuestion, id=self.kwargs['question_id'])
        return question

    def destroy(self, request, *args, **kwargs):
        self.check_permissions(request)
        question = get_object_or_404(models.AssignedQuestion, id=self.kwargs['question_id'])
        self.check_object_permissions(self.request, question.listing.shelter)
        return super().destroy(self, request, *args, **kwargs)

    def get_serializer_class(self):
        if not self.request:
            return self.serializer_class
        elif self.request.method == 'GET':
            return serializers.AssignedQuestionDetailsSerializer
        else:
            return self.serializer_class


class ListOrCreatePetListing(generics.ListCreateAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def perform_create(self, serializer):
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        if shelter.owner != self.request.user:
            raise PermissionDenied("You do not have permission to create a listing for this shelter")
        serializer.save(shelter=self.request.user.shelter)

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, permissions.IsShelterOwner]
        return [permission() for permission in permission_classes]
    

class RetrieveUpdateOrDeletePetListing(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def get_object(self):
        return get_object_or_404(PetListing, shelter=self.kwargs['pk'], id=self.kwargs['listing_id'])
    
    def update(self, request, *args, **kwargs):
        listing = self.get_object()
        user = request.user
        if user != listing.shelter.owner:
            raise PermissionDenied("You do not have permission to update this listing")
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        listing = self.get_object()
        user = request.user
        if user != listing.shelter.owner:
            raise PermissionDenied("You do not have permission to update this listing")
        return super().destroy(request, *args, **kwargs)
    
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
        return models.ShelterReview.objects.filter(shelter_id=self.kwargs['pk'])\
                                            .order_by('-date_created')
    
    def perform_create(self, serializer):
        get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        serializer.save()


# Pet application comments
class ListOrCreateApplicationComment(generics.ListCreateAPIView):
    serializer_class = serializers.ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ApplicationPagination

    def get_queryset(self):
        shelter = get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        if get_object_or_404(models.PetListing, id=self.kwargs['listing_id']).shelter.id != self.kwargs['pk']:
            raise NotFound("Listing does not belong to shelter")
        application = get_object_or_404(models.PetApplication, id=self.kwargs['application_id'])
        if application.listing.id != self.kwargs['listing_id']:
            raise NotFound("Application does not belong to listing")
        
        user = self.request.user
        if user != application.applicant and user != shelter.owner:
            raise PermissionDenied("You do not have permission to view these comments.")
        
        return models.ApplicationComment.objects.filter(application_id=self.kwargs['application_id'])\
                                                .order_by('-date_created')

    def perform_create(self, serializer):
        get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        application = get_object_or_404(PetApplication, id=self.kwargs['application_id'])
        application.save()
        get_object_or_404(PetListing, id=self.kwargs['listing_id'])
        user = self.request.user

        if not (user == application.applicant or user == application.listing.shelter.owner):
            raise PermissionDenied("You do not have permission to comment on this application")

        serializer.save(user=user, application=application)
        
from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend

from shelters.filters import PetApplicationFilter, PetListingFilter
from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import ShelterQuestion, AssignedQuestion
from shelters import models
from shelters.serializers import serializers
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
        if self.request is None:
            return serializers.PetApplicationSerializer
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
        serializer.save(shelter=self.request.user.shelter)

class ListPetListing(generics.ListAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_class = PetListingFilter
    ordering_fields = ['name', 'age']
    ordering = ['name']
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status', None)
        if status in map(lambda x: x[0], PetListing.STATUS_CHOICES):
            queryset = queryset.filter(status=status)
        elif status != "":
            queryset = queryset.filter(status="available")
        return queryset
    

class RetrieveUpdateOrDeletePetListing(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def get_object(self):
        return get_object_or_404(PetListing, shelter=self.kwargs['pk'], id=self.kwargs['listing_id'])


# Shelter
class ListShelter(generics.ListAPIView):
    queryset = models.Shelter.objects.all()
    serializer_class = serializers.ShelterSerializer


# Shelter reviews
class ListOrCreateShelterReview(generics.ListCreateAPIView):
    serializer_class = serializers.ShelterReviewSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ApplicationPagination

    def get_queryset(self):
        return models.ShelterReview.objects.filter(shelter_id=self.kwargs['pk'])\
                                            .order_by('-date_created')


# Pet application comments
class ListOrCreateApplicationComment(generics.ListCreateAPIView):
    serializer_class = serializers.ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ApplicationPagination

    def get_queryset(self):
        get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        if get_object_or_404(models.PetListing, id=self.kwargs['listing_id']).shelter.id != self.kwargs['pk']:
            raise NotFound("Listing does not belong to shelter")
        if get_object_or_404(models.PetApplication, id=self.kwargs['application_id']).listing.id != self.kwargs['listing_id']:
            raise NotFound("Application does not belong to listing")
        return models.ApplicationComment.objects.filter(application_id=self.kwargs['application_id'])\
                                                .order_by('-date_created')

    def perform_create(self, serializer):
        get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        application = get_object_or_404(PetApplication, id=self.kwargs['application_id'])
        application.save()
        listing = get_object_or_404(PetListing, id=self.kwargs['listing_id'])
        user = self.request.user

        if not (user == application.applicant or user == application.listing.shelter.owner):
            raise serializers.ValidationError("You do not have permission to comment on this application")

        serializer.save(user=user, application=application)
        
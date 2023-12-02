from shelters.serializers.serializers import PetListingSerializer
from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from shelters.filters import PetApplicationFilter, PetListingFilter
from shelters.models.pet_application import PetApplication
from listings.models import PetListing
from shelters import models
from shelters.serializers import serializers
from django_filters.rest_framework import DjangoFilterBackend
from shelters.permissions import permissions


class ListPetListing(generics.ListAPIView):
    serializer_class = PetListingSerializer
    queryset = PetListing.objects.all()
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_class = PetListingFilter
    ordering_fields = ["name", "age"]
    ordering = ["name"]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get("status", None)
        if status in map(lambda x: x[0], PetListing.STATUS_CHOICES):
            queryset = queryset.filter(status=status)
        elif status != "":
            queryset = queryset.filter(status="available")
        return queryset


class ListOrCreateAssignedQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.AssignedQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_queryset(self):
        # only owner of this listing has permission to list the questions
        self.check_permissions(self.request)
        listing = get_object_or_404(PetListing, id=self.kwargs['listing_id'])
        self.check_object_permissions(self.request, listing.shelter)
        return models.AssignedQuestion.objects.filter(listing=listing).order_by('-id')

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            self.check_permissions(self.request)
            listing = get_object_or_404(PetListing, id=self.kwargs['listing_id'])
            self.check_object_permissions(self.request, listing.shelter)
            for data in request.data:
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save(listing_id=self.kwargs['listing_id'])
            return super().list(request, *args, **kwargs)
        else:
            return super().create(request, *args, **kwargs)

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


class RetrieveUpdateOrDeletePetListing(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def get_object(self):
        return get_object_or_404(PetListing, id=self.kwargs['listing_id'])

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


class ListOrCreateApplicationForListing(generics.ListCreateAPIView):
    # Only the owner can get
    permission_classes = [IsAuthenticated,
                          permissions.IsShelterOwner | permissions.IsCreateOnly]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_class = PetApplicationFilter
    ordering_fields = ['application_time', 'last_updated']
    ordering = ['last_updated']

    def get_serializer_class(self):
        if self.request is None:
            return serializers.PetApplicationGetOrUpdateSerializer
        if self.request.method == 'GET':
            return serializers.PetApplicationGetOrUpdateSerializer
        else:
            return serializers.PetApplicationPostSerializer

    def get_queryset(self):
        # make sure only owner of this shelter
        listing = get_object_or_404(PetListing, id=self.kwargs['listing_id'])
        self.check_object_permissions(self.request, listing.shelter)
        return PetApplication.objects.filter(listing_id=listing.id)

    def perform_create(self, serializer):
        serializer.save(listing_id=self.kwargs['listing_id'], applicant=self.request.user)

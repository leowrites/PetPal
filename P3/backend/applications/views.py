from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from shelters.filters import PetApplicationFilter
from shelters.models.pet_application import PetApplication
from shelters import models
from shelters.serializers import serializers
from shelters.permissions import permissions


# Create your views here.
class ListUserApplication(generics.ListAPIView):
    serializer_class = serializers.PetApplicationListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_class = PetApplicationFilter
    ordering_fields = ['application_time', 'last_updated']
    ordering = ['last_updated']

    def get_queryset(self):
        # for users, return applications that belong to the user
        # for shelters, return the applications where the shelter is owned by the user
        if hasattr(self.request.user, 'shelter'):
            return PetApplication.objects.filter(listing__shelter=self.request.user.shelter).order_by('-application_time')
        return PetApplication.objects.filter(applicant=self.request.user).order_by('-application_time')


class UpdateOrGetPetApplicationDetails(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.PetApplicationGetOrUpdateSerializer
    # only the applicant of this application, or the owner of the listing associated with this application can get the
    # details or make changes to the application
    permission_classes = [IsAuthenticated, permissions.IsApplicationListingOwner | permissions.IsApplicationOwner]

    def get_object(self):
        obj = get_object_or_404(PetApplication, id=self.kwargs['application_id'])
        self.check_object_permissions(self.request, obj)
        return obj


# Pet application comments
class ListOrCreateApplicationComment(generics.ListCreateAPIView):
    serializer_class = serializers.ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        application = get_object_or_404(models.PetApplication, id=self.kwargs['application_id'])
        user = self.request.user
        if user != application.applicant and user != application.listing.shelter.owner:
            raise PermissionDenied("You do not have permission to view these comments.")

        return models.ApplicationComment.objects.filter(application_id=self.kwargs['application_id']) \
            .order_by('-date_created')

    def perform_create(self, serializer):
        application = get_object_or_404(PetApplication, id=self.kwargs['application_id'])
        application.save()
        user = self.request.user
        if user != application.applicant and user != application.listing.shelter.owner:
            raise PermissionDenied("You do not have permission to view these comments.")
        serializer.save(user=user, application=application)

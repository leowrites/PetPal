from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination

from shelters.filters import PetApplicationFilter
from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import ShelterQuestion
from shelters import models
from shelters.serializers import serializers
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend


class ApplicationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10


# POST /shelters/{shelter_id}/listings/{listing_id}/applications
# GET /shelters/<shelter_id>/listings/<listing_id>/applications
# TODO: on GET only allow if the shelter owns this listing
# TODO: on POST allow anyone to make a request to apply
class ListOrCreateApplicationForListing(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
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
        return PetApplication.objects.filter(listing_id=self.kwargs['listing_id'])


# GET /shelters/<shelter_id>/listings/<listing_id>/applications/<application_id>
# PUT /shelters/<shelter_id>/listings/<listing_id>/applications/<application_id>
class UpdateOrGetPetApplicationDetails(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.PetApplicationSerializer

    def get_object(self):
        return get_object_or_404(PetApplication, id=self.kwargs['application_id'])

    def get_queryset(self):
        return PetApplication.objects.get_queryset()


class ListOrCreateShelterQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.ShelterQuestionSerializer

    def get_queryset(self):
        # uncomment once others are implemented
        # shelter = get_object_or_404(Shelter, user=self.request.user)
        # questions = Question.objects.filter(owner=shelter)
        # return questions
        return ShelterQuestion.objects.all()


class UpdateOrDestroyShelterQuestion(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ShelterQuestionSerializer

    def get_object(self):
        # need to validate owner once shelter is implemented (use permission_classes)
        return get_object_or_404(ShelterQuestion, id=self.kwargs['question_id'])


class ListOrCreateListingQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.AssignedQuestionSerializer

    def get_queryset(self):
        # update to filter
        return ShelterQuestion.objects.all()


class RemoveListingQuestion(generics.DestroyAPIView):
    serializer_class = serializers.AssignedQuestionSerializer


class ListOrCreatePetListing(generics.ListCreateAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()


class UpdateOrDeletePetListing(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def get_object(self):
        return get_object_or_404(PetListing, id=self.kwargs['listing_id'])


# Shelter
class ListOrCreateShelter(generics.ListCreateAPIView):
    queryset = models.Shelter.objects.all()
    serializer_class = serializers.ShelterSerializer


# Shelter reviews
class ListOrCreateShelterReview(generics.ListCreateAPIView):
    serializer_class = serializers.ShelterReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.ShelterReview.objects.filter(shelter_id=self.kwargs['pk'])\
                                            .order_by('-date_created')

# Pet application comments
class ListOrCreateApplicationComment(generics.ListCreateAPIView):
    serializer_class = serializers.ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        get_object_or_404(models.PetListing, id=self.kwargs['listing_id'])
        get_object_or_404(models.PetApplication, id=self.kwargs['application_id'])
        return models.ApplicationComment.objects.filter(application_id=self.kwargs['application_id'])\
                                                .order_by('-date_created')

    def perform_create(self, serializer):
        get_object_or_404(models.Shelter, id=self.kwargs['pk'])
        application = get_object_or_404(PetApplication, id=self.kwargs['application_id'])
        listing = get_object_or_404(PetListing, id=self.kwargs['listing_id'])
        user = self.request.user

        if not (user == application.applicant or user == application.listing.shelter.owner):
            raise serializers.ValidationError("You do not have permission to comment on this application")

        serializer.save(user=user, application=application)
from rest_framework import generics
from rest_framework.generics import get_object_or_404

from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import Question
from shelters.serializers import serializers


# POST /shelters/{shelter_id}/listings/{listing_id}/applications
# GET /shelters/<shelter_id>/listings/<listing_id>/applications
# TODO: on GET only allow if the shelter owns this listing
# TODO: on POST allow anyone to make a request to apply
class CreateApplicationForListing(generics.ListCreateAPIView):

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
        return Question.objects.all()


class UpdateOrDestroyShelterQuestion(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ShelterQuestionSerializer

    def get_object(self):
        # need to validate owner once shelter is implemented (use permission_classes)
        return get_object_or_404(Question, id=self.kwargs['question_id'])


class ListOrCreateListingQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.ListingQuestionSerializer

    def get_queryset(self):
        # update to filter
        return Question.objects.all()


class RemoveListingQuestion(generics.DestroyAPIView):
    serializer_class = serializers.ListingQuestionSerializer


class ListOrCreatePetListing(generics.ListCreateAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()


class UpdateOrDeletePetListing(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PetListingSerializer
    queryset = PetListing.objects.all()

    def get_object(self):
        return get_object_or_404(PetListing, id=self.kwargs['listing_id'])
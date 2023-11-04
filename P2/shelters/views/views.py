from rest_framework import generics
from rest_framework.generics import get_object_or_404

from shelters.models.pet_application import PetApplication
from shelters.models.application_response import Question
from shelters.serializers import serializers


# Create your views here.
# POST /shelters/{shelter_id}/listings/{listing_id}/shelters/
# for now: /shelters
class ListOrCreateApplicationForListing(generics.ListCreateAPIView):
    queryset = PetApplication.objects.all()
    serializer_class = serializers.PetApplicationSerializer


# GET /shelters/{shelter_id}/listings/{listing_id}/shelters/{application_id}
# PUT /shelters/{shelter_id}/listings/{listing_id}/shelters/{application_id}
class PetApplicationDetails(generics.RetrieveUpdateAPIView):
    queryset = PetApplication.objects.all()
    serializer_class = serializers.PetApplicationSerializer


# GET /shelters/{shelter_id}/shelters
class PetApplicationListByShelter(generics.ListAPIView):
    queryset = PetApplication.objects.all()
    serializer_class = serializers.PetApplicationSerializer


class ListOrCreateShelterQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.ShelterQuestionSerializer

    def get_queryset(self):
        # uncomment once others are implemented
        # shelter = get_object_or_404(Shelter, userId=self.request.user.id)
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


from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from shelters.models.application_response import ShelterQuestion
from shelters.serializers import serializers
from shelters.permissions import permissions


class ListOrCreateShelterQuestion(generics.ListCreateAPIView):
    serializer_class = serializers.ShelterQuestionSerializer
    # only the owner of this shelter can get questions for this shelter, as well as make new ones
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_queryset(self):
        shelter = self.request.user.shelter
        self.check_object_permissions(self.request, shelter)
        return ShelterQuestion.objects.filter(shelter=shelter)

    def perform_create(self, serializer):
        shelter = self.request.user.shelter
        self.check_object_permissions(self.request, shelter)
        serializer.save(user=self.request.user)


class UpdateOrDestroyShelterQuestion(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ShelterQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_object(self):
        obj = get_object_or_404(ShelterQuestion, id=self.kwargs['question_id'])
        self.check_object_permissions(self.request, obj.shelter)
        return obj
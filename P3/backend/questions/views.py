from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from shelters.models.application_response import ShelterQuestion
from shelters.serializers import serializers
from shelters.permissions import permissions


class UpdateOrDestroyShelterQuestion(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ShelterQuestionSerializer
    permission_classes = [IsAuthenticated, permissions.IsAnyShelterOwner, permissions.IsShelterOwner]

    def get_object(self):
        obj = get_object_or_404(ShelterQuestion, id=self.kwargs['question_id'], shelter_id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj.shelter)
        return obj
from users.models import User
from rest_framework import generics, parsers
from users.serializers import serializers
from rest_framework.permissions import IsAuthenticated
from users.permissions import permissions
from django.shortcuts import get_object_or_404

# POST /users/
class CreateUser(generics.CreateAPIView):
    permission_classes = [permissions.IsNotAuthenticated]
    serializer_class = serializers.UserCreationSerializer
    queryset = User.objects.all()
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

# GET /users/<pk>
# PUT /users/<pk>
# DELETE /users/<pk>
class RetrieveOrUpdateOrDestroyUser(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.UserProfileSerializer
    queryset = User.objects.all()
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated, permissions.IsOwnerOrUserHasApplicationWithShelter]
        else:
            permission_classes = [IsAuthenticated, permissions.IsOwner]
        return [permission() for permission in permission_classes]

    def get_object(self):
        user = get_object_or_404(User, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, user)
        return user
    
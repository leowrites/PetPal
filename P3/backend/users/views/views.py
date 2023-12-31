from users.models import User
from rest_framework import generics, permissions, mixins
from users.serializers import serializers
from rest_framework.permissions import IsAuthenticated
from users.permissions import permissions
from django.shortcuts import get_object_or_404


# GET /users/
# POST /users/
class RetrieveSelfOrCreateUser(generics.RetrieveAPIView, generics.CreateAPIView):
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return serializers.UserCreationSerializer
        else:
            return serializers.UserProfileSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsNotAuthenticated()]
        return [permissions.IsAuthenticated()]

    def get_object(self):
        return self.request.user

# GET /users/<pk>
# PUT /users/<pk>
# DELETE /users/<pk>
class RetrieveOrUpdateOrDestroyUser(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.UserProfileSerializer
    queryset = User.objects.all()

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
    
# PUT /users/password/change
class ChangePassword(generics.UpdateAPIView):
    serializer_class = serializers.ChangePasswordSerializer
    permission_classes = [IsAuthenticated, permissions.IsOwner]

    def get_object(self):
        return self.request.user
    
# GET /users/<pk>/public
class PublicUserDetail(generics.RetrieveAPIView):
    serializer_class = serializers.PublicUserSerializer
    queryset = User.objects.all()
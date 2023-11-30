from users.models import User
from rest_framework import generics, permissions, mixins
from users.serializers import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.permissions import permissions
from django.shortcuts import get_object_or_404

# GET /users/
# POST /users/
class RetrieveSelfOrCreateUser(generics.CreateAPIView):
    permission_classes = [permissions.IsNotAuthenticated]
    serializer_class = serializers.UserCreationSerializer
    queryset = User.objects.all()

    def get_permissions(self):
        if self.request.method == "POST":
            permission_classes = [permissions.IsNotAuthenticated]
        elif self.request.method == "GET":
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return serializers.UserCreationSerializer
        elif self.request.method == "GET":
            return serializers.UserProfileSerializer
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)



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
    
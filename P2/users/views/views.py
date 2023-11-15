from django.contrib.auth.models import User
from rest_framework import generics
from users.serializers import serializers
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.shortcuts import get_object_or_404


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj


# Create your views here.
class CreateOrListUsers(generics.ListCreateAPIView):
    serializer_class = serializers.UserSerializer
    queryset = User.objects.all()


class UserDetails(generics.RetrieveAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [IsOwner]

    def get_object(self):
        user = get_object_or_404(User, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, user)
        return user
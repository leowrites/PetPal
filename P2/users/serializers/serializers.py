from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from shelters.models.shelter import Shelter
from notifications.models import NotificationPreferences

class UserSerializer(serializers.ModelSerializer):
    is_shelter = serializers.BooleanField(label="Are you a shelter?", write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'is_shelter']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # create a shelter if user is a shelter
        is_shelter = validated_data.pop('is_shelter', False)
        user = User.objects.create_user(**validated_data)
        if is_shelter:
            Shelter.objects.create(owner=user)
        NotificationPreferences.objects.create(user=user)
        return user

    def validate_password(self, password):
        validate_password(password=password)
        return password

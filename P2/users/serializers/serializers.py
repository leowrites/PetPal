from users.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from shelters.models.shelter import Shelter
from notifications.models import NotificationPreferences

class UserCreationSerializer(serializers.ModelSerializer):
    is_shelter = serializers.BooleanField(label="Are you a shelter?")
    shelter_name = serializers.CharField(write_only=True, required=False)
    contact_email = serializers.EmailField(write_only=True, required=False)
    location = serializers.CharField(write_only=True, required=False)
    mission_statement = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'is_shelter', 'shelter_name', 'contact_email', 'location', 'mission_statement']
        extra_kwargs = {
            'email': {'required': True},
            'password': {'write_only': True}
        }

    def validate(self, data):
        validated_data = super().validate(data)
        if validated_data.get('is_shelter'):
            errors = {}
            if not validated_data.get('shelter_name'):
                errors['shelter_name'] = "Shelter name is required."
            if not validated_data.get('contact_email'):
                errors['contact_email'] = "Contact email is required."
            if not validated_data.get('location'):
                errors['location'] = "Location is required."
            if not validated_data.get('mission_statement'):
                errors['mission_statement'] = "Mission statement is required."
            if errors:
                raise serializers.ValidationError(errors)
        return validated_data

    def create(self, validated_data):
        # create a shelter if user is a shelter
        is_shelter = validated_data.get('is_shelter', False)
        shelter_data = {}
        if is_shelter:
            shelter_fields = ['shelter_name', 'contact_email', 'location', 'mission_statement']
            for field in shelter_fields:
                shelter_data[field] = validated_data.pop(field)
        
        user = User.objects.create_user(**validated_data)
        if is_shelter:
            Shelter.objects.create(owner=user, **shelter_data)
        NotificationPreferences.objects.create(user=user)
        return user

    def validate_password(self, password):
        validate_password(password=password)
        return password

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_shelter']
from users.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from shelters.models.shelter import Shelter
from notifications.models import NotificationPreferences

class UserCreationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, label="Confirm Password")
    avatar = serializers.ImageField(label="Upload an avatar", required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'password2', 'email', 'avatar', 'is_shelter']
        extra_kwargs = {
            'email': {'required': True},
            'password': {'write_only': True},
            'password2': {'write_only': True},
        }

    def validate(self, data):
        validated_data = super().validate(data)
        if validated_data['password'] != validated_data['password2']:
            raise serializers.ValidationError("Passwords must match")
        return validated_data

    def validate_username(self, username):
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists")
        return username

    def create(self, validated_data):
        validated_data['is_shelter'] = False
        validated_data.pop('password2', None)
        user = User.objects.create_user(**validated_data)
        NotificationPreferences.objects.create(user=user)
        return user

    def validate_password(self, password):
        validate_password(password=password)
        return password

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'is_shelter']
    
    def update(self, instance, validated_data):
        validated_data.pop('is_shelter', None)
        return super().update(instance, validated_data)

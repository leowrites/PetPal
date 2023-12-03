from users.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from shelters.models.shelter import Shelter
from notifications.models import NotificationPreferences
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

class UserCreationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, label="Confirm Password")
    avatar = serializers.ImageField(label="Upload an avatar", required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'password2', 'email', 'avatar', 'is_shelter']
        read_only_fields = ['is_shelter']
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
        if username.strip() == '':
            raise serializers.ValidationError("Username cannot be empty")
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists")
        return username

    def create(self, validated_data):
        validated_data.pop('password2', None)
        user = User.objects.create_user(**validated_data)
        NotificationPreferences.objects.create(user=user)
        return user

    def validate_password(self, password):
        validate_password(password=password)
        return password

class UserProfileSerializer(serializers.ModelSerializer):
    shelter_id = serializers.PrimaryKeyRelatedField(source='shelter', required=False, allow_null=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'is_shelter', 'shelter_id']
        read_only_fields = ['is_shelter', 'shelter_id']

    def validate_username(self, username):
        if username.strip() == '':
            raise serializers.ValidationError("Username cannot be empty")
        if User.objects.filter(username=username).exists() and self.context['request'].user.username != username:
            raise serializers.ValidationError("Username already exists")
        return username
    
    def validate_email(self, email):
        if email.strip() == '':
            raise serializers.ValidationError("Email cannot be empty")
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format")
        return email
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(instance, 'shelter'):
            rep.pop('shelter_id', None)
        return rep
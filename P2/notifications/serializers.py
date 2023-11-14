from rest_framework import serializers
from notifications.models import Notification, NotificationPreferences
from users.serializers.serializers import UserSerializer

class AssociatedModelTypeSerializer(serializers.SlugRelatedField):
    def to_representation(self, value):
        return value.model

class NotificationSerializer(serializers.ModelSerializer):
    associated_model_type = AssociatedModelTypeSerializer(slug_field='model', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'associated_model_type', 'associated_model_id', 'created', 'read']
        extra_kwargs = {
            'application_message': {'required': False},
            'application_status_change': {'required': False},
            'pet_listing': {'required': False},
            'application': {'required': False},
            'review': {'required': False},
        }
    
class NotificationPreferencesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = NotificationPreferences
        fields = ['user', 'application_message', 'application_status_change', 'pet_listing', 'application', 'review']
        extra_kwargs = {
            'application_message': {'required': False, 'allow_null': True, 'default': None},
            'application_status_change': {'required': False, 'allow_null': True, 'default': None},
            'pet_listing': {'required': False, 'allow_null': True, 'default': None},
            'application': {'required': False, 'allow_null': True, 'default': None},
            'review': {'required': False, 'allow_null': True, 'default': None},
        }
    
    def update(self, instance, validated_data):
        request = self.context.get('request')

        if request.user.is_anonymous:
            raise serializers.ValidationError("User must be logged in to update notification preferences")
        
        if hasattr(request.user, 'shelter'):
            # Update shelter notification preferences - application_message, application_status_change, application, review
            applicable_fields = ['application_message', 'application_status_change', 'review', 'application']
        else:
            # Update user notification preferences - application_message, application_status_change, pet_listing, application
            applicable_fields = ['application_message', 'application_status_change', 'pet_listing']
        
        for field in applicable_fields:
            if validated_data[field] is not None:
                setattr(instance, field,validated_data[field])
        
        instance.save()
        return instance
    
    def to_representation(self, instance):
        request = self.context.get('request')
        if request.user.is_anonymous:
            raise serializers.ValidationError("User must be logged in to view notification preferences")
        
        if hasattr(request.user, 'shelter'):
            return {
                'application_message': instance.application_message,
                'application_status_change': instance.application_status_change,
                'review': instance.review,
                'application': instance.application
            }
        else:
            return {
                'application_message': instance.application_message,
                'application_status_change': instance.application_status_change,
                'pet_listing': instance.pet_listing
            }
        
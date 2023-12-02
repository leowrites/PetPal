from rest_framework import serializers
from notifications.models import Notification, NotificationPreferences
from users.serializers.serializers import UserProfileSerializer

class AssociatedModelTypeSerializer(serializers.SlugRelatedField):
    def to_representation(self, value):
        return value.model

class NotificationSerializer(serializers.ModelSerializer):
    associated_model_type = AssociatedModelTypeSerializer(slug_field='model', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'associated_model_type', 'associated_model_id', 'created', 'read']
    
    def to_representation(self, instance):
        request, message = self.context.get('request'), None

        if instance.notification_type == "applicationMessage":
            listing = instance.associated_model.application.listing
            message = f'New message on application for {listing.name}'
        elif instance.notification_type in "application_status_change":
            application = instance.associated_model.application
            listing = application.listing
            message = f'Status change on application for {listing.name}'
        elif instance.notification_type == "application":
            application = instance.associated_model.application
            listing = application.listing
            message = f'New application for {listing.name}'
        elif instance.notification_type == "petListing":
            listing = instance.associated_model
            message = f'New pet listed: {listing.name}!'
        elif instance.notification_type == "review":
            message = f'New review for your shelter'

        return {
            'id': instance.id,
            'type': instance.notification_type,
            'message': message,
            'created': instance.created,
            'read': instance.read
        }
    
class NotificationPreferencesSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

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
        request, message = self.context.get('request'), None
        
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
        
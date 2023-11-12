from rest_framework import serializers
from notifications.models import Notification

class AssociatedModelTypeSerializer(serializers.SlugRelatedField):
    def to_representation(self, value):
        return value.model

class NotificationSerializer(serializers.ModelSerializer):
    associated_model_type = AssociatedModelTypeSerializer(slug_field='model', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'associated_model_type', 'associated_model_id', 'created', 'read']
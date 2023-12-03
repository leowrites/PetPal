from rest_framework.generics import RetrieveDestroyAPIView, ListAPIView, RetrieveUpdateAPIView
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.urls import reverse_lazy

from notifications.models import Notification, NotificationPreferences
from notifications.serializers import NotificationSerializer, NotificationPreferencesSerializer

class NotificationDeleteOrRetrieveAPIView(RetrieveDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        notification = get_object_or_404(Notification, id=self.kwargs['notification_id'])
        if notification.user != self.request.user:
            raise PermissionDenied()
        return notification

    def retrieve(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.read = True
        notification.save()
        if notification.notification_type == "applicationMessage":
            return Response({
                'type': notification.notification_type,
                'applicationId': notification.associated_model.application.id
            })
        elif notification.notification_type in ("applicationStatusChange", "application"):
            return Response({
                'type': notification.notification_type,
                'applicationId': notification.associated_model.id
            })
        elif notification.notification_type == "petListing":
            return Response({
                'type': notification.notification_type,
                'listingId': notification.associated_model.id
            })
        elif notification.notification_type == "review":
            return Response({
                'type': notification.notification_type,
                'shelterId': notification.associated_model.shelter.id
            })

class NotificationListAPIView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    
    def get_queryset(self):
        query_set = Notification.objects.filter(user=self.request.user).order_by('-created')
        read_status = self.request.query_params.get('read', None)
        if read_status is not None:
            if read_status not in ('true', 'false'):
                raise ValidationError('Invalid read status value')
            query_set = query_set.filter(read=(read_status.lower() == 'true'))
        return query_set

class NotificationPreferencesRetrieveOrUpdateAPIView(RetrieveUpdateAPIView):
    serializer_class = NotificationPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(NotificationPreferences, user=self.request.user)
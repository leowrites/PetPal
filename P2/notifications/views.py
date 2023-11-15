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
        response_data = {'redirect': ''}
        if notification.notification_type == "applicationMessage":
            application_comment = notification.associated_model
            application = application_comment.application
            listing = application.listing
            shelter = listing.shelter
            response_data['redirect'] = reverse_lazy(
                'shelters:application-comment-list-create',
                kwargs={
                    'pk': shelter.id,
                    'listing_id': listing.id,
                    'application_id': application.id
                }
            )
        elif notification.notification_type in ("applicationStatusChange", "application"):
            application = notification.associated_model
            listing = application.listing
            shelter = listing.shelter
            response_data['redirect'] = reverse_lazy(
                'shelters:pet-application-details', 
                kwargs={
                    'pk': shelter.id,
                    'listing_id': listing.id,
                    'application_id': application.id
                }
            )
        elif notification.notification_type == "petListing":
            listing = notification.associated_model
            shelter = listing.shelter
            response_data['redirect'] = reverse_lazy(
                'shelters:pet-listing-update-destroy', 
                kwargs={
                    'pk': shelter.id,
                    'listing_id': listing.id
                }
            )
        elif notification.notification_type == "review":
            shelter_review = notification.associated_model
            shelter = shelter_review.shelter
            response_data['redirect'] = reverse_lazy(
                'shelters:shelter-review-list-create', 
                kwargs={
                    'pk': shelter.id
                }
            )
        return Response(response_data)

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
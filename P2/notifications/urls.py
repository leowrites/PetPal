from django.urls import path
from notifications.views import NotificationDeleteOrRetrieveAPIView, NotificationListAPIView

app_name = "notifications"

urlpatterns = [
    path('', NotificationListAPIView.as_view(), name='notification-list'),
    path('<int:notification_id>', NotificationDeleteOrRetrieveAPIView.as_view(), name='notification-delete'),
]
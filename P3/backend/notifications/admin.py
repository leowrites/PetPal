from django.contrib import admin

# Register your models here.
from notifications.models import Notification, NotificationPreferences

admin.site.register(Notification)
admin.site.register(NotificationPreferences)
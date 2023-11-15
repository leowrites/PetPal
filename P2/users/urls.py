from django.urls import path
from .views import views
from django.conf import settings
from django.conf.urls.static import static

app_name='users'
urlpatterns = [
    path('', views.CreateUser.as_view(), name='user-list-create'),
    path('<int:pk>', views.RetrieveOrUpdateOrDestroyUser.as_view(), name='user-details'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
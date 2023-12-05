from django.urls import path
from .views import views

app_name='users'
urlpatterns = [
    path('', views.RetrieveSelfOrCreateUser.as_view(), name='user-get-create'),
    path('<int:pk>', views.RetrieveOrUpdateOrDestroyUser.as_view(), name='user-details'),
    path('password/change', views.ChangePassword.as_view(), name='change-password'),
]
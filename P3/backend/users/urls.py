from django.urls import path
from .views import views

app_name='users'
urlpatterns = [
    path('', views.RetrieveSelfOrCreateUser.as_view(), name='user-list-create'),
    path('<int:pk>', views.RetrieveOrUpdateOrDestroyUser.as_view(), name='user-details'),
]
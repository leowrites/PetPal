from django.urls import path
from .views import views

app_name='users'
urlpatterns = [
    path('', views.CreateOrListUsers.as_view(), name='user-list-create'),
    path('<int:pk>', views.UserDetails.as_view(), name='user-details')
]
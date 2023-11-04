
from django.urls import path
from .views import views

app_name = "shelters"

urlpatterns = [
    path('<int:pk>/questions', views.ListOrCreateShelterQuestion.as_view(),
         name='shelter-question-list-create'),
    path('<int:pk>/questions/<int:question_id>', views.UpdateOrDestroyShelterQuestion.as_view(),
         name='shelter-question-update-delete'),
    path('<int:pk>/listings/<int:listing_id>/questions', views.ListOrCreateListingQuestion.as_view(),
         name='listing-question-list-create'),
    path('<int:pk>/listings/<int:listing_id>/questions/<int:question_id>',
         views.RemoveListingQuestion.as_view(), name='listing-question-delete')
]
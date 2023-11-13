import django_filters
from .models import PetApplication


class PetApplicationFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=PetApplication.STATUS_CHOICES)

    class Meta:
        model = PetApplication
        fields = ['status']

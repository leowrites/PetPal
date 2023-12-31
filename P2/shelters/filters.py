import django_filters
from .models import PetApplication
from listings.models import PetListing


class PetApplicationFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=PetApplication.STATUS_CHOICES)

    class Meta:
        model = PetApplication
        fields = ['status']


class PetListingFilter(django_filters.FilterSet):
    class Meta:
        model = PetListing
        fields = ['shelter', 'status', 'name', 'breed', 'age']
        
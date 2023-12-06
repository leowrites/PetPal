import django_filters
from .models import PetApplication
from listings.models import PetListing


class PetApplicationFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=PetApplication.STATUS_CHOICES)

    class Meta:
        model = PetApplication
        fields = ['status']


class PetListingFilter(django_filters.FilterSet):
    min_age = django_filters.NumberFilter(field_name='age', lookup_expr='gte')
    max_age = django_filters.NumberFilter(field_name='age', lookup_expr='lte')
    name = django_filters.CharFilter(field_name='name', lookup_expr='istartswith')
    breed = django_filters.CharFilter(field_name='breed', lookup_expr='istartswith')
    shelter_name = django_filters.CharFilter(field_name='shelter__shelter_name', lookup_expr='istartswith')

    class Meta:
        model = PetListing
        fields = ['shelter_name', 'status', 'name', 'breed', 'min_age', 'max_age', 'shelter']
        
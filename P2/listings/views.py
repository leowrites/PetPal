from django.shortcuts import render
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from listings.models import PetListing
from shelters.serializers.serializers import PetListingSerializer
from shelters.filters import PetListingFilter
from rest_framework import filters


class ListPetListing(generics.ListAPIView):
    serializer_class = PetListingSerializer
    queryset = PetListing.objects.all()
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_class = PetListingFilter
    ordering_fields = ["name", "age"]
    ordering = ["name"]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get("status", None)
        if status in map(lambda x: x[0], PetListing.STATUS_CHOICES):
            queryset = queryset.filter(status=status)
        elif status != "":
            queryset = queryset.filter(status="available")
        return queryset

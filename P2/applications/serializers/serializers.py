from rest_framework import serializers
from applications.models.pet_application import PetApplication
from applications.models.application_response import Question, ListingQuestion


def get_status(obj):
    return obj.get_status_display()


class PetApplicationSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = PetApplication
        fields = '__all__'


class ShelterQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question']


class ListingQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingQuestion
        fields = ['id', 'question']

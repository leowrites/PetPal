from django.shortcuts import get_object_or_404
from rest_framework import serializers
from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import ShelterQuestion, AssignedQuestion, ApplicationResponse
from shelters import models
from users.serializers.serializers import UserSerializer
from notifications.models import Notification
from django.contrib.auth.models import User
from django.db import transaction


class ShelterQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelterQuestion
        fields = ['id', 'question', 'type']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = validated_data.pop('user')
        return ShelterQuestion.objects.create(**validated_data, shelter=user.shelter)


# only difference to the one above is that on GET methods, it returns a bit more information about the question
class AssignedQuestionDetailsSerializer(serializers.ModelSerializer):
    question = ShelterQuestionSerializer(read_only=True)

    class Meta:
        model = AssignedQuestion
        fields = ['id', 'question', 'rank','required', 'listing']


class ApplicationResponseSerializer(serializers.ModelSerializer):
    question = AssignedQuestionDetailsSerializer(read_only=True)

    class Meta:
        model = ApplicationResponse
        fields = '__all__'


class PetApplicationGetOrUpdateSerializer(serializers.ModelSerializer):
    application_responses = ApplicationResponseSerializer(many=True, read_only=True)
    applicant = UserSerializer(read_only=True)

    class Meta:
        model = PetApplication
        fields = ['status', 'listing', 'application_responses', 'applicant', 'id', 'application_time', 'last_updated']
        read_only_fields = ['listing', 'application_responses', 'applicant', 'id', 'application_time', 'last_updated']
        extra_kwargs = {
            'status': { 'required': True }
        }

    def validate_status(self, data):
        new_status = super().validate(data)
        request = self.context.get('request')
        user = request.user
        is_shelter = hasattr(user, 'shelter')
        application_id = request.parser_context['kwargs'].get('application_id')
        instance = PetApplication.objects.get(id=application_id)
        if is_shelter and new_status not in ['approved', 'denied', 'pending']:
            raise serializers.ValidationError("Shelter can only update status to pending, approved, and denied.")
        if not is_shelter:
            if instance.status not in ['pending', 'approved']:
                raise serializers.ValidationError("You can't update the status right now.")
            if instance.status == 'pending' and new_status != 'withdrawn':
                raise serializers.ValidationError("Applicant can only update status from pending to withdrawn.")
            elif instance.status == 'approved' and new_status not in ['accepted', 'withdrawn']:
                raise serializers.ValidationError("Applicant can only update status from approved "
                                                  "to withdrawn or accepted.")
        return new_status

    def update(self, instance, validated_data):
        instance.status = validated_data['status']
        instance.save(update_fields=['status', 'last_updated'])
        request = self.context.get('request')

        # send notification to the shelter owner or user
        if request.user == instance.applicant:
            Notification.objects.create(
                user=instance.listing.shelter.owner,
                notification_type="applicationStatusChange",
                associated_model=instance
            )
        elif request.user == instance.listing.shelter.owner:
            Notification.objects.create(
                user=instance.applicant,
                notification_type="applicationStatusChange",
                associated_model=instance
            )

        return instance


class AssignedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedQuestion
        fields = ['id', 'question', 'rank', 'required', 'listing']
        read_only_fields = ['id', 'listing']

    def create(self, validated_data):
        return AssignedQuestion.objects.create(**validated_data)


def type_to_field(question_type, label, required):
    if question_type == ShelterQuestion.FILE:
        return serializers.FileField(label=label, required=required)
    elif question_type == ShelterQuestion.CHECKBOX:
        return serializers.BooleanField(label=label, required=required)
    elif question_type == ShelterQuestion.DATE:
        return serializers.DateField(input_formats=['%d-%m-%Y'], label=label, required=required)
    elif question_type == ShelterQuestion.EMAIL:
        return serializers.EmailField(max_length=200, min_length=0, label=label, required=required)
    elif question_type == ShelterQuestion.TEXT:
        return serializers.CharField(max_length=1000, label=label, required=required)
    elif question_type == ShelterQuestion.NUMBER:
        return serializers.IntegerField(label=label, required=required)
    else:
        return serializers.CharField(label=label, required=required)


class PetApplicationPostSerializer(serializers.Serializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.listing_id = self.context.get('request').parser_context.get('kwargs').get('listing_id')
        listing_questions = AssignedQuestion.objects.filter(listing_id=self.listing_id).order_by('rank')

        question_dict = {}
        # for each question that belongs to this pet listing, make a field for it
        # may need to add more data such as type of the question so corresponding fields can be used
        for listing_question in listing_questions:
            question = listing_question.question
            question_string = question.question
            # the serializer field differs depending on the type of the question
            question_dict[str(listing_question.id)] = type_to_field(question_type=question.type, label=question_string,
                                                                    required=listing_question.required)
        self.fields.update(question_dict)

    def validate(self, data):
        # check listing is available
        validated_data = super().validate(data)
        listing = get_object_or_404(PetListing, id=self.listing_id)
        if listing.status == 'not_available':
            raise serializers.ValidationError({"not_available": "This listing is not available"})

        user = self.context['request'].user
        # check if this user already has an application for this listing
        if PetApplication.objects.filter(applicant=user, listing_id=self.listing_id).exists():
            raise serializers.ValidationError({"already_applied": "You already applied to this listing"})
        return validated_data

    def create(self, validated_data):
        listing_id = validated_data.pop('listing_id')
        applicant = validated_data.pop('applicant')
        application = PetApplication.objects.create(listing_id=listing_id, applicant=applicant)
        application_responses = []
        for question_id, answer in validated_data.items():
            application_responses.append(
                ApplicationResponse(answer=answer, question_id=question_id, application=application)
            )
        ApplicationResponse.objects.bulk_create(application_responses)
        shelter = application.listing.shelter
        Notification.objects.create(
            user=shelter.owner,
            notification_type="application",
            associated_model=application
        )
        return application

    def to_representation(self, instance):
        # Start with the default serialized data
        application_responses_queryset = instance.application_responses.all()
        application_responses = []
        for response in application_responses_queryset:
            application_responses.append({
                "question": response.question.question.question,
                "answer": response.answer
            })
        return {
            'id': instance.id,
            'listing_id': instance.listing_id,
            'applicant': instance.applicant.id,  # or any other representation you want
            'application_time': instance.application_time,
            'last_updated': instance.last_updated,
            'application_responses': application_responses
            # add any other fields from the PetApplication model that you want to include
        }


class PetListingSerializer(serializers.ModelSerializer):
    # questions = serializers.PrimaryKeyRelatedField(many=True, queryset=Question.objects.all(), write_only=True)
    assigned_questions = AssignedQuestionDetailsSerializer(many=True, required=False)

    # user can select the questions, which will create new rows in listing questions
    class Meta:
        # for listing or creating a serializer
        model = PetListing
        fields = ['id', 'name', 'shelter', 'status', 'assigned_questions', 'age', 'breed']
        read_only_fields = ['shelter', 'id', 'application_questions']

    def create(self, validated_data):
        pet_listing = PetListing.objects.create(**validated_data)
        with transaction.atomic():
            notifications = [
                Notification(
                    user=user,
                    notification_type="petListing",
                    associated_model=pet_listing
                ) for user in User.objects.filter(shelter__isnull=True)
            ]

            Notification.objects.bulk_create(notifications)
        return pet_listing


class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Shelter
        fields = ['name', 'owner']
        read_only_fields = ['owner']    


class ShelterReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ShelterReview
        fields = ['text', 'user', 'date_created', 'rating', 'shelter']
        read_only_fields = ['user', 'date_created']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user

        shelter = validated_data['shelter']
        if not models.Shelter.objects.filter(id=shelter.id).exists():
            raise serializers.ValidationError("Shelter does not exist")

        review = models.ShelterReview.objects.create(**validated_data, user=user)

        # create related notification
        if shelter != user:
            notification = Notification.objects.create(
                user=shelter.owner,
                notification_type="review",
                associated_model=review
            )

        return review


class ApplicationCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ApplicationComment
        fields = ['text', 'user', 'date_created']
        read_only_fields = ['user', 'date_created']
    
    def create(self, validated_data):
        application_comment = super().create(validated_data)
        application = application_comment.application
        request = self.context.get('request')

        # create related notification
        if request.user == application.applicant:
            notification = Notification.objects.create(
                user = application.listing.shelter.owner,
                notification_type = "applicationMessage",
                associated_model = application_comment
            )
        elif request.user == application.listing.shelter.owner:
            notification = Notification.objects.create(
                user = application.applicant,
                notification_type = "applicationMessage",
                associated_model = application_comment
            )

        return application_comment
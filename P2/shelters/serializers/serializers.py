from django.shortcuts import get_object_or_404
from rest_framework import serializers
from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import ShelterQuestion, AssignedQuestion, ApplicationResponse
from shelters import models
from users.serializers.serializers import UserSerializer


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
    assigned_questions = AssignedQuestionSerializer(many=True, required=False)

    # user can select the questions, which will create new rows in listing questions
    class Meta:
        # for listing or creating a serializer
        model = PetListing
        fields = ['id', 'name', 'shelter', 'status', 'assigned_questions', 'age', 'breed']
        read_only_fields = ['shelter', 'id']

    def create(self, validated_data):
        questions_data = validated_data.pop('assigned_questions', [])
        shelter = self.context.get('request').user.shelter
        pet_listing = PetListing.objects.create(**validated_data, shelter=shelter)
        for question in questions_data:
            AssignedQuestion.objects.create(listing=pet_listing, **question)
        return pet_listing

    def update(self, instance, validated_data):
        # if question is not already in the listing then update it
        listing_questions_data = validated_data.pop('assigned_questions', [])
        # remove the ones that no longer exist
        new_question_ids = {q['question'].id: q for q in listing_questions_data}
        # Get all questions that belong to this pet listing
        existing_questions = AssignedQuestion.objects.filter(listing=instance)
        existing_question_ids = {q.question.id: q for q in existing_questions}

        existing_questions_to_update = []
        new_questions = []

        # add new ones
        for question_id, question_data in new_question_ids.items():
            if question_id in existing_question_ids:
                existing_question = existing_question_ids[question_id]
                existing_question.rank = question_data.get('rank', existing_question.rank)
                existing_question.required = question_data.get('required', existing_question.required)
                existing_questions_to_update.append(existing_question)
            else:
                new_questions.append(AssignedQuestion(listing=instance, **question_data))

        AssignedQuestion.objects.bulk_create(new_questions)
        AssignedQuestion.objects.bulk_update(existing_questions_to_update, ['rank', 'required'])

        old_question_ids = set(existing_question_ids.keys()) - set(new_question_ids.keys())
        AssignedQuestion.objects.filter(listing=instance, question_id__in=old_question_ids).delete()

        # for question in questions_data:
        return super().update(instance, validated_data)

    def get_assigned_questions(self, obj):
        assigned_questions = AssignedQuestion.objects.filter(listing=obj)
        return AssignedQuestionSerializer(assigned_questions, many=True).data


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
        return review


class ApplicationCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ApplicationComment
        fields = ['text', 'user', 'date_created']
        read_only_fields = ['user', 'date_created']
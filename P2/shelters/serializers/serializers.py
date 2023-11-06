from rest_framework import serializers
from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import ShelterQuestion, AssignedQuestion, ApplicationResponse
from shelters import models


class ShelterQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelterQuestion
        fields = ['id', 'question', 'type', 'required']

    def create(self, validated_data):
        user = self.context['request'].user
        # pretty sure this logic can be moved to the view, we can have a
        # permission method for this
        if not hasattr(user, 'shelter'):
            raise serializers.ValidationError("You are not a shelter")
        question = ShelterQuestion.objects.create(**validated_data, shelter=user.shelter)
        return question


class ApplicationResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationResponse
        fields = '__all__'


class PetApplicationSerializer(serializers.ModelSerializer):
    application_responses = ApplicationResponseSerializer(many=True, read_only=True)

    class Meta:
        model = PetApplication
        fields = '__all__'


class AssignedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedQuestion
        fields = ['id', 'question', 'rank']


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


class PetApplicationFormSerializer(serializers.Serializer):
    # on post, each question associated with the listing should be a field in the serializer
    # listing_questions = ListingQuestionSerializer(many=True)

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
            question_dict[str(listing_question.id)] = type_to_field(question_type=question.type, label=question_string, required=question.required)
        self.fields.update(question_dict)

    def create(self, validated_data):
        # should create an application instance here as well as for each response create answers
        application = PetApplication.objects.create(listing_id=self.listing_id, applicant=self.context['request'].user)
        for key, value in validated_data.items():
            ApplicationResponse.objects.create(answer=value, question_id=key, application=application)
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


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelterQuestion
        fields = '__all__'
        extra_kwargs = {
            'id': {
                'read_only': False
            }
        }


class PetListingSerializer(serializers.ModelSerializer):
    # questions = serializers.PrimaryKeyRelatedField(many=True, queryset=Question.objects.all(), write_only=True)
    assigned_questions = AssignedQuestionSerializer(many=True)

    # user can select the questions, which will create new rows in listing questions
    class Meta:
        # for listing or creating a serializer
        model = PetListing
        fields = '__all__'

    def create(self, validated_data):
        questions_data = validated_data.pop('assigned_questions', [])
        pet_listing = PetListing.objects.create(**validated_data)
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
                existing_question.rank = question_data['rank']
                existing_questions_to_update.append(existing_question)
            else:
                new_questions.append(AssignedQuestion(listing=instance, **question_data))

        AssignedQuestion.objects.bulk_create(new_questions)
        AssignedQuestion.objects.bulk_update(existing_questions_to_update, ['rank'])

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
        fields = '__all__'

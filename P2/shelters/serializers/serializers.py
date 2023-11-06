from rest_framework import serializers
from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import Question, ListingQuestion, Answer
from shelters import models


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'


class PetApplicationSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = PetApplication
        fields = '__all__'


class ShelterQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question', 'type', 'required']

    def create(self, validated_data):
        user = self.context['request'].user
        # pretty sure this logic can be moved to the view, we can have a
        # permission method for this
        if not hasattr(user, 'shelter'):
            raise serializers.ValidationError("You are not a shelter")
        question = Question.objects.create(**validated_data, shelter=user.shelter)
        return question


class ListingQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingQuestion
        fields = ['id', 'question', 'rank']


def type_to_field(question_type, label, required):
    if question_type == Question.FILE:
        return serializers.FileField(label=label, required=required)
    elif question_type == Question.CHECKBOX:
        return serializers.BooleanField(label=label, required=required)
    elif question_type == Question.DATE:
        return serializers.DateField(input_formats=['%d-%m-%Y'], label=label, required=required)
    elif question_type == Question.EMAIL:
        return serializers.EmailField(max_length=200, min_length=0, label=label, required=required)
    elif question_type == Question.TEXT:
        return serializers.CharField(max_length=1000, label=label, required=required)
    elif question_type == Question.NUMBER:
        return serializers.IntegerField(label=label, required=required)
    else:
        return serializers.CharField(label=label, required=required)


class PetApplicationFormSerializer(serializers.Serializer):
    # on post, each question associated with the listing should be a field in the serializer
    # listing_questions = ListingQuestionSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.listing_id = self.context.get('request').parser_context.get('kwargs').get('listing_id')
        listing_questions = ListingQuestion.objects.filter(listing_id=self.listing_id).order_by('rank')

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
            Answer.objects.create(answer=value, question_id=key, application=application)
        return application


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        extra_kwargs = {
            'id': {
                'read_only': False
            }
        }


class PetListingSerializer(serializers.ModelSerializer):
    # questions = serializers.PrimaryKeyRelatedField(many=True, queryset=Question.objects.all(), write_only=True)
    listing_questions = ListingQuestionSerializer(many=True)

    # user can select the questions, which will create new rows in listing questions
    class Meta:
        # for listing or creating a serializer
        model = PetListing
        fields = '__all__'

    def create(self, validated_data):
        questions_data = validated_data.pop('listing_questions', [])
        pet_listing = PetListing.objects.create(**validated_data)
        for question in questions_data:
            ListingQuestion.objects.create(listing=pet_listing, **question)
        return pet_listing

    def update(self, instance, validated_data):
        # if question is not already in the listing then update it
        listing_questions_data = validated_data.pop('listing_questions', [])
        # remove the ones that no longer exist
        new_question_ids = {q['question'].id: q for q in listing_questions_data}
        # Get all questions that belong to this pet listing
        existing_questions = ListingQuestion.objects.filter(listing=instance)
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
                new_questions.append(ListingQuestion(listing=instance, **question_data))

        ListingQuestion.objects.bulk_create(new_questions)
        ListingQuestion.objects.bulk_update(existing_questions_to_update, ['rank'])

        old_question_ids = set(existing_question_ids.keys()) - set(new_question_ids.keys())
        ListingQuestion.objects.filter(listing=instance, question_id__in=old_question_ids).delete()

        # for question in questions_data:
        return super().update(instance, validated_data)

    def get_listing_questions(self, obj):
        listing_questions = ListingQuestion.objects.filter(listing=obj)
        return ListingQuestionSerializer(listing_questions, many=True).data


class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Shelter
        fields = '__all__'

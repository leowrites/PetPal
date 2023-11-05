from rest_framework import serializers
from shelters.models.pet_application import PetApplication, PetListing
from shelters.models.application_response import Question, ListingQuestion, Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'


class PetApplicationSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = PetApplication
        fields = '__all__'
        extra_kwargs = {
            'listing': {
                'required': False
            }
        }

    def update(self, instance, validated_data):
        # Check if the 'status' field is included in the request data
        if 'status' not in validated_data:
            raise serializers.ValidationError("The status field is required.")

        request = self.context.get('request')
        new_status = validated_data['status']
        # make sure the applicant can only update the status from pending -> withdrawn,
        # or approved -> accepted, withdrawn
        # if request.user.is_anonymous:
        #     raise serializers.ValidationError("You must be logged in!")

        # uncomment once user model & shelter model are merged
        # if request.user == instance.applicant:
        #     if instance.status == 'pending' and new_status != 'withdrawn':
        #         raise serializers.ValidationError("Applicant can only update status from pending to withdrawn.")
        #     elif instance.status == 'approved' and new_status not in ['accepted', 'withdrawn']:
        #         raise serializers.ValidationError("Applicant can only update status from approved "
        #                                           "to withdrawn or accepted.")
        #     else:
        #         raise serializers.ValidationError("You can only update the status to withdrawn or accepted")
        # add logic for shelter here once shelter is added
        # if True:
        #     pass
        # else:
        #     # check owner of this listing is the current user
        #     if instance.listing.shelter != request.user:
        #         raise serializers.ValidationError("You do not own this listing")
        #     # will let them update anytime if they change their mind
        #     if new_status != ['accepted', 'denied', 'pending']:
        #         raise serializers.ValidationError("Shelter can only update status from pending to accepted or withdrawn.")
        #     else:
        #         raise serializers.ValidationError("You can only update the status to pending, accepted, or denied")
        # Only update the 'status' field
        instance.status = validated_data['status']
        instance.save(update_fields=['status'])
        return instance


class ShelterQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question']


class ListingQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingQuestion
        fields = ['id', 'question']


class PetApplicationFormSerializer(serializers.Serializer):
    # on post, each question associated with the listing should be a field in the serializer
    # listing_questions = ListingQuestionSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.listing_id = self.context.get('request').parser_context.get('kwargs').get('listing_id')
        listing_questions = ListingQuestion.objects.filter(listing_id=self.listing_id)

        question_dict = {}
        # for each question that belongs to this pet listing, make a field for it
        # may need to add more data such as type of the question so corresponding fields can be used
        for listing_question in listing_questions:
            question_string = listing_question.question.question
            question_dict[str(listing_question.id)] = serializers.CharField(label=question_string, required=False)
        self.fields.update(question_dict)

    def create(self, validated_data):
        # check listing is available
        listing = PetListing.objects.get(id=self.listing_id)
        if listing.status == 'not_available':
            raise serializers.ValidationError("This listing is not available")

        # check if this user already has an applicant for this listing
        user = self.context['request'].user
        if PetApplication.objects.filter(applicant=user, listing_id=self.listing_id).exists():
            raise serializers.ValidationError("You already applied to this listing")
        application = PetApplication.objects.create(listing_id=self.listing_id)
        for key, value in validated_data.items():
            Answer.objects.create(answer=value, question_id=key, application=application)
        return application


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class PetListingSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(many=True, queryset=Question.objects.all(), write_only=True)
    listing_questions = serializers.SerializerMethodField(read_only=True)

    # user can select the questions, which will create new rows in listing questions
    class Meta:
        # for listing or creating a serializer
        model = PetListing
        fields = '__all__'

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        pet_listing = PetListing.objects.create(**validated_data)
        for question in questions_data:
            ListingQuestion.objects.create(listing=pet_listing, question=question)
        return pet_listing

    def update(self, instance, validated_data):
        # if question is not already in the listing then update it
        questions_data = validated_data.pop('questions')
        # remove the ones that no longer exist
        new_question_ids = [q.id for q in questions_data]
        # Get all questions that belong to this pet listing
        existing_questions = ListingQuestion.objects.filter(listing=instance)
        existing_question_ids = [q.question.id for q in existing_questions]

        for question in questions_data:
            if question.id not in existing_question_ids:
                ListingQuestion.objects.create(listing=instance, question=question)

        for existing_question in existing_questions:
            if existing_question.question.id not in new_question_ids:
                existing_question.delete()

        # for question in questions_data:
        return super().update(instance, validated_data)

    def get_listing_questions(self, obj):
        listing_questions = ListingQuestion.objects.filter(listing=obj)
        return ListingQuestionSerializer(listing_questions, many=True).data

from django.contrib.auth.models import User
from users.views import views
from shelters.models import Shelter, ShelterQuestion
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)
from rest_framework.test import (APIRequestFactory, force_authenticate, APIClient, APITestCase)
from django.urls import reverse


def create_user(username='Leo', is_shelter=False):
    factory = APIRequestFactory()
    request = factory.post('/users', {
        'username': username,
        'password': '123123123a!',
        'is_shelter': is_shelter
    })
    return views.CreateOrListUsers.as_view()(request)


def login(username='Leo', password='123123123a!'):
    factory = APIRequestFactory()
    request = factory.post('/api/token', {
        'username': username,
        'password': password
    })
    return TokenObtainPairView.as_view()(request)


class UserCreationTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_CreateUser_UserDoesNotExist_CreatesUser(self):
        create_user()
        user = User.objects.get(username='Leo')
        self.assertEquals(user.username, 'Leo')

    def test_CreateUser_userExists_UserExistsException(self):
        response = create_user()
        self.assertEquals(response.status_code, 201)
        response = create_user()
        self.assertEquals(response.status_code, 400)
        self.assertEquals(response.data['username'][0], 'A user with that username already exists.')


class ShelterUserCreationTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_CreateUser_UserIsShelter_CreatesUserAndShelter(self):
        create_user(is_shelter=True)
        user = User.objects.get(username='Leo')
        shelter = Shelter.objects.get(owner=user)
        self.assertEquals(user.username, 'Leo')
        self.assertEquals(shelter.owner, user)

    def test_CreateUser_UserIsNotShelter_CreatesUserOnly(self):
        create_user()
        user = User.objects.get(username='Leo')
        with self.assertRaises(Shelter.DoesNotExist):
            Shelter.objects.get(owner=user)


class ShelterQuestionCreationTest(APITestCase):

    def setUp(self):
        normal_user_username = 'Leo'
        create_user(normal_user_username)
        user = User.objects.get(username=normal_user_username)
        self.user_client = APIClient()
        self.user_client.force_authenticate(user)

        shelter_user_username = 'Jack'
        create_user(shelter_user_username, is_shelter=True)
        shelter_user = User.objects.get(username=shelter_user_username)
        self.shelter_client = APIClient()
        self.shelter_client.force_authenticate(shelter_user)

        self.shelter = shelter_user.shelter

    def test_CreateQuestion_UserIsShelter_CreatesQuestion(self):
        request_body = {
            "question": "What is your name?",
            "type": "NUMBER",
        }
        response = self.shelter_client.post(reverse('shelters:shelter-question-list-create',
                                                    kwargs={'pk': self.shelter.id}), request_body)
        self.assertEquals(response.status_code, 201)
        self.shelter.refresh_from_db()
        # check it has a question
        question = self.shelter.shelter_questions.get(id=response.data['id'])
        self.assertEquals(question.question, "What is your name?")

    def test_CreateQuestion_AcceptedTypes_CreatesQuestion(self):
        # supported types are defined in the API doc
        # includes FILE, CHECKBOX, DATE, EMAIL, TEXT, NUMBER
        question_ids = []
        question_types = ['FILE', 'CHECKBOX', 'DATE', 'EMAIL', 'TEXT', 'NUMBER']
        for question_type in question_types:
            request_body = {
                "question": f"This is a {question_type} test",
                "type": question_type,
            }
            response = self.shelter_client.post(reverse('shelters:shelter-question-list-create',
                                                        kwargs={'pk': self.shelter.id}), request_body)
            self.assertEquals(response.status_code, 201)
            question_ids.append(response.data.get('id'))
        created_questions = ShelterQuestion.objects.filter(id__in=question_ids)
        # check every type has exactly one question created
        for question_type in question_types:
            question = created_questions.get(type=question_type)
            self.assertEquals(question.question, f"This is a {question_type} test")

    def test_CreateQuestion_NotAcceptedType_CreatesNoQuestion(self):
        question_type = 'hehe'
        request_body = {
            "question": f"This is a {question_type} test",
            "type": question_type,
        }
        response = self.shelter_client.post(reverse('shelters:shelter-question-list-create',
                                                    kwargs={'pk': self.shelter.id}), request_body)
        self.assertEquals(response.status_code, 400)
        self.assertEquals(str(response.data.get('type', [])[0]), f'"{question_type}" is not a valid choice.')
        self.assertFalse(ShelterQuestion.objects.all().exists())

    def test_CreateQuestion_QuestionTooLong_CreatesNoQuestion(self):
        request_body = {
            "question": "L" * 1001,
            "type": "TEXT",
        }
        response = self.shelter_client.post(reverse('shelters:shelter-question-list-create',
                                                    kwargs={'pk': self.shelter.id}), request_body)
        self.assertEquals(response.status_code, 400)
        self.assertFalse(ShelterQuestion.objects.all().exists())

    def test_CreateQuestion_InvalidField_CreatesQuestion(self):
        request_body = {
            "question": "test",
            "type": "TEXT",
            "completely_random_field": "hmm"
        }
        response = self.shelter_client.post(reverse('shelters:shelter-question-list-create',
                                                    kwargs={'pk': self.shelter.id}), request_body)
        self.assertEquals(response.status_code, 201)
        self.assertIsNotNone(ShelterQuestion.objects.get(id=response.data['id']))

    def test_CreateQuestion_UserIsNotShelter_CreatesNoQuestion(self):
        request_body = {
            "question": "What is your name?",
            "type": "NUMBER",
        }
        response = self.user_client.post(reverse('shelters:shelter-question-list-create',
                                                 kwargs={'pk': self.shelter.id}), request_body)
        self.assertEquals(response.status_code, 403)
        self.assertFalse(ShelterQuestion.objects.exists())

    def test_CreateQuestion_NotAuthenticated_CreatesNoQuestion(self):
        self.user_client.logout()
        response = self.user_client.post(reverse('shelters:shelter-question-list-create',
                                                 kwargs={'pk': self.shelter.id}))
        self.assertEquals(response.status_code, 401)

    def test_CreateQuestion_OwnerOfAnotherShelter_CreatesNoQuestion(self):
        create_user('shelter_2', True)
        shelter_2 = User.objects.get(username='shelter_2')
        shelter_2_client = APIClient()
        shelter_2_client.force_authenticate(shelter_2)
        request_body = {
            "question": "What is your name?",
            "type": "NUMBER",
        }
        response = shelter_2_client.post(reverse('shelters:shelter-question-list-create',
                                                 kwargs={'pk': self.shelter.id}), request_body)
        self.assertEquals(response.status_code, 403)

# class PetListingCreation(APITestCase):

# def setUp(self):

from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from users.views import views
from shelters.views import views as shelter_views
from shelters.models import Shelter, ShelterQuestion
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)


def create_user(username='Leo', is_shelter=False):
    factory = RequestFactory()
    request = factory.post('/users', {
        'username': username,
        'password': '123123123a!',
        'is_shelter': is_shelter
    })
    return views.CreateOrListUsers.as_view()(request)


def login(username='Leo', password='123123123a!'):
    factory = RequestFactory()
    request = factory.post('/api/token', {
        'username': username,
        'password': password
    })
    return TokenObtainPairView.as_view()(request)


class UserCreationTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

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


class ShelterUserCreationTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

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


class ShelterQuestionCreationTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        normal_user_username = 'Leo'
        shelter_user_username = 'Jack'

        create_user(shelter_user_username, is_shelter=True)
        response = login(shelter_user_username)
        self.shelter_access = response.data['access']

        create_user(normal_user_username)
        response = login(normal_user_username)
        self.user_access = response.data['access']

        self.user = User.objects.get(username=normal_user_username)
        self.shelter_user = User.objects.get(username=shelter_user_username)
        self.shelter = self.shelter_user.shelter

    def test_CreateQuestion_UserIsShelter_CreatesQuestion(self):
        request = self.factory.post(f'/shelter/{self.shelter.id}/questions', {
            "question": "What is your name?",
            "type": "NUMBER",
            "required": True
        }, HTTP_AUTHORIZATION=f'Bearer {self.shelter_access}')
        response = shelter_views.ListOrCreateShelterQuestion.as_view()(request)
        self.assertEquals(response.status_code, 201)
        self.shelter.refresh_from_db()
        # check it has a question
        question = self.shelter.shelter_questions.get(id=response.data['id'])
        self.assertEquals(question.question, "What is your name?")

    def test_CreateQuestion_UserIsNotShelter_CreatesNoQuestion(self):
        request = self.factory.post(f'/shelter/{self.shelter.id}/questions', {
            "question": "What is your name?",
            "type": "NUMBER",
            "required": True
        }, HTTP_AUTHORIZATION=f'Bearer {self.user_access}')
        response = shelter_views.ListOrCreateShelterQuestion.as_view()(request)
        self.assertEquals(response.status_code, 400)
        self.assertFalse(ShelterQuestion.objects.exists())
        self.assertEquals(response.data[0], 'You are not a shelter')

    def test_CreateQuestion_NotAuthenticated_CreatesNoQuestion(self):
        pass

    def test_CreateQuestion_OwnerOfAnotherShelter_CreatesNoQuestion(self):
        pass


# class PetListingCreation(TestCase):

    # def setUp(self):

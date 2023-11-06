from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from users.views import views
from shelters.models import Shelter
# Create your tests here.


class UserCreationTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_CreateUser_UserDoesNotExist_CreatesUser(self):
        request = self.factory.post('/users', {
            'username': 'Leo',
            'password': '123123123a!',
        })
        views.CreateOrListUsers.as_view()(request)
        user = User.objects.get(username='Leo')
        self.assertEquals(user.username, 'Leo')

    def test_CreateUser_userExists_UserExistsException(self):
        request = self.factory.post('/users', {
            'username': 'Leo',
            'password': '123123123a!',
        })
        response = views.CreateOrListUsers.as_view()(request)
        self.assertEquals(response.status_code, 201)
        response = views.CreateOrListUsers.as_view()(request)
        self.assertEquals(response.status_code, 400)
        self.assertEquals(response.data['username'][0], 'A user with that username already exists.')


class ShelterUserCreationTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
    def test_CreateUser_UserIsShelter_CreatesUserAndShelter(self):
        request = self.factory.post('/users', {
            'username': 'Leo',
            'password': '123123123a!',
            'is_shelter': True
        })
        views.CreateOrListUsers.as_view()(request)
        user = User.objects.get(username='Leo')
        shelter = Shelter.objects.get(owner=user)
        self.assertEquals(user.username, 'Leo')
        self.assertEquals(shelter.owner, user)

    def test_CreateUser_UserIsNotShelter_CreatesUserOnly(self):
        request = self.factory.post('/users', {
            'username': 'Leo',
            'password': '123123123a!'
        })
        views.CreateOrListUsers.as_view()(request)
        user = User.objects.get(username='Leo')
        with self.assertRaises(Shelter.DoesNotExist):
            Shelter.objects.get(owner=user)
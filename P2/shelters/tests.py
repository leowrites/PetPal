from users.models import User
from users.views import views
from shelters.models import Shelter, ShelterQuestion
from listings.models import PetListing
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)
from rest_framework.test import (APIRequestFactory, force_authenticate, APIClient, APITestCase)
from django.urls import reverse


def create_user(username='Leo', is_shelter=False):
    factory = APIRequestFactory()
    if is_shelter == False:
      request = factory.post('/users', {
          'username': username,
          'password': '123123123a!',
          'email': 'leo@gmail.com',
          'is_shelter': is_shelter
      })
    else:
      request = factory.post('/users', {
          'username': username,
          'password': '123123123a!',
          'email': 'leo@gmail.com',
          'is_shelter': is_shelter,
          'shelter_name': 'justin\'s shelter',
          'contact_email': 'contact@gmail.com',
          'location': 'toronto',
          'mission_statement': 'we are a shelter'
      })  
    return views.CreateUser.as_view()(request)

def login(username='Leo', password='123123123a!'):
    factory = APIRequestFactory()
    request = factory.post('/api/token', {
        'username': username,
        'password': password
    })
    return TokenObtainPairView.as_view()(request)

def create_question(client, shelter_id):
    request_body = {
        "question": "What is your name?",
        "type": "NUMBER",
    }
    response = client.post(reverse('shelters:shelter-question-list-create',
                                         kwargs={'pk': shelter_id}), request_body)
    return response.data['id']

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


class ShelterQuestionTestCase(APITestCase):

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

        create_user('shelter_2', True)
        self.shelter_2 = User.objects.get(username='shelter_2')
        self.shelter_2_client = APIClient()
        self.shelter_2_client.force_authenticate(self.shelter_2)

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
        request_body = {
            "question": "What is your name?",
            "type": "NUMBER",
        }
        response = self.shelter_2_client.post(reverse('shelters:shelter-question-list-create',
                                                 kwargs={'pk': self.shelter.id}), request_body)
        self.assertEquals(response.status_code, 403)

    def test_ListQuestions_NotAuthenticated_Returns401(self):
        client = APIClient()
        response = client.get(reverse('shelters:shelter-question-list-create',  kwargs={'pk': self.shelter.id}))
        self.assertEquals(response.status_code, 401)

    def test_ListQuestions_OwnerOfAnotherShelter_Returns403(self):
        response = self.shelter_2_client.get(reverse('shelters:shelter-question-list-create',
                                                     kwargs={'pk': self.shelter.id}))
        self.assertEquals(response.status_code, 403)

    def test_ListQuestions_Owner_ReturnsQuestions(self):
        create_question(self.shelter_client, self.shelter.id)
        # add a question to the shelter
        # retrieve the question
        response = self.shelter_client.get(reverse('shelters:shelter-question-list-create', kwargs={'pk': self.shelter.id}))
        self.assertEquals(response.status_code, 200)
        data = response.data.get('results')
        self.assertEquals(data[0].get('question', None), "What is your name?")
        self.assertEquals(data[0].get('type', None), "NUMBER")
        
    def test_ListQuestions_UserClient_Returns403(self):
        create_question(self.shelter_client, self.shelter.id)
        response = self.user_client.get(reverse('shelters:shelter-question-list-create', kwargs={'pk': self.shelter.id}))
        self.assertEquals(response.status_code, 403)

    def test_DeleteQuestion_OwnerOfAnotherShelter_Returns403(self):
        question_id = create_question(self.shelter_client, self.shelter.id)
        response = self.shelter_2_client.delete(reverse('shelters:shelter-question-update-delete',
                                                        kwargs={'pk': self.shelter.id, 'question_id': question_id}))
        self.assertEquals(response.status_code, 403)

    def test_DeleteQuestion_Owner_DeletesQuestion(self):
        question_id = create_question(self.shelter_client, self.shelter.id)
        response = self.shelter_client.delete(reverse('shelters:shelter-question-update-delete',
                                                      kwargs={'pk': self.shelter.id, 'question_id': question_id}))
        self.assertEquals(response.status_code, 204)
        with self.assertRaises(ShelterQuestion.DoesNotExist):
            ShelterQuestion.objects.get(id=question_id)

    def test_DeleteQuestion_UserClient_Returns403(self):
        question_id = create_question(self.shelter_client, self.shelter.id)
        response = self.user_client.delete(reverse('shelters:shelter-question-update-delete',
                                                   kwargs={'pk': self.shelter.id, 'question_id': question_id}))
        self.assertEquals(response.status_code, 403)


class AssignedQuestionTestCase(APITestCase):
    def setUp(self):
        owner_id = 'shelter_owner'
        create_user(owner_id, True)
        user = User.objects.get(username='shelter_owner')
        self.shelter_client = APIClient()
        self.shelter_client.force_authenticate(user)
        self.shelter = Shelter.objects.get(owner__username=owner_id)
        self.pet_listing = PetListing.objects.create(
            name='test listing',
            shelter=self.shelter,
            status='available',
            breed='breed',
            age=1
        )

    def test_AssignQuestion_OwnerClient_Success(self):
        question_id = create_question(self.shelter_client, self.shelter.id)
        request_body = {
            'question': question_id,
            'rank': 0,
            'required': False
        }
        response = self.shelter_client.post(reverse('shelters:assigned-question-list-create', kwargs={
            'pk': self.shelter.id,
            'listing_id': self.pet_listing.id
        }), request_body)
        self.assertEquals(response.status_code, 201)

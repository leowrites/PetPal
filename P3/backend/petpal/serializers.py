from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.serializers import serializers

class TokenObtainPairUserSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = serializers.UserProfileSerializer(self.user).data
        return data
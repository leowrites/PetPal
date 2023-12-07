from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS

class IsOwner(BasePermission):
    message = 'Forbidden Access'
    
    def has_object_permission(self, request, view, obj):
        return request.user == obj

class IsOwnerOrUserHasApplicationWithShelter(BasePermission):
    message = 'Forbidden Access'
    
    def has_object_permission(self, request, view, obj):
        # check if user is the current user
        if request.user == obj:
            return True
        
        # check if shelter has an application from the user
        if request.user.is_shelter:
            listings = request.user.shelter.listings.all()
            for listing in listings:
                if listing.applications.filter(applicant=obj).exists():
                    return True
                
        return False

class IsNotAuthenticated(BasePermission):
    message = 'You are already logged in'

    def has_permission(self, request, view):
        return not request.user.is_authenticated
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS


class IsAnyShelterOwner(BasePermission):
    message = 'You must be the owner of a shelter for this operation'

    def has_permission(self, request, view):
        return hasattr(request.user, 'shelter')


class IsShelterOwner(IsAnyShelterOwner, BasePermission):
    message = 'You must be the owner of this shelter for this operation'

    def has_object_permission(self, request, view, obj):
        return request.user.shelter == obj


class IsApplicationOwner(BasePermission):
    message = 'You must be the applicant of this application'

    def has_object_permission(self, request, view, obj):
        return request.user == obj.applicant


class IsApplicationListingOwner(BasePermission):
    message = 'You must be the owner of the listing associated with this application'

    def has_object_permission(self, request, view, obj):
        return request.user == obj.listing.shelter


class IsCreateOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method == 'POST'

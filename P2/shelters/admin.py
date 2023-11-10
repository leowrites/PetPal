from django.contrib import admin

# Register your models here.
import shelters.models as models

admin.site.register(models.Shelter)
admin.site.register(models.ShelterReview)
admin.site.register(models.PetApplication)
admin.site.register(models.PetListing)
admin.site.register(models.ApplicationResponse)
admin.site.register(models.ShelterQuestion)
admin.site.register(models.AssignedQuestion)
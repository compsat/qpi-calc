from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Restaurant)
admin.site.register(Review)
admin.site.register(CustomUser)
admin.site.register(Categories)
admin.site.register(WaitListEntry)
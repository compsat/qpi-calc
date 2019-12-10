from django.db import models
from django.contrib.auth.models import User,AbstractUser
import datetime
# Create your models here.



class Categories(models.Model):
    CatID = models.CharField(max_length = 30, verbose_name = 'Category ID', primary_key = True)
    CatName = models.CharField(max_length = 30, unique = True)
    # CatPic = models.FileField() #fix this later
    def __str__(self):
        return self.CatName

    


class CustomUser(AbstractUser):
    CUSTOMER = "CU"
    RESTAURANT_MANAGER = "RM"
    USER_TYPES = (
        (CUSTOMER,'Customer'),
        (RESTAURANT_MANAGER,'Restaurant Manager'),
    )
    user_type = models.CharField(
        max_length = 2,
        choices = USER_TYPES,
        default = CUSTOMER,
    )
    contact = models.CharField(
        max_length = 11,
        verbose_name = 'Contact Numbers',
        default = 'n/a'
    )
    def __str__(self):
        return self.username

class Restaurant (models.Model):
    WIFI = "WIFI"
    SOCKETS = "SCKT"
    AIRCON = "AIRC"
    RESTROOM = "REST"
    

    RestoID = models.CharField(max_length = 30, unique = True, primary_key = True, verbose_name = "Restaurant ID", default = "none")
    MngID = models.ForeignKey(CustomUser,on_delete= models.CASCADE, verbose_name = "Manager ID")
    Category = models.ManyToManyField(Categories,related_name='Restaurants',)
    Open_time = models.TimeField(verbose_name="Opening Time", null = True, default = "0:0")
    Closing_time = models.TimeField(verbose_name="Closing Time", default = "0:0", null = True)
    Address = models.CharField(max_length = 100, verbose_name = "Address", default = "none")
    Landline = models.CharField(max_length = 10, verbose_name = "Landline", default = "none")
    Contact = models.CharField(max_length = 11, verbose_name = 'Contact', default = "none")
	# Accommodations = models.CharField(max_length=300, default='not set')
	# Seating = models.CharField(max_length=50, default='not set')
    Rating = models.IntegerField(editable = True, default = 0)
    WaitTime1_4 = models.IntegerField(editable = True, default = 0)
    WaitTime5_8 = models.IntegerField(editable = True, default = 0)
    WaitTime9_12 = models.IntegerField(editable = True, default = 0)
    def __str__(self):
        return str(self.RestoID)
        
class Review(models.Model):
    ReviewID = models.CharField(max_length = 30, unique = True, primary_key = True, verbose_name = "ReviewID")
    RestoID = models.ForeignKey(Restaurant, on_delete = models.CASCADE)
    Rating = models.IntegerField(editable = True)
    ReviewDetail = models.CharField(max_length = 300, default = 'no Review')
    # ReviewedBy = models.CharField(max_length = 30, default = "Anonymous")
    def __str__(self):
        return str(self.Rating)



class WaitListEntry(models.Model):
    # EntryID = models.CharField(max_length = 40, unique = True, primary_key = True, verbose_name = "Entry ID")
    RestoID = models.ForeignKey(Restaurant, related_name="WaitListEntry", on_delete = models.CASCADE)
    # UserID = models.ForeignKey(CustomUser,related_name= "WaitListEntry", on_delete = models.CASCADE, null = True, default = None )
    first_name = models.CharField(verbose_name = "First Name", max_length = 30)
    last_name = models.CharField(verbose_name = "Last Name", max_length = 30)
    PaxCount = models.IntegerField(editable = True, default = 1)
    TimeIn = models.DateTimeField(auto_now_add=True, verbose_name="Time In",editable = True)
    TimeOut = models.DateTimeField(verbose_name="Time Out", null = True,auto_now=True, editable = True)
    Seated = models.BooleanField(verbose_name="Seated", default = False)
    WaitTime = models.IntegerField(editable = True, default = None, null = True)
    def __str__(self):
        return str(self.first_name)

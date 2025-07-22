from django.urls import path
from .admins import *
from .users import *


urlpatterns = [
    # Admin Routes
    path('admin/register/', register, name='admin_register'),
    path('admin/login/', login),
    path('admin/generate_event_description/',generate_event_description),
    path('admin/create_event/', create_event),
    path('admin/get_events/', get_events),

    #User Routes
    path('user/register/', user_register,),
    path('user/login/', user_login), 
]

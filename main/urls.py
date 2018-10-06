from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('planning', views.planning, name='planning'),
    path('plan', views.plan, name='plan'),
    path('schedule', views.schedule, name='schedule'),
]

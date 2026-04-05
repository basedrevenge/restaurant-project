from django.urls import path
from . import views

urlpatterns = [
    path('menu/', views.get_menu, name='menu'),
    path('reserve/', views.create_reservation, name='reserve'),
    path('reservations/', views.get_reservations, name='reservations'),
    path('reservations/<int:id>/', views.update_reservation_status, name='update_status'),
    path('reservations/<int:id>/delete/', views.delete_reservation, name='delete'),
]
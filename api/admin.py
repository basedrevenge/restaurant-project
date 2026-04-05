from django.contrib import admin
from .models import MenuItem, Reservation

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'price')
    search_fields = ('title',)

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'date', 'people', 'status')
    list_filter = ('status', 'date')
    search_fields = ('name', 'phone')
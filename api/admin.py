from django.contrib import admin
from .models import User, Reservation, FavoriteDish, MenuItem, Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_name', 'rating', 'text', 'created_at', 'is_approved']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['text', 'author_name', 'user__username']
    actions = ['approve_reviews']
    
    def user_name(self, obj):
        return obj.author_name or (obj.user.username if obj.user else 'Гость')
    user_name.short_description = 'Автор'
    
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f'Одобрено {queryset.count()} отзывов')
    approve_reviews.short_description = 'Одобрить отзывы'

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'phone', 'loyalty_points', 'loyalty_tier']
    list_display_links = ['id', 'username']
    search_fields = ['username', 'email', 'phone']
    list_filter = ['loyalty_tier', 'is_active']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'date', 'time', 'guests', 'table_type', 'status']
    list_filter = ['status', 'table_type', 'date']
    search_fields = ['user__username']
    actions = ['confirm_and_add_points']
    
    def confirm_and_add_points(self, request, queryset):
        for reservation in queryset:
            if reservation.status != 'CONFIRMED':
                reservation.status = 'CONFIRMED'
                reservation.save()
                
                user = reservation.user
                user.loyalty_points += 100
                
                if user.loyalty_points >= 5000:
                    user.loyalty_tier = 'PLATINUM'
                elif user.loyalty_points >= 2000:
                    user.loyalty_tier = 'GOLD'
                elif user.loyalty_points >= 500:
                    user.loyalty_tier = 'SILVER'
                else:
                    user.loyalty_tier = 'BRONZE'
                user.save()
        
        self.message_user(request, f'Подтверждено {queryset.count()} бронирований, начислено по 100 баллов')
    confirm_and_add_points.short_description = 'Подтвердить и начислить баллы'


@admin.register(FavoriteDish)
class FavoriteDishAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'dish_name', 'dish_price', 'created_at']
    search_fields = ['user__username', 'dish_name']


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'category']
    search_fields = ['name']
    list_filter = ['category']


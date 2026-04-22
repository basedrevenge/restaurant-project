from rest_framework import serializers
from .models import User, Reservation, FavoriteDish, MenuItem, Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'avatar', 'loyalty_points', 'loyalty_tier']

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class FavoriteDishSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteDish
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'author_name', 'rating', 'text', 'created_at', 'is_approved']
        read_only_fields = ['created_at', 'is_approved']
    
    def get_user_name(self, obj):
        if obj.author_name:
            return obj.author_name
        return obj.user.username if obj.user else 'Гость'
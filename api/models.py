from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    loyalty_points = models.IntegerField(default=0)
    loyalty_tier = models.CharField(
        max_length=20,
        choices=[
            ('BRONZE', 'Бронзовый'),
            ('SILVER', 'Серебряный'),
            ('GOLD', 'Золотой'),
            ('PLATINUM', 'Платиновый'),
        ],
        default='BRONZE'
    )
    preferences = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return self.username

class Reservation(models.Model):
    TABLE_TYPES = [
        ('MAIN', 'Основной зал'),
        ('VIP', 'VIP зал'),
        ('TERRACE', 'Терраса'),
        ('WINDOW', 'У окна'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Ожидание'),
        ('CONFIRMED', 'Подтверждено'),
        ('CANCELLED', 'Отменено'),
        ('COMPLETED', 'Завершено'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations', null=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    guests = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    table_type = models.CharField(max_length=20, choices=TABLE_TYPES, default='MAIN')
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        username = self.user.username if self.user else 'Гость'
        return f"{username} - {self.date} {self.time}"


class FavoriteDish(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    dish_id = models.IntegerField()
    dish_name = models.CharField(max_length=200)
    dish_price = models.DecimalField(max_digits=10, decimal_places=2)
    dish_image = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'dish_id']
    
    def __str__(self):
        return f"{self.user.username} - {self.dish_name}"

    
class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('pizza', 'Пиццы'),
        ('soup', 'Супы'),
        ('salad', 'Салаты'),
        ('drinks', 'Напитки'),
        ('desserts', 'Десерты'),
    ]
    
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.CharField(max_length=500)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='pizza')
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    author_name = models.CharField(max_length=100, blank=True)
    rating = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], default=5)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    
    def __str__(self):
        name = self.author_name or (self.user.username if self.user else 'Гость')
        return f"{name} - {self.rating}★"
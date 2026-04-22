from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password, check_password
from .models import User, Reservation, FavoriteDish, MenuItem, Review
from .serializers import UserSerializer, ReservationSerializer, FavoriteDishSerializer, MenuItemSerializer, ReviewSerializer


@api_view(['POST'])
def change_password(request):
    user = request.user
    data = request.data
    
    if not check_password(data['old_password'], user.password):
        return Response({'error': 'Неверный текущий пароль'}, status=400)
    
    if data['new_password'] != data['confirm_password']:
        return Response({'error': 'Новые пароли не совпадают'}, status=400)
    
    user.password = make_password(data['new_password'])
    user.save()
    return Response({'message': 'Пароль успешно изменен'})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get', 'patch'])
    def profile(self, request):
        if request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        return Response(self.get_serializer(request.user).data)


class FavoriteDishViewSet(viewsets.ModelViewSet):
    queryset = FavoriteDish.objects.all()
    serializer_class = FavoriteDishSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FavoriteDish.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_approved=True).order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()


# ЕДИНСТВЕННЫЙ КЛАСС ReservationViewSet (исправленный)
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]  # Разрешаем гостям
    
    def get_queryset(self):
        # Если пользователь авторизован - показываем его брони
        if self.request.user.is_authenticated:
            return Reservation.objects.filter(user=self.request.user)
        # Для гостей - пустой список
        return Reservation.objects.none()
    
    def perform_create(self, serializer):
        # Если пользователь авторизован - привязываем к нему
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            # Для гостя - сохраняем без пользователя
            serializer.save(user=None)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        reservation = self.get_object()
        reservation.status = 'CONFIRMED'
        reservation.save()
        
        user = reservation.user
        if user:  # Только если есть пользователь
            user.loyalty_points += 100
            user.save()
            
            if user.loyalty_points >= 5000:
                user.loyalty_tier = 'PLATINUM'
            elif user.loyalty_points >= 2000:
                user.loyalty_tier = 'GOLD'
            elif user.loyalty_points >= 500:
                user.loyalty_tier = 'SILVER'
            else:
                user.loyalty_tier = 'BRONZE'
            user.save()
        
        return Response({'status': 'confirmed', 'points_added': 100 if user else 0})


@api_view(['POST'])
def register_user(request):
    data = request.data
    user = User.objects.create(
        username=data['username'],
        email=data['email'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        phone=data.get('phone', ''),
        password=make_password(data['password'])
    )
    return Response(UserSerializer(user).data, status=201)
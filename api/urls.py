from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register('users', views.UserViewSet)
router.register('reservations', views.ReservationViewSet)
router.register('favorites', views.FavoriteDishViewSet)
router.register('menu', views.MenuItemViewSet)
router.register('reviews', views.ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.register_user, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', views.change_password, name='change_password'),
]
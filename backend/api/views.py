from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import MenuItem, Reservation
from .serializers import MenuItemSerializer, ReservationSerializer

@api_view(['GET'])
def get_menu(request):
    items = MenuItem.objects.all()
    serializer = MenuItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_reservation(request):
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Бронь успешно создана',
            'reservation': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_reservations(request):
    reservations = Reservation.objects.all().order_by('-date')
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
def update_reservation_status(request, id):
    try:
        reservation = Reservation.objects.get(id=id)
    except Reservation.DoesNotExist:
        return Response({'error': 'Бронь не найдена'}, status=status.HTTP_404_NOT_FOUND)
    
    status_value = request.data.get('status')
    if status_value not in ['pending', 'confirmed', 'cancelled']:
        return Response({'error': 'Неверный статус'}, status=status.HTTP_400_BAD_REQUEST)
    
    reservation.status = status_value
    reservation.save()
    return Response({'message': 'Статус обновлен', 'status': reservation.status})

@api_view(['DELETE'])
def delete_reservation(request, id):
    try:
        reservation = Reservation.objects.get(id=id)
    except Reservation.DoesNotExist:
        return Response({'error': 'Бронь не найдена'}, status=status.HTTP_404_NOT_FOUND)
    
    reservation.delete()
    return Response({'message': 'Бронь удалена'})
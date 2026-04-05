import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import MenuItem

MenuItem.objects.all().delete()

items = [
    {'title': 'Гамбургер Макси', 'description': 'Толстый слой мяса', 'price': 420},
    {'title': 'Пицца Маргарита', 'description': 'Классическая итальянская', 'price': 550},
    {'title': 'Салат Цезарь', 'description': 'Свежие овощи и курица', 'price': 300},
]

for item in items:
    MenuItem.objects.create(**item)

print('Меню загружено')
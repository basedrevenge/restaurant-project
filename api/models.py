from django.db import models

class MenuItem(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.IntegerField()

    def __str__(self):
        return self.title

class Reservation(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    date = models.DateTimeField()
    people = models.IntegerField()
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.date}"
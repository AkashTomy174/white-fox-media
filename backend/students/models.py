from django.db import models
from django.utils import timezone


class Student(models.Model):
    ACTIVE = "active"
    INACTIVE = "inactive"
    STATUS_CHOICES = [
        (ACTIVE, "Active"),
        (INACTIVE, "Inactive"),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    grade = models.CharField(max_length=50)
    address = models.TextField()
    enrollment_date = models.DateField(default=timezone.localdate)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-enrollment_date", "-created_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

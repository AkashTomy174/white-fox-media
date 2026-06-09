import re

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from students.models import Student


NAME_PATTERN = re.compile(r"^[a-zA-Z\s'.\-]+$")
PHONE_PATTERN = re.compile(r"^\d{10}$")


def validate_person_name(value, field_label, min_length=2):
    name = value.strip()
    message = (
        f"{field_label} must be at least {min_length} characters and contain only letters."
        if min_length > 1
        else f"{field_label} must contain only letters."
    )
    if len(name) < min_length or not NAME_PATTERN.fullmatch(name):
        raise serializers.ValidationError(message)
    return name


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "date_of_birth",
            "grade",
            "address",
            "enrollment_date",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "enrollment_date", "created_at", "updated_at"]
        extra_kwargs = {
            "first_name": {
                "required": True,
                "allow_blank": False,
                "error_messages": {
                    "required": "First name must be at least 2 characters and contain only letters.",
                    "blank": "First name must be at least 2 characters and contain only letters.",
                },
            },
            "last_name": {
                "required": True,
                "allow_blank": False,
                "error_messages": {
                    "required": "Last name must contain only letters.",
                    "blank": "Last name must contain only letters.",
                },
            },
            "email": {
                "required": True,
                "allow_blank": False,
                "validators": [],
                "error_messages": {
                    "required": "Please enter a valid email address.",
                    "blank": "Please enter a valid email address.",
                    "invalid": "Please enter a valid email address.",
                },
            },
            "phone": {
                "required": True,
                "allow_blank": False,
                "error_messages": {
                    "required": "Phone number must be exactly 10 digits.",
                    "blank": "Phone number must be exactly 10 digits.",
                },
            },
            "date_of_birth": {
                "required": True,
                "error_messages": {
                    "required": "Date of birth must be a valid past date.",
                    "invalid": "Date of birth must be a valid past date.",
                },
            },
            "grade": {
                "required": True,
                "allow_blank": False,
                "error_messages": {
                    "required": "Grade is required.",
                    "blank": "Grade is required.",
                },
            },
            "address": {
                "required": True,
                "allow_blank": False,
                "error_messages": {
                    "required": "Address must be at least 10 characters.",
                    "blank": "Address must be at least 10 characters.",
                },
            },
            "status": {
                "required": True,
                "error_messages": {
                    "required": "Status must be active or inactive.",
                    "invalid_choice": "Status must be active or inactive.",
                },
            },
        }

    def validate_first_name(self, value):
        return validate_person_name(value, "First name")

    def validate_last_name(self, value):
        return validate_person_name(value, "Last name", min_length=1)

    def validate_phone(self, value):
        phone = value.strip()
        if not PHONE_PATTERN.fullmatch(phone):
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return phone

    def validate_date_of_birth(self, value):
        today = timezone.localdate()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if value >= today or age < 3 or age > 100:
            raise serializers.ValidationError("Date of birth must be a valid past date.")
        return value

    def validate_address(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Address must be at least 10 characters.")
        return value.strip()

    def validate_email(self, value):
        queryset = Student.objects.filter(email__iexact=value.strip())
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A student with this email already exists.")
        return value.strip().lower()

    def validate_status(self, value):
        if value not in {Student.ACTIVE, Student.INACTIVE}:
            raise serializers.ValidationError("Status must be active or inactive.")
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = get_user_model().USERNAME_FIELD

    def validate(self, attrs):
        username = attrs.get(self.username_field)
        if username and "@" in username:
            User = get_user_model()
            user = User.objects.filter(email__iexact=username).first()
            if user:
                attrs[self.username_field] = user.get_username()

        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.get_username(),
            "email": self.user.email,
        }
        return data

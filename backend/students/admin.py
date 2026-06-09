from django.contrib import admin

from students.models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "email",
        "grade",
        "status",
        "enrollment_date",
    )
    list_filter = ("status", "grade")
    search_fields = ("first_name", "last_name", "email")

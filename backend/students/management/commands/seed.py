from datetime import date
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from students.models import Student


class Command(BaseCommand):
    help = "Seed the database with an admin user and sample students."

    def handle(self, *args, **options):
        User = get_user_model()
        admin_username = os.environ.get("ADMIN_USERNAME", "admin")
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
        admin_password = os.environ.get("ADMIN_PASSWORD")
        reset_password = os.environ.get("ADMIN_RESET_PASSWORD", "False").lower() == "true"

        admin, created = User.objects.get_or_create(
            username=admin_username,
            defaults={"email": admin_email, "is_staff": True, "is_superuser": True},
        )
        admin.is_staff = True
        admin.is_superuser = True
        admin.email = admin_email

        if created and not admin_password:
            raise CommandError("ADMIN_PASSWORD is required when creating the admin user.")

        if admin_password and (created or reset_password):
            admin.set_password(admin_password)

        admin.save()

        students = [
            ("Aarav", "Sharma", "aarav.sharma@example.com", "9876543210", "Grade 10", "12 Park Street, New Delhi", "active", date(2009, 4, 12)),
            ("Diya", "Patel", "diya.patel@example.com", "9876543211", "Grade 9", "44 Lake View Road, Ahmedabad", "active", date(2010, 8, 21)),
            ("Kabir", "Singh", "kabir.singh@example.com", "9876543212", "Grade 11", "8 Green Colony, Jaipur", "inactive", date(2008, 1, 15)),
            ("Anaya", "Mehta", "anaya.mehta@example.com", "9876543213", "Grade 8", "23 Rose Avenue, Mumbai", "active", date(2011, 6, 5)),
            ("Rohan", "Iyer", "rohan.iyer@example.com", "9876543214", "Grade 12", "91 Temple Road, Chennai", "active", date(2007, 10, 9)),
            ("Mira", "Rao", "mira.rao@example.com", "9876543215", "Grade 10", "17 Sunrise Layout, Bengaluru", "inactive", date(2009, 3, 18)),
            ("Vivaan", "Kapoor", "vivaan.kapoor@example.com", "9876543216", "Grade 7", "60 Hill Road, Pune", "active", date(2012, 12, 2)),
            ("Saanvi", "Gupta", "saanvi.gupta@example.com", "9876543217", "Grade 9", "31 Garden Lane, Lucknow", "active", date(2010, 5, 30)),
            ("Arjun", "Nair", "arjun.nair@example.com", "9876543218", "Grade 11", "6 Pearl Street, Kochi", "inactive", date(2008, 7, 14)),
            ("Isha", "Verma", "isha.verma@example.com", "9876543219", "Grade 8", "73 Central Avenue, Bhopal", "active", date(2011, 11, 23)),
        ]

        for first_name, last_name, email, phone, grade, address, status, dob in students:
            Student.objects.update_or_create(
                email=email,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "phone": phone,
                    "date_of_birth": dob,
                    "grade": grade,
                    "address": address,
                    "status": status,
                },
            )

        user_status = "created" if created else "already exists"
        self.stdout.write(self.style.SUCCESS(f"Admin user {user_status}: {admin_username}"))
        self.stdout.write(self.style.SUCCESS("Seeded 10 sample students."))

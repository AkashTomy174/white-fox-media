from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from students.models import Student
from students.serializers import CustomTokenObtainPairSerializer, StudentSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "data": response.data,
            },
            status=status.HTTP_200_OK,
        )


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Student.objects.all()
        search = self.request.query_params.get("search")
        status_filter = self.request.query_params.get("status")
        grade_filter = self.request.query_params.get("grade")
        

        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
            )

        if status_filter in {Student.ACTIVE, Student.INACTIVE}:
            queryset = queryset.filter(status=status_filter)

        if grade_filter:
            queryset = queryset.filter(grade__iexact=grade_filter)
            page=self.paginate_queryset(queryset)
            
            if page is not None:
                self.serializer=self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "success": True,
                "message": "Students retrieved successfully.",
                "data": serializer.data,
            }
        )

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response(
            {
                "success": True,
                "message": "Student retrieved successfully.",
                "data": serializer.data,
            }
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                "success": True,
                "message": "Student created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                "success": True,
                "message": "Student updated successfully.",
                "data": serializer.data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "success": True,
                "message": "Student deleted successfully.",
                "data": {},
            },
            status=status.HTTP_200_OK,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    recent = Student.objects.order_by("-enrollment_date", "-created_at")[:5]
    return Response(
        {
            "success": True,
            "message": "Dashboard statistics retrieved successfully.",
            "data": {
                "total_students": Student.objects.count(),
                "active_students": Student.objects.filter(status=Student.ACTIVE).count(),
                "inactive_students": Student.objects.filter(
                    status=Student.INACTIVE
                ).count(),
                "recent_enrollments": StudentSerializer(recent, many=True).data,
            },
        }
    )

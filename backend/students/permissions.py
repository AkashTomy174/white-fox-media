from rest_framework.permissions import IsAuthenticated


class IsAuthenticatedUser(IsAuthenticated):
    message = "A valid JWT Bearer token is required."

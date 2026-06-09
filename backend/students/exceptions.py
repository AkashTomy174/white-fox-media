from django.http import Http404
from rest_framework import exceptions, status
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, Http404):
        return _error_response(
            status.HTTP_404_NOT_FOUND,
            "The requested resource was not found.",
        )

    if response is None:
        return response

    message = "An error occurred."
    if isinstance(exc, exceptions.NotAuthenticated):
        message = "Authentication credentials were not provided."
    elif isinstance(exc, exceptions.AuthenticationFailed):
        message = "Invalid authentication credentials."
    elif isinstance(exc, exceptions.NotFound):
        message = "The requested resource was not found."
    elif isinstance(exc, exceptions.ValidationError):
        message = "Validation failed."
    elif isinstance(response.data, dict):
        detail = response.data.get("detail")
        if detail:
            message = str(detail)

    response.data = {
        "success": False,
        "message": message,
        "errors": response.data,
    }
    return response


def _error_response(status_code, message):
    from rest_framework.response import Response

    return Response(
        {"success": False, "message": message, "errors": {}},
        status=status_code,
    )

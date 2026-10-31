import json
from django.contrib.auth import authenticate, login as django_login
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .serializers import RegisterSerializer


@method_decorator(csrf_protect, name="dispatch")
class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "Account created successfully!",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                }
            },
            status=status.HTTP_201_CREATED
        )

@require_GET
@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({
        "csrfToken": get_token(request)
    })
    
@require_POST
@csrf_protect
def login_view(request):

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({
            "error": "Invalid JSON request."
        }, status=400)

    if not isinstance(data, dict):
        return JsonResponse({
            "error": "Invalid request data."
        }, status=400)

    email = data.get("email", "")
    password = data.get("password", "")

    if (
        not isinstance(email, str)
        or not isinstance(password, str)
        or not email.strip()
        or not password
    ):
        return JsonResponse({
            "error": "Email and password are required."
        }, status=400)

    user = authenticate(
        request,
        username=email.strip().lower(),
        password=password
    )

    if user is None:
        return JsonResponse({
            "error": "Invalid email or password."
        }, status=401)

    django_login(request, user)

    return JsonResponse({
        "message": "Login successful!",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    })

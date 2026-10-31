
from django.urls import path
from .views import RegisterView, csrf_token_view, login_view

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('csrf/', csrf_token_view, name='csrf'),
    path('login/', login_view, name='login'),
]

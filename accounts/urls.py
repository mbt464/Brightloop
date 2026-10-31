
from django.urls import path
from .views import RegisterView, csrf_token_view, login_view, session_view, logout_view

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('csrf/', csrf_token_view, name='csrf'),
    path('login/', login_view, name='login'),
    path('session/', session_view, name='session'),
    path('logout/', logout_view, name='logout'),
]

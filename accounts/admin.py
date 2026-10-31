
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        'email',
        'role',
        'is_active',
        'is_staff',
        'is_superuser',
    )

    list_filter = (
        'role',
        'is_active',
        'is_staff',
    )

    search_fields = ('email',)
    ordering = ('email',)

    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name')
        }),
        ('Account Role', {
            'fields': ('role',)
        }),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            )
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'password1',
                'password2',
                'role',
                'is_active',
                'is_staff',
            ),
        }),
    )


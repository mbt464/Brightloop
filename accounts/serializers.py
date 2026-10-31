
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import User


class RegisterSerializer(serializers.Serializer):

    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        min_length=9,
        trim_whitespace=False
    )

    def validate_email(self, value):
        email = value.strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return email

    def validate(self, data):
        password = data["password"]

        if not any(char.isupper() for char in password):
            raise serializers.ValidationError({
                "password": "Include at least one uppercase letter."
            })

        if not any(char.islower() for char in password):
            raise serializers.ValidationError({
                "password": "Include at least one lowercase letter."
            })

        if not any(
            not char.isalnum() and not char.isspace()
            for char in password
        ):
            raise serializers.ValidationError({
                "password": "Include at least one special character."
            })

        first_name, _, last_name = data["full_name"].strip().partition(" ")

        user = User(
            email=data["email"],
            first_name=first_name,
            last_name=last_name
        )

        try:
            validate_password(password, user=user)
        except ValidationError as error:
            raise serializers.ValidationError({
                "password": error.messages
            })

        return data

    def create(self, validated_data):
        full_name = validated_data["full_name"].strip()

        first_name, _, last_name = full_name.partition(" ")

        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=first_name,
            last_name=last_name,
            role=User.Role.CUSTOMER,
            is_staff=False,
            is_superuser=False
        )

        return user

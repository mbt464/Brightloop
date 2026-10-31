
# Stage 1: Build React
FROM node:24-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build -- --base=/static/


# Stage 2: Set up Django
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy the completed React build
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Collect static assets using a temporary build-only key
RUN DJANGO_SECRET_KEY=temporary-build-only-key \
    DJANGO_DEBUG=False \
    python manage.py collectstatic --noinput

EXPOSE 10000

CMD ["sh", "-c", "exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-10000}"]

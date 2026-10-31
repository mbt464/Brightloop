
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render, redirect
from django.views.generic import TemplateView



def workspace_page(request, role):
    if not request.user.is_authenticated:
        return redirect('/')
    if role != request.user.role:
        return redirect(f'/workspace/{request.user.role}/')
    return render(request, 'index.html')


urlpatterns = [
    path('workspace/admin/', workspace_page, {'role': 'admin'}, name='admin-workspace'),
    path('workspace/staff/', workspace_page, {'role': 'staff'}, name='staff-workspace'),
    path('workspace/customer/', workspace_page, {'role': 'customer'}, name='customer-workspace'),

    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),

    # React homepage
    path('', TemplateView.as_view(
        template_name='index.html'
    ), name='home'),
]


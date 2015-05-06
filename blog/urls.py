from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.ListPost),
    url(r'^read/(\w+)/$', views.ReadPost), #--- SEO optimized: title in the URI
]

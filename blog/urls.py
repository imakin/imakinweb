from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.ListPost),
    url(r'^read/(?P<permalink>.+)/(?P<tipe>[CScs]{0,1})$', views.ReadPost), #--- SEO optimized: title in the URI, 
    url(r'^read/(?P<permalink>.+)/(?P<tipe>[CScs]{0,1})/$', views.ReadPost), #--- SEO optimized: title in the URI, 
													#--- +type  for security only accept C,c,S,s
]

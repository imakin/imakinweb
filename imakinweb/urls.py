from django.conf.urls import include, url
from django.contrib import admin
import os

#-- python 3.4 :( 
#~ BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#~ f = open(BASE_DIR+'/blog/views.py')
#~ v = f.read()
#~ f.close()
#~ eval(v)

urlpatterns = [
    # Examples:
    # url(r'^$', 'imakinweb.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('blog.urls')),
]

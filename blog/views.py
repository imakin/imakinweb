from django.shortcuts import render,get_object_or_404

from django.utils import timezone
from .models import Post

import os#-- listdir
import re #-- regex
from datetime import date#-- file date

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Create your views here.
def ListPost(request):
    def _SQLite():
        #~ return Post.objects.all().order_by('date_published')
        return Post.objects.all().order_by('-date_published')

    def _Custom():
        """ ambil blog yg ada """
        files = os.listdir(os.path.join(BASE_DIR,'blog','templates','customblog'))#-- this is custom blog dir
        blogsdata = re.compile("(\w*).html").findall(str(files))
        blogsrange = range(len(blogsdata))
        blogs = []
        for x in range(len(blogsdata)):
            modified = os.path.getmtime(os.path.join(BASE_DIR,'blog','templates','customblog',blogsdata[x]+".html"))
            modified = date.fromtimestamp(modified)
            blogs.append(   (blogsdata[x],blogsdata[x].replace("_"," "), modified)    )
        return blogs

    # -- get all in sort


    return render(request, 'listpost.html', {'posts_sqlite':_SQLite(), 'posts_custom':_Custom(), 'ok':330})

def ReadPost(request, permalink,tipe):
    """ tipe is either S for SQLite or C for custom """
    #-- security
    if (permalink.find(r'/')>=0):
        return 0
    if (tipe=='C'):
        return render(request, os.path.join('customblog',permalink+'.html'), {})
    else:
        blogdata = get_object_or_404(Post,url=permalink) #kondisi: url==permalink
        return render(request, 'read.html',{'data':permalink,'blog':blogdata})

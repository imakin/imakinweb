from django.shortcuts import render,get_object_or_404

from django.utils import timezone
from .models import Post
from .models import MyCloudData

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

def cloud_data_process(request, password, action, data_name, data_value="defaultvalue"):
    data = ""
    if (password!="oijmcs2038udsjkn0283udsoij201i29i2i9i"):
        return 0
    if (action=="read"):
        try:
            data = MyCloudData.objects.get(name=data_name).value
        except MyCloudData.DoesNotExist:
            data = ""
    elif(action=="write"):
        new_data = None
        try:
            new_data = MyCloudData.objects.get(name=data_name)
            new_data.value = data_value
        except MyCloudData.DoesNotExist:
            new_data = MyCloudData.objects.create(name=data_name, value=data_value)
        new_data.save()
        data = data_value
    return render(request, 'blank.html', {'data':data})
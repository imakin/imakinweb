from django.shortcuts import render

from django.utils import timezone
from .models import Post

import os#-- listdir
import re #-- regex

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Create your views here.
def ListPost(request):
	def _SQLite():
		return Post.objects.all().order_by('date_published')
		
	def _Custom():
		""" ambil blog yg ada """
		files = os.listdir(BASE_DIR+'/blog/customblog')#-- this is custom blog dir
		blogsdata = re.compile("(\w*).html").findall(str(files))
		blogsrange = range(len(blogsdata))
		blogs = [blogsdata, blogsrange]
		return blogsdata
	
	return render(request, 'posts.html', {'posts_sqlite':_SQLite(), 'posts_custom':_Custom(), 'ok':330})

def ReadPost(request, pageid):
	""" Pageid has leading byte which value is either C or S, C for custom written blog, S for SQLite saved blog"""
	#-- security
	if (pageid.find(r'/')>=0) or (pageid[0]=='.'):
		return 0
	if (pageid[0]=='C'):
		return render(request, 'customblog/'+pageid[1:]+'.html', {})
	else:
		return render(request, 'read.html',{'data':pageid})

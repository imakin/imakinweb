from django.shortcuts import render

from django.utils import timezone
from .models import Post

# Create your views here.
def fposts(request):
	#~ postpost = Post.objects.filter(date_published__lte=timezone.now()).order_by('date_published')
	postpost = Post.objects.all()
	return render(request, 'posts.html', {'postpost':postpost, 'ok':330})

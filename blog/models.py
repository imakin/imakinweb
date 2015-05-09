from django.db import models
from django.utils import timezone #-- wektu

class Post(models.Model):
	author = models.ForeignKey('auth.User',null=True)
	title = models.CharField(max_length=200)
	excerpt = models.TextField(null=True)
	text = models.TextField(null=True)
	score = models.IntegerField(default=0)
	url = models.CharField(max_length=150,null=True)
	
	date_created = models.DateTimeField(default=timezone.now)
	date_published = models.DateTimeField(blank=True, null=True)
	
	def publish(self):
		date_published = timezone.now()
		self.save()
		
	def __str__(self):
		return self.title

class Comment(models.Model):
	author = models.CharField(max_length=80)
	text = models.TextField()
	date_created = models.DateTimeField(default=timezone.now)
	post = models.ForeignKey('Post')
	
	def publish(self):
		self.save()
	
	def __str__(self):
		return self.author+self.text[:10]

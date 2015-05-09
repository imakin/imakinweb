# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_post_excerpt'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('author', models.CharField(max_length=80)),
                ('text', models.TextField()),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.AddField(
            model_name='post',
            name='score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='comments',
            name='post',
            field=models.ForeignKey(to='blog.Post'),
        ),
    ]

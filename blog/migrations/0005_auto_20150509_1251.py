# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_auto_20150429_2108'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='url',
            field=models.CharField(max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='text',
            field=models.TextField(null=True),
        ),
    ]

# Generated by Django 2.2.3 on 2020-04-28 21:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [('interests', '0015_shortterminterest_used_in_calc')]

    operations = [
        migrations.RenameField(model_name='longterminterest',
                               old_name='paper',
                               new_name='papers'),
        migrations.RenameField(model_name='longterminterest',
                               old_name='tweet',
                               new_name='tweets'),
    ]

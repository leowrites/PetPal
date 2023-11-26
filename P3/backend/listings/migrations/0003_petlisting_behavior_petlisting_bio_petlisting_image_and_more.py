# Generated by Django 4.2.7 on 2023-11-26 22:52

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='petlisting',
            name='behavior',
            field=models.TextField(default='aaa'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='petlisting',
            name='bio',
            field=models.TextField(default='aaa'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='petlisting',
            name='image',
            field=models.ImageField(default='aaa', upload_to='listings/'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='petlisting',
            name='listed_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='petlisting',
            name='medical_history',
            field=models.TextField(default='aaa'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='petlisting',
            name='other_notes',
            field=models.TextField(default='aaa'),
            preserve_default=False,
        ),
    ]

# Generated by Django 4.2.7 on 2023-11-15 20:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('listings', '0001_initial'),
        ('shelters', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='petlisting',
            name='shelter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listings', to='shelters.shelter'),
        ),
    ]
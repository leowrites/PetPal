# Generated by Django 4.2.7 on 2023-11-15 12:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification_type', models.CharField(choices=[('applicationMessage', 'New Application Message'), ('applicationSatusChange', 'Application Status Change'), ('petListing', 'New Pet Listing'), ('application', 'New Application'), ('review', 'New Review')], max_length=30)),
                ('associated_model_id', models.PositiveIntegerField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('read', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='NotificationPreferences',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('application_message', models.BooleanField(default=True)),
                ('application_status_change', models.BooleanField(default=True)),
                ('pet_listing', models.BooleanField(default=True)),
                ('application', models.BooleanField(default=True)),
                ('review', models.BooleanField(default=True)),
            ],
        ),
    ]

# Generated by Django 4.2 on 2023-11-14 09:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ApplicationComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ApplicationResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.CharField(max_length=3000)),
            ],
        ),
        migrations.CreateModel(
            name='AssignedQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rank', models.PositiveSmallIntegerField(blank=True, default=0)),
                ('required', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='PetApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('denied', 'Denied'), ('withdrawn', 'Withdrawn'), ('approved', 'Approved')], default='pending', max_length=15)),
                ('application_time', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='PetListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('status', models.CharField(choices=[('available', 'Available'), ('not_available', 'Not Available')], default='available', max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='Shelter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shelter_name', models.CharField(default='', max_length=200)),
                ('contact_email', models.EmailField(default='temp@temporaryfix.com', max_length=254)),
                ('location', models.CharField(default='tempLocation', max_length=200)),
                ('mission_statement', models.TextField(default='tempMissionStatement')),
            ],
        ),
        migrations.CreateModel(
            name='ShelterQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=1000)),
                ('type', models.CharField(choices=[('FILE', 'File'), ('CHECKBOX', 'Checkbox'), ('DATE', 'Date'), ('EMAIL', 'Email'), ('TEXT', 'Text'), ('NUMBER', 'Number')], default='TEXT', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ShelterReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])),
                ('text', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('shelter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='shelters.shelter')),
            ],
        ),
    ]

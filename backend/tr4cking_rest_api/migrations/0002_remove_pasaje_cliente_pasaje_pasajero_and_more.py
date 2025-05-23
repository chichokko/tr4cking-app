# Generated by Django 5.1.7 on 2025-05-20 22:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tr4cking_rest_api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pasaje',
            name='cliente',
        ),
        migrations.AddField(
            model_name='pasaje',
            name='pasajero',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='tr4cking_rest_api.pasajero'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='CabeceraReserva',
            fields=[
                ('id_reserva', models.BigAutoField(primary_key=True, serialize=False)),
                ('fecha_reserva', models.DateTimeField(auto_now_add=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tr4cking_rest_api.cliente')),
            ],
        ),
        migrations.CreateModel(
            name='DetalleReserva',
            fields=[
                ('id_detalle', models.BigAutoField(primary_key=True, serialize=False)),
                ('pasaje', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='tr4cking_rest_api.pasaje')),
                ('reserva', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tr4cking_rest_api.cabecerareserva')),
            ],
        ),
    ]

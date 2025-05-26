from django.core.management.base import BaseCommand
from tr4cking_rest_api.models import (
    Persona, Cliente, Localidad, Parada, 
    Empresa, Bus, Viaje, Ruta, DetalleRuta
)
from django.contrib.auth.models import Group
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creando datos de prueba...')

        # Crear empresas
        empresas_data = [
            {
                'nombre': 'NSA Transportes',
                'ruc': '8000123-0',
                'telefono': '021555123',
                'email': 'nsa@example.com',
                'direccion_legal': 'Avda. Artigas 1234'
            },
            {
                'nombre': 'Nuestra Señora de la Asunción',
                'ruc': '8000456-0',
                'telefono': '021555456',
                'email': 'nsa2@example.com',
                'direccion_legal': 'Avda. Mcal. López 2345'
            },
        ]
        empresas = []
        for data in empresas_data:
            empresa, created = Empresa.objects.get_or_create(
                ruc=data['ruc'],
                defaults=data
            )
            empresas.append(empresa)
        self.stdout.write(self.style.SUCCESS(f'Creadas {len(empresas)} empresas'))

        # Crear localidades
        localidades_data = [
            {'nombre': 'Asunción', 'coordenadas': -25.2867},
            {'nombre': 'Ciudad del Este', 'coordenadas': -25.5167},
            {'nombre': 'Encarnación', 'coordenadas': -27.3333},
            {'nombre': 'Coronel Oviedo', 'coordenadas': -25.4444},
            {'nombre': 'Villarrica', 'coordenadas': -25.7500},
        ]
        localidades = []
        for data in localidades_data:
            localidad, created = Localidad.objects.get_or_create(
                nombre=data['nombre'],
                defaults=data
            )
            localidades.append(localidad)
        self.stdout.write(self.style.SUCCESS(f'Creadas {len(localidades)} localidades'))

        # Crear paradas para cada localidad
        paradas = []
        for localidad in localidades:
            paradas_localidad = [
                {
                    'localidad': localidad,
                    'nombre': f'Terminal de Ómnibus {localidad.nombre}',
                    'direccion': f'Terminal {localidad.nombre}',
                    'coordenadas': localidad.coordenadas
                },
                {
                    'localidad': localidad,
                    'nombre': f'Parada Centro {localidad.nombre}',
                    'direccion': f'Centro {localidad.nombre}',
                    'coordenadas': localidad.coordenadas + 0.01
                }
            ]
            for data in paradas_localidad:
                parada, created = Parada.objects.get_or_create(
                    nombre=data['nombre'],
                    localidad=data['localidad'],
                    defaults=data
                )
                paradas.append(parada)
        self.stdout.write(self.style.SUCCESS(f'Creadas {len(paradas)} paradas'))

        # Crear buses para cada empresa
        buses = []
        placas_base = ['ABC', 'XYZ', 'DEF']
        for i, empresa in enumerate(empresas):
            for j in range(3):
                placa = f'{placas_base[i]}{j+1}23'
                bus_data = {
                    'placa': placa,
                    'marca': 'Mercedes Benz',
                    'modelo': f'O50{j}',
                    'capacidad': 40,
                    'estado': 'Activo',
                    'empresa': empresa
                }
                bus, created = Bus.objects.get_or_create(
                    placa=placa,
                    defaults=bus_data
                )
                buses.append(bus)
        self.stdout.write(self.style.SUCCESS(f'Creados {len(buses)} buses'))

        # Crear personas y clientes
        personas_data = [
            {'cedula': 1234567, 'nombre': 'Juan', 'apellido': 'Pérez', 'telefono': '0991234567', 'direccion': 'Calle 1'},
            {'cedula': 2345678, 'nombre': 'María', 'apellido': 'González', 'telefono': '0992345678', 'direccion': 'Calle 2'},
            {'cedula': 3456789, 'nombre': 'Carlos', 'apellido': 'López', 'telefono': '0993456789', 'direccion': 'Calle 3'},
        ]
        
        for data in personas_data:
            persona, created = Persona.objects.get_or_create(
                cedula=data['cedula'],
                defaults=data
            )
            # Crear cliente para cada persona
            cliente_data = {
                'cedula': persona,
                'razon_social': f"{persona.nombre} {persona.apellido}",
                'dv': str(persona.cedula)[-1]
            }
            cliente, created = Cliente.objects.get_or_create(
                cedula=persona,
                defaults=cliente_data
            )
        self.stdout.write(self.style.SUCCESS(f'Creadas {len(personas_data)} personas con sus clientes'))

        # Crear rutas
        rutas_data = [
            {
                'nombre': 'Asunción - Ciudad del Este',
                'activo': True
            },
            {
                'nombre': 'Asunción - Encarnación',
                'activo': True
            },
            {
                'nombre': 'Ciudad del Este - Encarnación',
                'activo': True
            }
        ]
        rutas = []
        for data in rutas_data:
            ruta, created = Ruta.objects.get_or_create(
                nombre=data['nombre'],
                defaults=data
            )
            rutas.append(ruta)

        # Crear detalles de ruta
        for ruta in rutas:
            # Obtener paradas según la ruta
            origen, destino = ruta.nombre.split(' - ')
            parada_origen = Parada.objects.filter(localidad__nombre=origen).first()
            parada_destino = Parada.objects.filter(localidad__nombre=destino).first()
            
            if parada_origen and parada_destino:
                # Crear detalle ruta origen
                DetalleRuta.objects.get_or_create(
                    ruta=ruta,
                    parada=parada_origen,
                    defaults={
                        'orden': 1,
                        'hora_salida': '08:00'
                    }
                )
                # Crear detalle ruta destino
                DetalleRuta.objects.get_or_create(
                    ruta=ruta,
                    parada=parada_destino,
                    defaults={
                        'orden': 2,
                        'hora_salida': '12:00'
                    }
                )

        self.stdout.write(self.style.SUCCESS(f'Creadas {len(rutas)} rutas con sus detalles'))

        # Modificar la creación de viajes para incluir rutas
        fecha_base = date.today()
        for ruta in rutas[:2]:  # Solo las primeras dos rutas
            for bus in buses[:2]:  # Los primeros dos buses
                for i in range(3):  # 3 viajes por combinación ruta-bus
                    fecha_viaje = fecha_base + timedelta(days=i)
                    viaje_data = {
                        'bus': bus,
                        'ruta': ruta,  # Agregamos la ruta al viaje
                        'fecha': fecha_viaje
                    }
                    viaje, created = Viaje.objects.get_or_create(
                        bus=bus,
                        ruta=ruta,
                        fecha=fecha_viaje,
                        defaults=viaje_data
                    )

        self.stdout.write(self.style.SUCCESS('Viajes creados exitosamente'))

        self.stdout.write(self.style.SUCCESS('Base de datos poblada exitosamente'))
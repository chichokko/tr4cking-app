# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User, Group, Permission
from .models import (
    Cliente, Localidad, Empresa, Sucursal, Parada, Empleado,
    Bus, Ruta, DetalleRuta, Horario, Viaje, Asiento,
    Pasaje, Encomienda
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'groups', 'user_permissions']
        extra_kwargs = {
            'user_permissions': {'required': False},
        }

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']

class ClienteSerializer(serializers.ModelSerializer):
    usuario_data = UserSerializer(read_only=True)

    class Meta:
        model = Cliente
        fields = ['id','usuario','usuario_data', 'ruc', 'dv', 
                 'razon_social', 'telefono', 'direccion', 'fecha_registro']
        read_only_fields = ('fecha_registro',)

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = '__all__'

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'

class ParadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parada
        fields = '__all__'

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__'

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'


class DetalleRutaSerializer(serializers.ModelSerializer):
    nombre_parada = serializers.CharField(source='parada.nombre', read_only=True)
    
    class Meta:
        model = DetalleRuta
        fields = ['id', 'parada', 'nombre_parada', 'orden']

class RutaSerializer(serializers.ModelSerializer):
    detalles = DetalleRutaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Ruta
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class ViajeSerializer(serializers.ModelSerializer):
    fecha = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])
    class Meta:
        model = Viaje
        fields = '__all__'

class AsientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asiento
        fields = '__all__'

class PasajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pasaje
        fields = '__all__'

class EncomiendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encomienda
        fields = '__all__'
        extra_kwargs = {
            'flete': {'required': True},
            'origen': {'required': True},
            'destino': {'required': True},
            'viaje': {'required': True},
            'cliente': {'required': True},
            'remitente': {'required': True},
            'ruc_ci': {'required': True},
            'tipo_envio': {'required': True}
        }

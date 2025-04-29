# views.py
from rest_framework import viewsets
from django.contrib.auth.models import User, Group, Permission
from rest_framework.permissions import AllowAny
from .models import (
    Cliente, Localidad, Empresa, Sucursal, Parada, Empleado,
    Bus, Ruta, DetalleRuta, Horario, Viaje, Asiento,
    Pasaje, Encomienda
)
from .serializers import (
    ClienteSerializer, LocalidadSerializer, EmpresaSerializer, SucursalSerializer,
    ParadaSerializer, EmpleadoSerializer, BusSerializer, RutaSerializer,
    DetalleRutaSerializer, HorarioSerializer, ViajeSerializer,
    AsientoSerializer, PasajeSerializer, EncomiendaSerializer
)

# views.py
from django.contrib.auth.models import User, Group, Permission
from rest_framework import viewsets
from .serializers import UserSerializer, GroupSerializer, PermissionSerializer
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [AllowAny]

class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [AllowAny]

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class LocalidadViewSet(viewsets.ModelViewSet):
    queryset = Localidad.objects.all()
    serializer_class = LocalidadSerializer

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer

class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer

class ParadaViewSet(viewsets.ModelViewSet):
    queryset = Parada.objects.all()
    serializer_class = ParadaSerializer

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer

class RutaViewSet(viewsets.ModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer

class DetalleRutaViewSet(viewsets.ModelViewSet):
    queryset = DetalleRuta.objects.all()
    serializer_class = DetalleRutaSerializer

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer

class ViajeViewSet(viewsets.ModelViewSet):
    queryset = Viaje.objects.all()
    serializer_class = ViajeSerializer

class AsientoViewSet(viewsets.ModelViewSet):
    queryset = Asiento.objects.all()
    serializer_class = AsientoSerializer

class PasajeViewSet(viewsets.ModelViewSet):
    queryset = Pasaje.objects.all()
    serializer_class = PasajeSerializer

class EncomiendaViewSet(viewsets.ModelViewSet):
    queryset = Encomienda.objects.all()
    serializer_class = EncomiendaSerializer


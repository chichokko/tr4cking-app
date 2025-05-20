# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, GroupViewSet, PermissionViewSet,
    PersonaViewSet, UsuarioPersonaViewSet, ClienteViewSet, PasajeroViewSet,
    EmpresaViewSet, LocalidadViewSet, ParadaViewSet, BusViewSet,
    AsientoViewSet, RutaViewSet, DetalleRutaViewSet, HorarioViewSet,
    ViajeViewSet, PasajeViewSet, EncomiendaViewSet
)


router = DefaultRouter()

# Authentication
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'permissions', PermissionViewSet)

# Personas y Usuarios
router.register(r'personas', PersonaViewSet)
router.register(r'usuarios-personas', UsuarioPersonaViewSet)

# Clientes y Pasajeros
router.register(r'clientes', ClienteViewSet)
router.register(r'pasajeros', PasajeroViewSet)

# Empresas
router.register(r'empresas', EmpresaViewSet)

# Geografia
router.register(r'localidades', LocalidadViewSet)
router.register(r'paradas', ParadaViewSet)

# Transporte
router.register(r'buses', BusViewSet)
router.register(r'asientos', AsientoViewSet)

# Rutas
router.register(r'rutas', RutaViewSet)
router.register(r'detalle-rutas', DetalleRutaViewSet)
router.register(r'horarios', HorarioViewSet)

# Viajes y Servicios
router.register(r'viajes', ViajeViewSet)
router.register(r'pasajes', PasajeViewSet)
router.register(r'encomiendas', EncomiendaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

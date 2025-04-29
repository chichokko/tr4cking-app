# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, GroupViewSet, PermissionViewSet,
    ClienteViewSet, LocalidadViewSet, EmpresaViewSet, SucursalViewSet,
    ParadaViewSet, EmpleadoViewSet, BusViewSet, RutaViewSet,
    DetalleRutaViewSet, HorarioViewSet, ViajeViewSet,
    AsientoViewSet, PasajeViewSet, EncomiendaViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'localidades', LocalidadViewSet)
router.register(r'empresas', EmpresaViewSet)
router.register(r'sucursales', SucursalViewSet)
router.register(r'paradas', ParadaViewSet)
router.register(r'empleados', EmpleadoViewSet)
router.register(r'buses', BusViewSet)
router.register(r'rutas', RutaViewSet)
router.register(r'detalle-rutas', DetalleRutaViewSet)
router.register(r'horarios', HorarioViewSet)
router.register(r'viajes', ViajeViewSet)
router.register(r'asientos', AsientoViewSet)
router.register(r'pasajes', PasajeViewSet)
router.register(r'encomiendas', EncomiendaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib import messages
from django.urls import path
from django.shortcuts import redirect
from unfold.admin import ModelAdmin, TabularInline, StackedInline
from .models import (
    Persona, UsuarioPersona, Cliente, Pasajero,
    Empresa, Empleado, Localidad, Parada,
    Bus, Asiento, Ruta, DetalleRuta,
    Viaje, Pasaje, Reserva, Encomienda,
    TipoDocumento, Timbrado, CabeceraFactura, DetalleFactura, HistorialFactura,
    Caja, CabeceraCaja, DetalleCaja
)


admin.site.site_header = 'Tr4cking'
admin.site.site_title = 'Tr4cking Admin Portal'
admin.site.index_title = 'Bienvenido al Portal Administrativo de Tr4cking'


# Inline Models
class UsuarioPersonaInline(StackedInline):
    model = UsuarioPersona
    can_delete = False
    verbose_name_plural = 'Información Personal'

class DetalleRutaInline(TabularInline):
    model = DetalleRuta
    extra = 1

class AsientoInline(TabularInline):
    model = Asiento
    extra = 1

class DetalleFacturaInline(TabularInline):
    model = DetalleFactura
    extra = 1
    fields = ('pasaje', 'encomienda', 'cantidad', 'precio_unitario', 'iva_porcentaje', 'subtotal')
    readonly_fields = ('subtotal',)

# Custom User Admin
class CustomUserAdmin(UserAdmin):
    inlines = (UsuarioPersonaInline,)
    unfold_form_tabs = [
        ("Información Personal", ["username", "password"]),
        ("Permisos", ["is_active", "is_staff", "is_superuser", "groups", "user_permissions"]),
        ("Fechas Importantes", ["last_login", "date_joined"]),
    ]

# Unregister the default User admin and register with custom
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Personas y Usuarios
@admin.register(Persona)
class PersonaAdmin(ModelAdmin):
    list_display = ('cedula', 'nombre', 'apellido', 'telefono')
    search_fields = ('cedula', 'nombre', 'apellido')
    ordering = ('apellido', 'nombre')
    unfold_form_tabs = [
        ("Información Personal", ["cedula", "nombre", "apellido"]),
        ("Contacto", ["telefono", "email"]),
    ]

@admin.register(Cliente)
class ClienteAdmin(ModelAdmin):
    list_display = ('id_cliente', 'get_nombre', 'dv', 'razon_social', 'fecha_registro')
    search_fields = ('cedula__nombre', 'cedula__apellido', 'razon_social')
    date_hierarchy = 'fecha_registro'
    
    def get_nombre(self, obj):
        return f"{obj.cedula.nombre} {obj.cedula.apellido}" if obj.cedula else "Sin persona"
    get_nombre.short_description = 'Nombre Completo'

# Actualizar Pasajero
@admin.register(Pasajero)
class PasajeroAdmin(ModelAdmin):  # Cambiar a ModelAdmin de Unfold
    list_display = ('id_pasajero', 'get_nombre', 'get_cedula')
    search_fields = ('cedula__nombre', 'cedula__apellido', 'cedula__cedula')
    unfold_form_tabs = [
        ("Información Personal", ["cedula"]),
    ]
    
    def get_nombre(self, obj):
        return f"{obj.cedula.nombre} {obj.cedula.apellido}"
    get_nombre.short_description = 'Nombre Completo'
    
    def get_cedula(self, obj):
        return obj.cedula.cedula
    get_cedula.short_description = 'Cédula'

# Empresas y Empleados
@admin.register(Empresa)
class EmpresaAdmin(ModelAdmin):
    list_display = ('nombre', 'ruc', 'telefono', 'email')
    search_fields = ('nombre', 'ruc')
    unfold_form_tabs = [
        ("Información Empresarial", ["nombre", "ruc"]),
        ("Contacto", ["telefono", "email", "direccion"]),
    ]

@admin.register(Empleado)
class EmpleadoAdmin(ModelAdmin):
    list_display = ('cedula__nombre', 'empresa', 'cargo', 'fecha_ingreso')
    list_filter = ('empresa', 'cargo')
    search_fields = ('cedula__nombre', 'cedula__apellido', 'cargo')
    date_hierarchy = 'fecha_ingreso'
    unfold_form_tabs = [
        ("Información Personal", ["cedula"]),
        ("Información Laboral", ["empresa", "cargo", "fecha_ingreso"]),
    ]

# Geografía
@admin.register(Localidad)
class LocalidadAdmin(ModelAdmin):
    list_display = ('nombre', 'coordenadas')
    search_fields = ('nombre',)

@admin.register(Parada)
class ParadaAdmin(ModelAdmin):
    list_display = ('nombre', 'localidad', 'direccion', 'activo')
    list_filter = ('localidad', 'activo')
    search_fields = ('nombre', 'direccion')
    unfold_form_tabs = [
        ("Información General", ["nombre", "localidad"]),
        ("Ubicación", ["direccion", "coordenadas"]),
        ("Estado", ["activo"]),
    ]

# Transporte
@admin.register(Bus)
class BusAdmin(ModelAdmin):
    list_display = ('placa', 'empresa', 'marca', 'modelo', 'capacidad', 'estado')
    list_filter = ('empresa', 'estado')
    search_fields = ('placa', 'marca', 'modelo')
    inlines = [AsientoInline]
    unfold_form_tabs = [
        ("Información del Bus", ["placa", "empresa", "marca", "modelo"]),
        ("Capacidad", ["capacidad", "tipo_bus"]),
        ("Estado", ["estado", "observaciones"]),
    ]

@admin.register(Asiento)
class AsientoAdmin(admin.ModelAdmin):
    list_display = ('bus', 'numero_asiento', 'estado', 'tipo_asiento')
    list_filter = ('bus', 'estado', 'tipo_asiento')
    search_fields = ('bus__placa',)

# Rutas
@admin.register(Ruta)
class RutaAdmin(ModelAdmin):
    list_display = ('nombre', 'activo', 'fecha_actualizacion')
    list_filter = ('activo',)
    search_fields = ('nombre',)
    inlines = [DetalleRutaInline]
    unfold_form_tabs = [
        ("Información de Ruta", ["nombre", "descripcion"]),
        ("Estado", ["activo"]),
    ]

@admin.register(DetalleRuta)
class DetalleRutaAdmin(admin.ModelAdmin):
    list_display = ('ruta', 'parada', 'hora_salida', 'orden')
    list_filter = ('ruta', 'parada')
    ordering = ('ruta', 'orden')

# Viajes y Servicios
@admin.register(Viaje)
class ViajeAdmin(ModelAdmin):
    list_display = ('ruta', 'bus', 'fecha', 'activo')
    list_filter = ('ruta', 'bus', 'activo')
    date_hierarchy = 'fecha'
    search_fields = ('ruta__nombre', 'bus__placa')
    unfold_form_tabs = [
        ("Información del Viaje", ["ruta", "bus", "fecha"]),
        ("Estado", ["activo", "observaciones"]),
    ]
    actions = ['marcar_como_activo', 'marcar_como_inactivo']

    def marcar_como_activo(self, request, queryset):
        queryset.update(activo=True)
    marcar_como_activo.short_description = "Marcar viajes seleccionados como activos"

    def marcar_como_inactivo(self, request, queryset):
        queryset.update(activo=False)
    marcar_como_inactivo.short_description = "Marcar viajes seleccionados como inactivos"

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('id_reserva', 'cliente', 'estado', 'fecha_reserva')
    list_filter = ('estado',)
    date_hierarchy = 'fecha_reserva'
    search_fields = ('cliente__razon_social',)

@admin.register(Pasaje)
class PasajeAdmin(admin.ModelAdmin):
    list_display = ('id_pasaje', 'viaje', 'asiento', 'pasajero', 'reserva')
    list_filter = ('viaje__ruta', 'viaje__fecha')
    search_fields = ('pasajero__cedula__nombre', 'pasajero__cedula__apellido')
    autocomplete_fields = ['viaje', 'asiento', 'pasajero']

@admin.register(Encomienda)
class EncomiendaAdmin(admin.ModelAdmin):
    list_display = ('id_encomienda', 'viaje', 'cliente', 'tipo_envio', 'fecha_creacion')
    list_filter = ('tipo_envio', 'viaje__ruta')
    date_hierarchy = 'fecha_creacion'
    search_fields = ('remitente', 'ruc_ci', 'descripcion')
    fieldsets = (
        ('Información Básica', {
            'fields': ('viaje', 'cliente', 'origen', 'destino')
        }),
        ('Detalles del Envío', {
            'fields': ('tipo_envio', 'cantidad_sobre', 'cantidad_paquete', 'descripcion')
        }),
        ('Información de Contacto', {
            'fields': ('remitente', 'ruc_ci', 'numero_contacto')
        }),
        ('Información de Pago', {
            'fields': ('flete',)
        }),
    )

# Facturación y Documentos
@admin.register(TipoDocumento)
class TipoDocumentoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre', 'requiere_cliente_registrado')
    search_fields = ('codigo', 'nombre')
    list_filter = ('requiere_cliente_registrado',)

@admin.register(Timbrado)
class TimbradoAdmin(admin.ModelAdmin):
    list_display = ('numero_timbrado', 'fecha_inicio', 'fecha_fin', 'activo')
    search_fields = ('numero_timbrado',)
    list_filter = ('activo',)
    date_hierarchy = 'fecha_inicio'

class CabeceraFacturaForm(forms.ModelForm):
    class Meta:
        model = CabeceraFactura
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        # Verificar si hay una caja abierta
        caja_abierta = Caja.objects.filter(estado='Abierta').exists()
        if not caja_abierta:
            raise ValidationError(
                'No se puede crear una factura sin una caja abierta. '
                'Por favor, abra una caja primero.'
            )
        return cleaned_data

@admin.register(CabeceraFactura)
class CabeceraFacturaAdmin(ModelAdmin):
    form = CabeceraFacturaForm
    list_display = ('numero_factura', 'cliente', 'empleado', 'fecha_factura', 'monto_total', 'estado')
    list_filter = ('estado', 'condicion', 'timbrado')
    search_fields = ('numero_factura', 'cliente__razon_social')
    date_hierarchy = 'fecha_factura'
    inlines = [DetalleFacturaInline]
    
    unfold_form_tabs = [
        ("Información General", {
            'fields': ('numero_factura', 'cliente', 'empleado', 'timbrado', 'parada')
        }),
        ("Condiciones", {
            'fields': ('condicion', 'estado')
        }),
        ("Montos", {
            'fields': ('monto_total', 'monto_exenta', 'monto_iva_5', 'monto_iva_10')
        }),
    ]

    def has_add_permission(self, request):
        # Verificar si hay una caja abierta antes de mostrar el botón "Añadir"
        if not Caja.objects.filter(estado='Abierta').exists():
            messages.warning(request, 'No se pueden crear facturas sin una caja abierta')
            return False
        return True

    def save_model(self, request, obj, form, change):
        if not change:  # Solo para nuevas facturas
            # Verificar nuevamente al guardar por seguridad
            if not Caja.objects.filter(estado='Abierta').exists():
                messages.error(request, 'No se puede guardar la factura sin una caja abierta')
                return
        super().save_model(request, obj, form, change)

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        caja_abierta = Caja.objects.filter(estado='Abierta').first()
        if caja_abierta:
            extra_context['caja_actual'] = f"Caja abierta: {caja_abierta.nombre}"
        else:
            extra_context['caja_actual'] = "No hay caja abierta"
        return super().changelist_view(request, extra_context=extra_context)

@admin.register(DetalleFactura)
class DetalleFacturaAdmin(admin.ModelAdmin):
    list_display = ('factura', 'get_detalle', 'cantidad', 'precio_unitario', 'subtotal')
    list_filter = ('factura__estado',)
    search_fields = ('factura__numero_factura', 'descripcion')

    def get_detalle(self, obj):
        if obj.pasaje:
            return f"Pasaje: {obj.pasaje}"
        elif obj.encomienda:
            return f"Encomienda: {obj.encomienda}"
        return obj.descripcion
    get_detalle.short_description = 'Detalle'

@admin.register(HistorialFactura)
class HistorialFacturaAdmin(admin.ModelAdmin):
    list_display = ('factura', 'fecha_cambio', 'campo_modificado', 'empleado')
    list_filter = ('campo_modificado',)
    search_fields = ('factura__numero_factura',)
    date_hierarchy = 'fecha_cambio'
    readonly_fields = ('fecha_cambio',)

# Cajas
class DetalleCajaInline(admin.TabularInline):
    model = DetalleCaja
    extra = 1

@admin.register(Caja)
class CajaAdmin(ModelAdmin):
    list_display = ('nombre', 'estado', 'fecha_creacion', 'monto_inicial')
    list_filter = ('estado',)
    search_fields = ('nombre',)
    date_hierarchy = 'fecha_creacion'
    unfold_form_tabs = [
        ("Información de Caja", ["nombre", "monto_inicial"]),
        ("Estado", ["estado"]),
    ]

@admin.register(CabeceraCaja)
class CabeceraCajaAdmin(ModelAdmin):
    list_display = ('caja', 'empleado', 'tipo_mov', 'fecha_mov', 'monto_inical', 'monto_final')
    list_filter = ('tipo_mov', 'caja')
    search_fields = ('caja__nombre', 'empleado__cedula__nombre')
    date_hierarchy = 'fecha_mov'
    inlines = [DetalleCajaInline]
    unfold_form_tabs = [
        ("Información de Movimiento", ["caja", "empleado", "tipo_mov"]),
        ("Montos", ["monto_inical", "monto_final"]),
    ]

@admin.register(DetalleCaja)
class DetalleCajaAdmin(ModelAdmin):
    list_display = ('cabecera_caja', 'tipo_transaccion', 'monto', 'fecha_transaccion', 'factura')
    list_filter = ('tipo_transaccion',)
    search_fields = ('descripcion', 'factura__numero_factura')
    date_hierarchy = 'fecha_transaccion'
    unfold_form_tabs = [
        ("Información de Transacción", ["cabecera_caja", "tipo_transaccion", "factura"]),
        ("Detalles", ["monto", "descripcion"]),
    ]




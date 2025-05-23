from django.conf import settings
from django.contrib.auth.models import User, Group, Permission
from django.db import models

# -----------------------------------------------
# Autenticación (Usar el estándar de Django)
# -----------------------------------------------
# auth_user, auth_group, auth_permission, etc. 
# -> Ya lo maneja Django internamente, no hay que redefinirlo

# -----------------------------------------------
# Personas y Usuarios
# -----------------------------------------------
class Persona(models.Model):
    cedula = models.BigIntegerField(primary_key=True, unique=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    telefono = models.CharField(max_length=30)
    direccion = models.TextField(help_text="Requerido para facturación")

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class UsuarioPersona(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=models.CASCADE)
    cedula = models.OneToOneField(
        Persona,
        to_field='cedula',
        db_column='cedula',
        on_delete=models.CASCADE
    )

    class Meta:
        db_table = 'usuario_persona'

# -----------------------------------------------
# Clientes (actualizado)
# -----------------------------------------------
class Cliente(models.Model):
    id_cliente = models.BigAutoField(primary_key=True)
    cedula = models.ForeignKey(
        Persona,
        to_field='cedula',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    dv = models.CharField(
        max_length=2,
        blank=True,
        null=True,
        help_text="Dígito verificador (opcional)"
    )
    razon_social = models.CharField(
        max_length=100,
        help_text="Para facturación, prioridad: auth_user > cliente o empleado para casuales"
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.razon_social

# -----------------------------------------------
# Pasajeros (nuevo)
# -----------------------------------------------
class Pasajero(models.Model):
    id_pasajero = models.BigAutoField(primary_key=True)
    cedula = models.OneToOneField(
        Persona,
        to_field='cedula',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.cedula.nombre} {self.cedula.apellido}"

# -----------------------------------------------
# Empresas y Sucursales
# -----------------------------------------------
class Empresa(models.Model):
    id_empresa = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    ruc = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    direccion_legal = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# -----------------------------------------------
# Geografía
# -----------------------------------------------
class Localidad(models.Model):
    id_localidad = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    coordenadas = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class Parada(models.Model):
    id_parada = models.BigAutoField(primary_key=True)
    localidad = models.ForeignKey(Localidad, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    direccion = models.TextField()
    coordenadas = models.FloatField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} ({self.localidad.nombre})"

    class Meta:
        verbose_name = "Parada"
        verbose_name_plural = "Paradas"

# -----------------------------------------------
# Transporte (Buses y Asientos)
# -----------------------------------------------
class Bus(models.Model):
    ESTADOS = [
        ('Activo', 'Activo'),
        ('Mantenimiento', 'Mantenimiento'),
        ('Inactivo', 'Inactivo'),
    ]

    id_bus = models.BigAutoField(primary_key=True)
    placa = models.TextField(unique=True)
    marca = models.TextField(blank=True, null=True)
    modelo = models.TextField(blank=True, null=True)
    capacidad = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ESTADOS)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    def __str__(self):
        return self.placa

class Asiento(models.Model):
    ESTADOS_ASIENTO = [
        ('Disponible', 'Disponible'),
        ('Reservado', 'Reservado'),
        ('Ocupado', 'Ocupado'),
    ]
    TIPOS_ASIENTO = [
        ('Semi-cama', 'Semi-cama'),
        ('Cama', 'Cama'),
    ]

    id_asiento = models.BigAutoField(primary_key=True)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    numero_asiento = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ESTADOS_ASIENTO, default='Disponible')
    tipo_asiento = models.CharField(max_length=20, choices=TIPOS_ASIENTO, blank=True, null=True)

    class Meta:
        unique_together = ('bus', 'numero_asiento')

# -----------------------------------------------
# Rutas
# -----------------------------------------------
class Ruta(models.Model):
    id_ruta = models.BigAutoField(primary_key=True)
    duracion_total = models.DecimalField(max_digits=6, decimal_places=2)
    distancia_km = models.DecimalField(max_digits=6, decimal_places=2)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    activo = models.BooleanField(default=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

class DetalleRuta(models.Model):
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
    parada = models.ForeignKey(Parada, on_delete=models.CASCADE)
    orden = models.IntegerField()

    class Meta:
        unique_together = [('ruta', 'parada'), ('ruta', 'orden')]

class Horario(models.Model):
    id_horario = models.BigAutoField(primary_key=True)
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
    hora_salida = models.TimeField()
    dias_semana = models.CharField(max_length=7)
    activo = models.BooleanField(default=True)

    class Meta:
        unique_together = ('ruta', 'hora_salida')

class Viaje(models.Model):
    id_viaje = models.BigAutoField(primary_key=True)
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE,null=True, blank=True)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    fecha = models.DateField()
    activo = models.BooleanField(default=True)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('bus', 'fecha', 'horario')


# -----------------------------------------------
# Servicios (Pasajes y Reservas)
# -----------------------------------------------
class Pasaje(models.Model):
    id_pasaje = models.BigAutoField(primary_key=True)
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE)
    asiento = models.ForeignKey(Asiento, on_delete=models.CASCADE)
    pasajero = models.ForeignKey(Pasajero, on_delete=models.CASCADE)

    def __str__(self):
        return f"Pasaje #{self.id_pasaje} - {self.pasajero}"

class CabeceraReserva(models.Model):
    id_reserva = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reserva #{self.id_reserva} - {self.cliente}"

class DetalleReserva(models.Model):
    id_detalle = models.BigAutoField(primary_key=True)
    reserva = models.ForeignKey(CabeceraReserva, on_delete=models.CASCADE)
    pasaje = models.OneToOneField(Pasaje, on_delete=models.CASCADE)

    def __str__(self):
        return f"Detalle #{self.id_detalle} - Reserva #{self.reserva.id_reserva}"


class Encomienda(models.Model):
    TIPO_ENVIO_CHOICES = [
        ('sobre', 'Sobre'),
        ('paquete', 'Paquete'),
        ('ambos', 'Ambos'),
    ]

    id_encomienda = models.BigAutoField(primary_key=True)
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    origen = models.ForeignKey(Parada, on_delete=models.CASCADE, related_name='origen_encomienda')
    destino = models.ForeignKey(Parada, on_delete=models.CASCADE, related_name='destino_encomienda')
    flete = models.DecimalField(max_digits=12, decimal_places=2)
    remitente = models.CharField(max_length=100)
    ruc_ci = models.CharField(max_length=20)
    numero_contacto = models.CharField(max_length=20)
    tipo_envio = models.CharField(max_length=10, choices=TIPO_ENVIO_CHOICES)
    cantidad_sobre = models.PositiveIntegerField(default=0)
    cantidad_paquete = models.PositiveIntegerField(default=0)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Encomienda #{self.id_encomienda} - {self.get_tipo_envio_display()}"




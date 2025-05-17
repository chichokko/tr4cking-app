from django.conf import settings
from django.contrib.auth.models import User, Group, Permission
from django.db import models

# -----------------------------------------------
# Autenticación (Usar el estándar de Django)
# -----------------------------------------------
# auth_user, auth_group, auth_permission, etc. 
# -> Ya lo maneja Django internamente, no hay que redefinirlo

# -----------------------------------------------
# Clientes (clientes no registrados)
# -----------------------------------------------
class Cliente(models.Model):
    #id_cliente = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cliente'
    )
    ruc = models.CharField(max_length=15, unique=True)
    dv = models.CharField(max_length=2, blank=True, null=True)
    razon_social = models.CharField(max_length=100)
    telefono = models.CharField(max_length=30)
    direccion = models.TextField()
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.razon_social

# -----------------------------------------------
# Geografía
# -----------------------------------------------
class Localidad(models.Model):
    id_localidad = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    coordenadas = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.nombre

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

class Sucursal(models.Model):
    id_sucursal = models.BigAutoField(primary_key=True)
    localidad = models.ForeignKey(Localidad, on_delete=models.CASCADE)

# -----------------------------------------------
# Paradas
# -----------------------------------------------
class Parada(models.Model):
    TIPOS_PARADA = [
        ('A', 'Agencia'),
        ('P', 'Parada de Bus'),
        ('T', 'Terminal'),
    ]

    id_parada = models.BigAutoField(primary_key=True)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    tipo_parada = models.CharField(max_length=1, choices=TIPOS_PARADA)
    nombre = models.TextField(unique=True)
    direccion = models.TextField(blank=True, null=True)
    telefono = models.TextField(blank=True, null=True)
    localidad = models.OneToOneField(Localidad, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

# -----------------------------------------------
# Empleados
# -----------------------------------------------
class Empleado(models.Model):
    id_empleado = models.BigAutoField(primary_key=True)
    usuario = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    fecha_contratacion = models.DateField()
    cargo = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.usuario.first_name} {self.usuario.last_name}"

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
# Servicios (Pasajes y Encomiendas)
# -----------------------------------------------
class Pasaje(models.Model):
    id_pasaje = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE)
    asiento = models.ForeignKey(Asiento, on_delete=models.CASCADE)

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
    



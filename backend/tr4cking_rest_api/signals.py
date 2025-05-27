from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Bus, Asiento, Pasaje



@receiver(post_save, sender=Bus)
def crear_asientos(sender, instance, created, **kwargs):
    if created:  # Solo cuando se crea un nuevo bus
        for i in range(1, instance.capacidad + 1):
            Asiento.objects.create(
                bus=instance,
                numero_asiento=i,
                estado='Disponible',
                tipo_asiento='Semi-cama'  # O podrías variar según alguna lógica
            )

# Las señales existentes de Pasaje se mantienen aquí también
@receiver(post_save, sender=Pasaje)
def actualizar_estado_asiento(sender, instance, created, **kwargs):
    if created:
        asiento = instance.asiento
        asiento.estado = 'Ocupado'
        asiento.save()

@receiver(post_delete, sender=Pasaje)
def restaurar_estado_asiento(sender, instance, **kwargs):
    asiento = instance.asiento
    asiento.estado = 'Disponible'
    asiento.save()
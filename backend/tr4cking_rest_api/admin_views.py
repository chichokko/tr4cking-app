from django.views.generic import TemplateView
from datetime import datetime, timedelta
from .models import CabeceraFactura, Encomienda, Ruta

class DashboardView(TemplateView):
    template_name = 'admin/index.html'

def dashboard_callback(request, context):
    """
    Callback para el dashboard de django-unfold.
    Agrega estadísticas reales al contexto para el template admin/index.html.
    """
    today = datetime.now().date()
    thirty_days_ago = today - timedelta(days=30)

    # Ventas totales (facturas) en los últimos 30 días
    ventas_totales = CabeceraFactura.objects.filter(fecha_factura__gte=thirty_days_ago).count()

    # Rutas activas
    rutas_activas = Ruta.objects.filter(activo=True).count()

    # Encomiendas en los últimos 30 días
    total_encomiendas = Encomienda.objects.filter(fecha_creacion__gte=thirty_days_ago).count()

    context.update({
        "ventas_totales": ventas_totales,
        "rutas_activas": rutas_activas,
        "total_encomiendas": total_encomiendas,
    })
    return context
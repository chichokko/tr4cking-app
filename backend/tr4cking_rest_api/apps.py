from django.apps import AppConfig


class Tr4ckingRestApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tr4cking_rest_api'
    verbose_name = 'Tr4cking'

    def ready(self):
        import tr4cking_rest_api.signals

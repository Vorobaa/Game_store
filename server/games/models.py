from django.db import models

# Create your models here.
class Game(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    release_date = models.DateField()

    def __str__(self):
        return self.title


# In your Django app's models.py
from django.db import models

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    
    # This will make it easier to access associated images
    @property
    def primary_image(self):
        return self.productimages_set.filter(is_primary=True).first()
    
    def __str__(self):
        return self.product_name

class ProductImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255, null=True, blank=True)
    display_order = models.IntegerField(default=0)
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Image for {self.product.product_name}"
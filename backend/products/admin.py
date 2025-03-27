from django.contrib import admin
from .models import Product, ProductImage, ProductSize, ProductVariant, Category, ProductCategory, ProductGroup, ProductGroupMember

admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(ProductSize)
admin.site.register(ProductVariant)
admin.site.register(Category)
admin.site.register(ProductCategory)
admin.site.register(ProductGroup)
admin.site.register(ProductGroupMember)

# Register your models here.

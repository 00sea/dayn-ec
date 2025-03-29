from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductImage, ProductSize, ProductVariant, Category, ProductCategory, ProductGroup, ProductGroupMember

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'image_preview', 'alt_text', 'image_type', 'display_order')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'base_price', 'is_active', 'has_primary_image', 'has_secondary_image')
    list_filter = ('is_active',)
    search_fields = ('product_name', 'description')
    inlines = [ProductImageInline]
    
    def has_primary_image(self, obj):
        has_primary = obj.images.filter(image_type='primary').exists()
        return format_html('✅' if has_primary else '❌')
    has_primary_image.short_description = 'Primary Image'

    def has_secondary_image(self, obj):
        has_secondary = obj.images.filter(image_type='secondary').exists()
        return format_html('✅' if has_secondary else '❌')
    has_secondary_image.short_description = 'Secondary Image'

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_preview', 'image_type', 'display_order')
    list_filter = ('image_type', 'product')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'

# Register other models
admin.site.register(ProductSize)
admin.site.register(ProductVariant)
admin.site.register(Category)
admin.site.register(ProductCategory)
admin.site.register(ProductGroup)
admin.site.register(ProductGroupMember)
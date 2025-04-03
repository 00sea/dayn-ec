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

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ('size', 'price_adjustment', 'stock_quantity', 'is_active')
    
    # Add this to make sure variants are properly saved
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        formset.request = request
        return formset

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'base_price', 'size_policy', 'total_stock_display', 'is_active', 'has_primary_image')
    list_filter = ('is_active', 'size_policy')
    search_fields = ('product_name', 'description')
    readonly_fields = ('total_stock_display',)
    fieldsets = (
        (None, {
            'fields': ('product_name', 'description', 'base_price', 'is_active')
        }),
        ('Size Options', {
            'fields': ('size_policy', ('stock_quantity', 'total_stock_display'))
        }),
    )
    inlines = [ProductImageInline, ProductVariantInline]
    
    def has_primary_image(self, obj):
        has_primary = obj.images.filter(image_type='primary').exists()
        return format_html('✅' if has_primary else '❌')
    has_primary_image.short_description = 'Primary Image'

    def total_stock_display(self, obj):
        if obj.has_sizes:
            variants = obj.variants.all()
            if not variants:
                return "No sizes added yet"
            
            stock_info = ", ".join([f"{v.size.size_name}: {v.stock_quantity}" for v in variants])
            total = obj.total_stock
            return f"{stock_info} (Total: {total})"
        return str(obj.stock_quantity)
    total_stock_display.short_description = "Stock Quantity"

    def get_inline_instances(self, request, obj=None):
        return super().get_inline_instances(request, obj)
    
    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        # If obj exists and uses multiple sizes, hide the stock_quantity field
        if obj and obj.size_policy == 'multiple':
            for name, options in fieldsets:
                if name == 'Size Options':
                    # Remove stock_quantity but keep total_stock_display
                    options['fields'] = ('size_policy', 'total_stock_display')
        # If obj exists and uses single size, show stock_quantity and hide total_stock_display
        elif obj and obj.size_policy == 'single':
            for name, options in fieldsets:
                if name == 'Size Options':
                    options['fields'] = ('size_policy', 'stock_quantity')
        return fieldsets

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        # After saving all related objects, ensure size policy is respected
        obj = form.instance
        if obj.size_policy == 'single':
            # If single size, remove any variants
            obj.variants.all().delete()
    
    class Media:
        js = ('admin/js/product_admin.js',)  # For controlling field visibility based on size_policy

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_preview', 'image_type', 'display_order')
    list_filter = ('image_type', 'product')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'

@admin.register(ProductSize)
class ProductSizeAdmin(admin.ModelAdmin):
    list_display = ('size_name', 'size_code', 'display_order')
    search_fields = ('size_name', 'size_code')
    ordering = ('display_order', 'size_name')

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'size', 'price_adjustment', 'stock_quantity', 'is_active')
    list_filter = ('is_active', 'product', 'size')
    search_fields = ('product__product_name', 'size__size_name')

# # Register other models
# admin.site.register(ProductSize)
# admin.site.register(ProductVariant)
# admin.site.register(Category)
# admin.site.register(ProductCategory)
# admin.site.register(ProductGroup)
# admin.site.register(ProductGroupMember)

# Register other models
admin.site.register(Category)
admin.site.register(ProductCategory)
admin.site.register(ProductGroup)
admin.site.register(ProductGroupMember)
from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['image_id', 'image_url', 'alt_text', 'image_type', 'display_order']

    def get_image_url(self, obj):
        # This returns the complete URL to the image
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    secondary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'product_id', 
            'product_name', 
            'description', 
            'base_price', 
            'images',
            'primary_image',
            'secondary_image',
            'is_active',
            'date_created'
        ]
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(image_type='primary').first()
        if primary:
            return ProductImageSerializer(primary, context=self.context).data.get('image_url')
        return None
    
    def get_secondary_image(self, obj):
        secondary = obj.images.filter(image_type='secondary').first()
        if secondary:
            return ProductImageSerializer(secondary, context=self.context).data.get('image_url')
        return None
        
    def to_representation(self, instance):
        """Customize the output to match what the React app expects."""
        data = super().to_representation(instance)
        # Map fields to match the React component's expected structure
        return {
            'id': data['product_id'],
            'name': data['product_name'],
            'price': float(data['base_price']),
            'description': data['description'],
            'image': data['primary_image'] or (data['images'][0]['image_url'] if data['images'] else None),
            'secondaryImage': data['secondary_image'],
            'category': 'watches',  # You might want to add this field to your model
            'images': data['images']
        }
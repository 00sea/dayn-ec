from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image_id', 'image_url', 'alt_text', 'is_primary']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'product_id', 
            'product_name', 
            'description', 
            'base_price', 
            'images',
            'is_active',
            'date_created'
        ]
        
    def to_representation(self, instance):
        """Customize the output to match what the React app expects."""
        data = super().to_representation(instance)
        # Map fields to match the React component's expected structure
        return {
            'id': data['product_id'],
            'name': data['product_name'],
            'price': float(data['base_price']),
            'description': data['description'],
            'image': data['images'][0]['image_url'] if data['images'] else '/placeholder.png',
            'category': 'watches',  # You might want to add this field to your model
            'images': data['images']
        }
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows products to be viewed.
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context
    
    def get_queryset(self):
        """
        Optionally restricts the returned products by filtering
        against query parameters in the URL.
        """
        queryset = Product.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category__iexact=category)
        if min_price:
            queryset = queryset.filter(base_price__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(base_price__lte=float(max_price))
        if search:
            queryset = queryset.filter(product_name__icontains=search)
            
        return queryset
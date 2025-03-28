import React, { useState } from 'react';
import type { Product } from '../../types';

interface ProductDetailProps {
  product: Product | null;
  loading: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, loading }) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // If still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // If product is null (after loading is complete), show not found message
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-watch text-4xl mb-4">Product Not Found</h1>
        <p className="font-nav">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Display the main image or the first image in the product's images array
  const mainImageUrl = selectedImageUrl || product.image;
  
  // Extract all images from the product data
  const allImages = product.images && Array.isArray(product.images) 
    ? product.images.map(img => img.image_url) 
    : [];

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    console.log('Adding to cart:', {
      product: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    });
    // Here you would implement your actual cart functionality
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images Section */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="bg-gray-800 aspect-square overflow-hidden">
            <img 
              src={mainImageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((imgUrl, index) => (
                <div 
                  key={index}
                  className={`aspect-square bg-gray-800 cursor-pointer overflow-hidden ${
                    imgUrl === selectedImageUrl ? 'ring-2 ring-white' : ''
                  }`}
                  onClick={() => setSelectedImageUrl(imgUrl)}
                >
                  <img 
                    src={imgUrl} 
                    alt={`${product.name} - View ${index + 1}`} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details Section */}
        <div className="space-y-8">
          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="font-watch text-4xl">{product.name}</h1>
            <p className="font-nav text-2xl">${product.price.toFixed(2)}</p>
            
            <div className="h-px bg-gray-700 my-6"></div>
            
            <div className="font-nav">
              <p className="text-gray-300 mb-4">{product.description}</p>
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="space-y-4">
            <h3 className="font-nav text-lg">Quantity</h3>
            <div className="flex items-center">
              <button 
                className="w-10 h-10 border border-gray-600 flex items-center justify-center"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <div className="w-16 h-10 border-t border-b border-gray-600 flex items-center justify-center">
                {quantity}
              </div>
              <button 
                className="w-10 h-10 border border-gray-600 flex items-center justify-center"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            className="w-full py-4 bg-white text-black font-nav hover:bg-gray-200 transition-colors"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
          
          {/* Product Details */}
          <div className="space-y-4 pt-8">
            <div className="h-px bg-gray-700"></div>
            
            <div className="space-y-4">
              <h3 className="font-nav text-lg">Details</h3>
              <ul className="space-y-2 font-nav text-gray-300">
                <li>Category: {product.category}</li>
                <li>Product ID: {product.id}</li>
                {/* Add more details as needed */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
import React, { useState, useEffect } from 'react';
import { Product, ProductSize } from '../../types';

interface ProductDetailProps {
  product: Product | null;
  loading: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, loading }) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Reset selected size when product changes
  useEffect(() => {
    if (product && product.hasSizes && product.variants && product.variants.length > 0) {
      // Default to the first available size with stock
      const inStockVariant = product.variants.find(v => v.stock_quantity > 0);
      if (inStockVariant) {
        setSelectedSize(inStockVariant.size);
      } else {
        // If no size has stock, just default to first size
        setSelectedSize(product.variants[0].size);
      }
    } else {
      setSelectedSize(null);
    }
    setSizeError(null);
  }, [product]);

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
  
  // Extract all images from the product data, ensuring we include primary and secondary
  // images at the beginning of the array
  const allImages: string[] = [];
  
  // Add primary image first
  if (product.image) {
    allImages.push(product.image);
  }
  
  // Add secondary image next if it exists and isn't already included
  if (product.secondaryImage && product.secondaryImage !== product.image) {
    allImages.push(product.secondaryImage);
  }
  
  // Add any additional images from the images array
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => {
      if (img.image_url && !allImages.includes(img.image_url)) {
        allImages.push(img.image_url);
      }
    });
  }

  // Get the current variant based on selected size
  const getCurrentVariant = () => {
    if (!product.hasSizes || !selectedSize) return null;
    return product.variants?.find(v => v.size.size_id === selectedSize.size_id) || null;
  };

  // Get adjusted price based on selected variant
  const getAdjustedPrice = () => {
    const variant = getCurrentVariant();
    if (variant) {
      return product.price + variant.price_adjustment;
    }
    return product.price;
  };

  // Get available stock based on size policy
  const getAvailableStock = () => {
    if (product.hasSizes) {
      const variant = getCurrentVariant();
      return variant ? variant.stock_quantity : 0;
    }
    return product.stockQuantity;
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    const availableStock = getAvailableStock();
    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    }
  };

  // Handle size selection
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeId = parseInt(e.target.value);
    const size = product.variants?.find(v => v.size.size_id === sizeId)?.size || null;
    setSelectedSize(size);
    setSizeError(null);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    // For products with sizes, ensure a size is selected
    if (product.hasSizes && !selectedSize) {
      setSizeError('Please select a size');
      return;
    }

    const availableStock = getAvailableStock();
    if (quantity > availableStock) {
      setSizeError(`Only ${availableStock} items available`);
      return;
    }

    console.log('Adding to cart:', {
      product: product.id,
      name: product.name,
      price: getAdjustedPrice(),
      size: selectedSize?.size_name,
      quantity: quantity
    });
    // Here you would implement your actual cart functionality
  };

  // Check if the product is out of stock
  const isOutOfStock = getAvailableStock() <= 0;

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
                    imgUrl === selectedImageUrl || (imgUrl === product.image && !selectedImageUrl) 
                      ? 'ring-2 ring-white' 
                      : ''
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
            <p className="font-nav text-2xl">${getAdjustedPrice().toFixed(2)}</p>
            
            <div className="h-px bg-gray-700 my-6"></div>
            
            <div className="font-nav">
              <p className="text-gray-300 mb-4">{product.description}</p>
            </div>
          </div>
          
          {/* Size Selector - Only show for products with multiple sizes */}
          {product.hasSizes && product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-nav text-lg">Size</h3>
              <div>
                <select 
                  className="w-full py-2 px-3 bg-gray-800 border border-gray-600 text-white font-nav"
                  value={selectedSize?.size_id || ''}
                  onChange={handleSizeChange}
                >
                  <option value="" disabled>Select a size</option>
                  {product.variants.map(variant => (
                    <option 
                      key={variant.size.size_id} 
                      value={variant.size.size_id}
                      disabled={variant.stock_quantity <= 0}
                    >
                      {variant.size.size_name} {variant.stock_quantity <= 0 ? '(Out of stock)' : ''}
                      {variant.price_adjustment > 0 ? ` (+$${variant.price_adjustment.toFixed(2)})` : ''}
                    </option>
                  ))}
                </select>
                {sizeError && (
                  <p className="mt-2 text-red-500 text-sm">{sizeError}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="space-y-4">
            <h3 className="font-nav text-lg">Quantity</h3>
            <div className="flex items-center">
              <button 
                className="w-10 h-10 border border-gray-600 flex items-center justify-center disabled:opacity-50"
                onClick={decreaseQuantity}
                disabled={quantity <= 1 || isOutOfStock}
              >
                -
              </button>
              <div className="w-16 h-10 border-t border-b border-gray-600 flex items-center justify-center">
                {quantity}
              </div>
              <button 
                className="w-10 h-10 border border-gray-600 flex items-center justify-center disabled:opacity-50"
                onClick={increaseQuantity}
                disabled={quantity >= getAvailableStock() || isOutOfStock}
              >
                +
              </button>
              
              <div className="ml-4 text-sm text-gray-400">
                {product.hasSizes 
                  ? selectedSize 
                    ? `${getAvailableStock()} available in size ${selectedSize.size_name}` 
                    : 'Please select a size'
                  : `${getAvailableStock()} available`
                }
              </div>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            className="w-full py-4 bg-white text-black font-nav hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:text-gray-400"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
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
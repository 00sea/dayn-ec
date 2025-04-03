import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, StoreGridProps } from '../../types';

const StoreGrid: React.FC<StoreGridProps> = ({ 
  products: initialProducts, 
  fetchUrl = 'http://localhost:8000/api/products/',
  filters = {},
  loading: externalLoading,
  onAddToCart
}) => {
  // State for products and loading
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(externalLoading !== undefined ? externalLoading : !initialProducts);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  // Fetch products only if not provided externally
  useEffect(() => {
    // If products are provided externally, use those instead
    if (initialProducts) {
      setProducts(initialProducts);
      return;
    }

    const fetchProducts = async () => {
      try {
        // Build URL with query parameters based on filters
        let url = new URL(fetchUrl, window.location.origin);
        
        // Add filters to query params
        if (filters.category) url.searchParams.append('category', filters.category);
        if (filters.minPrice !== undefined) url.searchParams.append('min_price', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) url.searchParams.append('max_price', filters.maxPrice.toString());
        if (filters.search) url.searchParams.append('search', filters.search);
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: Product[] = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
        
        // // For development purposes, let's add some mock data
        // const mockProducts: Product[] = [
        //   {
        //     id: 1,
        //     name: "Classic Timepiece",
        //     price: 249.99,
        //     image: "/product1.png",
        //     secondaryImage: "/product1-back.png",
        //     category: "watches"
        //   },
        //   {
        //     id: 2,
        //     name: "Modern Chronograph",
        //     price: 349.99,
        //     image: "/product2.png",
        //     category: "watches"
        //   },
        //   {
        //     id: 3,
        //     name: "Minimalist Watch",
        //     price: 199.99,
        //     image: "/product3.png",
        //     secondaryImage: "/product3-back.png",
        //     category: "watches"
        //   },
        //   // other mock products...
        // ];
        
        // Apply filters to mock data too
        // let filteredMockProducts = [...mockProducts];
        // if (filters.category) {
        //   filteredMockProducts = filteredMockProducts.filter(p => p.category === filters.category);
        // }
        // if (filters.minPrice !== undefined) {
        //   filteredMockProducts = filteredMockProducts.filter(p => p.price >= filters.minPrice!);
        // }
        // if (filters.maxPrice !== undefined) {
        //   filteredMockProducts = filteredMockProducts.filter(p => p.price <= filters.maxPrice!);
        // }
        // if (filters.search) {
        //   const searchLower = filters.search.toLowerCase();
        //   filteredMockProducts = filteredMockProducts.filter(p => 
        //     p.name.toLowerCase().includes(searchLower) || 
        //     p.category.toLowerCase().includes(searchLower)
        //   );
        // }
        
        // setProducts(filteredMockProducts);
      }
    };

    if (!initialProducts) {
      fetchProducts();
    }
  }, [initialProducts, fetchUrl, filters]);

  // Watch for external loading changes
  useEffect(() => {
    if (externalLoading !== undefined) {
      setLoading(externalLoading);
    }
  }, [externalLoading]);

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();  // Prevent navigating to product detail
    e.stopPropagation(); // Prevent event bubbling
    
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      console.log('Add to cart:', product);
      // Default implementation could add to local storage or context
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-35">      
      {loading ? (
        // Loading State
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        // Error State
        <div className="text-center text-red-500 py-10">
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        // No products found
        <div className="text-center py-10">
          <p className="text-xl font-nav">No products found.</p>
        </div>
      ) : (
        // Products Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div 
              key={product.id} 
              className="group relative"
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              {/* Add to Cart Icon */}
              <button 
                className="absolute top-0 right-5 z-10 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleAddToCart(e, product)}
                aria-label="Add to cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
                </svg>
              </button>

              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden aspect-square">
                  {/* Main Image (Primary) */}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                      hoveredProductId === product.id && product.secondaryImage ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  
                  {/* Secondary Image (shown on hover) */}
                  {product.secondaryImage && (
                    <img 
                      src={product.secondaryImage} 
                      alt={`${product.name} - Back view`}
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
                        hoveredProductId === product.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-4 font-nav flex flex-col items-center">
                  <h3 className="text-sm text-white">{product.name}</h3>
                  <p className="mt-1 text-white">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreGrid;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

// Props interface for better reusability
interface StoreGridProps {
  products?: Product[];
  title?: string;
  fetchUrl?: string;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  };
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
}

const StoreGrid: React.FC<StoreGridProps> = ({ 
  products: initialProducts, 
//   title = "Store", 
  fetchUrl = 'http://localhost:8000/api/products/',
  filters = {},
  loading: externalLoading,
  onAddToCart
}) => {
  // State for products and loading
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(externalLoading !== undefined ? externalLoading : !initialProducts);
  const [error, setError] = useState<string | null>(null);

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
        
        // For development purposes, let's add some mock data
        const mockProducts: Product[] = [
          {
            id: 1,
            name: "Classic Timepiece",
            price: 249.99,
            image: "/product1.png",
            category: "watches"
          },
          {
            id: 2,
            name: "Modern Chronograph",
            price: 349.99,
            image: "/product2.png",
            category: "watches"
          },
          {
            id: 3,
            name: "Minimalist Watch",
            price: 199.99,
            image: "/product3.png",
            category: "watches"
          },
          {
            id: 4,
            name: "Leather Watch Band",
            price: 49.99,
            image: "/band1.png",
            category: "accessories"
          },
          {
            id: 5,
            name: "Metal Watch Band",
            price: 59.99,
            image: "/band2.png",
            category: "accessories"
          },
          {
            id: 6,
            name: "Watch Care Kit",
            price: 29.99,
            image: "/care-kit.png",
            category: "accessories"
          },
        ];
        
        // Apply filters to mock data too
        let filteredMockProducts = [...mockProducts];
        if (filters.category) {
          filteredMockProducts = filteredMockProducts.filter(p => p.category === filters.category);
        }
        if (filters.minPrice !== undefined) {
          filteredMockProducts = filteredMockProducts.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          filteredMockProducts = filteredMockProducts.filter(p => p.price <= filters.maxPrice!);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredMockProducts = filteredMockProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.category.toLowerCase().includes(searchLower)
          );
        }
        
        setProducts(filteredMockProducts);
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
  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      console.log('Add to cart:', product);
      // Default implementation could add to local storage or context
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30 font-nav">
      {/* {title && <h1 className="font-watch text-4xl mb-8">{title}</h1>} */}
      
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
            <div key={product.id} className="group">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <h3 className="text-sm text-white">{product.name}</h3>
                  <p className="mt-1 text-white">${product.price.toFixed(2)}</p>
                </div>
              </Link>
              <button 
                className="mt-2 w-full bg-transparent hover:bg-white hover:text-black border border-white py-2 font-nav transition-colors duration-200"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreGrid;
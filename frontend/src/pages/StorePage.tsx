import React, { useState, useEffect } from 'react';
import { Header, Footer } from '../components';
import StoreGrid from '../components/Store/StoreGrid';
import { fetchProducts } from '../services/api';
import type { Product } from '../types';

const StorePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <StoreGrid
        products={products}
        loading={loading}
      />
      {error && (
        <div className="max-w-7xl mx-auto px-4 text-center text-red-500 py-4">
          {error}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default StorePage;
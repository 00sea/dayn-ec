import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header, ProductDetail } from '../components';
import { fetchProductById } from '../services/api';
import type { Product } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchProductById(parseInt(id));
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      {error ? (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-500">
          {error}
        </div>
      ) : (
        <ProductDetail 
          product={product} 
          loading={loading} 
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
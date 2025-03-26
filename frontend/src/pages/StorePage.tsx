import React from 'react';
import { Header, StoreGrid, Footer } from '../components';

const StorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <StoreGrid />
      <Footer />
    </div>
  );
};

export default StorePage;
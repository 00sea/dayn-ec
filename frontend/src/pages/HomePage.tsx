import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/Hero/Hero';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <Hero />
      
      {/* Featured Products section - can be expanded later */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-blue-500">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-4 text-lg text-gray-600">Discover our most popular items</p>
          </div>
          
          {/* Placeholder for featured products grid - to be implemented */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group relative">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                  <img
                    src={`/api/placeholder/300/300?text=Product ${item}`}
                    alt={`Product ${item}`}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        Product Name {item}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Black / Medium</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${(item * 25).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">Join Our Newsletter</h2>
            <p className="mt-4 text-lg text-gray-600">
              Subscribe to get special offers, free giveaways, and product launches.
            </p>
            <div className="mt-6">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary rounded-md"
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
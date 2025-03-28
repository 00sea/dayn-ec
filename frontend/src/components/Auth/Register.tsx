import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const { register, error: authError, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    // Basic form validation
    if (Object.values(formData).some(value => !value.trim())) {
      setFormError('Please fill out all fields');
      return;
    }
    
    if (formData.password !== formData.password2) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add username as email and empty first/last name for backend compatibility
      const registerData = {
        ...formData,
        username: formData.email,
        first_name: '',
        last_name: ''
      };
      
      await register(registerData);
      // Redirect handled by useEffect
    } catch (err) {
      console.error('Registration submission error:', err);
      // Auth context already sets the error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state or nothing if user is already authenticated
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="font-watch text-4xl text-white mb-6 text-center">Register</h1>
        
        {(formError || authError) && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {formError || authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white font-nav mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-white"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="your@email.com"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-white font-nav mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-white"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password2" className="block text-white font-nav mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-white"
              value={formData.password2}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-white text-black font-nav py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200 mb-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
          
          <div className="text-center text-gray-400 font-nav">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
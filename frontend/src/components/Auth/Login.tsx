import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LocationState {
  from?: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const { login, error: authError, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the location we came from, or default to home
  const state = location.state as LocationState;
  const from = state?.from || '/';
  
  // If user is already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    if (!username.trim() || !password.trim()) {
      setFormError('Please fill out all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(username, password);
      // The redirect is handled by the useEffect above
    } catch (err) {
      console.error('Login submission error:', err);
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
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="font-watch text-4xl text-white mb-6 text-center">Login</h1>
        
        {(formError || authError) && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {formError || authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-white font-nav mb-2">
              Email
            </label>
            <input
              type="email"
              id="username"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              placeholder="your@email.com"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-white font-nav mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-white text-black font-nav py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200 mb-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="text-center text-gray-400 font-nav">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    setSuccessMessage(null);
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
      setFormError('Please fill out all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // const data = await response.json();
        // Here we would ideally update the user context with this new data
        // But for simplicity, we'll just show a success message
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setFormError(errorData.detail || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setFormError('Failed to update profile. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    // No need to navigate here since ProtectedRoute will handle redirection
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-watch text-4xl text-white mb-8">My Account</h1>
        
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
          {isEditing ? (
            <>
              <h2 className="font-nav text-2xl text-white mb-6">Edit Profile</h2>
              
              {formError && (
                <div className="bg-red-500 text-white p-3 rounded mb-4">
                  {formError}
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-500 text-white p-3 rounded mb-4">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="first_name" className="block text-white font-nav mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-white"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-white font-nav mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-white"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
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
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-white text-black font-nav py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    type="button"
                    className="bg-transparent border border-gray-500 text-white font-nav py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-nav text-2xl text-white mb-6">Profile Information</h2>
              
              {successMessage && (
                <div className="bg-green-500 text-white p-3 rounded mb-4">
                  {successMessage}
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <p className="text-gray-400 font-nav">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 font-nav">First Name</p>
                    <p className="text-white">{user.first_name}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 font-nav">Last Name</p>
                    <p className="text-white">{user.last_name}</p>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                className="bg-white text-black font-nav py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
        
        {/* Order History Section - Can be expanded in the future */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="font-nav text-2xl text-white mb-6">Order History</h2>
          <p className="text-gray-400 font-nav">You have no orders yet.</p>
        </div>
        
        {/* Account Actions */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="font-nav text-2xl text-white mb-6">Account Actions</h2>
          
          <div className="space-y-4">
            <button
              type="button"
              className="block w-full md:w-auto bg-red-600 text-white font-nav py-2 px-4 rounded hover:bg-red-700 transition-colors duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
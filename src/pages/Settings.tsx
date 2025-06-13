import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile page for now
    if (!isLoading && user) {
      navigate('/profile');
    }
  }, [isLoading, user, navigate]);

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Settings</h1>
          <p className="text-center text-gray-500">Redirecting to profile page...</p>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
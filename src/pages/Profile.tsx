import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CreditCard, AlertCircle, Loader, Check, Edit, User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { services } from '../api';

interface UserProfile {
  id: string;
  email: string;
  email_confirmed: boolean;
  last_sign_in: string;
  created_at: string;
  full_name: string;
  avatar_url: string;
  country: string;
  country_code: string;
  currency: string;
  timezone: string;
  language: string;
  role: string;
  credit_balance: number;
  lemonsqueezy_customer_id: string | null;
  updated_at: string;
  phone?: string;
}

interface EditableFields {
  full_name: string;
  country: string;
  language: string;
  phone?: string;
}

const Profile = () => {
  // Wrap useAuth in a try-catch to handle the case when it's not within AuthProvider
  let user = null;
  let isAuthLoading = false;
  
  try {
    const auth = useAuth();
    user = auth.user;
    isAuthLoading = auth.isLoading;
  } catch (error) {
    console.error('Auth context not available:', error);
  }
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState<EditableFields>({
    full_name: '',
    country: '',
    language: '',
    phone: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await services.userService.getCurrentUser();
        setUserProfile(response as unknown as UserProfile);
        setEditableFields({
          full_name: response.full_name,
          country: response.country,
          language: response.language,
          phone: response.phone || '',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // Redirect to login if not authenticated
  if (!isAuthLoading && !user) {
    return <Navigate to="/login" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    setUpdateSuccess(false);
    setError(null);

    try {
      await services.userService.updateUserProfile(editableFields);
      
      // Fetch updated profile
      const updatedProfile = await services.userService.getCurrentUser();
      setUserProfile(updatedProfile as unknown as UserProfile);
      
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form fields to current user data
    if (userProfile) {
      setEditableFields({
        full_name: userProfile.full_name,
        country: userProfile.country,
        language: userProfile.language,
        phone: userProfile.phone || '',
      });
    }
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 text-purple-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        ) : userProfile ? (
          <>
            {updateSuccess && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <p className="text-green-800">Profile updated successfully!</p>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleCancelEdit}
                      className="flex items-center text-gray-500 hover:text-gray-700"
                      disabled={isUpdating}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center text-green-600 hover:text-green-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="h-20 w-20 rounded-full bg-purple-gradient flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                  <User className="h-10 w-10" />
                </div>
                {isEditing ? (
                  <div className="text-center">
                    <input 
                      type="text"
                      name="full_name"
                      value={editableFields.full_name}
                      onChange={handleInputChange}
                      className="text-center text-xl font-bold text-gray-900 border-b border-gray-300 focus:border-purple-500 focus:outline-none pb-1"
                    />
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-gray-900 text-center">{userProfile.full_name}</h2>
                )}
                <p className="text-gray-500 text-center">{userProfile.email}</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        name="country"
                        value={editableFields.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.country}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    {isEditing ? (
                      <select
                        name="language"
                        value={editableFields.language}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="ru">Russian</option>
                        <option value="zh">Chinese</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{userProfile.language ? userProfile.language.toUpperCase() : ''}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input 
                        type="tel"
                        name="phone"
                        value={editableFields.phone}
                        onChange={handleInputChange}
                        placeholder="+919876543210"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.phone || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Credits</h1>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 bg-purple-gradient rounded-lg flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-6">
                    <p className="text-gray-500">Current Balance</p>
                    <h3 className="text-3xl font-bold text-gray-900">{userProfile.credit_balance} Credits</h3>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
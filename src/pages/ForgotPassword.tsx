import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { services } from '../api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await services.authService.forgotPassword(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToReset = () => {
    navigate('/reset-password', { state: { email } });
  };

  return (
    <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-gradient p-3 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter your email to receive a password reset code</p>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-center">
                  Password reset instructions have been sent to <span className="font-medium">{email}</span>
                </p>
              </div>
              
              <button
                onClick={handleProceedToReset}
                className="w-full bg-purple-gradient text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Enter Reset Code
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setSuccess(false)} 
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-gradient text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:transform-none flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </button>
              </form>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              If you still need help, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 
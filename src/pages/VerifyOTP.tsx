import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Sparkles, AlertCircle, Loader } from 'lucide-react';
import { services } from '../api';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Input refs for handling focus
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

  useEffect(() => {
    // Get email from state or query params
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const stateEmail = location.state?.email;
    
    if (stateEmail) {
      setEmail(stateEmail);
    } else if (emailParam) {
      setEmail(emailParam);
    } else {
      // Redirect to login if no email
      navigate('/login');
    }
  }, [location, navigate]);

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    
    // Only allow numbers
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    newOtp[index] = sanitizedValue;
    
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (sanitizedValue && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus on the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs[nextEmptyIndex].current?.focus();
      } else {
        inputRefs[5].current?.focus();
      }
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await services.authService.resendVerification(email);
      setResendCooldown(60); // 60 second cooldown
      setSuccess(false); // Reset success state
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await services.authService.verifyEmail({
        email,
        otp: otpString
      });
      
      setSuccess(true);
      
      // Redirect after successful verification
      setTimeout(() => {
        navigate('/login', { state: { verificationSuccess: true } });
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to verify your email');
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <p className="text-green-800">Email verified successfully! Redirecting you to login...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-3">
                Verification Code
              </label>
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-purple-gradient text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:transform-none flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend Option */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Didn't receive the code?{' '}
              <button
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isLoading}
                className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend code'}
              </button>
            </p>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Please check your spam folder if you don't see the email in your inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP; 
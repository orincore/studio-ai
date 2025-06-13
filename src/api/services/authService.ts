import api, { setTokens, removeTokens, handleApiError } from '../client';
import { ENDPOINTS } from '../config';
import { 
  User, 
  AuthTokens, 
  RegisterPayload,
  LoginPayload,
  OtpVerificationPayload,
  ResetPasswordPayload,
  RefreshTokenPayload
} from '../../types/api';

// Response types
interface AuthResponse {
  user: User;
  tokens?: AuthTokens;
  message?: string;
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

// Register a new user
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Verify email with OTP
export const verifyEmail = async (payload: OtpVerificationPayload): Promise<SuccessResponse> => {
  try {
    const response = await api.post<SuccessResponse>(ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Resend verification OTP
export const resendVerification = async (email: string): Promise<SuccessResponse> => {
  try {
    const response = await api.post<SuccessResponse>(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login user
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    console.log("Login request to:", ENDPOINTS.AUTH.LOGIN);
    const response = await api.post<{success?: boolean, data?: AuthResponse} | AuthResponse>(ENDPOINTS.AUTH.LOGIN, payload);
    console.log("Login response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      console.log("Found nested data structure in login response");
      const authResponse = response.data.data;
      
      // Store tokens in local storage
      if (authResponse.tokens) {
        console.log("Setting tokens from nested login response");
        setTokens(authResponse.tokens);
      } else {
        console.warn("No tokens in nested login response");
      }
      
      return authResponse;
    } else {
      // Original structure
      const authResponse = response.data as AuthResponse;
      
      // Store tokens in local storage
      if (authResponse.tokens) {
        console.log("Setting tokens from login response");
        setTokens(authResponse.tokens);
      } else {
        console.warn("No tokens in login response");
      }
      
      return authResponse;
    }
  } catch (error) {
    console.error("Login error:", error);
    throw handleApiError(error);
  }
};

// Refresh token
export const refreshToken = async (payload: RefreshTokenPayload): Promise<AuthTokens> => {
  try {
    const response = await api.post<AuthTokens>(ENDPOINTS.AUTH.REFRESH_TOKEN, payload);
    
    // Store new tokens in local storage
    setTokens(response.data);
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Request password reset OTP
export const forgotPassword = async (email: string): Promise<SuccessResponse> => {
  try {
    const response = await api.post<SuccessResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Reset password with OTP
export const resetPassword = async (payload: ResetPasswordPayload): Promise<SuccessResponse> => {
  try {
    const response = await api.post<SuccessResponse>(ENDPOINTS.AUTH.RESET_PASSWORD, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Logout user
export const logout = async (): Promise<SuccessResponse> => {
  try {
    const response = await api.post<SuccessResponse>(ENDPOINTS.AUTH.LOGOUT);
    
    // Remove tokens from local storage
    removeTokens();
    
    return response.data;
  } catch (error) {
    // Still remove tokens even if the API call fails
    removeTokens();
    throw handleApiError(error);
  }
}; 
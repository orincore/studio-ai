import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens, RefreshTokenPayload } from '../types/api';

// Base API URL
export const BASE_URL = 'https://studioapi.orincore.com';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Local storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Set token in local storage
export const setTokens = (tokens: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
};

// Remove tokens from local storage
export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Get access token from local storage
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get refresh token from local storage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    console.log("API Request:", config.url);
    console.log("Has token:", !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Setting Authorization header");
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor for token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to add request to subscribers queue
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to notify subscribers with new token
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Function to refresh token
const refreshToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<AuthTokens>(`${BASE_URL}/api/auth/refresh-token`, {
      refresh_token: refreshToken,
    } as RefreshTokenPayload);

    const { access_token, refresh_token } = response.data;
    setTokens({ access_token, refresh_token });
    return access_token;
  } catch (error) {
    removeTokens();
    throw error;
  }
};

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.error("API Error:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Data:", JSON.stringify(error.response?.data, null, 2));
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Set retry flag
    originalRequest._retry = true;

    // If not already refreshing token
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        isRefreshing = false;
        onRefreshed(newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        removeTokens();
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If already refreshing, add request to queue
    return new Promise((resolve) => {
      addRefreshSubscriber((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(api(originalRequest));
      });
    });
  }
);

// Type for API error response
interface ApiErrorResponse {
  error?: {
    message?: string;
    status?: number;
    details?: any;
    stack?: string;
  };
}

// Generic API error handler
export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMsg = axiosError.response?.data?.error?.message || 'An error occurred';
    
    // Check for specific error patterns
    if (axiosError.response?.status === 402) {
      return {
        message: 'Insufficient credits for this operation',
        status: 402,
      };
    } 
    // Check for database constraint violations
    else if (errorMsg.includes('null value in column "prompt"')) {
      return {
        message: 'The prompt field cannot be empty. Please provide a detailed description.',
        status: axiosError.response?.status || 400,
        details: 'EMPTY_PROMPT',
      };
    }
    // Failed to store image metadata
    else if (errorMsg.includes('Failed to store image metadata')) {
      return {
        message: 'Failed to store image data. Please check your prompt and try again with more descriptive text.',
        status: axiosError.response?.status || 500,
        details: 'METADATA_STORAGE_ERROR',
      };
    }
    
    return {
      message: errorMsg,
      status: axiosError.response?.status || 500,
      details: axiosError.response?.data?.error?.details || 
               axiosError.response?.data?.error?.stack || null,
    };
  }
  
  // If it's not an Axios error, try to extract message if possible
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 500,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
};

// Simple test function to diagnose API issues
export const testLogin = async (email: string, password: string) => {
  try {
    console.log("Testing login with email:", email);
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password
    });
    console.log("Test login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Test login error:", error);
    throw error;
  }
};

export default api; 
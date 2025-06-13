import { ERROR_MESSAGES } from '../config';

/**
 * Interface for standardized API errors
 */
export interface ApiErrorResponse {
  message: string;
  status: number;
  details?: any;
}

/**
 * Formats API error responses
 * @param error The error object from the API
 * @returns Formatted error object
 */
export const formatApiError = (error: any): ApiErrorResponse => {
  // If it's already in the correct format, return it
  if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
    return error as ApiErrorResponse;
  }
  
  // Default error response
  const defaultError: ApiErrorResponse = {
    message: ERROR_MESSAGES.SERVER_ERROR,
    status: 500,
  };
  
  // If error is a string, use it as the message
  if (typeof error === 'string') {
    return {
      ...defaultError,
      message: error,
    };
  }
  
  // If error has response data
  if (error?.response?.data) {
    const responseData = error.response.data;
    
    // If response data has error message
    if (responseData.error?.message) {
      return {
        message: responseData.error.message,
        status: error.response.status || 500,
        details: responseData.error.details || null,
      };
    }
    
    // If response data has a direct message
    if (responseData.message) {
      return {
        message: responseData.message,
        status: error.response.status || 500,
      };
    }
  }
  
  // Handle specific HTTP status codes
  if (error?.response?.status) {
    switch (error.response.status) {
      case 401:
        return {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status: 401,
        };
      case 402:
        return {
          message: ERROR_MESSAGES.INSUFFICIENT_CREDITS,
          status: 402,
        };
      case 403:
        return {
          message: 'You do not have permission to perform this action',
          status: 403,
        };
      case 404:
        return {
          message: 'The requested resource was not found',
          status: 404,
        };
      case 422:
        return {
          message: 'The provided data was invalid',
          status: 422,
          details: error.response.data?.errors || null,
        };
    }
  }
  
  // Default to server error
  return defaultError;
};

/**
 * Checks if an error is related to insufficient credits
 * @param error The API error
 * @returns Boolean indicating if it's a credit-related error
 */
export const isInsufficientCreditsError = (error: ApiErrorResponse): boolean => {
  return error.status === 402 || error.message.includes('credit') || error.message.includes('insufficient');
};

/**
 * Checks if an error is related to authentication
 * @param error The API error
 * @returns Boolean indicating if it's an auth-related error
 */
export const isAuthenticationError = (error: ApiErrorResponse): boolean => {
  return error.status === 401 || error.message.includes('authentication') || error.message.includes('login');
}; 
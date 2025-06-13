import api, { handleApiError } from '../client';
import { ENDPOINTS } from '../config';
import { User, Pagination, CreditTransaction } from '../../types/api';

// Response types
interface UserProfileResponse {
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

interface CreditBalanceResponse {
  credit_balance: number;
}

interface CreditTransactionsResponse {
  transactions: CreditTransaction[];
  pagination: Pagination;
}

// Get current user profile
export const getCurrentUser = async (): Promise<UserProfileResponse> => {
  try {
    console.log("Getting current user from:", ENDPOINTS.USER.PROFILE);
    const response = await api.get<{success: boolean, data: UserProfileResponse}>(ENDPOINTS.USER.PROFILE);
    console.log("User profile response:", response.data);
    
    // Check if the response has a nested data structure
    if (response.data && 'data' in response.data) {
      console.log("Extracting user from nested data structure");
      return response.data.data;
    }
    
    // Fallback to the original structure if no nested data
    return response.data as unknown as UserProfileResponse;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw handleApiError(error);
  }
};

// Update user profile
export const updateUserProfile = async (payload: Partial<User>): Promise<User> => {
  try {
    console.log("Updating user profile with:", payload);
    const response = await api.put<{success?: boolean, data?: User} | User>(ENDPOINTS.USER.PROFILE, payload);
    console.log("Update profile response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as User;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw handleApiError(error);
  }
};

// Get user credit balance
export const getCreditBalance = async (): Promise<CreditBalanceResponse> => {
  try {
    const response = await api.get<{success?: boolean, data?: CreditBalanceResponse} | CreditBalanceResponse>(ENDPOINTS.USER.CREDITS);
    console.log("Credit balance response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as CreditBalanceResponse;
  } catch (error) {
    console.error("Error getting credit balance:", error);
    throw handleApiError(error);
  }
};

// Get credit transaction history
export const getCreditTransactions = async (
  page: number = 1,
  limit: number = 20,
  type?: 'credit' | 'debit'
): Promise<CreditTransactionsResponse> => {
  try {
    let url = `${ENDPOINTS.USER.CREDIT_HISTORY}?page=${page}&limit=${limit}`;
    
    if (type) {
      url += `&type=${type}`;
    }
    
    const response = await api.get<{success?: boolean, data?: CreditTransactionsResponse} | CreditTransactionsResponse>(url);
    console.log("Credit transactions response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as CreditTransactionsResponse;
  } catch (error) {
    console.error("Error getting credit transactions:", error);
    throw handleApiError(error);
  }
}; 
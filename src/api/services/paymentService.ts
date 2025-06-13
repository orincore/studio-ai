import api, { handleApiError } from '../client';
import { ENDPOINTS } from '../config';

interface CreateOrderPayload {
  amount: number;
  email: string;
  phone: string;
  return_url: string;
  notify_url: string;
  order_tags?: Record<string, string>;
  plan?: string;
}

interface CreateOrderResponse {
  order_id: string;
  payment_session_id: string;
}

interface PaymentStatusResponse {
  success: boolean;
  order_id: string;
  transaction_id?: string;
  error?: string;
  credits_added?: number;
  plan?: string;
  order_tags?: Record<string, string>;
}

/**
 * Load Cashfree SDK if not already loaded
 */
export const loadCashfreeSDK = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.Cashfree) {
      window.CashfreeReady = true;
      return resolve();
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if (!window.Cashfree) return reject(new Error('Cashfree SDK not found'));
      window.CashfreeReady = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.head.appendChild(script);
  });

/**
 * Create Cashfree order
 * @param amount - Payment amount (equals credits to be added)
 * @param email - User email
 * @param phone - User phone number
 * @param plan - Optional plan identifier
 */
export const createOrder = async (
  amount: number,
  email: string,
  phone: string,
  plan?: string
): Promise<CreateOrderResponse> => {
  try {
    console.log('🚀 Creating payment order...');

    // Build the URLs that Cashfree will redirect to
    const returnUrl = `${window.location.origin}/pricing`;
    const notifyUrl = 'https://studioapi.orincore.com/api/webhooks/cashfree';

    const payload: CreateOrderPayload = {
      amount,
      email,
      phone,
      return_url: returnUrl,
      notify_url: notifyUrl,
      order_tags: {} // Always include order_tags as an empty object
    };

    // Add plan if specified
    if (plan) {
      payload.plan = plan;
      
      // Also add plan to order_tags to ensure it's properly formatted for Cashfree
      payload.order_tags = {
        plan_id: plan
      };
    }

    // Your backend wraps the real orderDetails in `data.data`
    const response = await api.post<{ data: CreateOrderResponse }>(
      ENDPOINTS.PAYMENT.CREATE_ORDER,
      payload
    );

    // Unwrap the nested `data`
    return response.data.data;
  } catch (error) {
    console.error('❌ Cashfree API error occurred:', error);
    throw handleApiError(error);
  }
};

/**
 * Verify payment status
 * @param orderId - Order ID to verify
 */
export const verifyPayment = async (orderId: string): Promise<PaymentStatusResponse> => {
  try {
    console.log('🔍 Verifying payment for order:', orderId);
    const endpoint = ENDPOINTS.PAYMENT.VERIFY.replace(':orderId', orderId);
    const response = await api.get<PaymentStatusResponse>(endpoint);
    console.log('✅ Payment verification result:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Payment verification failed:', error);
    throw handleApiError(error);
  }
};

/**
 * Get transaction history for the current user
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 */
export const getTransactionHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`${ENDPOINTS.USER.CREDIT_HISTORY}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch transaction history:', error);
    throw handleApiError(error);
  }
};

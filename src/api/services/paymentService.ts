import api, { handleApiError } from '../client';
import { ENDPOINTS } from '../config';

interface CreateOrderPayload {
  amount: number;
  email: string;
  phone: string;
  return_url: string;
  notify_url: string;
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
}

// Create Cashfree order
export const createOrder = async (
  amount: number,
  email: string,
  phone: string
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
      notify_url: notifyUrl
    };

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

// Verify payment status
export const verifyPayment = async (orderId: string): Promise<PaymentStatusResponse> => {
  try {
    const endpoint = ENDPOINTS.PAYMENT.VERIFY.replace(':orderId', orderId);
    const response = await api.get<PaymentStatusResponse>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw handleApiError(error);
  }
};

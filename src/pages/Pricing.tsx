import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Star, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { services } from '../api';
import { createOrder, verifyPayment } from '../api/services/paymentService';
import { useToast } from '../contexts/ToastContext';

declare global {
  interface Window {
    Cashfree: any;
    CashfreeReady?: boolean;
  }
}

// Load Cashfree SDK v3
const loadCashfreeSDK = (): Promise<void> =>
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

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');

  // When Cashfree redirects back with ?order_id=, verify payment
  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) handlePaymentCallback(orderId);
  }, [searchParams]);

  const handlePaymentCallback = async (orderId: string) => {
    try {
      const res = await verifyPayment(orderId);
      if (res.success) {
        toast({
          title: 'Payment Successful',
          description: `${res.credits_added} credits added to your account.`,
          variant: 'success'
        });
        navigate('/profile');
      } else {
        toast({
          title: 'Payment Failed',
          description: res.error || 'Payment verification failed',
          variant: 'error'
        });
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      toast({
        title: 'Error',
        description: 'Failed to verify payment status',
        variant: 'error'
      });
    }
  };

  // Your pricing plans
  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started with AI image generation",
      features: [
        "1 image per day",
        "Text-to-image generation",
        "Basic style presets",
        "512x512 resolution",
        "Community support",
        "Watermarked images"
      ],
      cta: "Get Started Free",
      popular: false,
      icon: <Star className="h-6 w-6" />
    },
    {
      name: "Pro",
      price: { monthly: 2000, annual: 2000 * 12 },
      description: "30 images per day for professionals",
      features: [
        "30 images per day",
        "All AI tools included",
        "HD resolution (1024x1024)",
        "No watermarks",
        "Priority generation",
        "Thumbnail creator",
        "Logo generator",
        "Profile picture creator",
        "Email support"
      ],
      cta: "Subscribe Now",
      popular: true,
      icon: <Zap className="h-6 w-6" />
    }
  ];

  const creditPacks = [
    { credits: 10, price: 100, popular: false },
    { credits: 50, price: 500, popular: false },
    { credits: 100, price: 1000, popular: true },
    { credits: 250, price: 2500, popular: false }
  ];

  const getPrice = (plan: { price: { monthly: number; annual: number } }) =>
    isAnnual ? plan.price.annual : plan.price.monthly;

  // Called when user clicks a “Purchase” button
  const handlePayment = async (amount: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userPhone = phone || user.phone;
    if (!userPhone) {
      toast({
        title: 'Phone Required',
        description: 'Please enter your phone number to continue',
        variant: 'error'
      });
      return;
    }

    // If newly entered, save it
    if (phone && !user.phone) {
      await services.userService.updateUserProfile({ phone });
    }

    try {
      // 1) Load the Cashfree SDK
      await loadCashfreeSDK();

      // 2) Initialize for production
      const cf = window.Cashfree({ mode: 'production' });

      // 3) Create order on your backend
      //    (this now sends return_url=https://your-domain.com/pricing)
      const { payment_session_id } = await createOrder(
        amount,
        user.email,
        userPhone
      );

      // 4) Redirect to Cashfree checkout
      await cf.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: '_self'
      });

      // After the payment, Cashfree will send the user back to
      // https://your-domain.com/pricing?order_id=<order_id>
      // and your useEffect above will fire handlePaymentCallback()
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({
        title: 'Payment Error',
        description: err.message || 'Please try again',
        variant: 'error'
      });
    }
  };

  // Render input if no phone yet
  const renderPhoneInput = () => {
    if (!user || phone || user.phone) return null;
    return (
      <div className="mb-8 max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          placeholder="+919876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <p className="mt-2 text-sm text-gray-500">
          Required for payment processing. Will be saved for future use.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Billing Toggle */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent{' '}
            <span className="block bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your creative needs. Start free and scale as you grow.
          </p>
          <div className="flex justify-center items-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isAnnual ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual <span className="text-purple-600">(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Phone Input */}
      {renderPhoneInput()}

      {/* Plans Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-purple-600 scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={
                      plan.popular
                        ? 'bg-purple-600 text-white p-2 rounded-lg'
                        : 'bg-purple-100 text-purple-600 p-2 rounded-lg'
                    }
                  >
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                <div>
                  <span className="text-4xl font-bold text-gray-900">₹{getPrice(plan)}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePayment(getPrice(plan))}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Credit Packs Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {creditPacks.map((pack, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-xl shadow-lg ${
                pack.popular ? 'ring-2 ring-purple-600' : 'border border-gray-200'
              }`}
            >
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-gray-900">{pack.credits} credits</div>
                <div className="text-2xl font-bold text-purple-600">₹{pack.price}</div>
                <button
                  onClick={() => handlePayment(pack.price)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white py-2 rounded-lg font-semibold hover:shadow-lg"
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;

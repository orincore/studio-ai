import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Star, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { services } from '../api';
import { createOrder, verifyPayment, loadCashfreeSDK } from '../api/services/paymentService';
import { useToast } from '../contexts/ToastContext';

declare global {
  interface Window {
    Cashfree: any;
    CashfreeReady?: boolean;
  }
}

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // When Cashfree redirects back with ?order_id=, verify payment
  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) handlePaymentCallback(orderId);
  }, [searchParams]);

  const handlePaymentCallback = async (orderId: string) => {
    try {
      setLoading(true);
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
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to verify payment status',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Pricing plans
  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started with AI image generation',
      features: [
        '1 image per day',
        'Text-to-image generation',
        'Basic style presets',
        '512x512 resolution',
        'Community support',
        'Watermarked images'
      ],
      cta: 'Get Started Free',
      popular: false,
      icon: <Star className="h-6 w-6" />,
      planId: 'free'
    },
    {
      name: 'Pro',
      price: 2000,
      description: '30 images per day for professionals',
      features: [
        '30 images per day',
        'All AI tools included',
        'HD resolution (1024x1024)',
        'No watermarks',
        'Priority generation',
        'Profile picture creator',
        'Email support'
      ],
      cta: 'Subscribe Now',
      popular: true,
      icon: <Zap className="h-6 w-6" />,
      planId: 'pro'
    }
  ];

  const creditPacks = [
    { credits: 10, price: 10, popular: false },
    { credits: 50, price: 45, popular: false },
    { credits: 100, price: 80, popular: true },
    { credits: 250, price: 200, popular: false }
  ];

  const handlePayment = async (amount: number, planId?: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // 1) Load the Cashfree SDK
      await loadCashfreeSDK();

      // 2) Initialize for production with your real clientId
      const cf = window.Cashfree({
        mode: 'production',
        clientId: '651133ec7d7623ab9e8f260603331156'
      });

      // 3) Create order on your backend
      const { payment_session_id } = await createOrder(amount, user.email, user.phone || '', planId);

      // 4) Redirect to Cashfree checkout
      await cf.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: '_self'
      });
      // Cashfree will redirect back to /pricing?order_id=...
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({
        title: 'Payment Error',
        description: err.message || 'Please try again',
        variant: 'error'
      });
      setLoading(false);
    }
  };

  const handleCustomAmountSubmit = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'error'
      });
      return;
    }
    handlePayment(amount);
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Header Section */}
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
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto gap-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
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
                  onClick={() => handlePayment(plan.price, plan.planId)}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Credit Packs Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Buy Credits</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            1 Credit = ₹1. Purchase credits to use for generating images on-demand.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto gap-6 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white py-2 rounded-lg font-semibold hover:shadow-lg ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : 'Purchase'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Amount Section */}
        <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Amount</h3>
          <div className="flex space-x-4">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount in ₹"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min="1"
              disabled={loading}
            />
            <button
              onClick={handleCustomAmountSubmit}
              disabled={loading}
              className={`bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Buy Credits'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter any amount to purchase equivalent credits (1 Credit = ₹1)
          </p>
        </div>
      </section>
    </div>
  );
};

export default Pricing;

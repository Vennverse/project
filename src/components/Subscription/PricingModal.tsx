import React, { useState } from 'react';
import { X, Check, Crown, Star } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PricingModalProps {
  onClose: () => void;
}

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      'List up to 1 business',
      'Basic business profile',
      'Standard support',
      'Basic analytics'
    ],
    limitations: [
      'Limited visibility',
      'No featured listings',
      'Basic messaging'
    ],
    buttonText: 'Current Plan',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 50,
    period: 'month',
    description: 'Best for active sellers',
    features: [
      'List up to 5 businesses',
      'Enhanced business profiles',
      'Priority support',
      'Advanced analytics',
      'Featured listings',
      'Premium badge',
      'Advanced messaging',
      'Market insights'
    ],
    buttonText: 'Upgrade to Premium',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 100,
    period: 'month',
    description: 'For serious business brokers',
    features: [
      'Unlimited business listings',
      'Custom business profiles',
      'Dedicated account manager',
      'Comprehensive analytics',
      'Top featured listings',
      'Enterprise badge',
      'White-label messaging',
      'Custom market reports',
      'API access',
      'Custom integrations'
    ],
    buttonText: 'Upgrade to Enterprise',
    popular: false
  }
];

export default function PricingModal({ onClose }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, price: number) => {
    if (price === 0) return; // Free plan
    
    setLoading(planId);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // In a real app, you would call your backend to create a checkout session
      // For now, we'll simulate the process
      console.log(`Creating checkout session for plan: ${planId}, price: $${price}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, you would redirect to Stripe Checkout:
      // const { error } = await stripe.redirectToCheckout({
      //   sessionId: checkoutSession.id
      // });
      
      alert(`Subscription to ${planId} plan would be processed here with Stripe!`);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-lg text-gray-600 mb-2">
              Unlock premium features to grow your business faster
            </h3>
            <p className="text-sm text-gray-500">
              All plans include our core marketplace features. Upgrade for enhanced visibility and tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-6 ${
                  plan.popular
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    {plan.id === 'premium' && <Crown className="h-6 w-6 text-yellow-500 mr-2" />}
                    {plan.id === 'enterprise' && <Star className="h-6 w-6 text-purple-500 mr-2" />}
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                  
                  {plan.limitations && plan.limitations.map((limitation, index) => (
                    <li key={`limitation-${index}`} className="flex items-start opacity-60">
                      <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500 line-through">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id, plan.price)}
                  disabled={loading === plan.id || (plan.price === 0)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    plan.price === 0
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              All plans include a 14-day free trial. Cancel anytime.
            </p>
            <div className="flex justify-center space-x-6 text-xs text-gray-500">
              <span>✓ Secure payments with Stripe</span>
              <span>✓ No setup fees</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
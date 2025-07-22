import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Crown, Check, Star, Headphones, Zap, Shield } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const premiumFeatures = [
  {
    icon: Headphones,
    title: '24/7 Priority Support',
    description: 'Get instant help from our dedicated support team anytime'
  },
  {
    icon: Zap,
    title: 'Priority Processing',
    description: 'Your listings and enquiries get processed first'
  },
  {
    icon: Shield,
    title: 'Guaranteed Assistance',
    description: 'We guarantee to help you find buyers, sellers, or franchise opportunities'
  },
  {
    icon: Star,
    title: 'Premium Badge',
    description: 'Stand out with a premium member badge on all your listings'
  },
  {
    icon: Crown,
    title: 'Exclusive Access',
    description: 'Access to premium-only business opportunities and events'
  }
];

interface PremiumUpgradeProps {
  onClose?: () => void;
}

export default function PremiumUpgrade({ onClose }: PremiumUpgradeProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const plans = {
    monthly: {
      price: 50,
      period: 'month',
      savings: null
    },
    annual: {
      price: 500,
      period: 'year',
      savings: '$100 saved'
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { subscription_id, client_secret } = await apiClient.createSubscription(
        selectedPlan === 'monthly' ? 'premium_monthly' : 'premium_annual',
        user.email
      );

      const { error } = await stripe.confirmPayment({
        clientSecret: client_secret,
        confirmParams: {
          return_url: `${window.location.origin}/premium/success`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      alert('Upgrade failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock exclusive features and get guaranteed assistance in finding your perfect business opportunity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Premium Features</h2>
            <div className="space-y-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Success Guarantee</h4>
              <p className="text-sm text-gray-600">
                We're so confident in our premium service that we guarantee results. 
                If we can't help you find what you're looking for within 90 days, 
                we'll refund your membership fee.
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
            
            {/* Plan Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('annual')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Save $100
                </span>
              </button>
            </div>

            {/* Price Display */}
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ${plans[selectedPlan].price}
                <span className="text-lg font-normal text-gray-600">
                  /{plans[selectedPlan].period}
                </span>
              </div>
              {plans[selectedPlan].savings && (
                <div className="text-green-600 font-medium">
                  {plans[selectedPlan].savings}
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What's included:</h3>
              <ul className="space-y-2">
                {[
                  'Unlimited business listings',
                  '24/7 priority support',
                  'Guaranteed buyer/seller matching',
                  'Premium member badge',
                  'Priority processing',
                  'Exclusive opportunities',
                  'Success guarantee'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Upgrade Button */}
            <button
              onClick={handleUpgrade}
              disabled={loading || !user}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Upgrade to Premium - $${plans[selectedPlan].price}/${plans[selectedPlan].period}`
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Cancel anytime. 30-day money-back guarantee.
            </p>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full mt-4 text-gray-600 hover:text-gray-900 text-sm"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
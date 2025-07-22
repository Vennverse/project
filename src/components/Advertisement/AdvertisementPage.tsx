import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Upload, X, DollarSign, Building, MapPin, Users, Calendar, 
  Globe, AlertCircle, CreditCard, Star 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const adSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().min(1, 'Location is required'),
  contact_email: z.string().email('Please enter a valid email'),
  contact_phone: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  budget: z.number().min(100, 'Minimum budget is $100'),
  duration: z.enum(['30', '60', '90']),
  ad_type: z.enum(['premium', 'featured', 'spotlight'])
});

type AdForm = z.infer<typeof adSchema>;

const adTypes = [
  {
    value: 'premium',
    label: 'Premium Ad',
    price: 99,
    features: ['Highlighted listing', 'Priority placement', '30-day duration'],
    description: 'Get your ad noticed with premium placement'
  },
  {
    value: 'featured',
    label: 'Featured Ad',
    price: 199,
    features: ['Top of search results', 'Featured badge', 'Social media promotion'],
    description: 'Maximum visibility for your advertisement'
  },
  {
    value: 'spotlight',
    label: 'Spotlight Ad',
    price: 299,
    features: ['Homepage banner', 'Newsletter inclusion', 'Dedicated support'],
    description: 'Ultimate exposure with spotlight treatment'
  }
];

export default function AdvertisementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdAdId, setCreatedAdId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<AdForm>({
    resolver: zodResolver(adSchema)
  });

  const selectedAdType = watch('ad_type');
  const selectedDuration = watch('duration');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      setUploadedImages(prev => [...prev, ...acceptedFiles].slice(0, 5));
    }
  });

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const calculatePrice = () => {
    if (!selectedAdType || !selectedDuration) return 0;
    
    const basePrice = adTypes.find(type => type.value === selectedAdType)?.price || 0;
    const durationMultiplier = selectedDuration === '60' ? 1.5 : selectedDuration === '90' ? 2 : 1;
    
    return Math.round(basePrice * durationMultiplier);
  };

  const onSubmit = async (data: AdForm) => {
    if (!user) {
      setError('You must be signed in to create an advertisement');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create advertisement
      const adData = {
        ...data,
        user_id: user.id,
        price: calculatePrice(),
        images: uploadedImages.map(file => file.name) // In production, upload to storage
      };

      const advertisement = await apiClient.createAdvertisement(adData);
      setCreatedAdId(advertisement.id);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to create advertisement');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!createdAdId) return;

    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { client_secret, payment_intent_id } = await apiClient.createPaymentIntent(
        calculatePrice(),
        { ad_id: createdAdId, type: 'advertisement' }
      );

      const { error } = await stripe.confirmPayment({
        clientSecret: client_secret,
        confirmParams: {
          return_url: `${window.location.origin}/advertisement/success?ad_id=${createdAdId}&payment_intent=${payment_intent_id}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">You need to sign in to create an advertisement.</p>
          <button
            onClick={() => navigate('/signin')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Advertisement</h1>
            <p className="text-purple-100">Promote your business to thousands of potential customers</p>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="ml-2 font-medium">Ad Details</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
          </div>

          {currentStep === 1 ? (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Ad Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Advertisement Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {adTypes.map((type) => (
                    <label key={type.value} className="relative">
                      <input
                        {...register('ad_type')}
                        type="radio"
                        value={type.value}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAdType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-lg font-bold text-blue-600">${type.price}</div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {type.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.ad_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.ad_type.message}</p>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advertisement Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Looking for Restaurant Partnership"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="buying">Looking to Buy</option>
                    <option value="selling">Looking to Sell</option>
                    <option value="partnership">Seeking Partnership</option>
                    <option value="franchise">Franchise Opportunity</option>
                    <option value="investment">Investment Opportunity</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide detailed information about what you're looking for or offering..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    {...register('contact_email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  {errors.contact_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    {...register('contact_phone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Location and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, State"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range *
                  </label>
                  <input
                    {...register('budget', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advertisement Duration *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '30', label: '30 Days', multiplier: '1x' },
                    { value: '60', label: '60 Days', multiplier: '1.5x' },
                    { value: '90', label: '90 Days', multiplier: '2x' }
                  ].map((duration) => (
                    <label key={duration.value} className="relative">
                      <input
                        {...register('duration')}
                        type="radio"
                        value={duration.value}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-3 cursor-pointer text-center transition-colors ${
                        selectedDuration === duration.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <div className="font-medium">{duration.label}</div>
                        <div className="text-sm text-gray-500">{duration.multiplier}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (Optional)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {isDragActive
                      ? 'Drop images here...'
                      : 'Drag & drop images here, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Up to 5 images, max 5MB each
                  </p>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Summary */}
              {selectedAdType && selectedDuration && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Price Summary</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Base Price ({adTypes.find(t => t.value === selectedAdType)?.label}):</span>
                      <span>${adTypes.find(t => t.value === selectedAdType)?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration ({selectedDuration} days):</span>
                      <span>×{selectedDuration === '60' ? '1.5' : selectedDuration === '90' ? '2' : '1'}</span>
                    </div>
                    <div className="border-t border-blue-300 pt-1 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${calculatePrice()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Continue to Payment'}
                </button>
              </div>
            </form>
          ) : (
            /* Payment Step */
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
                <p className="text-gray-600">Your advertisement is ready! Complete payment to publish it.</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Advertisement Type:</span>
                      <span>{adTypes.find(t => t.value === selectedAdType)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{selectedDuration} days</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${calculatePrice()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {isLoading ? 'Processing...' : `Pay $${calculatePrice()}`}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your advertisement will be reviewed by our admin team and published once approved and payment is confirmed.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
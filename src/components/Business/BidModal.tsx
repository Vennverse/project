import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Business } from '../../types';
import { X, DollarSign, MessageSquare } from 'lucide-react';

const bidSchema = z.object({
  amount: z.number().min(1000, 'Bid amount must be at least $1,000'),
  message: z.string().min(10, 'Please provide a message with your bid')
});

type BidForm = z.infer<typeof bidSchema>;

interface BidModalProps {
  business: Business;
  onClose: () => void;
  onSubmit: (data: BidForm) => void;
}

export default function BidModal({ business, onClose, onSubmit }: BidModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<BidForm>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: business.asking_price * 0.9 // Default to 90% of asking price
    }
  });

  const bidAmount = watch('amount');

  const handleFormSubmit = async (data: BidForm) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Make an Offer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Business Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{business.title}</h3>
            <div className="text-sm text-gray-600">
              <div>Asking Price: {formatPrice(business.asking_price)}</div>
              <div>Location: {business.location}</div>
            </div>
          </div>

          {/* Bid Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Offer Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                step="1000"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="250000"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
            
            {bidAmount && (
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Offer:</span>
                  <span className="font-medium text-blue-600">{formatPrice(bidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Asking Price:</span>
                  <span className="font-medium">{formatPrice(business.asking_price)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 mt-1">
                  <span className="text-gray-600">Difference:</span>
                  <span className={`font-medium ${
                    bidAmount < business.asking_price ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {bidAmount < business.asking_price ? '-' : '+'}
                    {formatPrice(Math.abs(bidAmount - business.asking_price))}
                    {' '}({((bidAmount / business.asking_price - 1) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Seller *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...register('message')}
                rows={4}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Introduce yourself and explain why you're interested in this business. Include your experience, financing details, and timeline..."
              />
            </div>
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          {/* Terms Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your offer is not legally binding until accepted</li>
              <li>• The seller will be notified of your offer immediately</li>
              <li>• You can modify or withdraw your offer before acceptance</li>
              <li>• All communication should remain professional</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/api';
import { Business, Bid } from '../../types';
import { 
  MapPin, DollarSign, Calendar, Users, Globe, Building, 
  Heart, MessageSquare, TrendingUp, Award, Shield,
  ArrowLeft, Phone, Mail, AlertCircle, CheckCircle
} from 'lucide-react';
import BidModal from './BidModal';

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBusiness();
      fetchBids();
    }
  }, [id]);

  const fetchBusiness = async () => {
    try {
      const fetchedBusiness = await apiClient.getBusiness(id!);
      
      setBusiness(fetchedBusiness);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      // Mock bids data
      const mockBids: Bid[] = [
        {
          id: '1',
          business_id: id!,
          bidder_id: '2',
          amount: 240000,
          message: 'Very interested in this opportunity. I have experience in the food service industry and would like to discuss further.',
          status: 'pending' as const,
          created_at: '2024-01-20',
          updated_at: '2024-01-20',
          profiles: {
            id: '2',
            full_name: 'Sarah Johnson',
            company_name: 'Johnson Investments',
            user_type: 'buyer' as const,
            verified: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          }
        }
      ];
      setBids(mockBids);
    } catch (err: any) {
      console.error('Error fetching bids:', err);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  const handleBidSubmit = async (bidData: { amount: number; message: string }) => {
    if (!user || !business) return;

    try {
      const enquiryData = {
        business_id: business.id,
        user_id: user.id,
        message: bidData.message,
        contact_info: {
          name: user.full_name,
          email: user.email,
          phone: user.phone,
          company: user.company_name
        },
        bid_amount: bidData.amount
      };

      await apiClient.sendEnquiry(enquiryData);
      
      setShowBidModal(false);
      alert('Your enquiry has been sent successfully! The business owner and our admin team will be notified.');
    } catch (err: any) {
      console.error('Error sending enquiry:', err);
      alert('Failed to send enquiry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The business listing you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/businesses')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Businesses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to listings
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  business.business_type === 'franchise'
                    ? 'bg-emerald-100 text-emerald-800'
                    : business.business_type === 'acquisition'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {business.business_type.charAt(0).toUpperCase() + business.business_type.slice(1)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {business.industry}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{business.title}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-5 w-5 mr-1" />
                {business.location}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(business.asking_price)}
                </div>
                <div className="text-sm text-gray-500">Asking Price</div>
              </div>
              
              {user && user.id !== business.owner_id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-lg border ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowBidModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Make Offer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-64 md:h-96 bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <div className="text-white text-6xl font-bold">
                  {business.title.charAt(0)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {business.description}
              </p>
            </div>

            {/* Financial Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {business.revenue ? formatPrice(business.revenue) : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Annual Revenue</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {business.profit ? formatPrice(business.profit) : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Annual Profit</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {business.profit && business.revenue 
                      ? `${((business.profit / business.revenue) * 100).toFixed(1)}%`
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Profit Margin</div>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.established_year && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium">Established</div>
                      <div className="text-gray-600">{business.established_year}</div>
                    </div>
                  </div>
                )}
                
                {business.employees && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium">Employees</div>
                      <div className="text-gray-600">{business.employees}</div>
                    </div>
                  </div>
                )}
                
                {business.website_url && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium">Website</div>
                      <a 
                        href={business.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Industry</div>
                    <div className="text-gray-600">{business.industry}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise Information */}
            {business.business_type === 'franchise' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Franchise Information</h2>
                <div className="space-y-4">
                  {business.franchise_fee && (
                    <div className="flex justify-between">
                      <span className="font-medium">Franchise Fee:</span>
                      <span className="text-green-600 font-semibold">
                        {formatPrice(business.franchise_fee)}
                      </span>
                    </div>
                  )}
                  
                  {business.royalty_fee && (
                    <div className="flex justify-between">
                      <span className="font-medium">Royalty Fee:</span>
                      <span className="text-blue-600 font-semibold">
                        {business.royalty_fee}%
                      </span>
                    </div>
                  )}
                  
                  {business.territory_available && (
                    <div>
                      <span className="font-medium">Territory Available:</span>
                      <p className="text-gray-600 mt-1">{business.territory_available}</p>
                    </div>
                  )}
                  
                  {business.support_training && (
                    <div>
                      <span className="font-medium">Support & Training:</span>
                      <p className="text-gray-600 mt-1">{business.support_training}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">
                      {business.profiles?.full_name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{business.profiles?.full_name}</div>
                    {business.profiles?.company_name && (
                      <div className="text-sm text-gray-600">{business.profiles.company_name}</div>
                    )}
                  </div>
                  {business.profiles?.verified && (
                    <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                  )}
                </div>
                
                {user && user.id !== business.owner_id && (
                  <div className="space-y-2 pt-4 border-t">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </button>
                    {business.profiles?.phone && (
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Seller
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{business.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium">
                    {new Date(business.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {business.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Bids */}
            {user && user.id === business.owner_id && bids.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bids</h3>
                <div className="space-y-3">
                  {bids.slice(0, 3).map((bid) => (
                    <div key={bid.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{formatPrice(bid.amount)}</div>
                          <div className="text-sm text-gray-600">
                            by {bid.profiles?.full_name}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bid.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : bid.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bid.status}
                        </span>
                      </div>
                      {bid.message && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {bid.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <BidModal
          business={business}
          onClose={() => setShowBidModal(false)}
          onSubmit={handleBidSubmit}
        />
      )}
    </div>
  );
}
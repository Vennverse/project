import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Building2, Plus, Eye, Heart, MessageSquare, DollarSign, 
  TrendingUp, Users, Calendar, Crown, Settings 
} from 'lucide-react';
import { Business, Bid, Message } from '../../types';
import PricingModal from '../Subscription/PricingModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for dashboard
      const mockBusinesses: Business[] = [
        {
          id: '1',
          title: 'Premium Coffee Franchise',
          description: 'Established coffee franchise with prime location',
          industry: 'Restaurant & Food Service',
          business_type: 'franchise' as const,
          location: 'New York, NY',
          asking_price: 250000,
          revenue: 500000,
          status: 'active' as const,
          featured: true,
          views: 245,
          created_at: '2024-01-15',
          updated_at: '2024-01-15',
          owner_id: user?.id || '1'
        }
      ];

      const mockBids: Bid[] = [
        {
          id: '1',
          business_id: '1',
          bidder_id: '2',
          amount: 240000,
          message: 'Very interested in this opportunity',
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

      const mockMessages: Message[] = [
        {
          id: '1',
          business_id: '1',
          sender_id: '2',
          recipient_id: user?.id || '1',
          subject: 'Interest in Coffee Franchise',
          content: 'I would like to learn more about this opportunity.',
          read: false,
          created_at: '2024-01-21'
        }
      ];

      setBusinesses(mockBusinesses);
      setBids(mockBids);
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  const stats = [
    {
      label: 'Active Listings',
      value: businesses.filter(b => b.status === 'active').length,
      icon: Building2,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Total Views',
      value: businesses.reduce((sum, b) => sum + b.views, 0),
      icon: Eye,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Pending Bids',
      value: bids.filter(b => b.status === 'pending').length,
      icon: DollarSign,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Unread Messages',
      value: messages.filter(m => !m.read).length,
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.full_name}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <button
                onClick={() => setShowPricingModal(true)}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Plan
              </button>
              <Link
                to="/list-business"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Business
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Listings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Listings</h2>
                <Link
                  to="/list-business"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add New
                </Link>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No listings yet</p>
                  <Link
                    to="/list-business"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {businesses.map((business) => (
                    <div key={business.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{business.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{business.location}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {business.views} views
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {formatPrice(business.asking_price)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            business.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {business.status}
                          </span>
                          {business.featured && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            {/* Recent Bids */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bids</h2>
              </div>
              <div className="p-6">
                {bids.length === 0 ? (
                  <div className="text-center py-4">
                    <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No bids yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bids.slice(0, 3).map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{formatPrice(bid.amount)}</p>
                          <p className="text-sm text-gray-600">from {bid.profiles?.full_name}</p>
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
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                  <Link
                    to="/messages"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {messages.length === 0 ? (
                  <div className="text-center py-4">
                    <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.slice(0, 3).map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg ${
                        !message.read ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{message.subject}</p>
                          {!message.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal onClose={() => setShowPricingModal(false)} />
      )}
    </div>
  );
}
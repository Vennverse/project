import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Users, ArrowRight, Crown } from 'lucide-react';
import { Business } from '../../types';

export default function FranchiseList() {
  const [franchises, setFranchises] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const industries = [
    'All Industries',
    'Restaurant & Food Service',
    'Retail & E-commerce',
    'Healthcare & Medical',
    'Education & Training',
    'Automotive',
    'Beauty & Wellness',
    'Professional Services',
    'Other'
  ];

  useEffect(() => {
    fetchFranchises();
  }, []);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      
      // Mock franchise data
      const mockFranchises: Business[] = [
        {
          id: '1',
          title: 'Premium Coffee Franchise',
          description: 'Join our successful coffee franchise network with proven systems, comprehensive training, and ongoing support. Perfect for entrepreneurs looking to enter the booming coffee industry.',
          industry: 'Restaurant & Food Service',
          business_type: 'franchise' as const,
          location: 'Multiple Locations Available',
          asking_price: 250000,
          franchise_fee: 45000,
          royalty_fee: 6.0,
          territory_available: 'Nationwide - Protected territories',
          support_training: '2-week comprehensive training, ongoing marketing support, operations manual',
          revenue: 500000,
          established_year: 2015,
          employees: 12,
          status: 'active' as const,
          featured: true,
          views: 245,
          created_at: '2024-01-15',
          updated_at: '2024-01-15',
          owner_id: '1'
        },
        {
          id: '2',
          title: 'Fast Casual Restaurant Franchise',
          description: 'Award-winning fast casual concept with healthy menu options. Proven business model with strong unit economics and growing customer demand.',
          industry: 'Restaurant & Food Service',
          business_type: 'franchise' as const,
          location: 'Major Metro Areas',
          asking_price: 350000,
          franchise_fee: 65000,
          royalty_fee: 5.5,
          territory_available: 'Regional territories available',
          support_training: 'Comprehensive 3-week training program, site selection assistance',
          revenue: 750000,
          established_year: 2012,
          employees: 18,
          status: 'active' as const,
          featured: true,
          views: 189,
          created_at: '2024-01-10',
          updated_at: '2024-01-10',
          owner_id: '2'
        },
        {
          id: '3',
          title: 'Fitness Studio Franchise',
          description: 'Revolutionary fitness concept combining technology with personalized training. Low overhead, high-margin business model.',
          industry: 'Beauty & Wellness',
          business_type: 'franchise' as const,
          location: 'Suburban Markets',
          asking_price: 180000,
          franchise_fee: 39000,
          royalty_fee: 7.0,
          territory_available: 'Protected 3-mile radius',
          support_training: 'Equipment training, marketing launch support, ongoing coaching',
          revenue: 400000,
          established_year: 2018,
          employees: 8,
          status: 'active' as const,
          featured: false,
          views: 156,
          created_at: '2024-01-08',
          updated_at: '2024-01-08',
          owner_id: '3'
        },
        {
          id: '4',
          title: 'Auto Service Franchise',
          description: 'Leading automotive service franchise with multiple revenue streams. Established brand with strong customer loyalty.',
          industry: 'Automotive',
          business_type: 'franchise' as const,
          location: 'Urban & Suburban',
          asking_price: 420000,
          franchise_fee: 55000,
          royalty_fee: 6.5,
          territory_available: 'Metro area exclusivity',
          support_training: 'Technical training, business operations, marketing support',
          revenue: 850000,
          established_year: 2010,
          employees: 15,
          status: 'active' as const,
          featured: false,
          views: 203,
          created_at: '2024-01-05',
          updated_at: '2024-01-05',
          owner_id: '4'
        }
      ];

      // Apply filters
      let filteredFranchises = mockFranchises;

      if (searchQuery) {
        filteredFranchises = filteredFranchises.filter(franchise =>
          franchise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          franchise.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedIndustry && selectedIndustry !== 'All Industries') {
        filteredFranchises = filteredFranchises.filter(franchise =>
          franchise.industry === selectedIndustry
        );
      }

      if (priceRange.min) {
        filteredFranchises = filteredFranchises.filter(franchise =>
          franchise.asking_price >= parseInt(priceRange.min)
        );
      }

      if (priceRange.max) {
        filteredFranchises = filteredFranchises.filter(franchise =>
          franchise.asking_price <= parseInt(priceRange.max)
        );
      }

      setFranchises(filteredFranchises);
    } catch (error) {
      console.error('Error fetching franchises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFranchises();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-4xl font-bold mb-4">Franchise Opportunities</h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Discover proven franchise systems with established brands, comprehensive training, 
              and ongoing support to help you succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search franchise opportunities..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {industries.map((industry) => (
                    <option key={industry} value={industry === 'All Industries' ? '' : industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Investment
                </label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Investment
                </label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${franchises.length} franchise opportunities found`}
          </p>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            <option>Sort by: Featured First</option>
            <option>Investment: Low to High</option>
            <option>Investment: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : franchises.length === 0 ? (
          <div className="text-center py-12">
            <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No franchises found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('');
                setPriceRange({ min: '', max: '' });
                fetchFranchises();
              }}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {franchises.map((franchise) => (
              <div
                key={franchise.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-500 to-blue-500 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {franchise.title.charAt(0)}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                      Franchise
                    </span>
                  </div>
                  {franchise.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Crown className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {franchise.location}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {franchise.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {franchise.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Total Investment:</span>
                      <span className="font-semibold text-emerald-600 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatPrice(franchise.asking_price)}
                      </span>
                    </div>
                    
                    {franchise.franchise_fee && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Franchise Fee:</span>
                        <span className="font-medium">{formatPrice(franchise.franchise_fee)}</span>
                      </div>
                    )}
                    
                    {franchise.royalty_fee && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Royalty Fee:</span>
                        <span className="font-medium">{franchise.royalty_fee}%</span>
                      </div>
                    )}
                    
                    {franchise.employees && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Avg. Employees:</span>
                        <span className="font-medium flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {franchise.employees}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {franchise.industry}
                    </span>
                    
                    <Link
                      to={`/franchise/${franchise.id}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm group"
                    >
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
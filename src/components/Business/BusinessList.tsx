import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Calendar, Users, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { db } from '../../lib/supabase';
import { Business } from '../../types';

const industries = [
  'All Industries',
  'Restaurant & Food Service',
  'Retail & E-commerce',
  'Technology & Software',
  'Healthcare & Medical',
  'Education & Training',
  'Real Estate',
  'Manufacturing',
  'Professional Services',
  'Automotive',
  'Beauty & Wellness',
  'Entertainment & Recreation',
  'Transportation & Logistics',
  'Construction',
  'Agriculture',
  'Other'
];

const businessTypes = [
  { value: '', label: 'All Types' },
  { value: 'franchise', label: 'Franchises' },
  { value: 'acquisition', label: 'Business Sales' },
  { value: 'partnership', label: 'Partnerships' }
];

export default function BusinessList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('min_price') || '',
    max: searchParams.get('max_price') || ''
  });
  const [location, setLocation] = useState(searchParams.get('location') || '');

  useEffect(() => {
    fetchBusinesses();
  }, [searchParams, selectedIndustry, selectedType, priceRange, location]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      
      // Mock business data for static deployment
      const mockBusinesses = [
        {
          id: '1',
          title: 'Premium Coffee Franchise',
          description: 'Established coffee franchise with prime location and loyal customer base.',
          industry: 'Restaurant & Food Service',
          business_type: 'franchise' as const,
          location: 'New York, NY',
          asking_price: 250000,
          revenue: 500000,
          established_year: 2018,
          employees: 12,
          status: 'active' as const,
          featured: true,
          views: 245,
          created_at: '2024-01-15',
          updated_at: '2024-01-15',
          owner_id: '1',
          business_images: [],
          profiles: { full_name: 'John Smith', company_name: 'Smith Enterprises' }
        },
        {
          id: '2',
          title: 'Tech Startup Acquisition',
          description: 'Growing SaaS platform with recurring revenue and strong market position.',
          industry: 'Technology & Software',
          business_type: 'acquisition' as const,
          location: 'San Francisco, CA',
          asking_price: 1200000,
          revenue: 800000,
          established_year: 2020,
          employees: 8,
          status: 'active' as const,
          featured: true,
          views: 189,
          created_at: '2024-01-10',
          updated_at: '2024-01-10',
          owner_id: '2',
          business_images: [],
          profiles: { full_name: 'Sarah Johnson', company_name: 'Tech Innovations' }
        },
        {
          id: '3',
          title: 'Retail Chain Partnership',
          description: 'Successful retail chain looking for strategic partnership to expand.',
          industry: 'Retail & E-commerce',
          business_type: 'partnership' as const,
          location: 'Chicago, IL',
          asking_price: 750000,
          revenue: 1200000,
          established_year: 2015,
          employees: 25,
          status: 'active' as const,
          featured: false,
          views: 156,
          created_at: '2024-01-08',
          updated_at: '2024-01-08',
          owner_id: '3',
          business_images: [],
          profiles: { full_name: 'Mike Wilson', company_name: 'Retail Solutions' }
        },
        {
          id: '4',
          title: 'Restaurant Chain Franchise',
          description: 'Fast-casual restaurant concept with proven business model.',
          industry: 'Restaurant & Food Service',
          business_type: 'franchise' as const,
          location: 'Los Angeles, CA',
          asking_price: 350000,
          revenue: 600000,
          established_year: 2017,
          employees: 15,
          status: 'active' as const,
          featured: false,
          views: 203,
          created_at: '2024-01-05',
          updated_at: '2024-01-05',
          owner_id: '4',
          business_images: [],
          profiles: { full_name: 'Lisa Chen', company_name: 'Food Ventures' }
        }
      ];

      // Apply filters
      let filteredBusinesses = mockBusinesses;
      if (searchQuery) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedIndustry && selectedIndustry !== 'All Industries') {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.industry === selectedIndustry
        );
      }

      if (selectedType) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.business_type === selectedType
        );
      }

      if (priceRange.min) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.asking_price >= parseInt(priceRange.min)
        );
      }

      if (priceRange.max) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.asking_price <= parseInt(priceRange.max)
        );
      }

      if (location) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      setBusinesses(filteredBusinesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  const updateFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (selectedIndustry && selectedIndustry !== 'All Industries') params.set('industry', selectedIndustry);
    if (selectedType) params.set('type', selectedType);
    if (priceRange.min) params.set('min_price', priceRange.min);
    if (priceRange.max) params.set('max_price', priceRange.max);
    if (location) params.set('location', location);

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('');
    setSelectedType('');
    setPriceRange({ min: '', max: '' });
    setLocation('');
    setSearchParams(new URLSearchParams());
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Businesses</h1>
              <p className="text-gray-600 mt-2">Discover your next business opportunity</p>
            </div>
            <Link
              to="/list-business"
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              List Your Business
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses, franchises, or keywords..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    Business Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="No limit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={updateFilters}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${businesses.length} businesses found`}
          </p>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Sort by: Most Recent</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Viewed</option>
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
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-emerald-500 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {business.title.charAt(0)}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      business.business_type === 'franchise'
                        ? 'bg-emerald-100 text-emerald-800'
                        : business.business_type === 'acquisition'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {business.business_type.charAt(0).toUpperCase() + business.business_type.slice(1)}
                    </span>
                  </div>
                  {business.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {business.location}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {business.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {business.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Asking Price:</span>
                      <span className="font-semibold text-green-600 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatPrice(business.asking_price)}
                      </span>
                    </div>
                    
                    {business.revenue && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Annual Revenue:</span>
                        <span className="font-medium">{formatPrice(business.revenue)}</span>
                      </div>
                    )}
                    
                    {business.established_year && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Established:</span>
                        <span className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {business.established_year}
                        </span>
                      </div>
                    )}
                    
                    {business.employees && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Employees:</span>
                        <span className="font-medium flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {business.employees}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {business.industry}
                    </span>
                    
                    <Link
                      to={`/business/${business.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
                    >
                      View Details
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
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Users, ArrowRight } from 'lucide-react';
import { db } from '../../lib/supabase';
import { Business } from '../../types';

export default function FeaturedBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // Mock data for now since database might not be connected
        const mockBusinesses = [
          {
            id: '1',
            title: 'Premium Coffee Franchise',
            description: 'Established coffee franchise with prime location and loyal customer base. Perfect opportunity for expansion.',
            industry: 'Food & Beverage',
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
            owner_id: '1'
          },
          {
            id: '2',
            title: 'Tech Startup Acquisition',
            description: 'Growing SaaS platform with recurring revenue and strong market position. Ready for strategic acquisition.',
            industry: 'Technology',
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
            owner_id: '2'
          },
          {
            id: '3',
            title: 'Retail Chain Partnership',
            description: 'Successful retail chain looking for strategic partnership to expand into new markets.',
            industry: 'Retail',
            business_type: 'partnership' as const,
            location: 'Chicago, IL',
            asking_price: 750000,
            revenue: 1200000,
            established_year: 2015,
            employees: 25,
            status: 'active' as const,
            featured: true,
            views: 156,
            created_at: '2024-01-08',
            updated_at: '2024-01-08',
            owner_id: '3'
          }
        ];
        setBusinesses(mockBusinesses);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
            <p className="text-lg text-gray-600">Discover premium businesses ready for acquisition</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
          <p className="text-lg text-gray-600">Discover premium businesses ready for acquisition</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-emerald-500 overflow-hidden">
                {business.business_images && business.business_images.length > 0 ? (
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt={business.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-lg font-semibold">
                    {business.title.charAt(0)}
                  </div>
                )}
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

        <div className="text-center">
          <Link
            to="/businesses"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Opportunities
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
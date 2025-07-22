import React from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Shield, Users } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-emerald-600/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Buy & Sell
              <span className="block text-emerald-400">Premium Businesses</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              The world's most trusted marketplace for business acquisitions, 
              franchises, and strategic partnerships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/businesses"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors group"
              >
                <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Browse Opportunities
              </Link>
              <Link
                to="/list-business"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                List Your Business
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">1,000+</div>
                <div className="text-sm text-blue-200">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">$2.5B+</div>
                <div className="text-sm text-blue-200">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">95%</div>
                <div className="text-sm text-blue-200">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <TrendingUp className="h-12 w-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Market Intelligence</h3>
              <p className="text-blue-100">
                Get real-time valuations and market insights to make informed decisions.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Shield className="h-12 w-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Secure Transactions</h3>
              <p className="text-blue-100">
                Bank-level security with escrow services and verified business listings.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Users className="h-12 w-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Expert Support</h3>
              <p className="text-blue-100">
                Dedicated advisors to guide you through every step of the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
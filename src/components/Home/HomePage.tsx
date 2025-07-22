import React from 'react';
import Hero from './Hero';
import FeaturedBusinesses from './FeaturedBusinesses';
import { Target, Award, Users, TrendingUp, Shield, MessageSquare } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Target,
      title: 'Targeted Matching',
      description: 'Our AI-powered platform matches buyers with the perfect business opportunities based on their criteria and investment goals.'
    },
    {
      icon: Award,
      title: 'Verified Listings',
      description: 'Every business listing is thoroughly vetted and verified by our team of experts to ensure authenticity and accuracy.'
    },
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Access our network of business brokers, lawyers, and advisors to guide you through the acquisition process.'
    },
    {
      icon: TrendingUp,
      title: 'Market Analytics',
      description: 'Get comprehensive market data and business valuations to make informed investment decisions.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Bank-level security with escrow services and legal protection for all transactions on our platform.'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Connect directly with business owners and negotiate deals through our secure messaging system.'
    }
  ];

  const stats = [
    { label: 'Businesses Sold', value: '2,500+' },
    { label: 'Active Buyers', value: '15,000+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Average Deal Size', value: '$1.2M' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Featured Businesses */}
      <FeaturedBusinesses />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BizMarket?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide the tools, expertise, and security you need to successfully buy or sell businesses online.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-blue-100">
              Join the growing community of successful business owners
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're looking to buy your next business or sell your current one, 
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/businesses"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Opportunities
            </a>
            <a
              href="/list-business"
              className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              List Your Business
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
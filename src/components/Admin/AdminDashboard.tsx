import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/api';
import { 
  Users, Building2, DollarSign, TrendingUp, Eye, MessageSquare,
  Shield, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { Business, User, Bid } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  useEffect(() => {
    if (user?.user_type === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      const dashboardData = await apiClient.getAdminDashboard();
      const enquiriesData = await apiClient.getEnquiries();
      
      setBusinesses(dashboardData.recent_businesses || []);
      setEnquiries(enquiriesData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBusiness = async (businessId: string) => {
    try {
      await apiClient.approveBusiness(businessId);
      alert('Business approved successfully!');
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error approving business:', error);
      alert('Failed to approve business');
    }
  };

  const handleRejectBusiness = async (businessId: string) => {
    try {
      await apiClient.rejectBusiness(businessId);
      alert('Business rejected successfully!');
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting business:', error);
      alert('Failed to reject business');
    }
  };

  if (!user || user.user_type !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: enquiries.filter(e => e.type === 'new_user').length || 0,
      change: '+12%',
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Active Listings',
      value: businesses.filter(b => b.status === 'active').length,
      change: '+8%',
      icon: Building2,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Total Bids',
      value: enquiries.filter(e => e.type === 'business_enquiry').length || 0,
      change: '+15%',
      icon: DollarSign,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Total Views',
      value: businesses.reduce((sum, b) => sum + b.views, 0),
      change: '+23%',
      icon: Eye,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const chartData = [
    { name: 'Jan', users: 65, listings: 28, bids: 45 },
    { name: 'Feb', users: 78, listings: 35, bids: 52 },
    { name: 'Mar', users: 90, listings: 42, bids: 61 },
    { name: 'Apr', users: 105, listings: 48, bids: 73 },
    { name: 'May', users: 125, listings: 55, bids: 89 },
    { name: 'Jun', users: 142, listings: 62, bids: 95 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage platform activity</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Admin Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} />
                <Line type="monotone" dataKey="listings" stroke="#059669" strokeWidth={2} />
                <Line type="monotone" dataKey="bids" stroke="#DC2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#2563EB" />
                <Bar dataKey="listings" fill="#059669" />
                <Bar dataKey="bids" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.slice(0, 5).map((enquiry) => (
                    <tr key={enquiry.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{enquiry.type}</div>
                          <div className="text-sm text-gray-500">{enquiry.message}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {enquiry.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {enquiry.status === 'read' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Listings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Listings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businesses.map((business) => (
                    <tr key={business.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{business.title}</div>
                          <div className="text-sm text-gray-500">{business.location}</div>
                          {business.status === 'pending' && (
                            <div className="mt-2 space-x-2">
                              <button
                                onClick={() => handleApproveBusiness(business.id)}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectBusiness(business.id)}
                                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${business.asking_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          business.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : business.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {business.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './components/Home/HomePage';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import BusinessList from './components/Business/BusinessList';
import BusinessDetail from './components/Business/BusinessDetail';
import ListBusiness from './components/Business/ListBusiness';
import FranchiseList from './components/Franchise/FranchiseList';
import AdvertisementPage from './components/Advertisement/AdvertisementPage';
import PremiumUpgrade from './components/Subscription/PremiumUpgrade';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/signin" />;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/businesses" element={<BusinessList />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/franchises" element={<FranchiseList />} />
          <Route path="/franchise/:id" element={<BusinessDetail />} />
          <Route path="/advertise" element={
            <ProtectedRoute>
              <AdvertisementPage />
            </ProtectedRoute>
          } />
          <Route path="/premium" element={
            <ProtectedRoute>
              <PremiumUpgrade />
            </ProtectedRoute>
          } />
          <Route path="/list-business" element={
            <ProtectedRoute>
              <ListBusiness />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// Additional Page Components
function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Your favorite businesses will be displayed here.</p>
          <p className="text-sm text-gray-500">Sign in and start favoriting businesses to see them in this list.</p>
        </div>
      </div>
    </div>
  );
}

function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Your messages will be displayed here.</p>
          <p className="text-sm text-gray-500">Connect with business owners and potential buyers through our messaging system.</p>
        </div>
      </div>
    </div>
  );
}

function SearchResults() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Results</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Search functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About BizMarket</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600 mb-4">
            BizMarket is the premier marketplace for buying and selling businesses and franchises worldwide.
          </p>
          <p className="text-gray-600">
            We connect entrepreneurs, investors, and business owners to facilitate successful transactions.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600 mb-4">Get in touch with our team:</p>
          <div className="space-y-2">
            <p><strong>Email:</strong> support@bizmarket.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> New York, NY</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Go Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
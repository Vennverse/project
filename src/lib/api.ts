// API client for Netlify Functions
const API_BASE = '/.netlify/functions';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Authentication
  async signIn(email: string, password: string) {
    const result = await this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'signin', email, password }),
    });
    
    if (result.token) {
      this.setToken(result.token);
    }
    
    return result;
  }

  async signUp(email: string, password: string, userData: any) {
    const result = await this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'signup', email, password, userData }),
    });
    
    if (result.token) {
      this.setToken(result.token);
    }
    
    return result;
  }

  async verifyToken() {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'verify' }),
    });
  }

  // Businesses
  async getBusinesses() {
    return this.request('/businesses');
  }

  async getBusiness(id: string) {
    return this.request(`/businesses/${id}`);
  }

  async createBusiness(businessData: any) {
    return this.request('/businesses', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', ...businessData }),
    });
  }

  async sendEnquiry(enquiryData: any) {
    return this.request('/businesses', {
      method: 'POST',
      body: JSON.stringify({ action: 'enquiry', ...enquiryData }),
    });
  }

  // Admin
  async getAdminDashboard() {
    return this.request('/admin', {
      method: 'POST',
      body: JSON.stringify({ action: 'get_dashboard' }),
    });
  }

  async approveBusiness(businessId: string) {
    return this.request('/admin', {
      method: 'POST',
      body: JSON.stringify({ action: 'approve_business', business_id: businessId }),
    });
  }

  async rejectBusiness(businessId: string) {
    return this.request('/admin', {
      method: 'POST',
      body: JSON.stringify({ action: 'reject_business', business_id: businessId }),
    });
  }

  async getEnquiries() {
    return this.request('/admin', {
      method: 'POST',
      body: JSON.stringify({ action: 'get_enquiries' }),
    });
  }

  // Advertisements
  async getAdvertisements() {
    return this.request('/advertisements');
  }

  async createAdvertisement(adData: any) {
    return this.request('/advertisements', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', ...adData }),
    });
  }

  async confirmAdPayment(adId: string, paymentIntentId: string) {
    return this.request('/advertisements', {
      method: 'POST',
      body: JSON.stringify({ 
        action: 'payment_success', 
        ad_id: adId, 
        payment_intent_id: paymentIntentId 
      }),
    });
  }

  // Stripe Payments
  async createPaymentIntent(amount: number, metadata: any = {}) {
    return this.request('/stripe-payment', {
      method: 'POST',
      body: JSON.stringify({ 
        action: 'create_payment_intent', 
        amount, 
        metadata 
      }),
    });
  }

  async createSubscription(planId: string, customerEmail: string) {
    return this.request('/stripe-payment', {
      method: 'POST',
      body: JSON.stringify({ 
        action: 'create_subscription', 
        plan_id: planId, 
        customer_email: customerEmail 
      }),
    });
  }
}

export const apiClient = new ApiClient();
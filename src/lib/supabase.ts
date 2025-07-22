import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl.length > 0 && 
         supabaseAnonKey.length > 0;
};

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    if (!isSupabaseConfigured()) {
      // Return mock success for static deployment
      return { 
        data: { user: { id: 'mock-user-id', email } }, 
        error: null 
      };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Return mock success for static deployment
      console.log('Demo mode: Signing in user:', email);
      return { 
        data: { user: { id: 'mock-user-id', email } }, 
        error: null 
      };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  resetPassword: async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },

  getCurrentUser: () => {
    if (!isSupabaseConfigured()) {
      return Promise.resolve({ data: { user: null }, error: null });
    }
    return supabase.auth.getUser();
  }
};

// Database helpers
export const db = {
  // Profile operations
  getProfile: async (userId: string) => {
    if (!isSupabaseConfigured()) {
      // Return mock profile for static deployment
      return { 
        data: {
          id: userId,
          email: 'demo@example.com',
          full_name: 'Demo User',
          user_type: 'buyer',
          verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
  },

  updateProfile: async (userId: string, updates: any) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  },

  // Business operations
  getBusinesses: async (filters?: any) => {
    if (!isSupabaseConfigured()) {
      // Return mock businesses for static deployment
      const mockBusinesses = [
        {
          id: '1',
          title: 'Premium Coffee Franchise',
          description: 'Established coffee franchise with prime location and loyal customer base.',
          industry: 'Restaurant & Food Service',
          business_type: 'franchise',
          location: 'New York, NY',
          asking_price: 250000,
          revenue: 500000,
          established_year: 2018,
          employees: 12,
          status: 'active',
          featured: true,
          views: 245,
          created_at: '2024-01-15',
          updated_at: '2024-01-15',
          owner_id: '1',
          business_images: [],
          profiles: { full_name: 'John Smith', company_name: 'Smith Enterprises' }
        }
      ];
      return { data: mockBusinesses, error: null };
    }
    
    let query = supabase
      .from('businesses')
      .select(`
        *,
        business_images(image_url, alt_text, is_primary),
        profiles(full_name, company_name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters?.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters?.business_type) {
      query = query.eq('business_type', filters.business_type);
    }
    if (filters?.min_price) {
      query = query.gte('asking_price', filters.min_price);
    }
    if (filters?.max_price) {
      query = query.lte('asking_price', filters.max_price);
    }

    return await query;
  },

  getBusiness: async (id: string) => {
    if (!isSupabaseConfigured()) {
      // Return mock business for static deployment
      const mockBusiness = {
        id: id,
        title: 'Premium Coffee Franchise',
        description: 'Established coffee franchise with prime location and loyal customer base.',
        industry: 'Restaurant & Food Service',
        business_type: 'franchise',
        location: 'New York, NY',
        asking_price: 250000,
        revenue: 500000,
        established_year: 2018,
        employees: 12,
        status: 'active',
        featured: true,
        views: 245,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
        owner_id: '1',
        business_images: [],
        profiles: { 
          full_name: 'John Smith', 
          company_name: 'Smith Enterprises',
          phone: '+1 (555) 123-4567',
          email: 'john@example.com'
        }
      };
      return { data: mockBusiness, error: null };
    }
    
    return await supabase
      .from('businesses')
      .select(`
        *,
        business_images(image_url, alt_text, is_primary, display_order),
        profiles(full_name, company_name, phone, email)
      `)
      .eq('id', id)
      .single();
  },

  createBusiness: async (businessData: any) => {
    if (!isSupabaseConfigured()) {
      // Return mock success for static deployment
      return { 
        data: { 
          id: 'mock-business-id', 
          ...businessData,
          created_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    
    return await supabase
      .from('businesses')
      .insert(businessData)
      .select()
      .single();
  },

  // Bid operations
  getBids: async (businessId: string) => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }
    
    return await supabase
      .from('bids')
      .select(`
        *,
        profiles(full_name, company_name)
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
  },

  createBid: async (bidData: any) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    
    return await supabase
      .from('bids')
      .insert(bidData);
  },

  // Favorites operations
  getFavorites: async (userId: string) => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }
    
    return await supabase
      .from('favorites')
      .select(`
        *,
        businesses(
          *,
          business_images(image_url, is_primary)
        )
      `)
      .eq('user_id', userId);
  },

  addFavorite: async (userId: string, businessId: string) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    
    return await supabase
      .from('favorites')
      .insert({ user_id: userId, business_id: businessId });
  },

  removeFavorite: async (userId: string, businessId: string) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    
    return await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('business_id', businessId);
  }
};
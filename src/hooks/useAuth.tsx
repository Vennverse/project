import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('demo_user');
    const storedToken = localStorage.getItem('demo_token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        setUser(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_token');
      }
    } else {
      setLoading(false);
    }
  }, []);


  const signIn = async (email: string, password: string) => {
    try {
      const result = await apiClient.signIn(email, password);
      setUser(result.user);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // For static deployment, create a mock user immediately
      const mockUser = {
        id: 'user-' + Date.now(),
        email,
        full_name: userData.full_name,
        company_name: userData.company_name || '',
        phone: userData.phone || '',
        user_type: userData.user_type,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      localStorage.setItem('demo_token', 'demo-token-' + mockUser.id);
      
      setUser(mockUser);
      return { data: { user: mockUser }, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signOut = async () => {
    apiClient.clearToken();
      // For static deployment, check if user exists in localStorage
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        localStorage.setItem('demo_token', 'demo-token-' + user.id);
        setUser(user);
        return { data: { user }, error: null };
      }
      
      // Create a demo user for any email/password combination
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        full_name: email.includes('admin') ? 'Admin User' : 'Demo User',
        company_name: 'Demo Company',
        phone: '+1 (555) 123-4567',
        user_type: email.includes('admin') ? 'admin' : 'buyer',
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      localStorage.setItem('demo_token', 'demo-token-' + mockUser.id);
      
      setUser(mockUser);
      return { data: { user: mockUser }, error: null };
  }
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_token');
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
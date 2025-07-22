/*
  # B2B Marketplace Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `businesses` - Business listings with franchise details
    - `business_images` - Images for business listings
    - `bids` - Bidding system for businesses
    - `messages` - Communication between users
    - `favorites` - User saved businesses
    - `admin_settings` - Admin configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only policies for admin tables
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  company_name text,
  phone text,
  avatar_url text,
  user_type text NOT NULL CHECK (user_type IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business listings table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  industry text NOT NULL,
  business_type text NOT NULL CHECK (business_type IN ('franchise', 'acquisition', 'partnership')),
  location text NOT NULL,
  asking_price numeric(15,2) NOT NULL,
  revenue numeric(15,2),
  profit numeric(15,2),
  established_year integer,
  employees integer,
  website_url text,
  franchise_fee numeric(15,2),
  royalty_fee numeric(5,2),
  territory_available text,
  support_training text,
  status text NOT NULL CHECK (status IN ('active', 'sold', 'pending', 'draft')) DEFAULT 'active',
  featured boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business images table
CREATE TABLE IF NOT EXISTS business_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  bidder_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric(15,2) NOT NULL,
  message text,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject text,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, business_id)
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Anyone can read active businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (status = 'active' OR owner_id = auth.uid());

CREATE POLICY "Owners can manage their businesses"
  ON businesses FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Business images policies
CREATE POLICY "Anyone can read business images"
  ON business_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can manage images"
  ON business_images FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- Bids policies
CREATE POLICY "Bidders and business owners can read bids"
  ON bids FOR SELECT
  TO authenticated
  USING (
    bidder_id = auth.uid() OR
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create bids"
  ON bids FOR INSERT
  TO authenticated
  WITH CHECK (bidder_id = auth.uid());

CREATE POLICY "Bidders can update own bids"
  ON bids FOR UPDATE
  TO authenticated
  USING (bidder_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Favorites policies
CREATE POLICY "Users can manage their favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Admin settings policies (admin only)
CREATE POLICY "Only admins can manage settings"
  ON admin_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
('platform_fee', '{"percentage": 5, "minimum": 500}', 'Platform transaction fee'),
('featured_listing_fee', '{"amount": 299}', 'Cost for featured listing'),
('max_images_per_listing', '{"count": 10}', 'Maximum images per business listing');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_industry ON businesses(industry);
CREATE INDEX IF NOT EXISTS idx_businesses_business_type ON businesses(business_type);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(location);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bids_business_id ON bids(business_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
-- KaamKonnect Database Schema for Supabase
-- BUYER: Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('freelancer', 'client', 'admin');
CREATE TYPE budget_type AS ENUM ('fixed', 'hourly');
CREATE TYPE gig_status AS ENUM ('draft', 'published', 'in_progress', 'completed', 'cancelled');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'expert');
CREATE TYPE location_type AS ENUM ('remote', 'onsite', 'hybrid');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'freelancer',
    bio TEXT,
    skills TEXT[],
    location TEXT,
    phone TEXT,
    website TEXT,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Gigs table
CREATE TABLE gigs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    budget_type budget_type NOT NULL,
    budget_amount DECIMAL(12,2) NOT NULL,
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    deadline TIMESTAMP WITH TIME ZONE,
    skills_required TEXT[] NOT NULL DEFAULT '{}',
    status gig_status DEFAULT 'draft',
    difficulty_level difficulty_level DEFAULT 'intermediate',
    location_type location_type DEFAULT 'remote',
    location TEXT,
    attachments JSONB DEFAULT '[]',
    views INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Applications table
CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
    freelancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    proposal TEXT NOT NULL,
    proposed_rate DECIMAL(10,2) NOT NULL,
    estimated_duration TEXT,
    cover_letter TEXT,
    attachments JSONB DEFAULT '[]',
    status application_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(gig_id, freelancer_id)
);

-- Reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(gig_id, reviewer_id, reviewee_id)
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    freelancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    platform_fee DECIMAL(12,2) NOT NULL,
    net_amount DECIMAL(12,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_gigs_category_id ON gigs(category_id);
CREATE INDEX idx_gigs_client_id ON gigs(client_id);
CREATE INDEX idx_gigs_status ON gigs(status);
CREATE INDEX idx_gigs_created_at ON gigs(created_at DESC);
CREATE INDEX idx_applications_gig_id ON applications(gig_id);
CREATE INDEX idx_applications_freelancer_id ON applications(freelancer_id);
CREATE INDEX idx_reviews_gig_id ON reviews(gig_id);
CREATE INDEX idx_payments_gig_id ON payments(gig_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON gigs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can insert categories" ON categories FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update categories" ON categories FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Gigs policies
CREATE POLICY "Published gigs are viewable by everyone" ON gigs FOR SELECT USING (
    status = 'published' OR client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Clients can insert their own gigs" ON gigs FOR INSERT WITH CHECK (
    client_id = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('client', 'admin'))
);
CREATE POLICY "Clients can update their own gigs" ON gigs FOR UPDATE USING (
    client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete gigs" ON gigs FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Applications policies
CREATE POLICY "Applications are viewable by gig owner and applicant" ON applications FOR SELECT USING (
    freelancer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM gigs WHERE gigs.id = applications.gig_id AND gigs.client_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Freelancers can insert applications" ON applications FOR INSERT WITH CHECK (
    freelancer_id = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('freelancer', 'admin'))
);
CREATE POLICY "Freelancers can update own applications" ON applications FOR UPDATE USING (
    freelancer_id = auth.uid()
);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert reviews for completed gigs" ON reviews FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (SELECT 1 FROM gigs WHERE gigs.id = reviews.gig_id AND gigs.status = 'completed')
);

-- Payments policies
CREATE POLICY "Payments are viewable by involved parties" ON payments FOR SELECT USING (
    client_id = auth.uid() OR freelancer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default categories
INSERT INTO categories (name, description, slug, icon) VALUES
('Technology', 'Web development, mobile apps, software development', 'technology', 'Code'),
('Design', 'Graphic design, UI/UX, branding, illustrations', 'design', 'Palette'),
('Writing', 'Content writing, copywriting, technical writing', 'writing', 'PenTool'),
('Marketing', 'Digital marketing, SEO, social media management', 'marketing', 'TrendingUp'),
('Photography', 'Event photography, product photography, editing', 'photography', 'Camera'),
('Video', 'Video editing, animation, motion graphics', 'video', 'Video'),
('Music', 'Audio editing, composition, voice over', 'music', 'Music'),
('Business', 'Consulting, data entry, virtual assistance', 'business', 'Briefcase'),
('Education', 'Tutoring, course creation, training', 'education', 'BookOpen'),
('Legal', 'Legal consulting, document review, contracts', 'legal', 'Scale'),
('Finance', 'Accounting, bookkeeping, financial planning', 'finance', 'DollarSign'),
('Healthcare', 'Medical writing, health consulting, research', 'healthcare', 'Heart');

-- Create admin user function (call this after first user signup to make them admin)
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles SET role = 'admin' WHERE email = user_email;
END;
$$ language plpgsql security definer;

-- Example usage (uncomment and replace with your admin email):
-- SELECT make_user_admin('your-admin-email@example.com');

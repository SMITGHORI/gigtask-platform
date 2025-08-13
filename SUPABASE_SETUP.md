# 🚀 Supabase Setup Guide for KaamKonnect

This guide will help you set up Supabase for the KaamKonnect platform and get the full CMS functionality working.

## 📋 Prerequisites

- A Supabase account (free tier is sufficient to start)
- Node.js 18+ installed
- Git for version control

## 🎯 Step 1: Create Supabase Project

1. **Go to [Supabase](https://supabase.com)** and sign in/create account
2. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: `kaamkonnect-platform`
   - Enter database password (save this!)
   - Select region closest to your users
   - Click "Create new project"

3. **Wait for setup** (usually takes 2-3 minutes)

## 🔧 Step 2: Configure Environment Variables

1. **Get your project credentials**:
   - Go to your project dashboard
   - Click "Settings" → "API"
   - Copy the following values:
     - Project URL
     - Anon public key
     - Service role key (keep this secret!)

2. **Update your `.env.local` file**:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 🗄️ Step 3: Set Up Database Schema

1. **Open Supabase SQL Editor**:
   - Go to your project dashboard
   - Click "SQL Editor" in the sidebar
   - Click "New query"

2. **Run the schema script**:
   - Copy the entire content from `supabase/schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify tables were created**:
   - Go to "Table Editor"
   - You should see these tables:
     - profiles
     - categories
     - gigs
     - applications
     - reviews
     - payments

## 🔐 Step 4: Configure Authentication

1. **Enable Email Authentication**:
   - Go to "Authentication" → "Settings"
   - Under "Auth Providers", ensure Email is enabled
   - Set "Confirm email" to your preference
   - Save changes

2. **Configure Email Templates** (Optional):
   - Go to "Authentication" → "Email Templates"
   - Customize the confirmation and recovery email templates
   - Update with your branding

3. **Set up Redirect URLs**:
   - In "Authentication" → "URL Configuration"
   - Add your site URL: `http://localhost:3000` (development)
   - For production, add your actual domain

## 👤 Step 5: Create Admin User

1. **Sign up through your app**:
   - Run your Next.js app: `npm run dev`
   - Go to `/auth/login`
   - Create an account with your admin email

2. **Make yourself admin**:
   - Go back to Supabase SQL Editor
   - Run this query (replace with your email):
   ```sql
   SELECT make_user_admin('your-admin-email@example.com');
   ```

3. **Verify admin access**:
   - Sign out and sign back in
   - You should now be able to access `/admin`

## 🎨 Step 6: Configure Storage (Optional)

If you want to enable file uploads:

1. **Create Storage Bucket**:
   - Go to "Storage"
   - Click "Create bucket"
   - Name: `uploads`
   - Set to public if you want public file access

2. **Set up Storage Policies**:
   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Users can upload files" ON storage.objects 
   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
   
   -- Allow users to view public files
   CREATE POLICY "Public files are viewable" ON storage.objects 
   FOR SELECT USING (bucket_id = 'uploads');
   ```

## 📧 Step 7: Configure Email Service (Optional)

For production email sending:

1. **Set up SMTP**:
   - Go to "Settings" → "Auth"
   - Scroll to "SMTP Settings"
   - Configure with your email provider (Gmail, SendGrid, etc.)

2. **Update environment variables**:
```env
# Email Service Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🚀 Step 8: Test Your Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Test key functionality**:
   - ✅ Visit homepage: `http://localhost:3000`
   - ✅ Sign up: `http://localhost:3000/auth/login`
   - ✅ Access admin: `http://localhost:3000/admin`
   - ✅ Create categories
   - ✅ Create gigs
   - ✅ View data in Supabase dashboard

## 📊 Step 9: Monitor and Analytics

1. **Enable Analytics**:
   - Go to "Settings" → "API"
   - Enable "Analytics"

2. **Set up Monitoring**:
   - Check "Database" → "Logs" for errors
   - Monitor "Auth" → "Users" for user activity
   - Use "SQL Editor" to run custom queries

## 🔒 Step 10: Security Best Practices

1. **Review RLS Policies**:
   - Go to "Authentication" → "Policies"
   - Verify all tables have appropriate Row Level Security
   - Test with different user roles

2. **Secure API Keys**:
   - Never commit service role key to version control
   - Use environment variables for all sensitive data
   - Rotate keys periodically

3. **Database Security**:
   - Regularly backup your database
   - Monitor unusual activity
   - Keep Supabase updated

## 🎯 Production Deployment

### Vercel (Recommended)

1. **Connect GitHub repo to Vercel**
2. **Add environment variables in Vercel dashboard**:
   - All variables from `.env.local`
   - Update URLs to production domains
3. **Deploy and test**

### Other Platforms

- **Netlify**: Similar process to Vercel
- **AWS/DigitalOcean**: Configure environment variables
- **Railway/Render**: Add environment variables

## 🛠️ Customization Options

### Add New Features

1. **New Database Tables**:
   - Create tables in Supabase
   - Add TypeScript types
   - Create API routes
   - Build admin UI

2. **Custom Fields**:
   - Modify existing tables
   - Update TypeScript types
   - Update forms and validation

3. **New User Roles**:
   - Update user_role enum
   - Modify RLS policies
   - Update UI permissions

### Modify Existing Features

1. **Categories**:
   - Add/remove fields in categories table
   - Update admin interface
   - Modify validation schemas

2. **Gigs**:
   - Customize gig fields
   - Add new status types
   - Modify search/filter options

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**:
   - Check environment variables
   - Verify Supabase project is running
   - Check network connectivity

2. **Authentication not working**:
   - Verify redirect URLs
   - Check email confirmation settings
   - Ensure RLS policies are correct

3. **Admin access denied**:
   - Verify admin user was created correctly
   - Check user role in profiles table
   - Clear browser cache and cookies

4. **Database connection issues**:
   - Verify connection string
   - Check Supabase project status
   - Review database logs

### Getting Help

1. **Supabase Documentation**: https://supabase.com/docs
2. **Next.js Documentation**: https://nextjs.org/docs
3. **GitHub Issues**: Create an issue in the repository
4. **Community Support**: Join Supabase Discord

## ✅ Checklist

Before going live, ensure:

- [ ] Database schema is set up correctly
- [ ] Environment variables are configured
- [ ] Admin user is created and working
- [ ] Authentication flow is tested
- [ ] RLS policies are secure
- [ ] Email service is configured
- [ ] Storage is set up (if needed)
- [ ] All API endpoints are working
- [ ] Admin panel is accessible
- [ ] User registration/login works
- [ ] Data is displaying correctly
- [ ] Performance is acceptable
- [ ] Security policies are in place

## 🎉 You're Ready!

Once you complete these steps, your KaamKonnect platform will be fully functional with:

- ✅ **Complete CMS functionality**
- ✅ **User authentication & management**
- ✅ **Admin dashboard**
- ✅ **Gig posting & management**
- ✅ **Category management**
- ✅ **Application system**
- ✅ **Review system**
- ✅ **Payment tracking**
- ✅ **Real-time updates**
- ✅ **Secure & scalable**

Your buyers can now manage everything through the beautiful admin interface while users enjoy the full gig marketplace experience!

---

**Need help?** Check the troubleshooting section above or create an issue in the repository.

# Jolly - E-commerce Platform

A modern, professional e-commerce website built with React, TypeScript, Redux Toolkit, Supabase, and shadcn/ui. Features include a responsive storefront, admin dashboard, and comprehensive data tracking capabilities.

## 🚀 Features

### Storefront
- **Responsive Design**: Fully mobile-responsive with modern UI/UX
- **Product Catalog**: Browse products by category with search and filtering
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout Flow**: Streamlined checkout process
- **Data Layer**: Built-in tracking for customer analytics

### Admin Dashboard
- **Product Management**: Add, edit, and manage products
- **User Management**: View and manage customer accounts
- **Pixel/Tag Manager**: Configure Google Analytics, Facebook Pixel, and custom tracking
- **Order Management**: Track and manage customer orders
- **Analytics**: View sales and customer insights

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Redux Toolkit**: Centralized state management
- **Supabase**: Backend-as-a-Service with real-time capabilities
- **shadcn/ui**: Professional component library
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Form Validation**: Zod schema validation

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account and project

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd jolly
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics and Tracking
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
VITE_FACEBOOK_PIXEL_ID=your_fb_pixel_id
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Run the following SQL in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pixel_tracking table
CREATE TABLE pixel_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('google_analytics', 'facebook_pixel', 'custom')),
  code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Only admins can modify products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only admins can modify orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Only admins can manage pixel tracking" ON pixel_tracking FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create admin user (replace with your email)
INSERT INTO users (id, email, full_name, role) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'),
  'your-admin-email@example.com',
  'Admin User',
  'admin'
);
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── cart/           # Cart-related components
│   ├── search/         # Search components
│   └── auth/           # Authentication components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   └── ...             # Public pages
├── store/              # Redux store and slices
├── contexts/           # React contexts
├── lib/                # Utility functions and configurations
└── types/              # TypeScript type definitions
```

## 🎨 Customization

### Colors and Theme
The design system uses CSS variables defined in `src/index.css`. You can customize:
- Primary colors
- Background colors
- Text colors
- Border colors
- Component-specific colors

### Components
All UI components are built with shadcn/ui and can be customized by modifying the component files in `src/components/ui/`.

## 📱 Responsive Design

The platform is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- **Row Level Security (RLS)** in Supabase
- **Protected Routes** for admin functionality
- **Input Validation** with Zod schemas
- **Secure Authentication** with Supabase Auth

## 📊 Data Layer & Tracking

The platform includes built-in tracking for:
- Page views
- Product views
- Add to cart events
- Purchase events
- User interactions

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `pnpm build`
4. Publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Customer reviews and ratings
- [ ] Advanced search and filtering
- [ ] Payment gateway integration
- [ ] Email marketing integration
- [ ] Mobile app (React Native)

---

Built with ❤️ using modern web technologies

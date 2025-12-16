-- Create admins table for admin users
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'president', 'financial_officer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create department_offerings table (What We Offer)
CREATE TABLE IF NOT EXISTS department_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staff table (Executives & Staff)
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  staff_type TEXT NOT NULL DEFAULT 'staff' CHECK (staff_type IN ('dean', 'hod', 'faculty', 'staff', 'executive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  sex TEXT NOT NULL CHECK (sex IN ('Male', 'Female')),
  programme TEXT NOT NULL DEFAULT 'Computer Science',
  degree TEXT NOT NULL CHECK (degree IN ('HND', 'BTech', 'Diploma')),
  session TEXT NOT NULL CHECK (session IN ('Regular', 'Part-time')),
  level TEXT NOT NULL CHECK (level IN ('100', '200', '300', '400')),
  lacoste_size TEXT NOT NULL CHECK (lacoste_size IN ('S', 'M', 'L', 'XL', '2XL', '3XL')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Momo', 'Cash')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  registered_by UUID REFERENCES admins(id),
  registered_by_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create finance table for financial transactions
CREATE TABLE IF NOT EXISTS finance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES admins(id),
  recorded_by_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

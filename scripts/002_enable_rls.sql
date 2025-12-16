-- Enable Row Level Security on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance ENABLE ROW LEVEL SECURITY;

-- Admins table policies
CREATE POLICY "Admins can view all admins" ON admins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert their own profile" ON admins FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update their own profile" ON admins FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Department Offerings - Public read, authenticated write
CREATE POLICY "Anyone can view offerings" ON department_offerings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert offerings" ON department_offerings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update offerings" ON department_offerings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete offerings" ON department_offerings FOR DELETE TO authenticated USING (true);

-- Events - Public read, authenticated write
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete events" ON events FOR DELETE TO authenticated USING (true);

-- Staff - Public read, authenticated write
CREATE POLICY "Anyone can view staff" ON staff FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert staff" ON staff FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update staff" ON staff FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete staff" ON staff FOR DELETE TO authenticated USING (true);

-- Announcements - Public read, authenticated write
CREATE POLICY "Anyone can view active announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update announcements" ON announcements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete announcements" ON announcements FOR DELETE TO authenticated USING (true);

-- Students - Only authenticated admins can access
CREATE POLICY "Authenticated users can view students" ON students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert students" ON students FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update students" ON students FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete students" ON students FOR DELETE TO authenticated USING (true);

-- Finance - Only president and financial_officer can access
CREATE POLICY "Finance officers can view finance" ON finance FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role IN ('president', 'financial_officer')
    )
  );
CREATE POLICY "Finance officers can insert finance" ON finance FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role IN ('president', 'financial_officer')
    )
  );
CREATE POLICY "Finance officers can update finance" ON finance FOR UPDATE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role IN ('president', 'financial_officer')
    )
  );
CREATE POLICY "Finance officers can delete finance" ON finance FOR DELETE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role IN ('president', 'financial_officer')
    )
  );

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert contact submissions (public form)
CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all submissions
CREATE POLICY "Admins can view contact submissions" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

-- Admins can update (mark as read)
CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

-- Admins can delete submissions
CREATE POLICY "Admins can delete contact submissions" ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

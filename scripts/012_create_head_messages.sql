-- Create head_messages table for Head of Department and Faculty Dean messages
CREATE TABLE IF NOT EXISTS head_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, -- e.g., "Head of Department of Computer Science" or "Faculty Dean of Applied Sciences"
  name TEXT NOT NULL, -- Full name
  message TEXT NOT NULL, -- The message content
  image_url TEXT, -- URL to head's image
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for head_messages
ALTER TABLE head_messages ENABLE ROW LEVEL SECURITY;

-- Policies for head_messages
-- Anyone can view active head messages
CREATE POLICY "Anyone can view active head messages" ON head_messages
  FOR SELECT
  USING (is_active = true);

-- Admins can view all head messages
CREATE POLICY "Admins can view all head messages" ON head_messages
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

-- Admins can insert head messages
CREATE POLICY "Admins can insert head messages" ON head_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

-- Admins can update head messages
CREATE POLICY "Admins can update head messages" ON head_messages
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

-- Admins can delete head messages
CREATE POLICY "Admins can delete head messages" ON head_messages
  FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

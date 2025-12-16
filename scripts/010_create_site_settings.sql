-- Create site_settings table for storing key/value site configuration
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Allow public SELECT so the public site can read settings like "voting_enabled" and "voting_url"
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings"
  ON site_settings
  FOR SELECT
  USING (true);

-- Only admins may insert/update/delete settings
CREATE POLICY "Only admins can modify settings"
  ON site_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE admins.id = auth.uid()
    )
  );

-- Insert defaults
INSERT INTO site_settings (key, value)
VALUES
  ('voting_enabled', 'false')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('voting_url', 'https://cs-voting.vercel.app/')
ON CONFLICT (key) DO NOTHING;

-- Default contact info
INSERT INTO site_settings (key, value)
VALUES
  ('contact_address', 'Computer Science Building, Main Campus')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('contact_email', 'cs@university.edu')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('contact_phone', '+233 20 123 4567')
ON CONFLICT (key) DO NOTHING;

-- Social media links
INSERT INTO site_settings (key, value)
VALUES
  ('social_twitter', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('social_facebook', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('social_instagram', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('social_linkedin', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('social_youtube', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('social_github', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('social_tiktok', '')
ON CONFLICT (key) DO NOTHING;

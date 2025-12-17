-- Add image_url column to announcements table
ALTER TABLE announcements
ADD COLUMN image_url text;

-- Add comment for documentation
COMMENT ON COLUMN announcements.image_url IS 'URL to the announcement image stored in Supabase storage';

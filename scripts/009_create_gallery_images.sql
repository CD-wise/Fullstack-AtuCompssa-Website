-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view gallery images
CREATE POLICY "Gallery images are viewable by all"
  ON gallery_images
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert gallery images
CREATE POLICY "Only admins can insert gallery images"
  ON gallery_images
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Policy: Only admins can update gallery images
CREATE POLICY "Only admins can update gallery images"
  ON gallery_images
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Policy: Only admins can delete gallery images
CREATE POLICY "Only admins can delete gallery images"
  ON gallery_images
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Create index for display_order
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order 
  ON gallery_images(display_order);

-- Create index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at 
  ON gallery_images(created_at DESC);

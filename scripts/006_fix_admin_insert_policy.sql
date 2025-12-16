-- Fix RLS policy to allow users to insert their own admin profile
-- This is needed for users who signed up before the trigger was created

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Admins can insert own profile" ON admins;

-- Create a more permissive insert policy that allows authenticated users to create their own profile
CREATE POLICY "Users can insert own admin profile"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also add an upsert-friendly policy for updates
DROP POLICY IF EXISTS "Admins can update own profile" ON admins;

CREATE POLICY "Admins can update own profile"
  ON admins FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

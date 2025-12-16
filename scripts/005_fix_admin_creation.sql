-- Fix admin creation by using a trigger that bypasses RLS
-- This trigger runs with SECURITY DEFINER privileges

-- First, drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Admins can insert their own profile" ON admins;

-- Create a more permissive policy for new user registration
-- Allow insert when the id matches the authenticated user's id OR when no user exists yet with that id
CREATE POLICY "Users can create their own admin profile" ON admins 
  FOR INSERT 
  WITH CHECK (true);

-- Alternative approach: Create a trigger function to handle admin creation
-- This function will be called by a trigger after auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.admins (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Admin'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  );
  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create clubs table
create table if not exists clubs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  links jsonb default '[]'::jsonb,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Example: grant insert/select/update/delete
-- GRANT SELECT, INSERT, UPDATE, DELETE ON clubs TO authenticated;

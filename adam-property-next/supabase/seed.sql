-- ==============================================================================
-- SEED USERS & INITIAL ACCOUNTS - PT ADAM PROPERTY INDONESIA
-- SUPABASE POSTGRESQL SEED SCRIPT
-- ==============================================================================

-- 1. Create auth users (if using Supabase local CLI or self-hosted)
-- In Supabase Cloud Dashboard, users can also be invited or created via Authentication tab:
-- User 1: management@adamproperty.co.id (Password: adampropertyjaya1!)
-- User 2: it.manager@adamproperty.co.id (Password: edc128xk92)
-- User 3: admin@adamproperty.co.id (Password: adamproperty1)

-- Insert/Update profiles for the 3 defined roles
-- (Note: If using Supabase Cloud, sign up the users in Authentication -> Users, then run this to assign roles)
DO $$
DECLARE
  v_uid_mgmt UUID;
  v_uid_it UUID;
  v_uid_admin UUID;
BEGIN
  -- Try to find existing auth.users by email or generate dummy UUIDs for testing
  SELECT id INTO v_uid_mgmt FROM auth.users WHERE email = 'management@adamproperty.co.id' LIMIT 1;
  IF v_uid_mgmt IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, nama, jabatan, role)
    VALUES (v_uid_mgmt, 'management@adamproperty.co.id', 'Management', 'Direksi & Pengawas', 'management')
    ON CONFLICT (id) DO UPDATE SET role = 'management', nama = 'Management', jabatan = 'Direksi & Pengawas';
  END IF;

  SELECT id INTO v_uid_it FROM auth.users WHERE email = 'it.manager@adamproperty.co.id' LIMIT 1;
  IF v_uid_it IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, nama, jabatan, role)
    VALUES (v_uid_it, 'it.manager@adamproperty.co.id', 'Faruq Adrean', 'Head of IT & Administrator', 'it_manager')
    ON CONFLICT (id) DO UPDATE SET role = 'it_manager', nama = 'Faruq Adrean', jabatan = 'Head of IT & Administrator';
  END IF;

  SELECT id INTO v_uid_admin FROM auth.users WHERE email = 'admin@adamproperty.co.id' LIMIT 1;
  IF v_uid_admin IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, nama, jabatan, role)
    VALUES (v_uid_admin, 'admin@adamproperty.co.id', 'Admin', 'Admin Keuangan & Kasir', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', nama = 'Admin', jabatan = 'Admin Keuangan & Kasir';
  END IF;
END $$;

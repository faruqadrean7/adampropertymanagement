-- ==============================================================================
-- FIX MULTI-DEVICE CLOUD SYNC - PT ADAM PROPERTY INDONESIA
-- Jalankan script ini di menu "SQL Editor" pada dashboard Supabase Anda
-- (https://supabase.com/dashboard/project/hnkwnklmxgxvihpaogpz/sql/new)
-- 
-- FUNGSI:
-- 1. Membuka akses simpan, ubah & hapus cloud Supabase tanpa hambatan RLS.
-- 2. Mengaktifkan Supabase Realtime Replication sehingga perubahan di satu perangkat
--    (misal: hapus atau tambah kavling di Laptop) LANGSUNG tersinkron ke HP seketika.
-- ==============================================================================

-- 1. Nonaktifkan RLS pada seluruh tabel operasional agar input dari web langsung masuk ke Supabase
ALTER TABLE IF EXISTS public.kavlings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.land_debts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.land_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cashbook DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.petty_cash DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.salary_payments DISABLE ROW LEVEL SECURITY;

-- 2. Pastikan izin akses penuh (ALL) diberikan kepada role anon & authenticated
GRANT ALL ON TABLE public.kavlings TO anon, authenticated;
GRANT ALL ON TABLE public.projects TO anon, authenticated;
GRANT ALL ON TABLE public.customers TO anon, authenticated;
GRANT ALL ON TABLE public.payments TO anon, authenticated;
GRANT ALL ON TABLE public.land_debts TO anon, authenticated;
GRANT ALL ON TABLE public.land_payments TO anon, authenticated;
GRANT ALL ON TABLE public.cashbook TO anon, authenticated;
GRANT ALL ON TABLE public.petty_cash TO anon, authenticated;
GRANT ALL ON TABLE public.inventory TO anon, authenticated;
GRANT ALL ON TABLE public.employees TO anon, authenticated;
GRANT ALL ON TABLE public.salary_payments TO anon, authenticated;

-- 3. Aktifkan Replica Identity FULL agar event DELETE memuat detail baris data
ALTER TABLE IF EXISTS public.kavlings REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.projects REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.customers REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.payments REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.land_debts REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.land_payments REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.cashbook REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.petty_cash REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.inventory REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.employees REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.salary_payments REPLICA IDENTITY FULL;

-- 4. Daftarkan tabel ke Publication supabase_realtime agar WebSocket aktif
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      public.kavlings, 
      public.projects, 
      public.customers, 
      public.payments, 
      public.land_debts, 
      public.land_payments, 
      public.cashbook, 
      public.petty_cash, 
      public.inventory, 
      public.employees, 
      public.salary_payments;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL; -- tabel sudah terdaftar
  END;
END $$;

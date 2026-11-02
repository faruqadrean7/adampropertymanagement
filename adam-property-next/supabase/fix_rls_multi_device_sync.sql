-- ==============================================================================
-- FIX MULTI-DEVICE CLOUD SYNC - PT ADAM PROPERTY INDONESIA
-- Jalankan script ini di menu "SQL Editor" pada dashboard Supabase Anda
-- (https://supabase.com/dashboard/project/hnkwnklmxgxvihpaogpz/sql/new)
-- 
-- FUNGSI:
-- Membuka akses simpan & baca cloud Supabase sehingga seluruh data kavling,
-- customer, dan transaksi langsung tersinkronisasi otomatis di SEMUA perangkat
-- (Laptop, HP Android/iPhone, Tablet, dan Komputer Kantor).
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

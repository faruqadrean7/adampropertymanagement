-- ==============================================================================
-- DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) - PT ADAM PROPERTY INDONESIA
-- SUPABASE POSTGRESQL IMPLEMENTATION
-- 3 USER ROLES:
-- 1. management : HANYA BISA LIHAT (Read-Only across all modules)
-- 2. it_manager : BISA AKSES SEMUA (Full Access / Superadmin)
-- 3. admin      : HANYA BISA AKSES PEMBAYARAN (Uang Masuk, Uang Keluar, Cicilan)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & USER ROLES
CREATE TYPE user_role AS ENUM ('management', 'it_manager', 'admin');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'management',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROJECTS (Kawasan Induk Proyek)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT ('proj-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  nama TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  deskripsi TEXT,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 3. KAVLINGS (Unit Site Plan)
CREATE TABLE IF NOT EXISTS public.kavlings (
  id TEXT PRIMARY KEY DEFAULT ('kav-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  blok TEXT NOT NULL,
  nomor TEXT NOT NULL,
  luas NUMERIC NOT NULL,
  dimensi TEXT NOT NULL,
  harga NUMERIC NOT NULL,
  tipe TEXT NOT NULL DEFAULT 'Hunian Standar',
  status TEXT NOT NULL CHECK (status IN ('terbuka', 'booking', 'terjual')) DEFAULT 'terbuka',
  customer_id TEXT,
  customer_nama TEXT,
  keterangan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CUSTOMERS (Pembeli & Piutang Kavling)
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY DEFAULT ('cust-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  nama TEXT NOT NULL,
  nik TEXT NOT NULL,
  no_kk TEXT,
  telepon TEXT NOT NULL,
  tempat_tanggal_lahir TEXT,
  pekerjaan TEXT,
  alamat TEXT NOT NULL,
  kavling_id TEXT,
  kavling_kode TEXT,
  project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  total_harga NUMERIC NOT NULL DEFAULT 0,
  total_masuk NUMERIC NOT NULL DEFAULT 0,
  sisa_piutang NUMERIC NOT NULL DEFAULT 0,
  status_bayar TEXT NOT NULL CHECK (status_bayar IN ('lunas', 'belum_lunas')) DEFAULT 'belum_lunas',
  tanggal_beli DATE NOT NULL DEFAULT CURRENT_DATE,
  ktp_image TEXT,
  kk_image TEXT,
  ajb_image TEXT,
  shm_split_image TEXT,
  no_ajb TEXT,
  no_shm_split TEXT,
  tanggal_ajb DATE,
  tanggal_shm_split DATE,
  notaris_ppat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PAYMENTS (Uang Masuk Pembayaran Customer & Kwitansi)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT ('pay-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
  customer_nama TEXT,
  kavling_kode TEXT,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  nominal NUMERIC NOT NULL,
  metode_bayar TEXT NOT NULL CHECK (metode_bayar IN ('tunai', 'transfer', 'barter')),
  tujuan TEXT NOT NULL,
  keterangan TEXT,
  rincian_barter TEXT,
  kwitansi_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. LAND DEBTS (Hutang Pembelian Lahan Mentah ke Petani & Legalitas Lahan)
CREATE TABLE IF NOT EXISTS public.land_debts (
  id TEXT PRIMARY KEY DEFAULT ('land-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  project_nama TEXT,
  nama_petani TEXT NOT NULL,
  telepon TEXT,
  luas_tanah TEXT NOT NULL,
  alas_hak TEXT NOT NULL,
  harga_kesepakatan NUMERIC NOT NULL,
  dp_dibayar NUMERIC NOT NULL DEFAULT 0,
  total_cicilan NUMERIC NOT NULL DEFAULT 0,
  sisa_hutang NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('lunas', 'belum_lunas')) DEFAULT 'belum_lunas',
  alamat_lahan TEXT,
  keterangan TEXT,
  sertifikat_image TEXT,
  perjanjian_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. LAND PAYMENTS (Cicilan Uang Keluar ke Petani & Slip Bank)
CREATE TABLE IF NOT EXISTS public.land_payments (
  id TEXT PRIMARY KEY DEFAULT ('lpay-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  land_debt_id TEXT REFERENCES public.land_debts(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  nominal NUMERIC NOT NULL,
  metode TEXT NOT NULL DEFAULT 'Transfer Bank',
  keterangan TEXT NOT NULL,
  kwitansi_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CASHBOOK (Buku Kas Besar / General Ledger)
CREATE TABLE IF NOT EXISTS public.cashbook (
  id TEXT PRIMARY KEY DEFAULT ('cash-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  tipe TEXT NOT NULL CHECK (tipe IN ('masuk', 'keluar')),
  kategori TEXT NOT NULL,
  sumber TEXT NOT NULL,
  keterangan TEXT NOT NULL,
  nominal NUMERIC NOT NULL,
  metode TEXT NOT NULL,
  project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  ref_type TEXT,
  ref_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PETTY CASH (Buku Kas Kecil Operasional & Payroll)
CREATE TABLE IF NOT EXISTS public.petty_cash (
  id TEXT PRIMARY KEY DEFAULT ('pcash-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  tipe TEXT NOT NULL CHECK (tipe IN ('masuk', 'keluar')),
  kategori TEXT NOT NULL,
  sumber_tujuan TEXT NOT NULL,
  keterangan TEXT NOT NULL,
  nominal NUMERIC NOT NULL,
  metode TEXT NOT NULL,
  saldo_akhir NUMERIC NOT NULL DEFAULT 0,
  bukti_nota TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. INVENTORY (Aset & Inventaris Perusahaan)
CREATE TABLE IF NOT EXISTS public.inventory (
  id TEXT PRIMARY KEY DEFAULT ('inv-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  nama_barang TEXT NOT NULL,
  kategori TEXT NOT NULL,
  jumlah INT NOT NULL DEFAULT 1,
  satuan TEXT NOT NULL DEFAULT 'Unit',
  nilai_perolehan NUMERIC NOT NULL DEFAULT 0,
  lokasi TEXT NOT NULL,
  kondisi TEXT NOT NULL CHECK (kondisi IN ('baik', 'perlu_perbaikan', 'rusak')),
  tanggal_beli DATE NOT NULL DEFAULT CURRENT_DATE,
  foto TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. EMPLOYEES (Data Karyawan & Marketing)
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY DEFAULT ('emp-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  nama TEXT NOT NULL,
  nik TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  divisi TEXT NOT NULL,
  no_hp TEXT NOT NULL,
  alamat TEXT NOT NULL,
  no_rek TEXT,
  bank TEXT,
  gaji_pokok NUMERIC NOT NULL DEFAULT 0,
  tunjangan_jabatan NUMERIC NOT NULL DEFAULT 0,
  tunjangan_makan NUMERIC NOT NULL DEFAULT 0,
  komisi_penjualan NUMERIC NOT NULL DEFAULT 0,
  potongan NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('aktif', 'nonaktif')) DEFAULT 'aktif',
  tanggal_bergabung DATE NOT NULL DEFAULT CURRENT_DATE,
  keterangan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SALARY PAYMENTS (Payroll Riwayat Penggajian)
CREATE TABLE IF NOT EXISTS public.salary_payments (
  id TEXT PRIMARY KEY DEFAULT ('sal-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
  employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  bulan TEXT NOT NULL, -- YYYY-MM
  tanggal_bayar DATE NOT NULL DEFAULT CURRENT_DATE,
  gaji_pokok NUMERIC NOT NULL,
  tunjangan_jabatan NUMERIC NOT NULL DEFAULT 0,
  tunjangan_makan NUMERIC NOT NULL DEFAULT 0,
  komisi NUMERIC NOT NULL DEFAULT 0,
  potongan NUMERIC NOT NULL DEFAULT 0,
  thp NUMERIC NOT NULL,
  catatan TEXT,
  status TEXT NOT NULL CHECK (status IN ('terbayar', 'pending')) DEFAULT 'terbayar',
  petty_cash_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) CONFIGURATION
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kavlings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petty_cash ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_payments ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch the role of current logged in user
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- ROLE 1: MANAGEMENT (HANYA BISA LIHAT / READ-ONLY)
-- Management can SELECT (Read) from all tables, but CANNOT INSERT, UPDATE, or DELETE
-- ------------------------------------------------------------------------------
CREATE POLICY "Management view profiles" ON public.profiles FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view projects" ON public.projects FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view kavlings" ON public.kavlings FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view customers" ON public.customers FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view payments" ON public.payments FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view land_debts" ON public.land_debts FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view land_payments" ON public.land_payments FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view cashbook" ON public.cashbook FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view petty_cash" ON public.petty_cash FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view inventory" ON public.inventory FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view employees" ON public.employees FOR SELECT USING (public.get_current_role() = 'management');
CREATE POLICY "Management view salary_payments" ON public.salary_payments FOR SELECT USING (public.get_current_role() = 'management');

-- ------------------------------------------------------------------------------
-- ROLE 2: IT MANAGER (BISA AKSES SEMUA / FULL ACCESS SUPERADMIN)
-- IT Manager has FULL CRUD (SELECT, INSERT, UPDATE, DELETE) on all tables
-- ------------------------------------------------------------------------------
CREATE POLICY "IT Manager full profiles" ON public.profiles FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full projects" ON public.projects FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full kavlings" ON public.kavlings FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full customers" ON public.customers FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full payments" ON public.payments FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full land_debts" ON public.land_debts FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full land_payments" ON public.land_payments FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full cashbook" ON public.cashbook FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full petty_cash" ON public.petty_cash FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full inventory" ON public.inventory FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full employees" ON public.employees FOR ALL USING (public.get_current_role() = 'it_manager');
CREATE POLICY "IT Manager full salary_payments" ON public.salary_payments FOR ALL USING (public.get_current_role() = 'it_manager');

-- ------------------------------------------------------------------------------
-- ROLE 3: ADMIN (HANYA BISA AKSES PEMBAYARAN, UANG MASUK, UANG KELUAR, CICILAN)
-- Admin can view data to process payments, record payments, and manage cashflow,
-- but CANNOT delete projects, alter core structures, or manipulate master payroll.
-- ------------------------------------------------------------------------------
-- Admin can view tables needed to conduct payments
CREATE POLICY "Admin view profiles" ON public.profiles FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view projects" ON public.projects FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view kavlings" ON public.kavlings FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view customers" ON public.customers FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view payments" ON public.payments FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view land_debts" ON public.land_debts FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view land_payments" ON public.land_payments FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view cashbook" ON public.cashbook FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view petty_cash" ON public.petty_cash FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view inventory" ON public.inventory FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view employees" ON public.employees FOR SELECT USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin view salary_payments" ON public.salary_payments FOR SELECT USING (public.get_current_role() = 'admin');

-- Admin Payment Operations (Uang Masuk):
CREATE POLICY "Admin insert payments" ON public.payments FOR INSERT WITH CHECK (public.get_current_role() = 'admin');
CREATE POLICY "Admin update customer payment balance" ON public.customers FOR UPDATE USING (public.get_current_role() = 'admin');
CREATE POLICY "Admin register customer with payment" ON public.customers FOR INSERT WITH CHECK (public.get_current_role() = 'admin');
CREATE POLICY "Admin update kavling status on sale" ON public.kavlings FOR UPDATE USING (public.get_current_role() = 'admin');

-- Admin Land Installment Operations (Cicilan Lahan Uang Keluar):
CREATE POLICY "Admin insert land_payments" ON public.land_payments FOR INSERT WITH CHECK (public.get_current_role() = 'admin');
CREATE POLICY "Admin update land debt balance" ON public.land_debts FOR UPDATE USING (public.get_current_role() = 'admin');

-- Admin Cashflow In & Out Operations (Kas Besar & Kas Kecil):
CREATE POLICY "Admin insert cashbook" ON public.cashbook FOR INSERT WITH CHECK (public.get_current_role() = 'admin');
CREATE POLICY "Admin insert petty_cash" ON public.petty_cash FOR INSERT WITH CHECK (public.get_current_role() = 'admin');

-- ------------------------------------------------------------------------------
-- STORAGE BUCKET FOR DOCUMENTS & SLIPS
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "IT Manager manage documents" ON storage.objects FOR ALL USING (bucket_id = 'documents' AND public.get_current_role() = 'it_manager');
CREATE POLICY "Admin upload payment receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND public.get_current_role() = 'admin');

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION ON USER SIGNUP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nama, jabatan, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'jabatan', 'Staff Operasional'),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'management'::user_role)
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      nama = EXCLUDED.nama,
      jabatan = EXCLUDED.jabatan,
      role = EXCLUDED.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SEED INITIAL DATA (Baitul Makmur Regency 1 & 2)
-- ==============================================================================
INSERT INTO public.projects (id, nama, lokasi, deskripsi, created_at)
VALUES 
  ('proj-1', 'Baitul Makmur Regency', 'Kaliwungu, Kendal', 'Pengembangan lahan perumahan subsidi & komersil tahap 1', '2026-06-01')
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- SCHEMA SQL: PT ADAM PROPERTY INDONESIA (DEVELOPER UTAMA)
-- Ready for Supabase PostgreSQL Editor
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROJECTS (INDUK PROYEK LAHAN)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    lokasi TEXT NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. KAVLINGS (UNIT BLOK & SITE PLAN)
CREATE TABLE IF NOT EXISTS public.kavlings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    blok TEXT NOT NULL,
    nomor TEXT NOT NULL,
    luas NUMERIC NOT NULL,
    dimensi TEXT NOT NULL,
    harga NUMERIC NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'Hunian Standar',
    status TEXT NOT NULL CHECK (status IN ('terbuka', 'booking', 'terjual')) DEFAULT 'terbuka',
    customer_id UUID,
    customer_nama TEXT,
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMERS (PEMBELI KAVLINGS & PIUTANG)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    nik TEXT NOT NULL,
    telepon TEXT NOT NULL,
    alamat TEXT,
    kavling_id UUID REFERENCES public.kavlings(id) ON DELETE SET NULL,
    kavling_kode TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    total_harga NUMERIC NOT NULL DEFAULT 0,
    total_masuk NUMERIC NOT NULL DEFAULT 0,
    sisa_piutang NUMERIC NOT NULL DEFAULT 0,
    status_bayar TEXT NOT NULL CHECK (status_bayar IN ('lunas', 'belum_lunas')) DEFAULT 'belum_lunas',
    tanggal_beli DATE DEFAULT CURRENT_DATE,
    ktp_url TEXT,
    kk_url TEXT,
    ajb_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS (KWITANSI PEMBAYARAN & BARTER MATERIAL)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_nama TEXT,
    kavling_kode TEXT,
    tanggal DATE DEFAULT CURRENT_DATE,
    nominal NUMERIC NOT NULL DEFAULT 0,
    metode_bayar TEXT NOT NULL CHECK (metode_bayar IN ('tunai', 'transfer', 'barter')),
    tujuan TEXT NOT NULL,
    keterangan TEXT,
    rincian_barter TEXT,
    kwitansi_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LAND_DEBTS (HUTANG PEMBELIAN LAHAN PETANI)
CREATE TABLE IF NOT EXISTS public.land_debts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    sertifikat_url TEXT,
    perjanjian_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LAND_PAYMENTS (CICILAN KE PETANI)
CREATE TABLE IF NOT EXISTS public.land_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    land_debt_id UUID REFERENCES public.land_debts(id) ON DELETE CASCADE,
    tanggal DATE DEFAULT CURRENT_DATE,
    nominal NUMERIC NOT NULL,
    metode TEXT NOT NULL,
    keterangan TEXT,
    kwitansi_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CASHBOOK (BUKU KAS BESAR / GENERAL LEDGER)
CREATE TABLE IF NOT EXISTS public.cashbook (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tanggal DATE DEFAULT CURRENT_DATE,
    tipe TEXT NOT NULL CHECK (tipe IN ('masuk', 'keluar')),
    kategori TEXT NOT NULL,
    sumber TEXT NOT NULL,
    keterangan TEXT NOT NULL,
    nominal NUMERIC NOT NULL,
    metode TEXT NOT NULL,
    rekening TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    ref_type TEXT,
    ref_id TEXT,
    bukti_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PETTY_CASH (BUKU KAS KECIL OPERASIONAL KANTOR)
CREATE TABLE IF NOT EXISTS public.petty_cash (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tanggal DATE DEFAULT CURRENT_DATE,
    tipe TEXT NOT NULL CHECK (tipe IN ('masuk', 'keluar')),
    kategori TEXT NOT NULL,
    sumber_dana TEXT,
    penerima TEXT NOT NULL,
    keterangan TEXT NOT NULL,
    nominal NUMERIC NOT NULL,
    metode TEXT NOT NULL DEFAULT 'Tunai Kasir',
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    ref_type TEXT,
    ref_id TEXT,
    bukti_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVENTORY (INVENTARIS & ASET TETAP DEVELOPER)
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode TEXT NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL,
    kondisi TEXT NOT NULL DEFAULT 'baik',
    lokasi TEXT NOT NULL,
    penanggung_jawab TEXT NOT NULL,
    tanggal DATE DEFAULT CURRENT_DATE,
    sumber_dana TEXT NOT NULL,
    nilai_perolehan NUMERIC NOT NULL,
    jumlah INTEGER NOT NULL DEFAULT 1,
    satuan TEXT NOT NULL DEFAULT 'Unit',
    nomor_seri TEXT,
    keterangan TEXT,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EMPLOYEES (DATA KARYAWAN & TIM MARKETING)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    nik TEXT NOT NULL UNIQUE,
    jabatan TEXT NOT NULL,
    departemen TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'tetap',
    no_hp TEXT NOT NULL,
    email TEXT,
    no_rek TEXT,
    bank TEXT,
    gaji_pokok NUMERIC NOT NULL DEFAULT 0,
    tunjangan_jabatan NUMERIC NOT NULL DEFAULT 0,
    tunjangan_makan NUMERIC NOT NULL DEFAULT 0,
    komisi_penjualan NUMERIC NOT NULL DEFAULT 0,
    potongan NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('aktif', 'nonaktif')) DEFAULT 'aktif',
    tanggal_bergabung DATE DEFAULT CURRENT_DATE,
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SALARY_PAYMENTS (RIWAYAT SLIP GAJI VIA KAS KECIL)
CREATE TABLE IF NOT EXISTS public.salary_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    employee_nama TEXT NOT NULL,
    jabatan TEXT NOT NULL,
    bulan TEXT NOT NULL, -- Format YYYY-MM
    tanggal_bayar DATE DEFAULT CURRENT_DATE,
    gaji_pokok NUMERIC NOT NULL,
    tunjangan_jabatan NUMERIC NOT NULL,
    tunjangan_makan NUMERIC NOT NULL,
    komisi NUMERIC NOT NULL DEFAULT 0,
    potongan NUMERIC NOT NULL DEFAULT 0,
    thp NUMERIC NOT NULL,
    catatan TEXT,
    status TEXT NOT NULL DEFAULT 'terbayar',
    petty_cash_id UUID REFERENCES public.petty_cash(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ROW LEVEL SECURITY (RLS) - Enable for security
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

-- 14. DEFAULT POLICIES (Allow full access for authenticated users)
CREATE POLICY "Allow all access to authenticated users" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.kavlings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.land_debts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.land_payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.cashbook FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.petty_cash FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.inventory FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.employees FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users" ON public.salary_payments FOR ALL TO authenticated USING (true);

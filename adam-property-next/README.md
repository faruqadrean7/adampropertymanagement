# PT Adam Property Indonesia - Next.js Enterprise ERP

Sistem Manajemen Properti, Kavling, dan Keuangan Terpadu berbasis **Next.js (App Router, TypeScript, Tailwind CSS)** yang siap dihubungkan langsung ke backend **Supabase (PostgreSQL, Auth, Storage & Realtime)**.

---

## 🚀 Cara Menjalankan Frontend

1. Masuk ke folder proyek:
   ```bash
   cd adam-property-next
   ```

2. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

3. Buka di browser:
   [http://localhost:3000](http://localhost:3000)

---

## 📂 Struktur Modul yang Sudah Selesai (Frontend 100% Berfungsi)

1. **Executive Business Analytics (`DashboardView`)**:
   - 6 Kartu Metrik KPI (Omzet Penjualan, Realisasi Kas Masuk, Piutang Customer, Hutang Petani, Okupansi Kavling, Total Kas Likuid).
   - Grafik Batang Tren Penjualan & Arus Kas (`Chart.js`).
   - Grafik Donat Okupansi Unit Kavling.
   - Ringkasan Kesehatan Finansial.

2. **Peta & Site Plan Kavling (`KavlingView`)**:
   - Filter dropdown per-proyek lahan.
   - Grid kartu kavling interaktif dengan status Terbuka, Booking (DP), dan Terjual.
   - Fitur **+ Buat Blok Sekaligus (Batch Generator)**.
   - Modal detail unit & ubah status instan.

3. **Data Customer & Barter Material (`CustomerView`)**:
   - Data customer pembeli kavling.
   - Pelunasan tunai, transfer bank, dan **Barter Material Bangunan** (semen, besi, pasir, bata ringan).
   - Modal riwayat kwitansi & pembayaran bertahap.

4. **Hutang Lahan ke Petani (`LandDebtView`)**:
   - **Filter pemilihan lahan terpisah** agar pencatatan hutang antar tanah mentah tidak tercampur.
   - Pemantauan kesepakatan akta notaris, DP, cicilan, dan sisa hutang.
   - Pembayaran cicilan otomatis memotong Kas Besar.

5. **Buku Kas Besar / General Ledger (`CashbookView`)**:
   - Pencatatan arus kas masuk dari penjualan kavling (**Auto-Sync**) & suntikan modal investor.
   - Pencatatan pengeluaran proyek (sewa alat berat, notaris, dll).
   - Rekapitulasi mutasi dan cetak laporan resmi.

6. **Buku Kas Kecil Kantor / Petty Cash (`PettyCashView`)**:
   - Pengelolaan uang kasir harian (ATK, bensin survey lahan, konsumsi, utilitas).
   - Fitur **Top Up Kas Kecil** yang otomatis sinkron mengurangi Kas Besar.
   - Otomatis mencatat pengeluaran saat gaji karyawan dibayarkan.

7. **Inventaris & Aset Kantor Tetap (`InventoryView`)**:
   - Sarana kantor, laptop Asus ROG, printer Epson, theodolite alat ukur tanah, brankas Chubbsafes.
   - Fitur **Stiker Label Barcode Aset** siap cetak.

8. **Karyawan, Tim Marketing & Payroll Gaji (`EmployeeView`)**:
   - Profil staf & tim sales lengkap dengan nomor rekening bank dan rincian gaji (pokok, tunjangan, komisi closing kavling).
   - Tombol **Gaji 1-Klik** dan **⚡ Gaji Massal Bulan Ini** yang **langsung otomatis memotong saldo Kas Kecil kantor**.
   - Modal cetak Slip Gaji resmi.

---

## 🗄️ Langkah Menghubungkan ke Supabase Backend (Tahap Selanjutnya)

1. Buat proyek baru di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** di dashboard Supabase Anda.
3. Salin dan jalankan seluruh isi file [`supabase-schema.sql`](./supabase-schema.sql).
4. Buat file `.env.local` di folder `adam-property-next`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. Supabase Client telah tersedia di [`src/lib/supabaseClient.ts`](./src/lib/supabaseClient.ts).

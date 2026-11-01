# ADAM PROPERTY GROUP - ENTERPRISE REAL ESTATE SYSTEM
**Sistem Manajemen Kavling, Customer CRM, Barter Material, Hutang Petani, Kas Besar Investor, Kas Kecil & Inventaris Kantor**

Aplikasi sistem pengelolaan properti terpadu berbasis Web (HTML5, Tailwind CSS, JavaScript, IndexedDB v6) dengan tampilan **Corporate Executive**, dirancang khusus untuk operasional pengembang tanah kavling dan perumahan mandiri.

---

## 🚀 Cara Menjalankan Aplikasi
1. Buka folder kerja: `C:\Users\ADAM PROPERTY\Desktop\adamcustomer\`.
2. Klik ganda (**double-click**) pada file **`index.html`** untuk membukanya di browser (Google Chrome, Microsoft Edge, dll).
3. Berjalan **100% offline** tanpa perlu instalasi server atau internet. Seluruh data tersimpan secara lokal dan aman di browser komputer Anda (IndexedDB v6).

---

## 🏢 Navigasi Samping Eksekutif (Executive Sidebar Navigation)
Tata letak navigasi menggunakan **Sidebar Samping Kiri (*Left Sidebar*)** bergaya Enterprise ERP Properti:
* **Identitas Korporat**: Logo `AP` gradient emerald, `ADAM PROPERTY GROUP - Real Estate Dev`, status sistem `v6.0 OFFLINE`.
* **Pengelompokan Modul Vertikal**:
  * **OPERASIONAL PROPERTI**:
    1. 🗺️ **1. Peta & Site Plan Kavling**: Manajemen unit kavling, pengelompokan blok (Ruko, A, B, C), spek fisik asli, dan status (*Terbuka*, *Booking*, *Terjual*).
    2. 👥 **2. Customer & Piutang Kavling**: CRM customer, identitas (**KTP, KK, & AJB setelah DP**), kwitansi tunai, serta **Barter Material Bangunan**.
    3. 🚜 **3. Hutang Lahan ke Petani / Pemilik**: Pembebasan lahan mentah, perjanjian notaris, alas hak tanah petani, serta cicilan bertahap berfilter per proyek.
  * **MANAJEMEN KEUANGAN**:
    4. 💰 **4. Kas Besar & Investor (Arus Kas)**: Buku kas besar sentral, pencatatan uang masuk (**AUTO-SYNC dari Customer**), modal investor, serta pengeluaran proyek.
    5. 🧾 **5. Kas Kecil Kantor (Petty Cash)**: Operasional harian laci kantor, belanja ATK/konsumsi/BBM, dengan top up dari **Kas Besar (Auto-Sync)** dan **Investor**.
  * **ASET & SARANA KANTOR**:
    6. 📦 **6. Inventaris Kantor & Aset Tetap**: Pencatatan peralatan kantor, laptop, printer, drone pemetaan, theodolite alat ukur tanah, brankas dokumen sertifikat, kendaraan dinas, dan **cetak label barcode stiker**.
* **Toolbar Bawah Sidebar**: Tombol aksi dinamis (*+ Tambah Kavling / Customer / Top Up / Inventaris*), tombol Backup/Restore, dan Muat Data Demo.
* **Responsive Mobile Drawer**: Pada layar ponsel/tablet, navigasi samping dapat dibuka-tutup dengan tombol hamburger menu.

---

## 📦 1. Fitur Inventaris Kantor & Aset Tetap Developer
Modul untuk mengelola aset fisik, sarana perkantoran, dan peralatan proyek lapangan milik ADAM PROPERTY GROUP:
* **Data Lengkap Aset & Peralatan**:
  * **Kode Inventaris Unik**: Format otomatis `INV-2026-001`, dapat disesuaikan.
  * **Nama & Spesifikasi Barang**: Merk, tipe, kelengkapan aksesoris, masa garansi.
  * **Nomor Seri / SN / No Rangka / Plat**: Nomor seri pabrikan atau plat nomor kendaraan untuk identifikasi unit fisik.
  * **Kategori Terstandar**:
    * 💻 *Elektronik & Komputer* (Laptop pimpinan, PC desain, tablet marketing).
    * 🖨️ *Mesin & Perkantoran* (Printer cetak AJB/berkas, mesin laminating).
    * 🪑 *Mebel & Furniture* (Meja kayu jati direktur, kursi putar, lemari arsip).
    * 📐 *Peralatan Ukur & Lapangan* (Theodolite digital, meteran laser, patok).
    * 🚗 *Kendaraan Operasional* (Mobil survey kavling, sepeda motor lapangan).
    * ❄️ *Fasilitas & Pendingin* (AC inverter, dispenser, kulkas kantor).
    * 🔒 *Keamanan & Brankas* (Brankas anti api dokumen sertifikat SHM, CCTV).
    * 📦 *Lainnya*.
  * **Lokasi Penempatan**: Ruang Direktur, Ruang Admin & Kasir, Ruang Marketing, Gudang Proyek Baitul Makmur, Kendaraan Dinas, dll.
  * **Penanggung Jawab / Pemegang**: PIC aset (Direktur, Kasir, Tim Lapangan).
  * **Sumber Dana Perolehan**: Kas Besar Developer, Kas Kecil Kantor, Modal Awal Owner/Investor, Hibah/Barter.
  * **Nilai Aset / Harga Beli (Rp)**: Nilai perolehan buku aset perusahaan.
  * **Kondisi Fisik**: 🟢 *Baik / Prima*, 🟡 *Perlu Servis*, 🔴 *Rusak Berat*, ⚪ *Afkir / Dijual*.
  * **Upload Berkas**: Foto fisik barang & foto nota pembelian/kartu garansi.
* **4 Indikator Statistik Eksekutif**:
  1. **Total Nilai Buku Aset (Rp)**: Akumulasi nilai aktiva tetap perusahaan.
  2. **Total Unit Fisik Barang**: Jumlah unit barang terdaftar beserta ringkasan per kategori.
  3. **Kondisi Baik / Prima**: Unit siap pakai operasional.
  4. **Perlu Servis / Rusak**: Unit butuh perbaikan atau penggantian.
* **Cetak Label Stiker Barcode (Asset Tag)**:
  * Tombol `Cetak Stiker Barcode Label` mencetak stiker inventaris berukuran standar dengan logo ADAM PROPERTY GROUP, kode barcode visual, spesifikasi barang, lokasi penempatan, tanggal perolehan, dan label kepemilikan resmi untuk ditempel pada aset fisik.
* **Cetak Laporan Rekapitulasi Inventaris**:
  * Format cetak resmi Berita Acara / Laporan Daftar Inventaris Kantor berlogo korporat untuk audit keuangan dan pertanggungjawaban kepada Direktur Utama.

---

## 🧾 2. Fitur Kas Kecil Kantor (Petty Cash Operasional Harian)
Modul khusus pemegang kas kecil (Sekretaris / Kasir Laci Kantor) untuk mengontrol uang harian keperluan kantor:
* **Multi-Sumber Dana Top Up**:
  * **Top Up dari Kas Besar**: Pencairan dana dari rekening/kas besar developer. Sistem secara otomatis mencatat pengeluaran di Kas Besar (**Auto-Sync**) sehingga pembukuan kas besar dan laci kasir sinkron tanpa selisih.
  * **Uang Langsung dari Investor**: Penerimaan dana taktis langsung dari investor (misal: suntikan dana operasional khusus, jamuan tamu proyek, dll).
  * **Setoran Mandiri / Saldo Awal**: Catatan modal awal kasir laci kantor.
* **Pencatatan Belanja Barang & Keperluan Harian**:
  * ✏️ ATK & Perlengkapan Kantor, ☕ Konsumsi & Dapur Kantor, ⛽ Transportasi & BBM Lapangan, 📮 Materai 10.000 & Pos, 💡 Listrik/WiFi, 🧹 Kebersihan & Pantry, 🔧 Maintenance & Service.
  * Upload foto struk/nota fisik belanjaan.
* **Indikator Kesehatan Saldo Laci Kasir**:
  * 🟢 **Saldo Kasir Aman** (> Rp 1.000.000)
  * 🟡 **Saldo Menipis, Siapkan Top Up** (Rp 0 - Rp 1.000.000)
  * 🔴 **Kasir Habis / Perlu Top Up** (≤ Rp 0)
* **Cetak Dokumen Resmi Kas Kecil**:
  * **Cetak Voucher Bon Kasir (BPKK)**: Bukti Pengeluaran/Penerimaan Kas Kecil dengan angka terbilang dan kolom tanda tangan.
  * **Cetak Laporan Pertanggungjawaban Kas Kecil (LPJ)**: Lembar rekap belanja bulanan untuk pengajuan *reimbursement*.

---

## 💰 3. Fitur Kas Besar & Investor (Auto-Sync Penjualan Kavling)
Sentral mutasi keuangan real-time untuk memantau likuiditas kas pengembang:
* **Auto-Sync Otomatis dari Penjualan Kavling**: Setiap pembayaran customer di CRM (DP, cicilan, pelunasan) otomatis masuk ke Buku Kas Besar dengan label `💰 Jual Kavling [AUTO]`.
* **Pencatatan Dana Masuk Investor / Pemodal**: Form suntikan modal proyek, alokasi perumahan, rekening bank, kesepakatan bagi hasil, dan bukti transfer.
* **Pencatatan Kas Keluar Operasional & Pengeluaran Proyek**: Biaya legalitas/notaris, perataan lahan (alat berat cut & fill), marketing/brosur, gaji tukang, dan cicilan petani (`🌾 Bayar Petani [AUTO]`).
* **5 Indikator Finansial Eksekutif**: Total Kas Masuk Likuid, Penerimaan Jual Kavling, Dana Investor, Total Kas Keluar, dan Saldo Kas Bersih (Net Cash).
* **Cetak Dokumen Keuangan Resmi**: Cetak Voucher Kas Masuk (BKM), Voucher Kas Keluar (BKK), dan Cetak Rekapitulasi Kas Besar.

---

## 🧱 4. Fitur Transaksi Barter Material (Bahan Bangunan)
Untuk kasus di mana customer / toko bangunan membeli kavling dengan cara barter material:
* Pilihan metode pembayaran: Tunai, Barter Material Bangunan (Non-Tunai), atau Campuran.
* Konversi nilai Rupiah yang setara (misal: Rp 250.000.000) sehingga sisa tagihan kavling otomatis terhitung **LUNAS** dan kavling berstatus **🔴 TERJUAL**.
* Rincian spesifikasi material (Semen, Besi beton, Bata hebel, Pasir cor) dan upload Surat Jalan/Nota Toko Bangunan/BAST.
* Cetak lembar resmi *"Tanda Terima Barter Material Bahan Bangunan (Non-Tunai)"*.

---

## 🚜 5. Fitur Hutang Lahan ke Petani / Pemilik Lahan
Untuk mencatat kewajiban pengembang saat membeli lahan mentah sebelum dipetakan menjadi kavling:
* **Dropdown Filter Lahan Proyek**: Pisahkan catatan hutang antar lahan (*Baitul Makmur Regency* vs *Griya Harmoni Asri*).
* Luas lahan mentah (m² / Ru), alas hak tanah (Letter C / SHM), upload foto sertifikat dan perjanjian notaris.
* Riwayat cicilan DP dan termin pembayaran bertahap dengan foto kwitansi bermaterai (Auto-Sync ke Kas Besar).

---

## 🗺️ 6. Peta Kavling & Spek Detail
* **Site Plan Visual per Blok**: Blok Ruko, Blok A, Blok B, Blok C.
* **Klik Kotak Kavling**: Menampilkan jendela spesifikasi (Luas tanah m², Ukuran dimensi asli P×L, Tipe hunian/ruko/hook, Harga Rp, serta Catatan keunggulan).
* **Keterhubungan Langsung**: Jika kavling berstatus *Booking* atau *Terjual*, langsung muncul kartu customer pemiliknya dengan tombol cepat **"Buka Data Customer & Kwitansi"**.

---

## 💾 Backup & Restore Lengkap (IndexedDB v6)
Tombol **Backup / Restore** di kiri bawah sidebar mencadangkan seluruh 9 tabel database:
1. Induk Proyek
2. Unit Kavling & Site Plan
3. Data Customer CRM
4. Dokumen KTP, KK, dan AJB
5. Riwayat Kwitansi & Transaksi Barter Material
6. Catatan Lahan & Cicilan Petani
7. Buku Kas Besar & Arus Modal Investor
8. Buku Kas Kecil Kantor (Petty Cash)
9. **Inventaris Kantor & Aset Tetap Developer**

---
*Dikembangkan secara khusus untuk operasional ADAM PROPERTY GROUP.*

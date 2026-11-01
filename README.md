# ADAM PROPERTY GROUP - ENTERPRISE REAL ESTATE SYSTEM
**Sistem Manajemen Kavling, Customer CRM, Barter Material, Hutang Petani, Kas Besar Investor, Kas Kecil, Inventaris Kantor, Data Karyawan & Marketing, Payroll Otomatis & Dashboard Eksekutif**

Aplikasi sistem pengelolaan properti terpadu berbasis Web (HTML5, Tailwind CSS, Chart.js, SweetAlert2, JavaScript, IndexedDB v7) dengan tampilan **Corporate Executive**, dirancang khusus untuk direksi, manajer, kasir, dan tim marketing pengembang tanah kavling dan perumahan mandiri.

---

## 🚀 Cara Menjalankan Aplikasi
1. Buka folder kerja: `C:\Users\ADAM PROPERTY\Desktop\adamcustomer\`.
2. Klik ganda (**double-click**) pada file **`index.html`** untuk membukanya di browser (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).
3. Berjalan **100% offline** tanpa perlu instalasi server atau internet. Seluruh data tersimpan secara lokal dan aman di browser komputer Anda (IndexedDB v7).

---

## 🏢 Navigasi Samping Eksekutif (Executive Sidebar Navigation)
Tata letak navigasi menggunakan **Sidebar Samping Kiri (*Left Sidebar*)** bergaya Enterprise ERP Properti:
* **Identitas Korporat**: Logo `AP` gradient emerald, `ADAM PROPERTY GROUP - Real Estate Dev`, status sistem `v7.0 OFFLINE`.
* **Pengelompokan Modul Vertikal**:
  * **DASHBOARD UTAMA**:
    * 📊 **Dashboard Eksekutif**: Grafik tren penjualan, arus kas, pembebasan lahan, okupansi unit & monitoring usaha.
  * **OPERASIONAL PROPERTI**:
    1. 🗺️ **1. Peta & Site Plan Kavling**: Manajemen unit kavling, pengelompokan blok (Ruko, A, B, C), spek fisik asli, dan status (*Terbuka*, *Booking*, *Terjual*).
    2. 👥 **2. Customer & Piutang Kavling**: CRM customer, identitas (**KTP, KK, & AJB setelah DP**), kwitansi tunai, serta **Barter Material Bangunan**.
    3. 🚜 **3. Hutang Lahan ke Petani / Pemilik**: Pembebasan lahan mentah, perjanjian notaris, alas hak tanah petani, serta cicilan bertahap berfilter per proyek.
  * **MANAJEMEN KEUANGAN**:
    4. 💰 **4. Kas Besar & Investor (Arus Kas)**: Buku kas besar sentral, pencatatan uang masuk (**AUTO-SYNC dari Customer**), modal investor, serta pengeluaran proyek.
    5. 🧾 **5. Kas Kecil Kantor (Petty Cash)**: Operasional harian laci kantor, belanja ATK/konsumsi/BBM, dengan top up dari **Kas Besar (Auto-Sync)** dan **Investor**.
  * **ASET & SARANA KANTOR**:
    6. 📦 **6. Inventaris Kantor & Aset Tetap**: Pencatatan peralatan kantor, laptop, printer, theodolite alat ukur tanah, brankas dokumen sertifikat, kendaraan dinas, dan **cetak label barcode stiker**.
  * **TIM & KARYAWAN**:
    7. 👥 **7. Data Karyawan & Marketing**: Profil tim, komisi closing kavling, nomor rekening bank, link direct WhatsApp, dan **Payroll 1-Klik Otomatis Memotong Kas Kecil**.
* **Toolbar Bawah Sidebar**: Tombol aksi dinamis (*+ Tambah Kavling / Customer / Top Up / Inventaris / Karyawan*), tombol Backup/Restore, dan Muat Data Demo.
* **Responsive Mobile Drawer**: Pada layar ponsel/tablet, navigasi samping dapat dibuka-tutup dengan tombol hamburger menu.

---

## 👥 1. Fitur Data Karyawan, Tim Marketing & Payroll Gaji (Kas Kecil)
Modul untuk mengelola seluruh data sumber daya manusia (SDM) perusahaan properti, menghitung komisi penjualan kavling, dan mengeksekusi pembayaran gaji secara cepat:

* **Manajemen Profil Staf & Marketing**:
  * **Data Pribadi & Kepegawaian**: Nama lengkap, NIK/KTP, status ikatan kerja (*Karyawan Tetap*, *Karyawan Kontrak*, *Marketing Freelance / Komisi Only*), tanggal masuk, dan status keaktifan (🟢 Aktif / ⚪ Nonaktif).
  * **Departemen / Divisi Kerja**:
    * 📢 *Marketing & Penjualan Kavling* (Senior Marketing, Sales Eksekutif).
    * 🏢 *Kantor & Administrasi* (Staff Admin, Customer Care).
    * 💰 *Kasir & Keuangan* (Staff Kasir Laci, Akuntansi).
    * 🚜 *Pengawas & Mandor Lapangan* (Pematangan lahan, patok batas kavling, drainase).
    * ⚖️ *Legalitas & Notaris AJB* (Pengurusan alas hak, AJB, balik nama SHM).
    * 👔 *Direksi / Pimpinan*.
  * **Direct WhatsApp Integration**: Klik nomor telepon staf untuk langsung membuka obrolan WhatsApp (`https://wa.me/...`).
  * **Rekening Penerimaan Gaji**: Nama bank (BCA, Mandiri, BRI, BNI, BSI, Bank Jatim, Tunai, dll), nomor rekening, dan nama pemilik rekening.
* **Struktur Finansial & Gaji Bulanan**:
  * Gaji Pokok (Rp).
  * Tunjangan Makan & Transportasi (Rp).
  * Komisi / Bonus Standar Closing Kavling (Rp).
  * Potongan Rutin / Kasbon / Absensi (Rp).
  * **Live Take Home Pay (THP) Preview**: Otomatis menghitung `(Gaji Pokok + Tunjangan + Komisi) - Potongan` secara *real-time*.
* **⚡ 1-Klik Bayar Gaji (Auto-Deduct Kas Kecil)**:
  * Klik tombol **⚡ Bayar** pada baris karyawan.
  * Sistem memverifikasi saldo Kas Kecil kantor secara langsung (*health check*). Jika saldo kurang, sistem memberikan peringatan detail.
  * Begitu dikonfirmasi, sistem secara otomatis:
    1. Membuat transaksi kas keluar di **Kas Kecil (`PettyCashDB`)** dengan kategori `gaji_karyawan` dan keterangan lengkap.
    2. Membuat record slip gaji resmi di **`PayrollDB`** lengkap dengan nomor slip unik (contoh: `SLIP/APG/202611/0001`).
    3. Menghubungkan ID transaksi kas kecil dengan slip payroll.
    4. Mengurangi saldo Kas Kecil secara seketika pada buku kas dan kartu stat dashboard.
* **⚡ Gaji Massal Bulan Ini**:
  * Tombol **⚡ Gaji Massal Bulan Ini** di toolbar atas untuk menggaji seluruh karyawan aktif yang belum dicairkan gajinya dalam satu klik.
* **📄 Cetak Slip Gaji Resmi (Print / PDF)**:
  * Kop surat resmi **ADAM PROPERTY GROUP** dengan logo korporat, alamat kantor, dan kontak resmi.
  * Nomor slip gaji unik dan periode penggajian.
  * Identitas karyawan, divisi, jabatan, dan rekening bank penerima.
  * Tabel rincian komponen penghasilan bruto versus komponen potongan.
  * Nominal Gaji Bersih Diterima (THP) dengan teks angka **Terbilang** resmi (*contoh: "Tujuh Juta Lima Ratus Ribu Rupiah"*).
  * 3 kolom tanda tangan resmi: **Penerima (Karyawan)**, **Kasir / Keuangan**, dan **Direktur Utama**.
* **📑 Rekapitulasi Riwayat Payroll & Pembatalan Aman**:
  * Tombol **Riwayat Slip** menampilkan histori seluruh slip gaji dengan filter periode dan pencarian.
  * **Fitur Batalkan Slip**: Jika terjadi kesalahan penggajian, membatalkan slip akan otomatis menghapus transaksi kas kecil terkait dan mengembalikan saldo Kas Kecil kantor.

---

## 📊 2. Dashboard Eksekutif, Grafik Penjualan & Monitoring Finansial Usaha
Tampilan beranda utama (*Executive Business Analytics*) yang menyajikan indikator kinerja kunci (KPI), grafik interaktif Chart.js, serta widget penagihan piutang dan stok unit secara konsolidasi:

* **Filter Proyek Dinamis**:
  * Pilihan `🌟 Semua Proyek Kavling (Konsolidasi)` untuk melihat performa bisnis group secara menyeluruh.
  * Pilihan per proyek spesifik (misal: *Baitul Makmur Regency*) untuk analisa mendalam unit per kawasan.
* **6 Kartu Metrik Finansial & Operasional (Executive KPIs)**:
  1. 💵 **Total Omzet Penjualan Kavling**: Akumulasi nilai kontrak penjualan kavling yang telah laku/booking.
  2. 📈 **Realisasi Kas Masuk Real**: Total uang kas/bank aktual yang telah diterima dari pembayaran DP dan cicilan konsumen.
  3. ⚠️ **Piutang Berjalan Customer**: Sisa saldo piutang yang masih harus ditagihkan ke konsumen.
  4. 🚜 **Sisa Hutang Pokok Lahan Petani**: Sisa kewajiban pelunasan tanah mentah kepada petani pemilik lahan asal.
  5. 📊 **Okupansi & Keterjualan Kavling**: Persentase kavling laku beserta rincian unit Terjual, Booking, dan Terbuka.
  6. 🏦 **Total Kas Bersih Likuid**: Saldo kas riil perusahaan (akumulasi Kas Besar Sentral + Kas Kecil Kantor).
* **6 Grafik Interaktif Bisnis (Powered by Chart.js)**:
  1. 📊 **Tren Nilai Penjualan Kavling & Realisasi Uang Masuk**: Grafik kombinasi Bar + Line yang membandingkan Omzet Kontrak Penjualan Baru vs Uang Masuk Aktual vs Pengeluaran Kas per bulan.
  2. 🍩 **Status Stok Unit Kavling & Okupansi Blok**: Diagram donat rasio Terjual, Booking, dan Terbuka, dilengkapi *Progress Bar* keterjualan per blok (Blok Ruko, Blok A, Blok B, Blok C).
  3. ⚖️ **Komparasi Arus Kas Sentral (Inflow vs Outflow)**: Perbandingan penerimaan penjualan dan investor melawan pengeluaran lahan, kas kecil, dan operasional proyek.
  4. 🌾 **Status Pelunasan Hutang Petani**: Bar horizontal bertumpuk (*Stacked Horizontal Bar*) memperlihatkan porsi yang sudah dicicil versus sisa hutang per lahan petani.
  5. 🧱 **Komposisi Transaksi Tunai vs Barter Material**: Analisa visual porsi pembayaran tunai/transfer bank dibandingkan barter material bahan bangunan proyek.
  6. 💻 **Valuasi Aset & Inventaris Kantor**: Distribusi nilai buku aktiva tetap menurut kategori (Elektronik & IT, Kendaraan, Alat Lapangan, Furniture, K3).
* **Widget Tindakan Cepat (Actionable Widgets)**:
  * ⚠️ **Piutang Customer Terbesar**: Daftar 5 konsumen prioritas penagihan dengan akses 1-klik ke kwitansi detail.
  * 🌟 **Kavling Terbuka Siap Jual**: Daftar unit unggulan siap ditawarkan marketing dengan akses 1-klik ke Site Plan.
* **Cetak Ringkasan Eksekutif (Print / PDF)**:
  * Tombol `Cetak Laporan` untuk mencetak lembar resmi Berita Acara Kinerja Bisnis berlogo ADAM PROPERTY GROUP lengkap dengan kolom tanda tangan Manager Keuangan dan Direktur Utama.

---

## 📦 3. Fitur Inventaris Kantor & Aset Tetap Developer
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

## 🧾 4. Fitur Kas Kecil Kantor (Petty Cash Operasional Harian)
Modul khusus pemegang kas kecil (Sekretaris / Kasir Laci Kantor) untuk mengontrol uang harian keperluan kantor:
* **Multi-Sumber Dana Top Up**:
  * **Top Up dari Kas Besar**: Pencairan dana dari rekening/kas besar developer. Sistem secara otomatis mencatat pengeluaran di Kas Besar (**Auto-Sync**) sehingga pembukuan kas besar dan laci kasir sinkron tanpa selisih.
  * **Uang Langsung dari Investor**: Penerimaan dana taktis langsung dari investor (misal: suntikan dana operasional khusus, jamuan tamu proyek, dll).
  * **Setoran Mandiri / Saldo Awal**: Catatan modal awal kasir laci kantor.
* **Pencatatan Belanja Barang & Keperluan Harian**:
  * ✏️ ATK & Perlengkapan Kantor, ☕ Konsumsi & Dapur Kantor, ⛽ Transportasi & BBM Lapangan, 📮 Materai 10.000 & Pos, 💡 Listrik/WiFi, 🧹 Kebersihan & Pantry, 🔧 Maintenance & Service, 👥 **Gaji & Insentif Karyawan (Auto-Payroll)**.
  * Upload foto struk/nota fisik belanjaan.
* **Indikator Kesehatan Saldo Laci Kasir**:
  * 🟢 **Saldo Kasir Aman** (> Rp 1.000.000)
  * 🟡 **Saldo Menipis, Siapkan Top Up** (Rp 0 - Rp 1.000.000)
  * 🔴 **Kasir Habis / Perlu Top Up** (≤ Rp 0)
* **Cetak Dokumen Resmi Kas Kecil**:
  * **Cetak Voucher Bon Kasir (BPKK)**: Bukti Pengeluaran/Penerimaan Kas Kecil dengan angka terbilang dan kolom tanda tangan.
  * **Cetak Laporan Pertanggungjawaban Kas Kecil (LPJ)**: Lembar rekap belanja bulanan untuk pengajuan *reimbursement*.

---

## 💰 5. Fitur Kas Besar & Investor (Auto-Sync Penjualan Kavling)
Sentral mutasi keuangan real-time untuk memantau likuiditas kas pengembang:
* **Auto-Sync Otomatis dari Penjualan Kavling**: Setiap pembayaran customer di CRM (DP, cicilan, pelunasan) otomatis masuk ke Buku Kas Besar dengan label `💰 Jual Kavling [AUTO]`.
* **Pencatatan Dana Masuk Investor / Pemodal**: Form suntikan modal proyek, alokasi perumahan, rekening bank, kesepakatan bagi hasil, dan bukti transfer.
* **Pencatatan Kas Keluar Operasional & Pengeluaran Proyek**: Biaya legalitas/notaris, perataan lahan (alat berat cut & fill), marketing/brosur, gaji tukang, dan cicilan petani (`🌾 Bayar Petani [AUTO]`).
* **5 Indikator Finansial Eksekutif**: Total Kas Masuk Likuid, Penerimaan Jual Kavling, Dana Investor, Total Kas Keluar, dan Saldo Kas Bersih (Net Cash).
* **Cetak Dokumen Keuangan Resmi**: Cetak Voucher Kas Masuk (BKM), Voucher Kas Keluar (BKK), dan Cetak Rekapitulasi Kas Besar.

---

## 🧱 6. Fitur Transaksi Barter Material (Bahan Bangunan)
Untuk kasus di mana customer / toko bangunan membeli kavling dengan cara barter material:
* Pilihan metode pembayaran: Tunai, Barter Material Bangunan (Non-Tunai), atau Campuran.
* Konversi nilai Rupiah yang setara (misal: Rp 250.000.000) sehingga sisa tagihan kavling otomatis terhitung **LUNAS** dan kavling berstatus **🔴 TERJUAL**.
* Rincian spesifikasi material (Semen, Besi beton, Bata hebel, Pasir cor) dan upload Surat Jalan/Nota Toko Bangunan/BAST.
* Cetak lembar resmi *"Tanda Terima Barter Material Bahan Bangunan (Non-Tunai)"*.

---

## 🚜 7. Fitur Hutang Lahan ke Petani / Pemilik Lahan
Untuk mencatat kewajiban pengembang saat membeli lahan mentah sebelum dipetakan menjadi kavling:
* **Dropdown Filter Lahan Proyek**: Pisahkan catatan hutang antar lahan (*Baitul Makmur Regency* vs *Griya Harmoni Asri*).
* Luas lahan mentah (m² / Ru), alas hak tanah (Letter C / SHM), upload foto sertifikat dan perjanjian notaris.
* Riwayat cicilan DP dan termin pembayaran bertahap dengan foto kwitansi bermaterai (Auto-Sync ke Kas Besar).

---

## 🗺️ 8. Peta Kavling & Spek Detail
* **Site Plan Visual per Blok**: Blok Ruko, Blok A, Blok B, Blok C.
* **Klik Kotak Kavling**: Menampilkan jendela spesifikasi (Luas tanah m², Ukuran dimensi asli P×L, Tipe hunian/ruko/hook, Harga Rp, serta Catatan keunggulan).
* **Keterhubungan Langsung**: Jika kavling berstatus *Booking* atau *Terjual*, langsung muncul kartu customer pemiliknya dengan tombol cepat **"Buka Data Customer & Kwitansi"**.

---

## 💾 Backup & Restore Lengkap (IndexedDB v7)
Tombol **Backup / Restore** di kiri bawah sidebar mencadangkan seluruh 11 tabel database:
1. Induk Proyek
2. Unit Kavling & Site Plan
3. Data Customer CRM
4. Dokumen KTP, KK, dan AJB
5. Riwayat Kwitansi & Transaksi Barter Material
6. Catatan Lahan & Cicilan Petani
7. Buku Kas Besar & Arus Modal Investor
8. Buku Kas Kecil Kantor (Petty Cash)
9. Inventaris Kantor & Aset Tetap Developer
10. **Data Karyawan, Staf & Tim Marketing (`employees`)**
11. **Slip Gaji & Rekapitulasi Payroll (`payrolls`)**

---
*Dikembangkan secara khusus untuk operasional ADAM PROPERTY GROUP.*

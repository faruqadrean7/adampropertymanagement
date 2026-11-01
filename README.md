# ADAM PROPERTY GROUP - ENTERPRISE REAL ESTATE SYSTEM
**Sistem Manajemen Kavling, Customer CRM, Barter Material, Hutang Petani, Kas Besar Investor & Kas Kecil Kantor**

Aplikasi sistem pengelolaan properti terpadu berbasis Web (HTML5, Tailwind CSS, JavaScript, IndexedDB v5) dengan tampilan **Corporate Executive**, dirancang khusus untuk operasional pengembang tanah kavling dan perumahan mandiri.

---

## 🚀 Cara Menjalankan Aplikasi
1. Buka folder kerja: `C:\Users\ADAM PROPERTY\Desktop\adamcustomer\`.
2. Klik ganda (**double-click**) pada file **`index.html`** untuk membukanya di browser (Google Chrome, Microsoft Edge, dll).
3. Berjalan **100% offline** tanpa perlu instalasi server atau internet. Seluruh data tersimpan secara lokal dan aman di browser komputer Anda (IndexedDB v5).

---

## 🏢 Navigasi Samping Eksekutif (Executive Sidebar Navigation)
Tata letak navigasi kini menggunakan **Sidebar Samping Kiri (*Left Sidebar*)** bergaya Enterprise ERP Properti:
* **Identitas Korporat**: Logo `AP` gradient emerald, `ADAM PROPERTY GROUP - Real Estate Dev`, status sistem `v5.0 OFFLINE`.
* **Pengelompokan Modul Vertikal**:
  * **OPERASIONAL PROPERTI**:
    1. 🗺️ **1. Peta & Site Plan Kavling**: Manajemen unit kavling, pengelompokan blok (Ruko, A, B, C), spek fisik asli, dan status (*Terbuka*, *Booking*, *Terjual*).
    2. 👥 **2. Customer & Piutang Kavling**: CRM customer, identitas (**KTP, KK, & AJB setelah DP**), kwitansi tunai, serta **Barter Material Bangunan**.
    3. 🚜 **3. Hutang Lahan ke Petani / Pemilik**: Pembebasan lahan mentah, perjanjian notaris, alas hak tanah petani, serta cicilan bertahap berfilter per proyek.
  * **MANAJEMEN KEUANGAN**:
    4. 💰 **4. Kas Besar & Investor (Arus Kas)**: Buku kas besar sentral, pencatatan uang masuk (**AUTO-SYNC dari Customer**), modal investor, serta pengeluaran proyek.
    5. 🧾 **5. Kas Kecil Kantor (Petty Cash)**: Operasional harian laci kantor, belanja ATK/konsumsi/BBM, dengan top up dari **Kas Besar (Auto-Sync)** dan **Investor**.
* **Toolbar Bawah Sidebar**: Tombol aksi dinamis (*+ Tambah Kavling / Customer / Top Up*), tombol Backup/Restore, dan Muat Data Demo.
* **Responsive Mobile Drawer**: Pada layar ponsel/tablet, navigasi samping dapat dibuka-tutup dengan tombol hamburger menu.

---

## 🧾 1. Fitur Kas Kecil Kantor (Petty Cash Operasional Harian)
Modul khusus pemegang kas kecil (Sekretaris / Kasir Laci Kantor) untuk mengontrol uang harian keperluan kantor:
* **Multi-Sumber Dana Top Up**:
  * **Top Up dari Kas Besar**: Pencairan dana dari rekening/kas besar developer. Sistem secara otomatis mencatat pengeluaran di Kas Besar (**Auto-Sync**) sehingga pembukuan kas besar dan laci kasir sinkron tanpa selisih.
  * **Uang Langsung dari Investor**: Penerimaan dana taktis langsung dari investor (misal: suntikan dana operasional khusus, jamuan tamu proyek, dll).
  * **Setoran Mandiri / Saldo Awal**: Catatan modal awal kasir laci kantor.
* **Pencatatan Belanja Barang & Keperluan Harian**:
  * **Kategori Terstandar**:
    * ✏️ *ATK & Perlengkapan Kantor* (Kertas, pulpen, map arsip, tinta printer).
    * ☕ *Konsumsi & Dapur Kantor* (Air galon, kopi/teh tamu, makan rapat tim).
    * ⛽ *Transportasi & BBM Lapangan* (Bensin survey lokasi, etoll, parkir).
    * 📮 *Materai, Notaris Kecil & Pos* (Materai 10.000, pengiriman berkas).
    * 💡 *Utilitas & Komunikasi* (Listrik token kantor, pulsa/kuota, WiFi).
    * 🧹 *Kebersihan, Pantry & Logistik* (Pembersih lantai, tisu, sabun).
    * 🔧 *Pemeliharaan & Service Kantor* (Service AC, ganti lampu, perbaikan kunci).
    * 📦 *Operasional Harian Lainnya*.
  * **Upload Bukti Nota / Struk Fisik**: Simpan foto bon/struk asli dari toko/SPBU/warung agar audit kasir transparan.
* **Indikator Kesehatan Saldo Laci Kasir (Live Health Indicator)**:
  * 🟢 **Saldo Kasir Aman** (> Rp 1.000.000): Kas siap untuk operasional kantor.
  * 🟡 **Saldo Menipis, Siapkan Top Up** (Rp 0 - Rp 1.000.000): Notifikasi visual agar kasir mengajukan top up dana ke Kas Besar.
  * 🔴 **Kasir Habis / Perlu Top Up** (≤ Rp 0): Peringatan mendesak bahwa dana laci sudah habis.
* **Cetak Dokumen Resmi Kas Kecil**:
  * **Cetak Voucher Bon Kasir (BPKK / BKKK)**: Cetak bukti pengeluaran kas kecil dengan angka terbilang Rupiah dan kolom tanda tangan (Penerima Uang, Kasir Kantor, Pimpinan).
  * **Cetak Laporan Rekapitulasi Kas Kecil**: Lembar pertanggungjawaban kas kecil (*Petty Cash Expense Report*) berlogo korporat untuk dilaporkan saat pengajuan reimbursement ke Direktur/Manajemen.

---

## 💰 2. Fitur Kas Besar & Investor (Auto-Sync Penjualan Kavling)
Sentral mutasi keuangan real-time untuk memantau likuiditas kas pengembang:
* **Auto-Sync Otomatis dari Penjualan Kavling**:
  * Setiap kali Anda menginput pembayaran customer di modul Customer CRM (DP, cicilan, pelunasan), transaksi tersebut **OTOMATIS MASUK** ke Buku Kas Besar dengan label `💰 Jual Kavling [AUTO]`.
  * Rincian kavling, nama customer, nominal, dan foto kwitansi/slip langsung terhubung tanpa perlu ketik dua kali.
  * Jika transaksi di customer dihapus, mutasi di Kas Besar juga otomatis diperbarui.
* **Pencatatan Dana Masuk Investor / Pemodal**:
  * Tombol `+ Catat Dana Masuk Investor`: Catat suntikan modal awal proyek, tambahan modal kerja, atau pembebasan lahan.
  * Form lengkap: Nama Investor, Kontak WhatsApp, Nominal (Rp), Alokasi Proyek, Rekening Penerima (BCA, Mandiri, BRI, Kas Kantor), Kesepakatan Bagi Hasil, dan Upload Bukti Transfer/Akta.
* **Pencatatan Kas Keluar Operasional & Pengeluaran Proyek**:
  * Biaya legalitas/notaris, perataan lahan (alat berat cut & fill), marketing/brosur, gaji tukang, dan infrastruktur.
  * Cicilan tanah ke petani otomatis masuk sebagai arus kas keluar dengan label `🌾 Bayar Petani [AUTO]`.
  * Pencairan dana ke Kas Kecil tercatat sebagai pengeluaran dengan label `Top Up Kas Kecil`.
* **5 Indikator Finansial Eksekutif**:
  1. **Total Kas Masuk Likuid**: Total uang kas/transfer yang telah diterima.
  2. **Uang Masuk Jual Kavling (Auto)**: Total nominal penerimaan dari penjualan unit.
  3. **Dana Modal Investor**: Total modal yang disuntikkan oleh investor.
  4. **Total Kas Keluar**: Akumulasi biaya proyek, legalitas, cicilan petani, dan top up kas kecil.
  5. **Saldo Kas Bersih (Net Cash)**: Uang tunai/likuid yang saat ini tersedia (`Masuk - Keluar`).
  * *Transparansi Barter*: Penerimaan barter material dipisahkan sebagai **Aset Material Non-Tunai** sehingga saldo bank fisik tidak bias.
* **Cetak Dokumen Keuangan Resmi**:
  * **Cetak Voucher Kas**: Cetak lembar resmi *Bukti Kas Masuk (BKM)* atau *Bukti Kas Keluar (BKK)* lengkap dengan angka terbilang dan kolom tanda tangan pimpinan/akuntan/penyetor.
  * **Cetak Laporan Rekap Buku Kas**: Cetak rekapitulasi mutasi kas besar untuk laporan ke Owner atau Investor.

---

## 🧱 3. Fitur Transaksi Barter Material (Bahan Bangunan)
Untuk kasus di mana customer / toko bangunan membeli kavling dengan cara barter material:
* **Pilihan Metode Pembayaran**:
  * `💵 Tunai / Transfer Bank`
  * `🧱 Barter Material Bangunan (Non-Tunai)`
  * `🔄 Campuran (Uang Muka Tunai + Sebagian Barter Material)`
* **Nominal Nilai Barter (Rp)**: Dikonversi ke nilai Rupiah yang setara (misal: Rp 250.000.000) sehingga sisa tagihan kavling otomatis terhitung **LUNAS** dan kavling otomatis berstatus **🔴 TERJUAL**.
* **Rincian Material yang Diterima**: Kolom khusus untuk mencatat spesifikasi bahan bangunan yang diserahkan (misal: *Semen 500 sak, Besi beton 10mm 1.000 batang, Bata hebel 120 m³, Pasir 25 truk*).
* **Upload Bukti**: Unggah foto **Surat Jalan / Nota Toko Bahan Bangunan / BAST**.
* **Kwitansi Cetak**: Menghasilkan lembar resmi *"Tanda Terima Barter Material Bahan Bangunan (Non-Tunai)"* lengkap dengan rincian material dan tanda tangan manajemen.

---

## 🚜 4. Fitur Hutang Lahan ke Petani / Pemilik Lahan
Untuk mencatat kewajiban pengembang saat membeli lahan mentah sebelum dipetakan menjadi kavling:
* **Dropdown Filter Lahan Proyek**: Pisahkan catatan hutang antar lahan (misal: *Baitul Makmur Regency* vs *Griya Harmoni Asri*) agar catatan hutang tidak tercampur.
* **Data Lahan & Petani**:
  * Nama Petani / Pemilik Lahan, Kontak WA, Alamat.
  * Luas Lahan Mentah (misal: *6.000 m² / 420 Ru*).
  * Jenis Dokumen Alas Hak (misal: *Letter C No. 45 / SHM No. 128*).
  * Upload Foto: **Sertifikat / Letter C** dan **Surat Perjanjian Jual Beli / Notaris**.
* **Status Finansial Lahan**: Total kesepakatan harga tanah, yang sudah dibayar, sisa hutang, dan status (🟢 *Lunas* atau 🔴 *Masih Ada Hutang*).
* **Riwayat Cicilan ke Petani**: Catat DP dan termin pembayaran lengkap dengan foto kwitansi bermaterai. Otomatis tersinkron ke pengeluaran Kas Besar.

---

## 🗺️ 5. Peta Kavling & Spek Detail
* **Site Plan Visual per Blok**: Blok Ruko, Blok A, Blok B, Blok C.
* **Klik Kotak Kavling**: Menampilkan jendela spesifikasi (Luas tanah m², Ukuran dimensi asli P×L, Tipe hunian/ruko/hook, Harga Rp, serta Catatan keunggulan).
* **Keterhubungan Langsung**: Jika kavling berstatus *Booking* atau *Terjual*, langsung muncul kartu customer pemiliknya dengan tombol cepat **"Buka Data Customer & Kwitansi"**.

---

## 💾 Backup & Restore Lengkap (IndexedDB v5)
Tombol **Backup / Restore** di kanan atas mencadangkan seluruh 8 tabel database:
1. Induk Proyek
2. Unit Kavling & Site Plan
3. Data Customer CRM
4. Dokumen KTP, KK, dan AJB
5. Riwayat Kwitansi & Transaksi Barter Material
6. Catatan Lahan & Cicilan Petani
7. Buku Kas Besar & Arus Modal Investor
8. **Buku Kas Kecil Kantor (Petty Cash Operasional Harian)**

---
*Dikembangkan secara khusus untuk operasional ADAM PROPERTY GROUP.*

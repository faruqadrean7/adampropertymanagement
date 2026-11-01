# ADAM PROPERTY GROUP - ENTERPRISE REAL ESTATE SYSTEM
**Sistem Manajemen Kavling, Customer CRM, Barter Material & Hutang Lahan Petani**

Aplikasi sistem pengelolaan properti terpadu berbasis Web (HTML5, Tailwind CSS, JavaScript, IndexedDB v3) dengan tampilan **Corporate Executive**, dirancang khusus untuk operasional pengembang tanah kavling dan perumahan.

---

## 🚀 Cara Menjalankan Aplikasi
1. Buka folder kerja: `C:\Users\ADAM PROPERTY\Desktop\adamcustomer\`.
2. Klik ganda (**double-click**) pada file **`index.html`** untuk membukanya di browser (Google Chrome, Microsoft Edge, dll).
3. Berjalan **100% offline** tanpa perlu internet maupun setup database server. Seluruh data tersimpan secara lokal dan aman di browser komputer Anda (IndexedDB).

---

## 🏢 Tampilan Navigasi Perusahaan (Company Feels)
Navigasi atas dirancang menyerupai portal ERP pengembang properti profesional:
* **Identitas Korporat**: `ADAM PROPERTY GROUP - Real Estate & Land Dev`.
* **3 Modul Eksekutif Terpadu**:
  1. 🗺️ **Peta & Site Plan Kavling**: Manajemen unit kavling, pengelompokan blok (Ruko, A, B, C), spek ukuran fisik, dan 3 status (Terbuka, Booking, Terjual).
  2. 👥 **Customer & Piutang Kavling**: Data customer, berkas identitas (**KTP, KK, & AJB setelah DP**), serta kwitansi tunai maupun **Barter Material Bangunan**.
  3. 🚜 **Hutang Lahan ke Petani / Pemilik**: Manajemen pembebasan lahan mentah, perjanjian notaris, sertifikat/Letter C tanah petani, serta cicilan pembayaran bertahap.

---

## 🧱 1. Fitur Transaksi Barter Material (Bahan Bangunan)
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

## 🚜 2. Fitur Hutang Lahan ke Petani / Pemilik Lahan
Untuk mencatat kewajiban pengembang saat membeli lahan mentah sebelum dipetakan menjadi kavling:
* **Data Lahan & Petani**:
  * Nama Petani / Pemilik Lahan, Kontak WA, Alamat.
  * Proyek Terkait (misal: *Baitul Makmur Regency*).
  * Luas Lahan Mentah (misal: *6.000 m² / 420 Ru*).
  * Jenis Dokumen Alas Hak (misal: *Letter C No. 45 / SHM No. 128*).
  * Upload Foto: **Sertifikat / Letter C** dan **Surat Perjanjian Jual Beli / Notaris**.
* **Status Finansial Lahan**:
  * Total Harga Kesepakatan Tanah (Rp).
  * Total yang Sudah Dibayarkan ke Petani (Rp).
  * Sisa Hutang yang Belum Terbayar (Rp).
  * Status: 🟢 *Lunas* atau 🔴 *Masih Ada Hutang*.
* **Riwayat Uang Keluar (Cicilan ke Petani)**:
  * Catatan bertahap (*DP Pembukaan Lahan*, *Termin 1 Pematangan Lahan*, *Termin 2*, *Pelunasan*).
  * Nominal pembayaran (Rp).
  * Metode bayar (*Transfer Bank* atau *Tunai di Rumah Petani*).
  * Upload Foto: **Kwitansi Tanda Tangan Petani di Atas Materai**.

---

## 🗺️ 3. Peta Kavling & Spek Detail
* **Site Plan Visual per Blok**: Blok Ruko, Blok A, Blok B, Blok C.
* **Klik Kotak Kavling**: Menampilkan jendela spesifikasi (Luas tanah m², Ukuran dimensi asli P×L, Tipe hunian/ruko/hook, Harga Rp, serta Catatan keunggulan).
* **Keterhubungan Langsung**: Jika kavling berstatus *Booking* atau *Terjual*, langsung muncul kartu customer pemiliknya dengan tombol cepat **"Buka Data Customer & Kwitansi"**.

---

## 💾 Backup & Restore Lengkap
Tombol **Backup / Restore** di kanan atas mencadangkan seluruh 6 tabel database:
1. Induk Proyek
2. Unit Kavling & Site Plan
3. Data Customer
4. Dokumen KTP, KK, dan AJB
5. Riwayat Kwitansi & Transaksi Barter Material
6. Catatan Lahan & Cicilan Petani

---
*Dikembangkan secara khusus untuk operasional ADAM PROPERTY GROUP.*

# PANDUAN APLIKASI PENCATATAN CUSTOMER KAVLING
**ADAM PROPERTY**

Aplikasi berbasis web modern (HTML, CSS, JavaScript) untuk pencatatan customer pembeli kavling tanah / perumahan, pengelolaan dokumen identitas (KK dan KTP), serta pencatatan riwayat uang masuk / pembayaran lengkap dengan bukti foto kwitansi.

---

## 🚀 Cara Menjalankan Aplikasi
1. Buka folder `adamcustomer` di komputer Anda (`C:\Users\ADAM PROPERTY\Desktop\adamcustomer`).
2. Klik ganda (**double-click**) pada file **`index.html`** untuk membukanya di browser (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).
3. Aplikasi langsung berjalan **100% tanpa perlu install server/database tambahan** (offline-first).

---

## 📋 Fitur Utama Sesuai Kebutuhan

### 1. Kolom Pencatatan Customer Kavling
- **Nama Customer**: Nama lengkap pembeli serta nomor WhatsApp / Telepon untuk kemudahan menghubungi.
- **Kavling Yang Diambil**: Blok kavling atau nomor lot yang dibeli (contoh: *Blok A-03*, *Kavling Melati 12*).
- **Harga Kavling**: Nilai total harga jual tanah kavling dalam format Rupiah (Rp) otomatis.
- **Status Pembayaran & Keuangan**:
  - Total Uang Masuk yang telah dibayarkan oleh customer.
  - Sisa Pembayaran / Piutang yang belum terbayar.
  - Status *Lunas* atau *Mengangsur (% persentase terbayar)*.

---

### 2. Laman "Data Customer" (Dokumen KK & KTP)
Ketika Anda mengklik tombol **"Buka Data Customer"** pada baris customer, akan terbuka laman detail khusus yang menampilkan:
- **Dokumen KTP Customer**:
  - Foto preview KTP yang Anda upload.
  - Tombol **Ganti / Upload KTP** (mendukung foto dari galeri / kamera hp).
  - Tombol **Perbesar (Zoom)** untuk melihat teks NIK dan foto KTP resolusi penuh di layar.
  - Tombol **Unduh KTP** langsung ke komputer.
- **Dokumen KK (Kartu Keluarga)**:
  - Foto preview Kartu Keluarga yang Anda upload.
  - Tombol **Ganti / Upload KK**.
  - Tombol **Perbesar (Zoom)** dan **Unduh KK**.

---

### 3. Riwayat Uang Masuk & Foto Kwitansi
Di bagian bawah dokumen KK & KTP pada laman Data Customer, terdapat pencatatan **Riwayat Uang Masuk**:
- **Tanggal Uang Masuk**: Tanggal saat customer menyetorkan uang.
- **Tujuan Pembayaran**:
  - *Booking Fee / Tanda Jadi*
  - *DP (Uang Muka)*
  - *Angsuran / Cicilan Bulanan*
  - *Pelunasan Kavling*
  - *Biaya Notaris / AJB / Sertifikat*
  - *Tujuan Lainnya (Bisa diketik bebas)*
- **Nominal Masuk (Rp)**: Jumlah uang yang disetorkan. Total terbayar dan sisa tagihan kavling akan dihitung secara **otomatis dan realtime**.
- **Keterangan**: Catatan metode pembayaran (contoh: *Transfer via BCA an. Bambang*, *Tunai di kantor*).
- **Foto Kwitansi**:
  - Unggah foto bukti transfer atau kwitansi fisik.
  - Foto dikompres secara cerdas agar tidak memberatkan browser namun tetap tajam dan jelas terbaca.
  - Klik foto kwitansi untuk memperbesar secara penuh.

---

### 4. Fitur Tambahan Pendukung
- **Cetak Kwitansi Resmi**: Klik ikon printer di samping riwayat pembayaran untuk mencetak lembar kuitansi resmi atas nama **ADAM PROPERTY**.
- **Cetak Rekap Pembayaran (Statement)**: Cetak seluruh riwayat pembayaran customer dalam satu lembar A4 sebagai bukti administrasi atau diserahkan ke pembeli kavling.
- **Pencarian Cepat & Filter**: Cari nama customer atau nomor kavling, serta filter customer berdasarkan status *Lunas* atau *Belum Lunas*.
- **Backup & Restore Data**:
  - Tombol **Backup / Restore** di pojok kanan atas memungkinkan Anda mengunduh seluruh data (termasuk foto KTP, KK, dan kwitansi) ke dalam satu file `.json`.
  - Anda bisa memindahkan file backup ini ke komputer/laptop lain kapan saja.
- **Contoh Data (Demo)**: Terdapat tombol *"Contoh Data"* untuk langsung mengisi 2 sampel pembeli kavling (Blok A dan Blok B) agar Anda bisa langsung mencoba semua fitur.

---

## 📁 Struktur File
- **`index.html`** : Antarmuka halaman web utama, tabel, dan formulir modal.
- **`app.js`** : Logika sistem, perhitungan uang masuk, cetak kuitansi, dan event.
- **`db.js`** : Pengelola penyimpanan database lokal browser (IndexedDB) dan kompresi foto.
- **`style.css`** : Pengaturan desain, layout animasi, dan tampilan cetak printer.

---
*Dibuat khusus untuk ADAM PROPERTY.*

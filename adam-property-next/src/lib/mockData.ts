import { 
  Project, 
  Kavling, 
  Customer, 
  Payment, 
  LandDebt, 
  LandPayment, 
  CashbookItem, 
  PettyCashItem, 
  InventoryItem, 
  Employee, 
  SalaryPayment 
} from '@/types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    nama: 'Baitul Makmur Regency',
    lokasi: 'Jl. Raya Utama Kaliwungu, Kendal',
    deskripsi: 'Proyek perumahan & ruko komersial strategis 50 unit.',
    createdAt: '2026-06-01'
  },
  {
    id: 'proj-2',
    nama: 'Adam Garden Residence',
    lokasi: 'Boja, Kendal',
    deskripsi: 'Kavling hunian asri dataran tinggi sejuk.',
    createdAt: '2026-09-01'
  }
];

export const INITIAL_KAVLINGS: Kavling[] = [
  {
    id: 'kav-1',
    projectId: 'proj-1',
    blok: 'Blok Ruko',
    nomor: 'Ruko-01',
    luas: 100,
    dimensi: '5 x 20 m',
    harga: 250000000,
    tipe: 'Ruko Komersil',
    status: 'terjual',
    customerId: 'cust-1',
    customerNama: 'Bpk. Ir. Hendro Purnomo',
    keterangan: 'Lunas transaksi Barter Material Bangunan Proyek'
  },
  {
    id: 'kav-2',
    projectId: 'proj-1',
    blok: 'Blok Ruko',
    nomor: 'Ruko-02',
    luas: 100,
    dimensi: '5 x 20 m',
    harga: 250000000,
    tipe: 'Ruko Komersil',
    status: 'terbuka',
    customerId: null,
    customerNama: null,
    keterangan: 'Posisi hook pinggir jalan provinsi'
  },
  {
    id: 'kav-3',
    projectId: 'proj-1',
    blok: 'Blok A',
    nomor: 'A-01',
    luas: 84,
    dimensi: '6 x 14 m',
    harga: 120000000,
    tipe: 'Hunian Standar',
    status: 'terjual',
    customerId: 'cust-2',
    customerNama: 'Bpk. Bambang Sutrisno',
    keterangan: 'Pembelian cash bertahap lunas'
  },
  {
    id: 'kav-4',
    projectId: 'proj-1',
    blok: 'Blok A',
    nomor: 'A-02',
    luas: 84,
    dimensi: '6 x 14 m',
    harga: 120000000,
    tipe: 'Hunian Standar',
    status: 'booking',
    customerId: 'cust-3',
    customerNama: 'Ibu Rahmawati Putri',
    keterangan: 'DP masuk Rp 40.000.000, sisa cicilan 12 bulan'
  },
  {
    id: 'kav-5',
    projectId: 'proj-1',
    blok: 'Blok A',
    nomor: 'A-03',
    luas: 84,
    dimensi: '6 x 14 m',
    harga: 120000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customerId: null,
    customerNama: null,
    keterangan: 'Siap bangun, hadap timur'
  },
  {
    id: 'kav-6',
    projectId: 'proj-1',
    blok: 'Blok B',
    nomor: 'B-01',
    luas: 105,
    dimensi: '7 x 15 m',
    harga: 150000000,
    tipe: 'Hunian Premium',
    status: 'terbuka',
    customerId: null,
    customerNama: null,
    keterangan: 'Dekat taman dan fasum perumahan'
  },
  {
    id: 'kav-7',
    projectId: 'proj-1',
    blok: 'Blok C',
    nomor: 'C-01',
    luas: 72,
    dimensi: '6 x 12 m',
    harga: 95000000,
    tipe: 'Hunian Ekonomis',
    status: 'terbuka',
    customerId: null,
    customerNama: null,
    keterangan: 'Kavling ekonomis siap pondasi'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    nama: 'Bpk. Ir. Hendro Purnomo',
    nik: '3324081204780001',
    telepon: '081298765432',
    alamat: 'Jl. Pemuda No. 88, Semarang',
    kavlingId: 'kav-1',
    kavlingKode: 'Blok Ruko - Ruko-01',
    projectId: 'proj-1',
    totalHarga: 250000000,
    totalMasuk: 250000000,
    sisaPiutang: 0,
    statusBayar: 'lunas',
    tanggalBeli: '2026-07-20'
  },
  {
    id: 'cust-2',
    nama: 'Bpk. Bambang Sutrisno',
    nik: '3324081508820004',
    telepon: '085712345678',
    alamat: 'Perumahan Griya Asri Blok D-14, Kendal',
    kavlingId: 'kav-3',
    kavlingKode: 'Blok A - A-01',
    projectId: 'proj-1',
    totalHarga: 120000000,
    totalMasuk: 120000000,
    sisaPiutang: 0,
    statusBayar: 'lunas',
    tanggalBeli: '2026-08-10'
  },
  {
    id: 'cust-3',
    nama: 'Ibu Rahmawati Putri',
    nik: '3324085409900002',
    telepon: '081324567890',
    alamat: 'Jl. Merak No. 12 RT 04/02 Kaliwungu',
    kavlingId: 'kav-4',
    kavlingKode: 'Blok A - A-02',
    projectId: 'proj-1',
    totalHarga: 120000000,
    totalMasuk: 40000000,
    sisaPiutang: 80000000,
    statusBayar: 'belum_lunas',
    tanggalBeli: '2026-09-15'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    customerId: 'cust-1',
    customerNama: 'Bpk. Ir. Hendro Purnomo',
    kavlingKode: 'Blok Ruko - Ruko-01',
    tanggal: '2026-07-20',
    nominal: 250000000,
    metodeBayar: 'barter',
    tujuan: 'Pelunasan Unit Ruko via Barter Material Bangunan',
    keterangan: 'Barter material bangunan komplit untuk percepatan sarana proyek ruko Baitul Makmur.',
    rincianBarter: 'Semen Gresik 1.200 sak @ Rp 68.000 = Rp 81.600.000\nBesi Ulir 12mm 600 btg = Rp 72.000.000\nBata Ringan Hebel 80 m3 = Rp 48.000.000\nPasir Muntilan 20 Dump Truck = Rp 48.400.000'
  },
  {
    id: 'pay-2',
    customerId: 'cust-2',
    customerNama: 'Bpk. Bambang Sutrisno',
    kavlingKode: 'Blok A - A-01',
    tanggal: '2026-08-10',
    nominal: 60000000,
    metodeBayar: 'transfer',
    tujuan: 'Uang Muka (DP 50%)',
    keterangan: 'Transfer via BCA KlikBCA Bisnis'
  },
  {
    id: 'pay-3',
    customerId: 'cust-2',
    customerNama: 'Bpk. Bambang Sutrisno',
    kavlingKode: 'Blok A - A-01',
    tanggal: '2026-09-10',
    nominal: 60000000,
    metodeBayar: 'transfer',
    tujuan: 'Pelunasan Kavling 100%',
    keterangan: 'Pelunasan sisa 50% dan serah terima akta PPJB'
  },
  {
    id: 'pay-4',
    customerId: 'cust-3',
    customerNama: 'Ibu Rahmawati Putri',
    kavlingKode: 'Blok A - A-02',
    tanggal: '2026-09-15',
    nominal: 40000000,
    metodeBayar: 'tunai',
    tujuan: 'Booking Fee & Uang Muka DP',
    keterangan: 'Diterima tunai di kantor pemasaran Adam Property'
  }
];

export const INITIAL_LAND_DEBTS: LandDebt[] = [
  {
    id: 'land-1',
    projectId: 'proj-1',
    projectNama: 'Baitul Makmur Regency',
    namaPetani: 'Bpk. H. Sugeng Mulyono',
    telepon: '081234455667',
    luasTanah: '6.000 m² (428 Ru)',
    alasHak: 'Letter C No. 45 Desa Kaliwungu',
    hargaKesepakatan: 600000000,
    dpDibayar: 250000000,
    totalCicilan: 50000000,
    sisaHutang: 300000000,
    status: 'belum_lunas',
    alamatLahan: 'Sebelah Barat Pasar Sore Kaliwungu',
    keterangan: 'Perjanjian Notaris No. 12/2026. Tenor cicilan 6 bulan.'
  }
];

export const INITIAL_LAND_PAYMENTS: LandPayment[] = [
  {
    id: 'lpay-1',
    landDebtId: 'land-1',
    tanggal: '2026-06-15',
    nominal: 250000000,
    metode: 'Transfer Bank Mandiri',
    keterangan: 'Pembayaran DP Pembebasan Lahan 6.000 m² di hadapan Notaris'
  },
  {
    id: 'lpay-2',
    landDebtId: 'land-1',
    tanggal: '2026-08-15',
    nominal: 50000000,
    metode: 'Transfer Bank Mandiri',
    keterangan: 'Cicilan Tahap 1 Pembayaran Tanah'
  }
];

export const INITIAL_CASHBOOK: CashbookItem[] = [
  {
    id: 'cash-1',
    tanggal: '2026-06-01',
    tipe: 'masuk',
    kategori: 'investor',
    sumber: 'Investor: Bpk. H. Mahmud',
    keterangan: 'Setoran Modal Investasi Proyek Baitul Makmur Regency (Tenor 18 Bulan)',
    nominal: 500000000,
    metode: 'Transfer Bank BCA',
    rekening: 'Bank BCA 012-345-6789',
    projectId: 'proj-1',
    refType: 'manual'
  },
  {
    id: 'cash-2',
    tanggal: '2026-06-15',
    tipe: 'keluar',
    kategori: 'lahan_petani',
    sumber: 'Petani: Bpk. H. Sugeng',
    keterangan: 'DP Pembebasan Lahan Mentah 6.000 m²',
    nominal: 250000000,
    metode: 'Transfer Bank BCA',
    rekening: 'Bank BCA 012-345-6789',
    projectId: 'proj-1',
    refType: 'land_payment',
    refId: 'lpay-1'
  },
  {
    id: 'cash-3',
    tanggal: '2026-07-05',
    tipe: 'keluar',
    kategori: 'operasional',
    sumber: 'PT Citra Mandiri Alat Berat',
    keterangan: 'Biaya Sewa Excavator Komatsu & Land Clearing Lahan 2 Pekan',
    nominal: 32000000,
    metode: 'Transfer Bank BCA',
    rekening: 'Bank BCA 012-345-6789',
    projectId: 'proj-1',
    refType: 'manual'
  },
  {
    id: 'cash-4',
    tanggal: '2026-08-01',
    tipe: 'keluar',
    kategori: 'operasional',
    sumber: 'Kasir Kantor Operasional',
    keterangan: 'Top Up Dana Kas Kecil Kantor (Petty Cash)',
    nominal: 5000000,
    metode: 'Tarik Tunai Bank BCA',
    rekening: 'Bank BCA 012-345-6789',
    projectId: null,
    refType: 'kas_besar'
  },
  {
    id: 'cash-5',
    tanggal: '2026-08-10',
    tipe: 'masuk',
    kategori: 'jual_kavling',
    sumber: 'Customer: Bpk. Bambang Sutrisno',
    keterangan: 'Uang Muka (DP 50%) Blok A-01',
    nominal: 60000000,
    metode: 'Transfer Bank BCA',
    rekening: 'Bank BCA 012-345-6789',
    projectId: 'proj-1',
    refType: 'customer_payment',
    refId: 'pay-2'
  },
  {
    id: 'cash-6',
    tanggal: '2026-09-10',
    tipe: 'masuk',
    kategori: 'jual_kavling',
    sumber: 'Customer: Bpk. Bambang Sutrisno',
    keterangan: 'Pelunasan 100% Blok A-01',
    nominal: 60000000,
    metode: 'Transfer Bank BCA',
    rekening: 'Bank BCA 012-345-6789',
    projectId: 'proj-1',
    refType: 'customer_payment',
    refId: 'pay-3'
  },
  {
    id: 'cash-7',
    tanggal: '2026-09-15',
    tipe: 'masuk',
    kategori: 'jual_kavling',
    sumber: 'Customer: Ibu Rahmawati Putri',
    keterangan: 'Booking Fee & Uang Muka DP Blok A-02',
    nominal: 40000000,
    metode: 'Tunai Kasir',
    rekening: 'Kasir Kantor',
    projectId: 'proj-1',
    refType: 'customer_payment',
    refId: 'pay-4'
  }
];

export const INITIAL_PETTY_CASH: PettyCashItem[] = [
  {
    id: 'petty-1',
    tanggal: '2026-08-01',
    tipe: 'masuk',
    kategori: 'topup_kas_besar',
    sumberDana: 'kas_besar',
    penerima: 'Kasir & Staf Operasional',
    keterangan: 'Top Up Dana Kas Kecil Operasional Harian dari Kas Besar Developer',
    nominal: 5000000,
    metode: 'Tunai Kasir'
  },
  {
    id: 'petty-2',
    tanggal: '2026-08-05',
    tipe: 'keluar',
    kategori: 'atk',
    penerima: 'Toko Buku Karunia',
    keterangan: 'Kertas HVS F4 3 rim, Pulpen Pilot 2 box, Map Ordner & Materai 10.000 (10 lembar)',
    nominal: 385000,
    metode: 'Tunai Kas Kecil'
  },
  {
    id: 'petty-3',
    tanggal: '2026-08-12',
    tipe: 'keluar',
    kategori: 'bensin',
    penerima: 'SPBU Pertamina Kaliwungu',
    keterangan: 'BBM Pertalite Mobil Operasional Avanza antar customer survey lokasi',
    nominal: 250000,
    metode: 'Tunai Kas Kecil'
  },
  {
    id: 'petty-4',
    tanggal: '2026-08-20',
    tipe: 'keluar',
    kategori: 'konsumsi',
    penerima: 'Warung Bu Siti & Toko Roti',
    keterangan: 'Konsumsi makan siang dan snack rapat koordinasi pengukuran kavling & pematokan',
    nominal: 220000,
    metode: 'Tunai Kas Kecil'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    kode: 'INV-2026-001',
    nama: 'Laptop Asus ROG Zephyrus G14 (AMD Ryzen 9 / RTX 4060)',
    kategori: 'elektronik',
    kondisi: 'baik',
    lokasi: 'Ruang Direktur & Desain Site Plan',
    penanggungJawab: 'Bpk. Adam (Direktur Utama)',
    tanggal: '2026-06-10',
    sumberDana: 'Kas Besar Developer',
    nilaiPerolehan: 24500000,
    jumlah: 1,
    satuan: 'Unit',
    nomorSeri: 'SN-ASUS-G14-9921',
    keterangan: 'Perangkat utama rendering denah 3D, peta kavling AutoCAD dan manajemen server.'
  },
  {
    id: 'inv-2',
    kode: 'INV-2026-002',
    nama: 'Printer Multifungsi Epson EcoTank L3210 (Print, Scan, Copy)',
    kategori: 'elektronik',
    kondisi: 'baik',
    lokasi: 'Meja Kasir & Administrasi',
    penanggungJawab: 'Staf Administrasi',
    tanggal: '2026-06-12',
    sumberDana: 'Kas Besar Developer',
    nilaiPerolehan: 2850000,
    jumlah: 1,
    satuan: 'Unit',
    nomorSeri: 'SN-EPSON-L3210-4821',
    keterangan: 'Pencetakan kwitansi resmi, PPJB, berkas konsumen dan slip gaji.'
  },
  {
    id: 'inv-3',
    kode: 'INV-2026-003',
    nama: 'Digital Theodolite South DT-02 Laser Prism (Akurasi 2")',
    kategori: 'survey',
    kondisi: 'baik',
    lokasi: 'Gudang Alat Ukur & Survey Lapangan',
    penanggungJawab: 'Tim Survey & Pematokan',
    tanggal: '2026-07-10',
    sumberDana: 'Kas Besar Developer',
    nilaiPerolehan: 14500000,
    jumlah: 1,
    satuan: 'Set',
    nomorSeri: 'SN-THD-SOUTH-02941',
    keterangan: 'Alat ukur presisi penentuan batas tanah mentah petani, leveling jalan dan patok kavling.'
  },
  {
    id: 'inv-4',
    kode: 'INV-2026-004',
    nama: 'Brankas Besi Tahan Api Chubbsafes Cobra King (Size 3)',
    kategori: 'keamanan',
    kondisi: 'baik',
    lokasi: 'Ruang Direktur',
    penanggungJawab: 'Direktur Utama',
    tanggal: '2026-06-20',
    sumberDana: 'Kas Besar Developer',
    nilaiPerolehan: 16500000,
    jumlah: 1,
    satuan: 'Unit',
    nomorSeri: 'SN-CHUBB-CB3-44120',
    keterangan: 'Penyimpanan dokumen vital: Sertifikat SHM Asli induk kavling, Letter C, Akta Notaris.'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    nama: 'Adam Malik, S.T.',
    nik: '3324081005850001',
    jabatan: 'Direktur Utama & Penanggung Jawab',
    departemen: 'direksi',
    tipe: 'tetap',
    noHp: '081234567800',
    email: 'adam@adamproperty.co.id',
    noRek: '012-345-6789',
    bank: 'Bank BCA',
    gajiPokok: 12000000,
    tunjanganJabatan: 3000000,
    tunjanganMakan: 1000000,
    komisiPenjualan: 0,
    potongan: 0,
    status: 'aktif',
    tanggalBergabung: '2025-01-01',
    keterangan: 'Founder & Direktur Eksekutif'
  },
  {
    id: 'emp-2',
    nama: 'Budi Santoso',
    nik: '3324081403920002',
    jabatan: 'Senior Marketing Executive',
    departemen: 'marketing',
    tipe: 'tetap',
    noHp: '085799887766',
    email: 'budi.marketing@adamproperty.co.id',
    noRek: '140-00-1928374',
    bank: 'Bank Mandiri',
    gajiPokok: 3500000,
    tunjanganJabatan: 500000,
    tunjanganMakan: 500000,
    komisiPenjualan: 1500000,
    potongan: 0,
    status: 'aktif',
    tanggalBergabung: '2026-02-01',
    keterangan: 'Fokus penjualan kavling Blok A & Ruko'
  },
  {
    id: 'emp-3',
    nama: 'Siti Nurhaliza, S.Ak.',
    nik: '3324086011950003',
    jabatan: 'Admin Keuangan & Kasir Kas Kecil',
    departemen: 'keuangan',
    tipe: 'tetap',
    noHp: '087811223344',
    email: 'siti.finance@adamproperty.co.id',
    noRek: '882-990-1122',
    bank: 'Bank BRI',
    gajiPokok: 3200000,
    tunjanganJabatan: 400000,
    tunjanganMakan: 500000,
    komisiPenjualan: 0,
    potongan: 0,
    status: 'aktif',
    tanggalBergabung: '2026-03-01',
    keterangan: 'Pengelola petty cash operasional & kwitansi kasir'
  },
  {
    id: 'emp-4',
    nama: 'Wahyudi Prasetyo',
    nik: '3324082207900005',
    jabatan: 'Koordinator Survey Lapangan & Patok',
    departemen: 'teknik',
    tipe: 'tetap',
    noHp: '081399001122',
    email: 'wahyudi.survey@adamproperty.co.id',
    noRek: '012-998-3344',
    bank: 'Bank BCA',
    gajiPokok: 3800000,
    tunjanganJabatan: 600000,
    tunjanganMakan: 600000,
    komisiPenjualan: 0,
    potongan: 0,
    status: 'aktif',
    tanggalBergabung: '2026-03-15',
    keterangan: 'Pengukuran batas tanah Letter C petani & penentuan elevasi'
  }
];

export const INITIAL_SALARY_PAYMENTS: SalaryPayment[] = [];

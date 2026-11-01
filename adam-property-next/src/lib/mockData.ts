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

// ==============================================================================
// REAL OPERATIONAL DATA IMPORTED FROM EXCEL
// PT ADAM PROPERTY INDONESIA - CLUSTER BAITUL MAKMUR
// ==============================================================================

export const INITIAL_PROJECTS: Project[] = [
  {
    "id": "proj-bm1",
    "nama": "Baitul Makmur",
    "lokasi": "Jl. Punden Gg 3 RT 42 RW 03, Jatikerto, Kec. Kromengan, Kab. Malang, Jawa Timur",
    "deskripsi": "Cluster Baitul Makmur (BM1). Luas Total 5.620 m\u00b2, SHM, Siap Jual.",
    "createdAt": "2026-09-01"
  }
];

export const INITIAL_KAVLINGS: Kavling[] = [];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    "id": "cust-nita",
    "nama": "Ibu Nita Siswati",
    "nik": "3507125809850001",
    "telepon": "081234567890",
    "alamat": "Kec. Kromengan, Kab. Malang, Jawa Timur",
    "kavlingId": null,
    "kavlingKode": "-",
    "projectId": "proj-bm1",
    "totalHarga": 0,
    "totalMasuk": 73000000,
    "sisaPiutang": 0,
    "statusBayar": "belum_lunas",
    "tanggalBeli": "2026-09-05"
  },
  {
    "id": "cust-reniati",
    "nama": "Ibu Reniati (Kel. Bpk. Bari)",
    "nik": "3507126104880003",
    "telepon": "085732109876",
    "alamat": "Jatikerto RT 42 RW 03, Kromengan, Malang",
    "kavlingId": null,
    "kavlingKode": "-",
    "projectId": "proj-bm1",
    "totalHarga": 0,
    "totalMasuk": 40500000,
    "sisaPiutang": 0,
    "statusBayar": "belum_lunas",
    "tanggalBeli": "2026-09-05"
  },
  {
    "id": "cust-ngateman",
    "nama": "Bapak Ngateman",
    "nik": "3507121503750002",
    "telepon": "082198765432",
    "alamat": "Kromengan, Malang, Jawa Timur",
    "kavlingId": null,
    "kavlingKode": "-",
    "projectId": "proj-bm1",
    "totalHarga": 0,
    "totalMasuk": 35000000,
    "sisaPiutang": 0,
    "statusBayar": "belum_lunas",
    "tanggalBeli": "2026-10-24"
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    "id": "pay-1",
    "customerId": "cust-reniati",
    "customerNama": "Ibu Reniati (Kel. Bpk. Bari)",
    "kavlingKode": "-",
    "tanggal": "2026-09-05",
    "nominal": 5000000,
    "metodeBayar": "transfer",
    "tujuan": "ITJ / Tanda Jadi (Disetor via Bpk. Bari)",
    "keterangan": "ITJ - ITJ Pak Bari"
  },
  {
    "id": "pay-2",
    "customerId": "cust-nita",
    "customerNama": "Ibu Nita Siswati",
    "kavlingKode": "-",
    "tanggal": "2026-09-05",
    "nominal": 5000000,
    "metodeBayar": "transfer",
    "tujuan": "ITJ / Tanda Jadi Unit Kavling",
    "keterangan": "ITJ - ITJ Nita Siswati"
  },
  {
    "id": "pay-3",
    "customerId": "cust-nita",
    "customerNama": "Ibu Nita Siswati",
    "kavlingKode": "-",
    "tanggal": "2026-10-03",
    "nominal": 60000000,
    "metodeBayar": "transfer",
    "tujuan": "Uang Muka / DP Kavling (AJB Notaris)",
    "keterangan": "DP NITA SISWATI"
  },
  {
    "id": "pay-4",
    "customerId": "cust-reniati",
    "customerNama": "Ibu Reniati (Kel. Bpk. Bari)",
    "kavlingKode": "-",
    "tanggal": "2026-10-07",
    "nominal": 35500000,
    "metodeBayar": "transfer",
    "tujuan": "Uang Muka / DP Kavling",
    "keterangan": "DP KAVLING (RENIATI)"
  },
  {
    "id": "pay-5",
    "customerId": "cust-ngateman",
    "customerNama": "Bapak Ngateman",
    "kavlingKode": "-",
    "tanggal": "2026-10-24",
    "nominal": 35000000,
    "metodeBayar": "transfer",
    "tujuan": "Uang Muka / DP Kavling",
    "keterangan": "DP PAK NGATEMAN"
  },
  {
    "id": "pay-6",
    "customerId": "cust-nita",
    "customerNama": "Ibu Nita Siswati",
    "kavlingKode": "-",
    "tanggal": "2026-10-27",
    "nominal": 8000000,
    "metodeBayar": "transfer",
    "tujuan": "Angsuran Cicilan Kavling",
    "keterangan": "Angsuran Nita Siswati"
  }
];

export const INITIAL_LAND_DEBTS: LandDebt[] = [
  {
    "id": "land-1",
    "projectId": "proj-bm1",
    "projectNama": "Baitul Makmur",
    "namaPetani": "Pemilik Lahan Asal Jatikerto",
    "telepon": "-",
    "luasTanah": "5.620 m\u00b2",
    "alasHak": "SHM Cluster BM1",
    "hargaKesepakatan": 2800000000,
    "dpDibayar": 100000000,
    "totalCicilan": 222857600,
    "sisaHutang": 2477142400,
    "status": "belum_lunas",
    "alamatLahan": "Jl. Punden Gg 3 RT 42 RW 03, Jatikerto, Kromengan, Malang",
    "keterangan": "Pembelian Lahan Induk Cluster Baitul Makmur"
  }
];

export const INITIAL_LAND_PAYMENTS: LandPayment[] = [
  {
    "id": "lp-1",
    "landDebtId": "land-1",
    "tanggal": "2026-08-15",
    "nominal": 15000000,
    "keterangan": "Kasbon Pemilik Lahan",
    "metode": "Transfer"
  },
  {
    "id": "lp-2",
    "landDebtId": "land-1",
    "tanggal": "2026-08-21",
    "nominal": 25000000,
    "keterangan": "Kasbon Pemilik Lahan",
    "metode": "Transfer"
  },
  {
    "id": "lp-3",
    "landDebtId": "land-1",
    "tanggal": "2026-08-26",
    "nominal": 10000000,
    "keterangan": "Kasbon Pemilik Lahan",
    "metode": "Transfer"
  },
  {
    "id": "lp-4",
    "landDebtId": "land-1",
    "tanggal": "2026-09-01",
    "nominal": 100000000,
    "keterangan": "DP Pemilik Lahan (Kasbon)",
    "metode": "Transfer"
  },
  {
    "id": "lp-5",
    "landDebtId": "land-1",
    "tanggal": "2026-10-03",
    "nominal": 47857600,
    "keterangan": "Bayar Pelepasan Sewa Lahan",
    "metode": "Transfer"
  },
  {
    "id": "lp-6",
    "landDebtId": "land-1",
    "tanggal": "2026-10-03",
    "nominal": 50000000,
    "keterangan": "Pelepasan Sewa Lahan",
    "metode": "Transfer"
  },
  {
    "id": "lp-7",
    "landDebtId": "land-1",
    "tanggal": "2026-10-03",
    "nominal": 40000000,
    "keterangan": "Pembayaran Sewa Lahan",
    "metode": "Transfer"
  },
  {
    "id": "lp-8",
    "landDebtId": "land-1",
    "tanggal": "2026-10-04",
    "nominal": 10000000,
    "keterangan": "Pembayaran Sewa Lahan",
    "metode": "Transfer"
  },
  {
    "id": "lp-9",
    "landDebtId": "land-1",
    "tanggal": "2026-10-24",
    "nominal": 25000000,
    "keterangan": "Pembayaran Tanah",
    "metode": "Transfer"
  }
];

export const INITIAL_CASHBOOK: CashbookItem[] = [
  {
    "id": "cash-1",
    "tanggal": "2026-08-15",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Lahan - Kasbon Pemilik Lahan",
    "nominal": 15000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-2",
    "tanggal": "2026-08-21",
    "tipe": "masuk",
    "kategori": "investor",
    "sumber": "Kas Besar",
    "keterangan": "Dana Investor - Dana Investor 2",
    "nominal": 30000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-3",
    "tanggal": "2026-08-21",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Lahan - Kasbon Pemilik Lahan",
    "nominal": 25000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-4",
    "tanggal": "2026-08-26",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Lahan - Kasbon Pemilik Lahan",
    "nominal": 10000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-5",
    "tanggal": "2026-09-01",
    "tipe": "keluar",
    "kategori": "jual_kavling",
    "sumber": "Kas Besar",
    "keterangan": "Pembelian Lahan - DP Pemilik Lahan (Kasbon)",
    "nominal": 100000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-6",
    "tanggal": "2026-09-04",
    "tipe": "masuk",
    "kategori": "investor",
    "sumber": "Kas Besar",
    "keterangan": "Dana Investor Cicilan Tanah",
    "nominal": 100000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-7",
    "tanggal": "2026-09-05",
    "tipe": "masuk",
    "kategori": "jual_kavling",
    "sumber": "Kas Besar",
    "keterangan": "ITJ - ITJ Pak Bari",
    "nominal": 5000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-8",
    "tanggal": "2026-09-05",
    "tipe": "masuk",
    "kategori": "jual_kavling",
    "sumber": "Kas Besar",
    "keterangan": "ITJ - ITJ Nita Siswati",
    "nominal": 5000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-9",
    "tanggal": "2026-09-05",
    "tipe": "masuk",
    "kategori": "investor",
    "sumber": "Kas Besar",
    "keterangan": "Dana Investor - Dana Investor 1",
    "nominal": 25000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-10",
    "tanggal": "2026-09-05",
    "tipe": "masuk",
    "kategori": "investor",
    "sumber": "Kas Besar",
    "keterangan": "Dana Investor - Dana Investor 3",
    "nominal": 25000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-11",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Transfer Antar Kas - Transfer ke Kas Kecil",
    "nominal": 30000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-12",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Legalitas - Bayar Notaris",
    "nominal": 5000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-13",
    "tanggal": "2026-09-08",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Transfer Kas Kecil",
    "nominal": 5000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-14",
    "tanggal": "2026-10-02",
    "tipe": "masuk",
    "kategori": "investor",
    "sumber": "Kas Besar",
    "keterangan": "Transfer Dari Investor",
    "nominal": 47857600.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-15",
    "tanggal": "2026-10-03",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Bayar Pelepasan Sewa Lahan",
    "nominal": 47857600.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-16",
    "tanggal": "2026-10-03",
    "tipe": "masuk",
    "kategori": "investor",
    "sumber": "Kas Besar",
    "keterangan": "Pemasukan Dari Investor",
    "nominal": 50000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-17",
    "tanggal": "2026-10-03",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Pelepasan Sewa Lahan",
    "nominal": 50000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-18",
    "tanggal": "2026-10-03",
    "tipe": "masuk",
    "kategori": "jual_kavling",
    "sumber": "Kas Besar",
    "keterangan": "DP NITA SISWATI",
    "nominal": 60000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-19",
    "tanggal": "2026-10-03",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Pembayaran Sewa Lahan",
    "nominal": 40000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-20",
    "tanggal": "2026-10-03",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Biaya Akta Jual Beli Ke Notaris (bu nina siswati)",
    "nominal": 1500000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-21",
    "tanggal": "2026-10-04",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Pembayaran Sewa Lahan",
    "nominal": 10000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-22",
    "tanggal": "2026-10-07",
    "tipe": "masuk",
    "kategori": "jual_kavling",
    "sumber": "Kas Besar",
    "keterangan": "DP KAVLING BLOK B10 (RENIATI)",
    "nominal": 35500000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-23",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Kasbon Laptop",
    "nominal": 11700000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-24",
    "tanggal": "2026-10-20",
    "tipe": "masuk",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Cicil Laptop",
    "nominal": 1250000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-25",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Transfer Ke Kas Kecil",
    "nominal": 2000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-26",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "P Sugeng (Ban)",
    "nominal": 3000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-27",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Pasir 2 Truk",
    "nominal": 1500000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-28",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Dzer",
    "nominal": 8500000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-29",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Pematokan",
    "nominal": 1000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-30",
    "tanggal": "2026-10-21",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "TF KE KAS KECIL",
    "nominal": 2000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-31",
    "tanggal": "2026-10-21",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "FEE MARKETING",
    "nominal": 5000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-32",
    "tanggal": "2026-10-21",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Biaya Akta Notaris (Reniati)",
    "nominal": 1500000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-33",
    "tanggal": "2026-10-22",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Mbak Dian Pinjam",
    "nominal": 1000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-34",
    "tanggal": "2026-10-22",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Kasbon Tong Sampah",
    "nominal": 1600000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-35",
    "tanggal": "2026-10-24",
    "tipe": "masuk",
    "kategori": "jual_kavling",
    "sumber": "Kas Besar",
    "keterangan": "DP PAK NGATEMAN",
    "nominal": 35000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-36",
    "tanggal": "2026-10-24",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Pembayaran Tanah",
    "nominal": 25000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-37",
    "tanggal": "2026-10-24",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Fee Marketing",
    "nominal": 3000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-38",
    "tanggal": "2026-10-24",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Tunjangan Operasional Pengola Lahan Bln Agustus",
    "nominal": 4000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-39",
    "tanggal": "2026-10-24",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Masuk Kas Kecil",
    "nominal": 1000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-40",
    "tanggal": "2026-10-24",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "pasang banner lahan",
    "nominal": 1000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-41",
    "tanggal": "2026-10-24",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "BIAYA AJB",
    "nominal": 1500000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-42",
    "tanggal": "2026-10-26",
    "tipe": "keluar",
    "kategori": "lahan_petani",
    "sumber": "Kas Besar",
    "keterangan": "Pemebelian Gazebo untuk lahan",
    "nominal": 2500000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-43",
    "tanggal": "2026-10-27",
    "tipe": "masuk",
    "kategori": "jual_kavling",
    "sumber": "Kas Besar",
    "keterangan": "Angsuran Nita Siswati",
    "nominal": 8000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-44",
    "tanggal": "2026-10-27",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "Top Up Kas Kecil",
    "nominal": 1000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-45",
    "tanggal": "2026-10-31",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "BIAYA RAB RUKO",
    "nominal": 1000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  },
  {
    "id": "cash-46",
    "tanggal": "2026-10-31",
    "tipe": "keluar",
    "kategori": "operasional",
    "sumber": "Kas Besar",
    "keterangan": "TOP UP KAS KECIL",
    "nominal": 1000000.0,
    "metode": "Transfer Bank",
    "projectId": "proj-bm1"
  }
];

export const INITIAL_PETTY_CASH: PettyCashItem[] = [
  {
    "id": "petty-1",
    "tanggal": "2026-09-05",
    "tipe": "masuk",
    "kategori": "topup_kas_besar",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Transfer Antar Kas - Transfer dari Kas Besar",
    "nominal": 30000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-2",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Sosial - Sedekah Remas Almuhajirin",
    "nominal": 1000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-3",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Beli Meteran",
    "nominal": 47000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-4",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Event - Konsumsi Tamu",
    "nominal": 165000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-5",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Event - Catering Tumpeng",
    "nominal": 2600000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-6",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "bensin",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Marketing - Banner",
    "nominal": 250000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-7",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Marketing - Brosur",
    "nominal": 500000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-8",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "bensin",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Event - Tim Banjari + Pemateri",
    "nominal": 2000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-9",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Event - Sewa Sound",
    "nominal": 500000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-10",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Event - Sewa Tenda",
    "nominal": 500000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-11",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Sosial - Santunan Yatim",
    "nominal": 3000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-12",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "gaji_karyawan",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Kasbon Karyawan - Kasbon 2 Marketing Inhouse",
    "nominal": 2000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-13",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Sewa Kantor",
    "nominal": 4000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-14",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Event - Kue Kotak",
    "nominal": 1000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-15",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Air Mineral",
    "nominal": 40000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-16",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Event - Persiapan Panggung",
    "nominal": 100000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-17",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "bensin",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Bensin Mobil",
    "nominal": 200000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-18",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Akomodasi",
    "nominal": 300000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-19",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "utilitas",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Pasang Wifi + Kelistrikan",
    "nominal": 250000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-20",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Sosial - Dhuafa",
    "nominal": 200000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-21",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Marketing - Brosur A5",
    "nominal": 550000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-22",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Server",
    "nominal": 825000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-23",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Aset Usaha - Meja Kursi",
    "nominal": 1100000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-24",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Aset Usaha - Printer",
    "nominal": 900000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-25",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - ATK",
    "nominal": 95000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-26",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Buku, Tisu, dll",
    "nominal": 47000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-27",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Mousepad",
    "nominal": 75000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-28",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Konsumsi - Bakso",
    "nominal": 78000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-29",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional - Materai",
    "nominal": 30000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-30",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Belum Dikategorikan - Pengeluaran Lainnya",
    "nominal": 70000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-31",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Aset Usaha - Beli Motor",
    "nominal": 8250000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-32",
    "tanggal": "2026-09-05",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Aset Usaha - Aki Motor",
    "nominal": 90000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-33",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Mounting",
    "nominal": 65000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-34",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Storange PC",
    "nominal": 135000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-35",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "kebersihan",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Tempat Sampah",
    "nominal": 35000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-36",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Rak Dinding",
    "nominal": 48000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-37",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "atk",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Amplop 104 Paperline",
    "nominal": 32000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-38",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Double Tape Dinding",
    "nominal": 18000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-39",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "HDMI MONITOR",
    "nominal": 40000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-40",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "kebersihan",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "ROL PLASTIK SAMPAH",
    "nominal": 29000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-41",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "atk",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "MAP BINDER",
    "nominal": 5000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-42",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "HIASAN DINDING ISLAMI 1",
    "nominal": 58000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-43",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "HIASAN DINDING ISLAMI 2",
    "nominal": 70000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-44",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "atk",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "STAPLER 2",
    "nominal": 35000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-45",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "atk",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "CLIP KERTAS",
    "nominal": 8000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-46",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "atk",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "ISI STAPLER",
    "nominal": 7000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-47",
    "tanggal": "2026-09-07",
    "tipe": "keluar",
    "kategori": "utilitas",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "KELISTRIKAN",
    "nominal": 200000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-48",
    "tanggal": "2026-09-08",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Biaya SitePlan",
    "nominal": 400000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-49",
    "tanggal": "2026-09-08",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Brosur Awal Tidak Terpakai",
    "nominal": 500000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-50",
    "tanggal": "2026-09-08",
    "tipe": "keluar",
    "kategori": "utilitas",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Bayar Wifi Bulan September",
    "nominal": 245000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-51",
    "tanggal": "2026-09-08",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Operasional Pengadaan Kantor",
    "nominal": 1200000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-52",
    "tanggal": "2026-09-08",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Konsusmsi 08/9/2026",
    "nominal": 50000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-53",
    "tanggal": "2026-09-08",
    "tipe": "masuk",
    "kategori": "topup_kas_besar",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Trasnfer dari Kas Besar",
    "nominal": 5000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-54",
    "tanggal": "2026-09-13",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Sedekah Yatim",
    "nominal": 1000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-55",
    "tanggal": "2026-09-14",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Kopi",
    "nominal": 24000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-56",
    "tanggal": "2026-09-16",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Mie Cak Tokek",
    "nominal": 17000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-57",
    "tanggal": "2026-09-27",
    "tipe": "masuk",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Transfer Dari Invenstor",
    "nominal": 4000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-58",
    "tanggal": "2026-10-01",
    "tipe": "keluar",
    "kategori": "bensin",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Beli Ban dan Oli",
    "nominal": 170000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-59",
    "tanggal": "2026-10-03",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Bayar Karyawan dan Marketing Inhouse",
    "nominal": 3000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-60",
    "tanggal": "2026-10-03",
    "tipe": "keluar",
    "kategori": "utilitas",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Bayar Listrik",
    "nominal": 76000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-61",
    "tanggal": "2026-10-03",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Beli Oleh Oleh dan Makan Waktu Ust Syuhur",
    "nominal": 224000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-62",
    "tanggal": "2026-10-04",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Brosur",
    "nominal": 370000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-63",
    "tanggal": "2026-10-04",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Konsusmsi",
    "nominal": 170000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-64",
    "tanggal": "2026-10-20",
    "tipe": "masuk",
    "kategori": "topup_kas_besar",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "TF DARI KAS BESAR",
    "nominal": 2000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-65",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "gaji_karyawan",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "KASBON CAK NURKHOLIS",
    "nominal": 500000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-66",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "BROSUR BARU 1 RIM",
    "nominal": 1000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-67",
    "tanggal": "2026-10-20",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Beli MONITOR SET",
    "nominal": 640000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-68",
    "tanggal": "2026-10-21",
    "tipe": "masuk",
    "kategori": "topup_kas_besar",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "TF DARI KAS BESAR",
    "nominal": 2000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-69",
    "tanggal": "2026-10-21",
    "tipe": "keluar",
    "kategori": "bensin",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "BANNER LAHAN",
    "nominal": 400000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-70",
    "tanggal": "2026-10-21",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Konsumsi Tamu",
    "nominal": 100000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-71",
    "tanggal": "2026-10-21",
    "tipe": "keluar",
    "kategori": "atk",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Beli Kertas HVS A4",
    "nominal": 45000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-72",
    "tanggal": "2026-10-22",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Konsumsi Kemarin U Syuhur dan U Nahrowi",
    "nominal": 200000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-73",
    "tanggal": "2026-10-24",
    "tipe": "masuk",
    "kategori": "topup_kas_besar",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "tf dari kas besar",
    "nominal": 1000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-74",
    "tanggal": "2026-10-25",
    "tipe": "keluar",
    "kategori": "gaji_karyawan",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "GAJI KARYAWAN + LISTRIK",
    "nominal": 1700000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-75",
    "tanggal": "2026-10-26",
    "tipe": "keluar",
    "kategori": "atk",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "STEMPEL + TINTA + MAP AJB",
    "nominal": 20000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-76",
    "tanggal": "2026-10-26",
    "tipe": "keluar",
    "kategori": "konsumsi",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "konsumsi 25 dan 26 oktober",
    "nominal": 200000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-77",
    "tanggal": "2026-10-27",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "Langganan Claude AI 22",
    "nominal": 400000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-78",
    "tanggal": "2026-10-31",
    "tipe": "masuk",
    "kategori": "topup_kas_besar",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "TOP UP KAS BEASR",
    "nominal": 1000000.0,
    "metode": "Tunai"
  },
  {
    "id": "petty-79",
    "tanggal": "2026-10-31",
    "tipe": "keluar",
    "kategori": "lainnya",
    "sumberDana": "kas_besar",
    "penerima": "Operasional Kantor / Lapangan",
    "keterangan": "BIAYA ENTERTAINT",
    "nominal": 100000.0,
    "metode": "Tunai"
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    "id": "inv-1",
    "kode": "ACR1",
    "nama": "ACER VERITON N2080G",
    "kategori": "elektronik",
    "kondisi": "baik",
    "lokasi": "RUANGAN ADMINISTRASI",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-08-31",
    "sumberDana": "BELI",
    "nilaiPerolehan": 850000.0,
    "jumlah": 1,
    "satuan": "unit",
    "keterangan": "Sumber: BELI"
  },
  {
    "id": "inv-2",
    "kode": "CN1",
    "nama": "CANON PIXMA MX377",
    "kategori": "elektronik",
    "kondisi": "baik",
    "lokasi": "RUANGAN ADMINISTRASI",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-09-01",
    "sumberDana": "BELI",
    "nilaiPerolehan": 950000.0,
    "jumlah": 1,
    "satuan": "unit",
    "keterangan": "Sumber: BELI"
  },
  {
    "id": "inv-3",
    "kode": "PC1",
    "nama": "DELL INSPIRO CORE I3",
    "kategori": "elektronik",
    "kondisi": "baik",
    "lokasi": "RUANGAN ADMINISTRASI",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-08-29",
    "sumberDana": "2050-09-30",
    "nilaiPerolehan": 0.0,
    "jumlah": 1,
    "satuan": "unit",
    "keterangan": "Sumber: 2050-09-30"
  },
  {
    "id": "inv-4",
    "kode": "HPM1",
    "nama": "MONITOR HP",
    "kategori": "elektronik",
    "kondisi": "baik",
    "lokasi": "RUANGAN ADMINISTRASI",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-08-29",
    "sumberDana": "2035-12-15",
    "nilaiPerolehan": 0.0,
    "jumlah": 1,
    "satuan": "unit",
    "keterangan": "Sumber: 2035-12-15"
  },
  {
    "id": "inv-5",
    "kode": "KRH",
    "nama": "KURSI HIDROLIK KANTOR",
    "kategori": "furniture",
    "kondisi": "baik",
    "lokasi": "RUANGAN ADMINISTRASI",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-09-03",
    "sumberDana": "BELI",
    "nilaiPerolehan": 300000.0,
    "jumlah": 1,
    "satuan": "unit",
    "keterangan": "Sumber: BELI"
  },
  {
    "id": "inv-6",
    "kode": "KRM1",
    "nama": "KURSI TAMU MERAH",
    "kategori": "furniture",
    "kondisi": "baik",
    "lokasi": "RUANGAN ADMINISTRASI",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-09-03",
    "sumberDana": "BELI",
    "nilaiPerolehan": 200000.0,
    "jumlah": 4,
    "satuan": "unit",
    "keterangan": "Sumber: BELI"
  },
  {
    "id": "inv-7",
    "kode": "MJB1",
    "nama": "MEJA BESI KOMPUTER",
    "kategori": "furniture",
    "kondisi": "baik",
    "lokasi": "RUANGAN ADMINISTRASI",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-09-01",
    "sumberDana": "2026-09-01",
    "nilaiPerolehan": 0.0,
    "jumlah": 1,
    "satuan": "unit",
    "keterangan": "Sumber: 2026-09-01"
  },
  {
    "id": "inv-8",
    "kode": "MJK1",
    "nama": "MEJA KAYU ADMINSITRASI",
    "kategori": "furniture",
    "kondisi": "baik",
    "lokasi": "RUANGAN ADMINISTRASI",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-09-03",
    "sumberDana": "BELI",
    "nilaiPerolehan": 500000.0,
    "jumlah": 1,
    "satuan": "unit",
    "keterangan": "Sumber: BELI"
  },
  {
    "id": "inv-9",
    "kode": "BRS1",
    "nama": "TEMPAT BROSUR",
    "kategori": "furniture",
    "kondisi": "baik",
    "lokasi": "RUANG ADMINISTRASI DAN TAMU",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-09-05",
    "sumberDana": "BELI",
    "nilaiPerolehan": 125000.0,
    "jumlah": 2,
    "satuan": "unit",
    "keterangan": "Sumber: BELI"
  },
  {
    "id": "inv-10",
    "kode": "VRO1",
    "nama": "MOTOR VARIO",
    "kategori": "kendaraan",
    "kondisi": "baik",
    "lokasi": "OPERASIONAL",
    "penanggungJawab": "Staff Operasional",
    "tanggal": "2026-09-02",
    "sumberDana": "BELI",
    "nilaiPerolehan": 8250000.0,
    "jumlah": 1,
    "satuan": "unit",
    "keterangan": "Sumber: BELI"
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_SALARY_PAYMENTS: SalaryPayment[] = [];

// ========================================================
// TYPES & DOMAIN INTERFACES - PT ADAM PROPERTY INDONESIA
// Ready for Supabase Schema Mapping
// ========================================================

export type NavTab = 
  | 'dashboard'
  | 'kavling'
  | 'customer'
  | 'landDebt'
  | 'cashbook'
  | 'pettyCash'
  | 'nonCash'
  | 'inventory'
  | 'employee';

export interface Project {
  id: string;
  nama: string;
  lokasi: string;
  deskripsi?: string;
  createdAt: string;
}

export interface Kavling {
  id: string;
  projectId: string;
  blok: string;
  nomor: string;
  luas: number;
  dimensi: string;
  harga: number;
  tipe: string;
  status: 'terbuka' | 'booking' | 'terjual';
  customerId?: string | null;
  customerNama?: string | null;
  keterangan?: string;
}

export interface Customer {
  id: string;
  nama: string;
  nik: string;
  noKk?: string;
  telepon: string;
  tempatTanggalLahir?: string;
  pekerjaan?: string;
  alamat: string;
  kavlingId: string | null;
  kavlingKode?: string;
  kavlingIds?: string[];
  projectId?: string;
  totalHarga: number;
  totalMasuk: number;
  sisaPiutang: number;
  statusBayar: 'lunas' | 'belum_lunas';
  tanggalBeli: string;
  ktpImage?: string | null;
  kkImage?: string | null;
  ajbImage?: string | null;
  shmSplitImage?: string | null;
  noAjb?: string;
  noShmSplit?: string;
  tanggalAjb?: string;
  tanggalShmSplit?: string;
  notarisPpat?: string;
}

export interface Payment {
  id: string;
  customerId: string;
  customerNama?: string;
  kavlingKode?: string;
  tanggal: string;
  nominal: number;
  metodeBayar: 'tunai' | 'transfer' | 'barter';
  tujuan: string;
  keterangan?: string;
  rincianBarter?: string;
  kwitansiImage?: string | null;
}

export interface LandDebt {
  id: string;
  projectId: string;
  projectNama?: string;
  namaPetani: string;
  telepon: string;
  luasTanah: string;
  alasHak: string;
  hargaKesepakatan: number;
  dpDibayar: number;
  totalCicilan: number;
  sisaHutang: number;
  status: 'lunas' | 'belum_lunas';
  alamatLahan?: string;
  keterangan?: string;
  sertifikatImage?: string | null;
  perjanjianImage?: string | null;
}

export interface LandPayment {
  id: string;
  landDebtId: string;
  tanggal: string;
  nominal: number;
  metode: string;
  keterangan: string;
  kwitansiImage?: string | null;
}

export interface CashbookItem {
  id: string;
  tanggal: string;
  tipe: 'masuk' | 'keluar';
  kategori: 'jual_kavling' | 'jual_kavling_barter' | 'investor' | 'lahan_petani' | 'operasional' | 'lainnya';
  sumber: string;
  keterangan: string;
  nominal: number;
  metode: string;
  rekening?: string;
  projectId?: string | null;
  refType?: 'customer_payment' | 'land_payment' | 'manual' | 'kas_besar' | 'payroll';
  refId?: string;
  buktiImage?: string | null;
}

export interface PettyCashItem {
  id: string;
  tanggal: string;
  tipe: 'masuk' | 'keluar';
  kategori: 'topup_kas_besar' | 'investor' | 'atk' | 'konsumsi' | 'bensin' | 'kebersihan' | 'utilitas' | 'gaji_karyawan' | 'lainnya';
  sumberDana?: 'kas_besar' | 'investor' | 'lainnya';
  penerima: string;
  keterangan: string;
  nominal: number;
  metode: string;
  projectId?: string | null;
  refType?: 'kas_besar' | 'payroll' | 'manual';
  refId?: string;
  buktiImage?: string | null;
}

export interface InventoryItem {
  id: string;
  kode: string;
  nama: string;
  kategori: 'elektronik' | 'survey' | 'kendaraan' | 'keamanan' | 'furniture' | 'lainnya';
  kondisi: 'baik' | 'perlu_perbaikan' | 'rusak';
  lokasi: string;
  penanggungJawab: string;
  tanggal: string;
  sumberDana: string;
  nilaiPerolehan: number;
  jumlah: number;
  satuan: string;
  nomorSeri?: string;
  keterangan?: string;
  fotoBarang?: string | null;
  fotoNota?: string | null;
}

export interface Employee {
  id: string;
  nama: string;
  nik: string;
  jabatan: string;
  departemen: 'marketing' | 'keuangan' | 'operasional' | 'teknik' | 'legal' | 'direksi';
  tipe: 'tetap' | 'kontrak' | 'freelance';
  noHp: string;
  email?: string;
  noRek?: string;
  bank?: string;
  gajiPokok: number;
  tunjanganJabatan: number;
  tunjanganMakan: number;
  komisiPenjualan: number;
  potongan: number;
  status: 'aktif' | 'nonaktif';
  tanggalBergabung: string;
  keterangan?: string;
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  employeeNama: string;
  jabatan: string;
  bulan: string; // YYYY-MM
  tanggalBayar: string;
  gajiPokok: number;
  tunjanganJabatan: number;
  tunjanganMakan: number;
  komisi: number;
  potongan: number;
  thp: number;
  catatan?: string;
  status: 'terbayar' | 'pending';
  pettyCashId?: string;
}

export type UserRole = 'management' | 'it_manager' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  nama: string;
  jabatan: string;
  role: UserRole;
  avatar?: string;
}

export interface RolePermission {
  canViewAll: boolean;
  canManagePayments: boolean;
  canRecordCashflow: boolean;
  canManageProjects: boolean;
  canManageKavling: boolean;
  canManageEmployees: boolean;
  canManageInventory: boolean;
  isReadOnly: boolean;
  title: string;
  description: string;
  badgeColor: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  management: {
    canViewAll: true,
    canManagePayments: true,
    canRecordCashflow: true,
    canManageProjects: true,
    canManageKavling: true,
    canManageEmployees: true,
    canManageInventory: true,
    isReadOnly: false,
    title: 'Management / Direksi (Akses Penuh)',
    description: 'Akses penuh pengawasan, penambahan customer, transaksi keuangan, site plan, dan operasional bisnis.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  it_manager: {
    canViewAll: true,
    canManagePayments: true,
    canRecordCashflow: true,
    canManageProjects: true,
    canManageKavling: true,
    canManageEmployees: true,
    canManageInventory: true,
    isReadOnly: false,
    title: 'IT Manager (Full Akses)',
    description: 'Superadmin dengan hak akses penuh ke seluruh modul, database, transaksi, dan konfigurasi master.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  admin: {
    canViewAll: true,
    canManagePayments: true,
    canRecordCashflow: true,
    canManageProjects: true,
    canManageKavling: true,
    canManageEmployees: false,
    canManageInventory: false,
    isReadOnly: false,
    title: 'Admin Operasional',
    description: 'Mencatat data konsumen, transaksi pembayaran, cicilan, dan mutasi kas.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  }
};

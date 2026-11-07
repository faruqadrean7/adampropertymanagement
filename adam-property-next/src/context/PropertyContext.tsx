'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  NavTab,
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
import {
  INITIAL_PROJECTS,
  INITIAL_KAVLINGS,
  INITIAL_CUSTOMERS,
  INITIAL_PAYMENTS,
  INITIAL_LAND_DEBTS,
  INITIAL_LAND_PAYMENTS,
  INITIAL_CASHBOOK,
  INITIAL_PETTY_CASH,
  INITIAL_INVENTORY,
  INITIAL_EMPLOYEES,
  INITIAL_SALARY_PAYMENTS
} from '@/lib/mockData';
import { supabase } from '@/lib/supabaseClient';
import { 
  isSupabaseConfigured,
  supabaseFetchProjects,
  supabaseFetchKavlings,
  supabaseFetchCustomers,
  supabaseFetchLandDebts,
  supabaseFetchCashbook,
  supabaseFetchPayments,
  supabaseInsertKavling,
  supabaseInsertBatchKavlings,
  supabaseUpdateKavling,
  supabaseDeleteKavling,
  supabaseUpdateProject,
  supabaseDeleteProject,
  supabaseUpdateLandDebt,
  supabaseDeleteLandDebt,
  supabaseInsertCustomer,
  supabaseUpdateCustomer,
  supabaseDeleteCustomer,
  supabaseInsertPayment,
  supabaseUpdatePayment,
  supabaseInsertCashbookItem,
  supabaseUpdateCashbookItem,
  supabaseDeleteCashbookItem,
  supabaseFetchPettyCash,
  supabaseInsertPettyCash,
  supabaseUpdatePettyCash,
  supabaseDeletePettyCash,
  supabaseFetchInventory,
  supabaseInsertInventory,
  supabaseDeleteInventory,
  supabaseFetchEmployees,
  supabaseInsertEmployee,
  supabaseDeleteEmployee,
  supabaseFetchSalaryPayments,
  supabaseInsertSalaryPayment
} from '@/lib/supabaseService';

export interface AddProjectData {
  nama: string;
  lokasi: string;
  deskripsi?: string;
  hasLandDebt?: boolean;
  namaPetani?: string;
  teleponPetani?: string;
  luasTanah?: string;
  alasHak?: string;
  hargaKesepakatan?: number;
  dpDibayar?: number;
  metodeBayarDp?: string;
  catatanHutang?: string;
  sertifikatImage?: string | null;
  perjanjianImage?: string | null;
}

interface PropertyContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  projects: Project[];
  kavlings: Kavling[];
  customers: Customer[];
  payments: Payment[];
  landDebts: LandDebt[];
  landPayments: LandPayment[];
  cashbook: CashbookItem[];
  pettyCash: PettyCashItem[];
  inventory: InventoryItem[];
  employees: Employee[];
  salaryPayments: SalaryPayment[];

  // Actions
  addProject: (data: AddProjectData) => Project;
  updateProject: (id: string, data: { nama: string; lokasi: string; deskripsi?: string }) => void;
  deleteProject: (id: string) => void;
  addKavling: (data: Omit<Kavling, 'id'>) => void;
  addMultipleKavlings: (newKavs: Kavling[]) => void;
  updateKavling: (id: string, data: Partial<Omit<Kavling, 'id'>>) => void;
  deleteKavling: (id: string) => void;
  addBatchKavling: (
    blok: string,
    prefix: string,
    start: number,
    count: number,
    luas: number,
    dimensi: string,
    harga: number,
    tipe: string,
    projectId: string
  ) => void;
  updateKavlingStatus: (id: string, status: 'terbuka' | 'booking' | 'terjual') => void;
  addCustomer: (data: {
    nama: string;
    nik: string;
    noKk?: string;
    telepon: string;
    tempatTanggalLahir?: string;
    pekerjaan?: string;
    alamat: string;
    kavlingId?: string | null;
    kavlingIds?: string[];
    totalHarga?: number;
    uangMuka?: number;
    metodeBayar?: 'tunai' | 'transfer' | 'barter';
    rincianBarter?: string;
    ktpImage?: string | null;
    kkImage?: string | null;
    ajbImage?: string | null;
    shmSplitImage?: string | null;
    noAjb?: string;
    noShmSplit?: string;
    tanggalAjb?: string;
    tanggalShmSplit?: string;
    notarisPpat?: string;
  }) => Promise<boolean>;
  updateCustomerDocuments: (
    customerId: string,
    docs: {
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
  ) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  assignCustomerToKavling: (customerId: string, kavlingId: string, customPrice?: number) => Promise<boolean>;
  assignCustomerToMultipleKavlings: (customerId: string, kavlingIds: string[], customTotalPrice?: number) => Promise<boolean>;
  unlinkCustomerFromSpecificKavling: (customerId: string, kavlingId: string) => Promise<boolean>;
  unlinkCustomerFromKavling: (customerId: string) => Promise<boolean>;
  addCustomerPayment: (data: Omit<Payment, 'id'>) => void;
  updatePaymentReceipt: (paymentId: string, kwitansiImage: string | null) => void;
  addLandDebt: (data: {
    projectId: string;
    namaPetani: string;
    telepon: string;
    luasTanah: string;
    alasHak: string;
    hargaKesepakatan: number;
    dpDibayar: number;
    alamatLahan?: string;
    keterangan?: string;
    sertifikatImage?: string | null;
    perjanjianImage?: string | null;
  }) => void;
  updateLandDebt: (id: string, data: Partial<Omit<LandDebt, 'id'>>) => void;
  deleteLandDebt: (id: string) => void;
  updateLandDocuments: (
    landDebtId: string,
    docs: {
      sertifikatImage?: string | null;
      perjanjianImage?: string | null;
    }
  ) => void;
  addLandPayment: (data: Omit<LandPayment, 'id'>) => void;
  updateLandPaymentReceipt: (paymentId: string, kwitansiImage: string | null) => void;
  addCashbookItem: (data: Omit<CashbookItem, 'id'>) => void;
  updateCashbookItem: (id: string, updates: Partial<CashbookItem>) => Promise<boolean>;
  deleteCashbookItem: (id: string) => Promise<boolean>;
  topUpPettyCash: (nominal: number, sumberDana: 'kas_besar' | 'investor', keterangan: string, penerima?: string) => void;
  addPettyExpense: (data: {
    kategori: PettyCashItem['kategori'];
    penerima: string;
    keterangan: string;
    nominal: number;
    metode?: string;
  }) => void;
  updatePettyCashItem: (id: string, updates: Partial<PettyCashItem>) => Promise<boolean>;
  deletePettyCashItem: (id: string) => Promise<boolean>;
  addInventoryItem: (data: Omit<InventoryItem, 'id'>) => void;
  deleteInventoryItem: (id: string) => void;
  addEmployee: (data: Omit<Employee, 'id'>) => void;
  deleteEmployee: (id: string) => Promise<boolean>;
  payEmployeeSalary: (employeeId: string, bulan: string, catatan?: string) => { success: boolean; message: string };
  payAllActiveSalaries: (bulan: string) => { count: number; total: number; message: string };
  syncAllToCashbook: () => void;
  syncAllToSupabase: () => Promise<{ success: boolean; message: string }>;
  refreshCloudData: () => Promise<void>;
  isSyncingCloud: boolean;
  lastSyncTime: Date | null;

  // Computed Financials
  totalSalesValue: number;
  totalCashIn: number;
  totalCashOut: number;
  cashbookBalance: number;
  pettyCashIn: number;
  pettyCashOut: number;
  pettyCashBalance: number;
  totalReceivables: number;
  totalFarmerDebt: number;
  totalAssetValue: number;
  totalNonCashBarter: number;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const STORAGE_PREFIX = 'adam_erp_v1_';

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed !== null && parsed !== undefined) ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed saving to localStorage:', e);
  }
}

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Core Data States
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [kavlings, setKavlings] = useState<Kavling[]>(INITIAL_KAVLINGS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [landDebts, setLandDebts] = useState<LandDebt[]>(INITIAL_LAND_DEBTS);
  const [landPayments, setLandPayments] = useState<LandPayment[]>(INITIAL_LAND_PAYMENTS);
  const [cashbook, setCashbook] = useState<CashbookItem[]>(INITIAL_CASHBOOK);
  const [pettyCash, setPettyCash] = useState<PettyCashItem[]>(INITIAL_PETTY_CASH);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>(INITIAL_SALARY_PAYMENTS);

  // 1. Immediately restore from localStorage on client-side mount
  useEffect(() => {
    const cachedKavs = loadStorage<Kavling[]>('kavlings', []);
    if (cachedKavs && cachedKavs.length > 0) setKavlings(cachedKavs);

    const cachedProjs = loadStorage<Project[]>('projects', []);
    if (cachedProjs && cachedProjs.length > 0) setProjects(cachedProjs);

    const cachedCust = loadStorage<Customer[]>('customers', []);
    if (cachedCust && cachedCust.length > 0) setCustomers(cachedCust);

    const cachedPayments = loadStorage<Payment[]>('payments', []);
    if (cachedPayments && cachedPayments.length > 0) setPayments(cachedPayments);

    const cachedLands = loadStorage<LandDebt[]>('landDebts', []);
    if (cachedLands && cachedLands.length > 0) setLandDebts(cachedLands);

    const cachedLpays = loadStorage<LandPayment[]>('landPayments', []);
    if (cachedLpays && cachedLpays.length > 0) setLandPayments(cachedLpays);

    const cachedCash = loadStorage<CashbookItem[]>('cashbook', []);
    if (cachedCash && cachedCash.length > 0) {
      // Exclude non-cash barter from liquid cashbook
      const pureCash = cachedCash.filter(c => c.kategori !== 'jual_kavling_barter' && c.metode !== 'Barter Material');
      setCashbook(pureCash);
    }

    const cachedPetty = loadStorage<PettyCashItem[]>('pettyCash', []);
    if (cachedPetty && cachedPetty.length > 0) setPettyCash(cachedPetty);

    const cachedInv = loadStorage<InventoryItem[]>('inventory', []);
    if (cachedInv && cachedInv.length > 0) setInventory(cachedInv);

    const cachedEmp = loadStorage<Employee[]>('employees', []);
    if (cachedEmp && cachedEmp.length > 0) setEmployees(cachedEmp);

    const cachedSal = loadStorage<SalaryPayment[]>('salaryPayments', []);
    if (cachedSal && cachedSal.length > 0) setSalaryPayments(cachedSal);
  }, []);

  // Cloud Sync States
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Synchronize from Supabase Cloud with conflict resolution
  const refreshCloudData = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    setIsSyncingCloud(true);
    try {
      const [
        supaProjects,
        supaKavlings,
        supaCust,
        supaLands,
        supaCash,
        supaPayments,
        supaPetty,
        supaInv,
        supaEmp,
        supaSal
      ] = await Promise.all([
        supabaseFetchProjects(),
        supabaseFetchKavlings(),
        supabaseFetchCustomers(),
        supabaseFetchLandDebts(),
        supabaseFetchCashbook(),
        supabaseFetchPayments(),
        supabaseFetchPettyCash(),
        supabaseFetchInventory(),
        supabaseFetchEmployees(),
        supabaseFetchSalaryPayments()
      ]);

      if (supaProjects !== null && supaProjects.length > 0) {
        setProjects(supaProjects);
        saveStorage('projects', supaProjects);
      }
      // CRITICAL FIX: If supaKavlings is empty array [], accept it so deletions propagate across all devices
      if (supaKavlings !== null) {
        setKavlings(supaKavlings);
        saveStorage('kavlings', supaKavlings);
      }
      if (supaCust !== null) {
        setCustomers(prev => {
          const supaIds = new Set(supaCust.map(c => c.id));
          const recentLocal = prev.filter(c => !supaIds.has(c.id) && Date.now() - (parseInt(c.id.replace('cust-', '')) || 0) < 120000);
          const populatedSupa = supaCust.map(c => {
            const ownedLots = (supaKavlings || []).filter(k => k.customerId === c.id || k.id === c.kavlingId);
            const ownedIds = ownedLots.map(k => k.id);
            return {
              ...c,
              kavlingIds: ownedIds.length > 0 ? ownedIds : (c.kavlingId ? [c.kavlingId] : [])
            };
          });
          const merged = [...recentLocal, ...populatedSupa];
          saveStorage('customers', merged);
          return merged;
        });
      }
      if (supaLands !== null) {
        setLandDebts(supaLands);
        saveStorage('landDebts', supaLands);
      }
      if (supaCash !== null) {
        // Exclude non-cash barter from liquid cashbook
        const pureCash = supaCash.filter(c => c.kategori !== 'jual_kavling_barter' && c.metode !== 'Barter Material');
        setCashbook(pureCash);
        saveStorage('cashbook', pureCash);
      }
      if (supaPayments !== null && supaPayments.length > 0) {
        setPayments(supaPayments);
        saveStorage('payments', supaPayments);
      }
      if (supaPetty !== null && supaPetty.length > 0) {
        setPettyCash(prev => {
          const supaIds = new Set(supaPetty.map(p => p.id));
          const recentLocal = prev.filter(p => !supaIds.has(p.id) && Date.now() - (parseInt(p.id.replace('petty-', '')) || 0) < 120000);
          const merged = [...recentLocal, ...supaPetty];
          saveStorage('pettyCash', merged);
          return merged;
        });
      }
      if (supaInv !== null && supaInv.length > 0) {
        setInventory(prev => {
          const supaIds = new Set(supaInv.map(i => i.id));
          const recentLocal = prev.filter(i => !supaIds.has(i.id) && Date.now() - (parseInt(i.id.replace('inv-', '')) || 0) < 60000);
          const merged = [...recentLocal, ...supaInv];
          saveStorage('inventory', merged);
          return merged;
        });
      }
      if (supaEmp !== null) {
        setEmployees(prev => {
          const supaIds = new Set(supaEmp.map(e => e.id));
          const recentLocal = prev.filter(e => !supaIds.has(e.id) && Date.now() - (parseInt(e.id.replace('emp-', '')) || 0) < 60000);
          const merged = [...recentLocal, ...supaEmp];
          saveStorage('employees', merged);
          return merged;
        });
      }
      if (supaSal !== null) {
        setSalaryPayments(prev => {
          const supaIds = new Set(supaSal.map(s => s.id));
          const recentLocal = prev.filter(s => !supaIds.has(s.id) && Date.now() - (parseInt(s.id.replace('slip-', '')) || 0) < 60000);
          const merged = [...recentLocal, ...supaSal];
          saveStorage('salaryPayments', merged);
          return merged;
        });
      }
      setLastSyncTime(new Date());
    } catch (err) {
      console.warn('Could not sync with Supabase tables:', err);
    } finally {
      setIsSyncingCloud(false);
    }
  }, []);

  // 2. Realtime Multi-Device Synchronization & Lifecycle Listeners
  useEffect(() => {
    // Initial fetch from cloud
    refreshCloudData();

    if (!isSupabaseConfigured()) return;

    // A. Supabase Realtime WebSocket listener (instant live push)
    const channel = supabase
      .channel('adam-realtime-global')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kavlings' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'land_debts' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cashbook' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'petty_cash' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, () => {
        refreshCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'salary_payments' }, () => {
        refreshCloudData();
      })
      .subscribe();

    // B. Foreground Resume Listener: Whenever user switches tabs or unlocks HP/mobile screen
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        refreshCloudData();
      }
    };
    const handleFocus = () => {
      refreshCloudData();
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    // C. Background Auto-Poll (every 10 seconds while viewing)
    const pollTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        refreshCloudData();
      }
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollTimer);
    };
  }, [refreshCloudData]);

  // Financial Calculations
  const totalSalesValue = kavlings
    .filter(k => k.status !== 'terbuka' && (selectedProjectId === 'all' || k.projectId === selectedProjectId))
    .reduce((sum, k) => sum + k.harga, 0);

  const totalCashIn = cashbook
    .filter(c => c.tipe === 'masuk' && c.kategori !== 'jual_kavling_barter' && c.metode !== 'Barter Material' && (selectedProjectId === 'all' || !c.projectId || c.projectId === selectedProjectId))
    .reduce((sum, c) => sum + c.nominal, 0);

  const totalCashOut = cashbook
    .filter(c => c.tipe === 'keluar' && (selectedProjectId === 'all' || !c.projectId || c.projectId === selectedProjectId))
    .reduce((sum, c) => sum + c.nominal, 0);

  const cashbookBalance = totalCashIn - totalCashOut;

  // Non-Cash & Barter Compensation Ledger (Strictly Isolated from Liquid Cashbook)
  const totalNonCashBarter = payments
    .filter(p => p.metodeBayar === 'barter' && (selectedProjectId === 'all' || !p.kavlingKode || kavlings.find(k => k.nomor === p.kavlingKode)?.projectId === selectedProjectId))
    .reduce((sum, p) => sum + p.nominal, 0);

  const pettyCashIn = pettyCash
    .filter(p => p.tipe === 'masuk')
    .reduce((sum, p) => sum + p.nominal, 0);

  const pettyCashOut = pettyCash
    .filter(p => p.tipe === 'keluar')
    .reduce((sum, p) => sum + p.nominal, 0);

  const pettyCashBalance = pettyCashIn - pettyCashOut;

  const totalReceivables = customers
    .filter(c => selectedProjectId === 'all' || !c.projectId || c.projectId === selectedProjectId)
    .reduce((sum, c) => sum + c.sisaPiutang, 0);

  const totalFarmerDebt = landDebts
    .filter(l => selectedProjectId === 'all' || l.projectId === selectedProjectId)
    .reduce((sum, l) => sum + l.sisaHutang, 0);

  const totalAssetValue = inventory.reduce((sum, item) => sum + (item.nilaiPerolehan * item.jumlah), 0);

  // 1. Projects & Land Induk Acquisition
  const addProject = (data: AddProjectData): Project => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      nama: data.nama,
      lokasi: data.lokasi,
      deskripsi: data.deskripsi,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [...prev, newProject]);

    // Jika user menginput transaksi finansial pembelian lahan induk:
    const harga = Number(data.hargaKesepakatan || 0);
    const dp = Number(data.dpDibayar || 0);
    if (data.hasLandDebt || harga > 0) {
      const landId = `land-${Date.now()}`;
      const sisa = Math.max(0, harga - dp);
      const isLunas = sisa <= 0;

      const newLand: LandDebt = {
        id: landId,
        projectId: newProject.id,
        projectNama: newProject.nama,
        namaPetani: data.namaPetani || 'Pemilik Lahan Asal',
        telepon: data.teleponPetani || '-',
        luasTanah: data.luasTanah || '-',
        alasHak: data.alasHak || 'SHM / Girik Induk',
        hargaKesepakatan: harga,
        dpDibayar: dp,
        totalCicilan: 0,
        sisaHutang: sisa,
        status: isLunas ? 'lunas' : 'belum_lunas',
        alamatLahan: data.lokasi,
        keterangan: data.catatanHutang || data.deskripsi || 'Pembelian lahan mentah proyek baru',
        sertifikatImage: data.sertifikatImage || null,
        perjanjianImage: data.perjanjianImage || null
      };

      setLandDebts(prev => [...prev, newLand]);

      // Jika ada DP dibayar, catat mutasi pengeluaran kas di Kas Besar & riwayat pembayaran tanah
      if (dp > 0) {
        const lpayId = `lpay-${Date.now()}`;
        const newLpay: LandPayment = {
          id: lpayId,
          landDebtId: landId,
          tanggal: new Date().toISOString().split('T')[0],
          nominal: dp,
          metode: data.metodeBayarDp || 'Transfer Bank BCA',
          keterangan: `DP Awal Pembebasan Lahan Induk ${newProject.nama} - ${data.namaPetani || 'Pemilik'}`,
          kwitansiImage: data.perjanjianImage || null
        };
        setLandPayments(prev => [...prev, newLpay]);

        const cashOut: CashbookItem = {
          id: `cash-${Date.now()}`,
          tanggal: new Date().toISOString().split('T')[0],
          tipe: 'keluar',
          kategori: 'lahan_petani',
          sumber: `Petani / Pemilik: ${data.namaPetani || 'Pemilik Lahan'}`,
          keterangan: `DP Pembebasan Lahan Induk ${data.luasTanah || ''} (${newProject.nama})`,
          nominal: dp,
          metode: data.metodeBayarDp || 'Transfer Bank',
          projectId: newProject.id,
          refType: 'land_payment',
          refId: lpayId
        };
        setCashbook(prev => [...prev, cashOut]);
      }
    }

    return newProject;
  };

  const updateProject = (id: string, data: { nama: string; lokasi: string; deskripsi?: string }) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
    setLandDebts(prev => prev.map(l => (l.projectId === id ? { ...l, projectNama: data.nama } : l)));
    if (isSupabaseConfigured()) {
      supabaseUpdateProject(id, data).catch(console.warn);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveStorage('projects', updated);
      return updated;
    });
    setKavlings(prev => {
      const updated = prev.filter(k => k.projectId !== id);
      saveStorage('kavlings', updated);
      return updated;
    });
    setLandDebts(prev => {
      const updated = prev.filter(l => l.projectId !== id);
      saveStorage('landDebts', updated);
      return updated;
    });
    if (selectedProjectId === id) {
      setSelectedProjectId('all');
    }
    if (isSupabaseConfigured()) {
      supabaseDeleteProject(id)
        .then(() => refreshCloudData())
        .catch(console.warn);
    }
  };

  // 2. Kavling
  const addKavling = (data: Omit<Kavling, 'id'>) => {
    const newKav: Kavling = {
      ...data,
      id: `kav-${Date.now()}`
    };
    setKavlings(prev => {
      const updated = [...prev, newKav];
      saveStorage('kavlings', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertKavling(newKav).catch(console.warn);
    }
  };

  const addMultipleKavlings = (newKavs: Kavling[]) => {
    setKavlings(prev => {
      const updated = [...prev, ...newKavs];
      saveStorage('kavlings', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertBatchKavlings(newKavs).catch(console.warn);
    }
  };

  const updateKavling = (id: string, data: Partial<Omit<Kavling, 'id'>>) => {
    setKavlings(prev => {
      const updated = prev.map(k => (k.id === id ? { ...k, ...data } : k));
      saveStorage('kavlings', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseUpdateKavling(id, data).catch(console.warn);
    }
  };

  const deleteKavling = (id: string) => {
    setKavlings(prev => {
      const updated = prev.filter(k => k.id !== id);
      saveStorage('kavlings', updated);
      return updated;
    });

    // Clean up customer reference if any customer owned this kavling
    setCustomers(prev => {
      let changed = false;
      const updated = prev.map(c => {
        const hasSingle = c.kavlingId === id;
        const hasMulti = c.kavlingIds?.includes(id);
        if (hasSingle || hasMulti) {
          changed = true;
          const newKavlingIds = (c.kavlingIds || []).filter(kId => kId !== id);
          return {
            ...c,
            kavlingId: hasSingle ? (newKavlingIds[0] || null) : c.kavlingId,
            kavlingIds: newKavlingIds
          };
        }
        return c;
      });
      if (changed) saveStorage('customers', updated);
      return updated;
    });

    if (isSupabaseConfigured()) {
      supabaseDeleteKavling(id)
        .then(() => refreshCloudData())
        .catch(console.warn);
    }
  };

  const addBatchKavling = (
    blok: string,
    prefix: string,
    start: number,
    count: number,
    luas: number,
    dimensi: string,
    harga: number,
    tipe: string,
    projectId: string
  ) => {
    const newLots: Kavling[] = [];
    for (let i = 0; i < count; i++) {
      const lotNum = start + i;
      const nomor = `${prefix ? prefix + '-' : ''}${lotNum < 10 ? '0' + lotNum : lotNum}`;
      newLots.push({
        id: `kav-${Date.now()}-${i}`,
        projectId,
        blok,
        nomor,
        luas,
        dimensi,
        harga,
        tipe,
        status: 'terbuka',
        customerId: null,
        customerNama: null
      });
    }
    setKavlings(prev => {
      const updated = [...prev, ...newLots];
      saveStorage('kavlings', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertBatchKavlings(newLots).catch(console.warn);
    }
  };

  const updateKavlingStatus = (id: string, status: 'terbuka' | 'booking' | 'terjual') => {
    setKavlings(prev => {
      const updated = prev.map(k => (k.id === id ? { ...k, status } : k));
      saveStorage('kavlings', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseUpdateKavling(id, { status }).catch(console.warn);
    }
  };

  // 3. Customer & Payment (with auto-sync to Supabase & Cashbook)
  const addCustomer = async (data: {
    nama: string;
    nik: string;
    noKk?: string;
    telepon: string;
    tempatTanggalLahir?: string;
    pekerjaan?: string;
    alamat: string;
    kavlingId?: string | null;
    kavlingIds?: string[];
    totalHarga?: number;
    uangMuka?: number;
    metodeBayar?: 'tunai' | 'transfer' | 'barter';
    rincianBarter?: string;
    ktpImage?: string | null;
    kkImage?: string | null;
    ajbImage?: string | null;
    shmSplitImage?: string | null;
    noAjb?: string;
    noShmSplit?: string;
    tanggalAjb?: string;
    tanggalShmSplit?: string;
    notarisPpat?: string;
  }): Promise<boolean> => {
    const custId = `cust-${Date.now()}`;
    const targetKavIds: string[] = data.kavlingIds && data.kavlingIds.length > 0
      ? data.kavlingIds
      : (data.kavlingId ? [data.kavlingId] : []);
    const targetLots = kavlings.filter(k => targetKavIds.includes(k.id));
    const primaryKav = targetLots[0];
    const kavKode = targetLots.length > 0
      ? targetLots.map(k => k.nomor).join(', ')
      : (data.kavlingId || '-');
    const brochureSum = targetLots.reduce((sum, k) => sum + k.harga, 0);
    const finalTotal = data.totalHarga !== undefined && data.totalHarga > 0 ? data.totalHarga : brochureSum;
    const finalDp = data.uangMuka || 0;
    const isLunas = finalDp >= finalTotal && finalTotal > 0;
    const sisa = Math.max(0, finalTotal - finalDp);
    const bayarMethod = data.metodeBayar || 'transfer';

    const newCustomer: Customer = {
      id: custId,
      nama: data.nama,
      nik: data.nik,
      noKk: data.noKk,
      telepon: data.telepon,
      tempatTanggalLahir: data.tempatTanggalLahir,
      pekerjaan: data.pekerjaan,
      alamat: data.alamat,
      kavlingId: primaryKav?.id || null,
      kavlingKode: kavKode,
      kavlingIds: targetKavIds,
      projectId: primaryKav?.projectId || 'proj-bm1',
      totalHarga: finalTotal,
      totalMasuk: finalDp,
      sisaPiutang: sisa,
      statusBayar: (isLunas ? 'lunas' : 'belum_lunas') as Customer['statusBayar'],
      tanggalBeli: new Date().toISOString().split('T')[0],
      ktpImage: data.ktpImage,
      kkImage: data.kkImage,
      ajbImage: data.ajbImage,
      shmSplitImage: data.shmSplitImage,
      noAjb: data.noAjb,
      noShmSplit: data.noShmSplit,
      tanggalAjb: data.tanggalAjb,
      tanggalShmSplit: data.tanggalShmSplit,
      notarisPpat: data.notarisPpat
    };

    // 1. Update customer state & localStorage
    setCustomers(prev => {
      const updated = [newCustomer, ...prev];
      saveStorage('customers', updated);
      return updated;
    });

    // 2. Update kavling status if kavlings were selected
    if (targetLots.length > 0) {
      setKavlings(prev => {
        const updated = prev.map(k =>
          targetKavIds.includes(k.id)
            ? { ...k, status: (isLunas ? 'terjual' : 'booking') as Kavling['status'], customerId: custId, customerNama: data.nama }
            : k
        );
        saveStorage('kavlings', updated);
        return updated;
      });
    }

    let newPay: Payment | null = null;
    let newCash: CashbookItem | null = null;
    // 3. If DP exists, create payment & cashbook entry
    if (finalDp > 0) {
      const payId = `pay-${Date.now()}`;
      newPay = {
        id: payId,
        customerId: custId,
        customerNama: data.nama,
        kavlingKode: kavKode,
        tanggal: new Date().toISOString().split('T')[0],
        nominal: finalDp,
        metodeBayar: bayarMethod,
        tujuan: isLunas ? 'Pelunasan Pembelian Kavling' : 'Uang Muka (DP)',
        rincianBarter: data.rincianBarter
      };

      setPayments(prev => {
        const updated = [...prev, newPay!];
        saveStorage('payments', updated);
        return updated;
      });

      // Auto-sync to Cashbook ONLY if payment is liquid (tunai or transfer)!
      // Non-cash barter is strictly recorded in payments & NonCashBarterView, NEVER in liquid cashbook!
      if (bayarMethod === 'tunai' || bayarMethod === 'transfer') {
        newCash = {
          id: `cash-${Date.now()}`,
          tanggal: new Date().toISOString().split('T')[0],
          tipe: 'masuk',
          kategori: 'jual_kavling',
          sumber: `Customer: ${data.nama}`,
          keterangan: `${newPay.tujuan} (${kavKode})`,
          nominal: finalDp,
          metode: bayarMethod === 'tunai' ? 'Tunai Kasir' : 'Transfer Bank',
          projectId: primaryKav?.projectId || 'proj-bm1',
          refType: 'customer_payment',
          refId: payId
        };
        setCashbook(prev => {
          const updated = [...prev, newCash!];
          saveStorage('cashbook', updated);
          return updated;
        });
      }
    }

    // 4. Cloud Supabase Sync
    if (isSupabaseConfigured()) {
      try {
        await supabaseInsertCustomer(newCustomer);
        for (const lot of targetLots) {
          await supabaseUpdateKavling(lot.id, {
            customerId: custId,
            customerNama: data.nama,
            status: isLunas ? 'terjual' : 'booking'
          });
        }
        if (newPay) {
          await supabaseInsertPayment(newPay);
        }
        if (newCash) {
          await supabaseInsertCashbookItem(newCash);
        }
        await refreshCloudData();
      } catch (e) {
        console.warn('Error syncing new customer to Supabase:', e);
      }
    }

    return true;
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<boolean> => {
    setCustomers(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      saveStorage('customers', updated);
      return updated;
    });

    if (isSupabaseConfigured()) {
      try {
        await supabaseUpdateCustomer(id, updates);
        await refreshCloudData();
      } catch (e) {
        console.warn('Error updating customer:', e);
      }
    }
    return true;
  };

  const deleteCustomer = async (id: string): Promise<boolean> => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return false;

    // 1. Unlink any kavlings owned by this customer
    setKavlings(prev => {
      const updated = prev.map(k => (k.customerId === id || k.id === cust.kavlingId) ? {
        ...k,
        customerId: null,
        customerNama: null,
        status: 'terbuka' as const
      } : k);
      saveStorage('kavlings', updated);
      return updated;
    });

    // 2. Remove customer from local state
    setCustomers(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveStorage('customers', updated);
      return updated;
    });

    // 3. Remove customer payments from local state
    setPayments(prev => {
      const updated = prev.filter(p => p.customerId !== id);
      saveStorage('payments', updated);
      return updated;
    });

    // 4. Cloud Supabase Sync
    if (isSupabaseConfigured()) {
      try {
        const ownedLots = kavlings.filter(k => k.customerId === id || k.id === cust.kavlingId);
        for (const lot of ownedLots) {
          await supabaseUpdateKavling(lot.id, {
            customerId: null,
            customerNama: null,
            status: 'terbuka'
          });
        }
        await supabaseDeleteCustomer(id);
        await refreshCloudData();
      } catch (e) {
        console.warn('Error deleting customer from Supabase:', e);
      }
    }

    return true;
  };

  const assignCustomerToMultipleKavlings = async (
    customerId: string,
    kavlingIds: string[],
    customPrice?: number
  ): Promise<boolean> => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return false;

    // Filter valid selected lots
    const selectedLots = kavlings.filter(k => kavlingIds.includes(k.id));
    
    // Lots previously owned by this customer
    const previouslyOwned = kavlings.filter(k => k.customerId === customerId || (cust.kavlingId === k.id));
    // Lots that were unselected
    const unlinkedLots = previouslyOwned.filter(k => !kavlingIds.includes(k.id));

    // Calculate sum of brochure prices
    const sumBrochurePrice = selectedLots.reduce((sum, k) => sum + k.harga, 0);
    const finalPrice = (customPrice !== undefined && customPrice > 0)
      ? customPrice
      : (sumBrochurePrice > 0 ? sumBrochurePrice : cust.totalHarga);

    const newSisa = Math.max(0, finalPrice - cust.totalMasuk);
    const isLunas = cust.totalMasuk >= finalPrice && finalPrice > 0;
    
    // Combine lot codes: e.g. "A1, A2" or "-"
    const kavKode = selectedLots.length > 0
      ? selectedLots.map(k => `${k.nomor}`).join(', ')
      : '-';
    const primaryKavlingId = selectedLots.length > 0 ? selectedLots[0].id : null;
    const projectId = selectedLots.length > 0 ? selectedLots[0].projectId : cust.projectId;

    // 1. Update customer state & storage
    const updatedCustomer: Customer = {
      ...cust,
      kavlingId: primaryKavlingId,
      kavlingKode: kavKode,
      kavlingIds: selectedLots.map(k => k.id),
      totalHarga: finalPrice,
      sisaPiutang: newSisa,
      statusBayar: (isLunas ? 'lunas' : 'belum_lunas') as Customer['statusBayar'],
      projectId: projectId
    };

    setCustomers(prev => {
      const updated = prev.map(c => c.id === customerId ? updatedCustomer : c);
      saveStorage('customers', updated);
      return updated;
    });

    // 2. Update kavling state & storage
    setKavlings(prev => {
      const updated = prev.map(lot => {
        // If this lot is one of the newly selected lots
        if (kavlingIds.includes(lot.id)) {
          return {
            ...lot,
            customerId: cust.id,
            customerNama: cust.nama,
            status: (isLunas ? 'terjual' : 'booking') as Kavling['status']
          };
        }
        // If this lot was previously owned by this customer, but now unlinked
        if ((lot.customerId === customerId || lot.id === cust.kavlingId) && !kavlingIds.includes(lot.id)) {
          return {
            ...lot,
            customerId: null,
            customerNama: null,
            status: 'terbuka' as Kavling['status']
          };
        }
        return lot;
      });
      saveStorage('kavlings', updated);
      return updated;
    });

    // 3. Update customer's payments with the new kavlingKode
    setPayments(prev => {
      const updated = prev.map(p => p.customerId === customerId ? { ...p, kavlingKode: kavKode } : p);
      saveStorage('payments', updated);
      return updated;
    });

    // 4. Update Central Cashbook entries related to this customer
    setCashbook(prev => {
      const updated = prev.map(c => {
        if (c.sumber.includes(cust.nama)) {
          return {
            ...c,
            keterangan: c.keterangan.includes('(') ? `${c.keterangan.split('(')[0].trim()} (${kavKode})` : `${c.keterangan} (${kavKode})`
          };
        }
        return c;
      });
      saveStorage('cashbook', updated);
      return updated;
    });

    // 5. Cloud Supabase Sync
    if (isSupabaseConfigured()) {
      try {
        const promises: Promise<any>[] = [];
        promises.push(
          supabaseUpdateCustomer(customerId, {
            kavlingId: primaryKavlingId,
            kavlingKode: kavKode,
            totalHarga: finalPrice,
            sisaPiutang: newSisa,
            statusBayar: isLunas ? 'lunas' : 'belum_lunas',
            projectId: projectId
          })
        );

        for (const lot of selectedLots) {
          promises.push(
            supabaseUpdateKavling(lot.id, {
              customerId: cust.id,
              customerNama: cust.nama,
              status: isLunas ? 'terjual' : 'booking'
            })
          );
        }

        for (const lot of unlinkedLots) {
          promises.push(
            supabaseUpdateKavling(lot.id, {
              customerId: null,
              customerNama: null,
              status: 'terbuka'
            })
          );
        }

        const custPayments = payments.filter(p => p.customerId === customerId);
        for (const p of custPayments) {
          promises.push(supabaseUpdatePayment(p.id, { kavlingKode: kavKode }));
        }

        await Promise.all(promises);
        await refreshCloudData();
      } catch (e) {
        console.warn('Error syncing multi-kavling to Supabase:', e);
      }
    }

    return true;
  };

  const assignCustomerToKavling = async (
    customerId: string, 
    kavlingId: string, 
    customPrice?: number
  ): Promise<boolean> => {
    return assignCustomerToMultipleKavlings(customerId, [kavlingId], customPrice);
  };

  const unlinkCustomerFromSpecificKavling = async (
    customerId: string,
    kavlingId: string
  ): Promise<boolean> => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return false;
    const currentlyOwned = kavlings.filter(k => k.customerId === customerId || (cust.kavlingId === k.id));
    const remainingIds = currentlyOwned.map(k => k.id).filter(id => id !== kavlingId);

    if (remainingIds.length === 0) {
      return unlinkCustomerFromKavling(customerId);
    }

    const removedLot = kavlings.find(k => k.id === kavlingId);
    const newPrice = Math.max(0, cust.totalHarga - (removedLot ? removedLot.harga : 0));
    return assignCustomerToMultipleKavlings(customerId, remainingIds, newPrice);
  };

  const unlinkCustomerFromKavling = async (customerId: string): Promise<boolean> => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return false;
    const previouslyOwned = kavlings.filter(k => k.customerId === customerId || (cust.kavlingId === k.id));

    setCustomers(prev => {
      const updated = prev.map(c => c.id === customerId ? {
        ...c,
        kavlingId: null,
        kavlingKode: '-',
        kavlingIds: [],
        totalHarga: 0,
        sisaPiutang: 0,
        statusBayar: 'belum_lunas' as const
      } : c);
      saveStorage('customers', updated);
      return updated;
    });

    setKavlings(prev => {
      const updated = prev.map(k => (k.customerId === customerId || k.id === cust.kavlingId) ? {
        ...k,
        customerId: null,
        customerNama: null,
        status: 'terbuka' as const
      } : k);
      saveStorage('kavlings', updated);
      return updated;
    });

    if (isSupabaseConfigured()) {
      try {
        const promises: Promise<any>[] = [];
        promises.push(
          supabaseUpdateCustomer(customerId, {
            kavlingId: null,
            kavlingKode: '-',
            totalHarga: 0,
            sisaPiutang: 0,
            statusBayar: 'belum_lunas'
          })
        );
        for (const lot of previouslyOwned) {
          promises.push(
            supabaseUpdateKavling(lot.id, {
              customerId: null,
              customerNama: null,
              status: 'terbuka'
            })
          );
        }
        await Promise.all(promises);
        await refreshCloudData();
      } catch (e) {
        console.warn('Error unlinking customer:', e);
      }
    }
    return true;
  };

  const addCustomerPayment = (data: Omit<Payment, 'id'>) => {
    const payId = `pay-${Date.now()}`;
    const newPay: Payment = { ...data, id: payId };
    setPayments(prev => {
      const updated = [...prev, newPay];
      saveStorage('payments', updated);
      return updated;
    });

    // Update customer balance
    setCustomers(prev => {
      const updated = prev.map(c => {
        if (c.id === data.customerId) {
          const newMasuk = c.totalMasuk + data.nominal;
          const newSisa = Math.max(0, c.totalHarga - newMasuk);
          const isLunas = newSisa <= 0;
          
          const allOwnedLots = Array.from(new Set([
            ...(c.kavlingIds || []),
            ...(c.kavlingId ? [c.kavlingId] : [])
          ]));

          if (isLunas && allOwnedLots.length > 0) {
            setKavlings(lots => lots.map(k => (allOwnedLots.includes(k.id) ? { ...k, status: 'terjual' } : k)));
            if (isSupabaseConfigured()) {
              for (const lotId of allOwnedLots) {
                supabaseUpdateKavling(lotId, { status: 'terjual' }).catch(console.warn);
              }
            }
          }

          if (isSupabaseConfigured()) {
            supabaseUpdateCustomer(c.id, {
              totalMasuk: newMasuk,
              sisaPiutang: newSisa,
              statusBayar: isLunas ? 'lunas' : 'belum_lunas'
            }).catch(console.warn);
          }

          return {
            ...c,
            totalMasuk: newMasuk,
            sisaPiutang: newSisa,
            statusBayar: (isLunas ? 'lunas' : 'belum_lunas') as Customer['statusBayar']
          };
        }
        return c;
      });
      saveStorage('customers', updated);
      return updated;
    });

    if (isSupabaseConfigured()) {
      supabaseInsertPayment(newPay).catch(console.warn);
    }

    // Auto-sync to Cashbook ONLY if payment is liquid (tunai or transfer)!
    // Non-cash barter is strictly isolated from liquid cashbook!
    if (data.metodeBayar === 'tunai' || data.metodeBayar === 'transfer') {
      const targetCust = customers.find(c => c.id === data.customerId);
      const cashItem: CashbookItem = {
        id: `cash-${Date.now()}`,
        tanggal: data.tanggal,
        tipe: 'masuk',
        kategori: 'jual_kavling',
        sumber: `Customer: ${targetCust?.nama || 'Customer'}`,
        keterangan: `${data.tujuan} (${data.kavlingKode || ''})`,
        nominal: data.nominal,
        metode: data.metodeBayar === 'tunai' ? 'Tunai Kasir' : 'Transfer Bank',
        projectId: targetCust?.projectId,
        refType: 'customer_payment',
        refId: payId
      };
      setCashbook(prev => {
        const updated = [...prev, cashItem];
        saveStorage('cashbook', updated);
        return updated;
      });

      if (isSupabaseConfigured()) {
        supabaseInsertCashbookItem(cashItem).catch(console.warn);
      }
    }
  };

  const updateCustomerDocuments = (
    customerId: string,
    docs: {
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
  ) => {
    setCustomers(prev => {
      const updated = prev.map(c => (c.id === customerId ? { ...c, ...docs } : c));
      saveStorage('customers', updated);
      return updated;
    });

    if (isSupabaseConfigured()) {
      supabaseUpdateCustomer(customerId, docs).catch(console.warn);
    }
  };

  const updatePaymentReceipt = (paymentId: string, kwitansiImage: string | null) => {
    setPayments(prev => {
      const updated = prev.map(p => (p.id === paymentId ? { ...p, kwitansiImage } : p));
      saveStorage('payments', updated);
      return updated;
    });

    if (isSupabaseConfigured()) {
      supabaseUpdatePayment(paymentId, { kwitansiImage }).catch(console.warn);
    }
  };

  // 4. Land Debts (with auto-deduction from Cashbook)
  const addLandDebt = (data: {
    projectId: string;
    namaPetani: string;
    telepon: string;
    luasTanah: string;
    alasHak: string;
    hargaKesepakatan: number;
    dpDibayar: number;
    alamatLahan?: string;
    keterangan?: string;
    sertifikatImage?: string | null;
    perjanjianImage?: string | null;
  }) => {
    const landId = `land-${Date.now()}`;
    const proj = projects.find(p => p.id === data.projectId);
    const sisa = Math.max(0, data.hargaKesepakatan - data.dpDibayar);
    const isLunas = sisa <= 0;

    const newLand: LandDebt = {
      id: landId,
      projectId: data.projectId,
      projectNama: proj?.nama || 'Proyek Lahan',
      namaPetani: data.namaPetani,
      telepon: data.telepon,
      luasTanah: data.luasTanah,
      alasHak: data.alasHak,
      hargaKesepakatan: data.hargaKesepakatan,
      dpDibayar: data.dpDibayar,
      totalCicilan: 0,
      sisaHutang: sisa,
      status: isLunas ? 'lunas' : 'belum_lunas',
      alamatLahan: data.alamatLahan,
      keterangan: data.keterangan,
      sertifikatImage: data.sertifikatImage || null,
      perjanjianImage: data.perjanjianImage || null
    };

    setLandDebts(prev => [...prev, newLand]);

    if (data.dpDibayar > 0) {
      const lpayId = `lpay-${Date.now()}`;
      const newLpay: LandPayment = {
        id: lpayId,
        landDebtId: landId,
        tanggal: new Date().toISOString().split('T')[0],
        nominal: data.dpDibayar,
        metode: 'Transfer Bank',
        keterangan: `DP Pembebasan Lahan Petani Bpk. ${data.namaPetani}`,
        kwitansiImage: data.perjanjianImage || null
      };
      setLandPayments(prev => [...prev, newLpay]);

      // Outflow in Cashbook
      const cashOut: CashbookItem = {
        id: `cash-${Date.now()}`,
        tanggal: new Date().toISOString().split('T')[0],
        tipe: 'keluar',
        kategori: 'lahan_petani',
        sumber: `Petani: ${data.namaPetani}`,
        keterangan: `DP Pembebasan Lahan ${data.luasTanah} (${proj?.nama || ''})`,
        nominal: data.dpDibayar,
        metode: 'Transfer Bank BCA',
        projectId: data.projectId,
        refType: 'land_payment',
        refId: lpayId
      };
      setCashbook(prev => [...prev, cashOut]);
    }
  };

  const updateLandDebt = (id: string, data: Partial<Omit<LandDebt, 'id'>>) => {
    const proj = data.projectId ? projects.find(p => p.id === data.projectId) : undefined;
    setLandDebts(prev => prev.map(l => {
      if (l.id !== id) return l;
      const updated = { 
        ...l, 
        ...data,
        projectNama: proj ? proj.nama : (data.projectNama || l.projectNama)
      };
      const harga = updated.hargaKesepakatan !== undefined ? updated.hargaKesepakatan : l.hargaKesepakatan;
      const dp = updated.dpDibayar !== undefined ? updated.dpDibayar : l.dpDibayar;
      const cicilan = updated.totalCicilan !== undefined ? updated.totalCicilan : l.totalCicilan;
      const sisa = Math.max(0, harga - (dp + cicilan));
      updated.sisaHutang = sisa;
      updated.status = sisa <= 0 ? 'lunas' : 'belum_lunas';
      return updated;
    }));
    if (isSupabaseConfigured()) {
      supabaseUpdateLandDebt(id, data).catch(console.warn);
    }
  };

  const deleteLandDebt = (id: string) => {
    setLandDebts(prev => {
      const updated = prev.filter(l => l.id !== id);
      saveStorage('landDebts', updated);
      return updated;
    });
    setLandPayments(prev => {
      const updated = prev.filter(lp => lp.landDebtId !== id);
      saveStorage('landPayments', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseDeleteLandDebt(id)
        .then(() => refreshCloudData())
        .catch(console.warn);
    }
  };

  const updateLandDocuments = (
    landDebtId: string,
    docs: {
      sertifikatImage?: string | null;
      perjanjianImage?: string | null;
    }
  ) => {
    setLandDebts(prev =>
      prev.map(l => (l.id === landDebtId ? { ...l, ...docs } : l))
    );
  };

  const addLandPayment = (data: Omit<LandPayment, 'id'>) => {
    const lpayId = `lpay-${Date.now()}`;
    const newLpay: LandPayment = { ...data, id: lpayId };
    setLandPayments(prev => [...prev, newLpay]);

    // Update land debt
    setLandDebts(prev =>
      prev.map(l => {
        if (l.id === data.landDebtId) {
          const newCicilan = l.totalCicilan + data.nominal;
          const newSisa = Math.max(0, l.hargaKesepakatan - l.dpDibayar - newCicilan);
          return {
            ...l,
            totalCicilan: newCicilan,
            sisaHutang: newSisa,
            status: newSisa <= 0 ? 'lunas' : 'belum_lunas'
          };
        }
        return l;
      })
    );

    // Record in cashbook
    const targetLand = landDebts.find(l => l.id === data.landDebtId);
    const cashOut: CashbookItem = {
      id: `cash-${Date.now()}`,
      tanggal: data.tanggal,
      tipe: 'keluar',
      kategori: 'lahan_petani',
      sumber: `Petani: ${targetLand?.namaPetani || 'Petani'}`,
      keterangan: `Cicilan Lahan: ${data.keterangan}`,
      nominal: data.nominal,
      metode: data.metode,
      projectId: targetLand?.projectId,
      refType: 'land_payment',
      refId: lpayId
    };
    setCashbook(prev => [...prev, cashOut]);
  };

  const updateLandPaymentReceipt = (paymentId: string, kwitansiImage: string | null) => {
    setLandPayments(prev =>
      prev.map(p => (p.id === paymentId ? { ...p, kwitansiImage } : p))
    );
  };

  // 5. Cashbook Direct
  const addCashbookItem = (data: Omit<CashbookItem, 'id'>) => {
    const newItem: CashbookItem = { ...data, id: `cash-${Date.now()}` };
    setCashbook(prev => {
      const updated = [newItem, ...prev];
      saveStorage('cashbook', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertCashbookItem(newItem).catch(console.warn);
    }
  };

  const updateCashbookItem = async (id: string, updates: Partial<CashbookItem>): Promise<boolean> => {
    setCashbook(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      saveStorage('cashbook', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      return await supabaseUpdateCashbookItem(id, updates);
    }
    return true;
  };

  const deleteCashbookItem = async (id: string): Promise<boolean> => {
    setCashbook(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveStorage('cashbook', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      try {
        await supabaseDeleteCashbookItem(id);
      } catch (e) {
        console.warn('Error deleting cashbook item:', e);
      }
    }
    return true;
  };

  // 6. Petty Cash
  const topUpPettyCash = (
    nominal: number,
    sumberDana: 'kas_besar' | 'investor',
    keterangan: string,
    penerima: string = 'Kasir Kantor Operasional'
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const pettyId = `petty-${Date.now()}`;

    // Add Inflow to Petty Cash
    const newPetty: PettyCashItem = {
      id: pettyId,
      tanggal: today,
      tipe: 'masuk',
      kategori: sumberDana === 'kas_besar' ? 'topup_kas_besar' : 'investor',
      sumberDana,
      penerima,
      keterangan,
      nominal,
      metode: 'Tunai Kasir',
      refType: sumberDana === 'kas_besar' ? 'kas_besar' : 'manual'
    };
    setPettyCash(prev => {
      const updated = [newPetty, ...prev];
      saveStorage('pettyCash', updated);
      return updated;
    });

    if (isSupabaseConfigured()) {
      supabaseInsertPettyCash(newPetty).catch(console.warn);
    }

    // Mirror Outflow in Kas Besar if from kas_besar
    if (sumberDana === 'kas_besar') {
      const cashOut: CashbookItem = {
        id: `cash-${Date.now()}`,
        tanggal: today,
        tipe: 'keluar',
        kategori: 'operasional',
        sumber: `Top Up Kas Kecil (${penerima})`,
        keterangan: `Pencairan dana harian petty cash kantor: ${keterangan}`,
        nominal,
        metode: 'Tarik Tunai Bank',
        refType: 'kas_besar',
        refId: pettyId
      };
      setCashbook(prev => {
        const updated = [cashOut, ...prev];
        saveStorage('cashbook', updated);
        return updated;
      });
      if (isSupabaseConfigured()) {
        supabaseInsertCashbookItem(cashOut).catch(console.warn);
      }
    }
  };

  const addPettyExpense = (data: {
    kategori: PettyCashItem['kategori'];
    penerima: string;
    keterangan: string;
    nominal: number;
    metode?: string;
  }) => {
    const newPetty: PettyCashItem = {
      id: `petty-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      tipe: 'keluar',
      kategori: data.kategori,
      penerima: data.penerima,
      keterangan: data.keterangan,
      nominal: data.nominal,
      metode: data.metode || 'Tunai Kas Kecil',
      sumberDana: 'kas_besar'
    };
    setPettyCash(prev => {
      const updated = [newPetty, ...prev];
      saveStorage('pettyCash', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertPettyCash(newPetty).catch(console.warn);
    }
  };

  const updatePettyCashItem = async (id: string, updates: Partial<PettyCashItem>): Promise<boolean> => {
    setPettyCash(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      saveStorage('pettyCash', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      return await supabaseUpdatePettyCash(id, updates);
    }
    return true;
  };

  const deletePettyCashItem = async (id: string): Promise<boolean> => {
    setPettyCash(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveStorage('pettyCash', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      return await supabaseDeletePettyCash(id);
    }
    return true;
  };

  // 7. Inventory Items
  const addInventoryItem = (data: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...data, id: `inv-${Date.now()}` };
    setInventory(prev => {
      const updated = [newItem, ...prev];
      saveStorage('inventory', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertInventory(newItem).catch(console.warn);
    }
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveStorage('inventory', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseDeleteInventory(id).catch(console.warn);
    }
  };

  // 8. Employees & Payroll
  const addEmployee = (data: Omit<Employee, 'id'>) => {
    const newEmp: Employee = { ...data, id: `emp-${Date.now()}` };
    setEmployees(prev => {
      const updated = [...prev, newEmp];
      saveStorage('employees', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertEmployee(newEmp).catch(console.warn);
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    setEmployees(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveStorage('employees', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      return await supabaseDeleteEmployee(id);
    }
    return true;
  };

  const payEmployeeSalary = (employeeId: string, bulan: string, catatan?: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return { success: false, message: 'Karyawan tidak ditemukan.' };

    const thp = emp.gajiPokok + emp.tunjanganJabatan + emp.tunjanganMakan + emp.komisiPenjualan - emp.potongan;
    if (thp <= 0) return { success: false, message: 'Nominal gaji tidak valid.' };

    // Check Petty Cash Balance
    if (pettyCashBalance < thp) {
      return {
        success: false,
        message: `Saldo Kas Kecil tidak mencukupi (Tersedia: Rp ${pettyCashBalance.toLocaleString('id-ID')}, Dibutuhkan: Rp ${thp.toLocaleString('id-ID')}). Silakan Top Up Kas Kecil terlebih dahulu.`
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const pettyId = `petty-${Date.now()}`;

    // 1. Deduct from Petty Cash
    const pettyExp: PettyCashItem = {
      id: pettyId,
      tanggal: today,
      tipe: 'keluar',
      kategori: 'gaji_karyawan',
      penerima: `${emp.nama} (${emp.jabatan})`,
      keterangan: `Pembayaran Gaji Periode ${bulan} - ${catatan || 'Rutin'}`,
      nominal: thp,
      metode: 'Tunai Kasir',
      refType: 'payroll'
    };
    setPettyCash(prev => {
      const updated = [pettyExp, ...prev];
      saveStorage('pettyCash', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertPettyCash(pettyExp).catch(console.warn);
    }

    // 2. Record Salary Payment Slip
    const newSlip: SalaryPayment = {
      id: `slip-${Date.now()}`,
      employeeId: emp.id,
      employeeNama: emp.nama,
      jabatan: emp.jabatan,
      bulan,
      tanggalBayar: today,
      gajiPokok: emp.gajiPokok,
      tunjanganJabatan: emp.tunjanganJabatan,
      tunjanganMakan: emp.tunjanganMakan,
      komisi: emp.komisiPenjualan,
      potongan: emp.potongan,
      thp,
      catatan,
      status: 'terbayar',
      pettyCashId: pettyId
    };
    setSalaryPayments(prev => {
      const updated = [newSlip, ...prev];
      saveStorage('salaryPayments', updated);
      return updated;
    });
    if (isSupabaseConfigured()) {
      supabaseInsertSalaryPayment(newSlip).catch(console.warn);
    }

    return {
      success: true,
      message: `Gaji untuk ${emp.nama} (Rp ${thp.toLocaleString('id-ID')}) berhasil dibayarkan dan otomatis memotong Kas Kecil!`
    };
  };

  const payAllActiveSalaries = (bulan: string) => {
    const activeEmps = employees.filter(e => e.status === 'aktif');
    let paidCount = 0;
    let totalPaid = 0;

    for (const emp of activeEmps) {
      // Check if already paid this month
      const alreadyPaid = salaryPayments.some(s => s.employeeId === emp.id && s.bulan === bulan);
      if (!alreadyPaid) {
        const res = payEmployeeSalary(emp.id, bulan, `Payroll Massal Periode ${bulan}`);
        if (res.success) {
          paidCount++;
          const thp = emp.gajiPokok + emp.tunjanganJabatan + emp.tunjanganMakan + emp.komisiPenjualan - emp.potongan;
          totalPaid += thp;
        }
      }
    }

    return {
      count: paidCount,
      total: totalPaid,
      message: `Berhasil menggaji ${paidCount} karyawan dengan total Rp ${totalPaid.toLocaleString('id-ID')}.`
    };
  };

  const syncAllToCashbook = () => {
    // Reconcile and confirm synchronization
    console.log('Central Cashbook auto-synchronized with sales and petty cash.');
  };

  const syncAllToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Koneksi Supabase belum terkonfigurasi di sistem.' };
    }
    try {
      if (kavlings.length > 0) {
        const ok = await supabaseInsertBatchKavlings(kavlings);
        if (!ok) {
          return {
            success: false,
            message: 'Gagal mengunggah data ke Supabase Cloud. Jalankan script fix_rls_multi_device_sync.sql di Supabase SQL Editor.'
          };
        }
      }
      return {
        success: true,
        message: `Sukses! ${kavlings.length} unit kavling tersimpan di Cloud Supabase dan langsung sinkron ke semua perangkat (HP / Laptop).`
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Terjadi kesalahan sinkronisasi' };
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        projects,
        kavlings,
        customers,
        payments,
        landDebts,
        landPayments,
        cashbook,
        pettyCash,
        inventory,
        employees,
        salaryPayments,

        addProject,
        updateProject,
        deleteProject,
        addKavling,
        addMultipleKavlings,
        updateKavling,
        deleteKavling,
        addBatchKavling,
        updateKavlingStatus,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        assignCustomerToKavling,
        assignCustomerToMultipleKavlings,
        unlinkCustomerFromSpecificKavling,
        unlinkCustomerFromKavling,
        addCustomerPayment,
        updatePaymentReceipt,
        updateCustomerDocuments,
        addLandDebt,
        updateLandDebt,
        deleteLandDebt,
        updateLandDocuments,
        addLandPayment,
        updateLandPaymentReceipt,
        addCashbookItem,
        updateCashbookItem,
        deleteCashbookItem,
        topUpPettyCash,
        addPettyExpense,
        updatePettyCashItem,
        deletePettyCashItem,
        addInventoryItem,
        deleteInventoryItem,
        addEmployee,
        deleteEmployee,
        payEmployeeSalary,
        payAllActiveSalaries,
        syncAllToCashbook,
        syncAllToSupabase,
        refreshCloudData,
        isSyncingCloud,
        lastSyncTime,

        totalSalesValue,
        totalCashIn,
        totalCashOut,
        cashbookBalance,
        pettyCashIn,
        pettyCashOut,
        pettyCashBalance,
        totalReceivables,
        totalFarmerDebt,
        totalAssetValue,
        totalNonCashBarter
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}

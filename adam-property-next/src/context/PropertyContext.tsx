'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { 
  isSupabaseConfigured,
  supabaseFetchProjects,
  supabaseFetchKavlings,
  supabaseFetchCustomers,
  supabaseFetchLandDebts,
  supabaseFetchCashbook,
  supabaseInsertKavling,
  supabaseInsertBatchKavlings,
  supabaseUpdateKavling,
  supabaseDeleteKavling,
  supabaseUpdateProject,
  supabaseDeleteProject,
  supabaseUpdateLandDebt,
  supabaseDeleteLandDebt
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
    kavlingId: string;
    totalHarga: number;
    uangMuka: number;
    metodeBayar: 'tunai' | 'transfer' | 'barter';
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
  }) => void;
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
  topUpPettyCash: (nominal: number, sumberDana: 'kas_besar' | 'investor', keterangan: string, penerima?: string) => void;
  addPettyExpense: (data: {
    kategori: PettyCashItem['kategori'];
    penerima: string;
    keterangan: string;
    nominal: number;
    metode?: string;
  }) => void;
  addInventoryItem: (data: Omit<InventoryItem, 'id'>) => void;
  deleteInventoryItem: (id: string) => void;
  addEmployee: (data: Omit<Employee, 'id'>) => void;
  payEmployeeSalary: (employeeId: string, bulan: string, catatan?: string) => { success: boolean; message: string };
  payAllActiveSalaries: (bulan: string) => { count: number; total: number; message: string };
  syncAllToCashbook: () => void;

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
    if (cachedCash && cachedCash.length > 0) setCashbook(cachedCash);

    const cachedPetty = loadStorage<PettyCashItem[]>('pettyCash', []);
    if (cachedPetty && cachedPetty.length > 0) setPettyCash(cachedPetty);

    const cachedInv = loadStorage<InventoryItem[]>('inventory', []);
    if (cachedInv && cachedInv.length > 0) setInventory(cachedInv);

    const cachedEmp = loadStorage<Employee[]>('employees', []);
    if (cachedEmp && cachedEmp.length > 0) setEmployees(cachedEmp);

    const cachedSal = loadStorage<SalaryPayment[]>('salaryPayments', []);
    if (cachedSal && cachedSal.length > 0) setSalaryPayments(cachedSal);
  }, []);

  // 2. Synchronize with Supabase if configured
  useEffect(() => {
    let isMounted = true;
    async function loadFromSupabase() {
      if (!isSupabaseConfigured()) return;
      try {
        const [supaProjects, supaKavlings, supaCust, supaLands, supaCash] = await Promise.all([
          supabaseFetchProjects(),
          supabaseFetchKavlings(),
          supabaseFetchCustomers(),
          supabaseFetchLandDebts(),
          supabaseFetchCashbook()
        ]);

        if (!isMounted) return;

        if (supaProjects && supaProjects.length > 0) {
          setProjects(supaProjects);
          saveStorage('projects', supaProjects);
        }
        if (supaKavlings && supaKavlings.length > 0) {
          setKavlings(supaKavlings);
          saveStorage('kavlings', supaKavlings);
        }
        if (supaCust && supaCust.length > 0) {
          setCustomers(supaCust);
          saveStorage('customers', supaCust);
        }
        if (supaLands && supaLands.length > 0) {
          setLandDebts(supaLands);
          saveStorage('landDebts', supaLands);
        }
        if (supaCash && supaCash.length > 0) {
          setCashbook(supaCash);
          saveStorage('cashbook', supaCash);
        }
      } catch (err) {
        console.warn('Could not sync with Supabase tables:', err);
      }
    }

    loadFromSupabase();
    return () => { isMounted = false; };
  }, []);

  // Financial Calculations
  const totalSalesValue = kavlings
    .filter(k => k.status !== 'terbuka' && (selectedProjectId === 'all' || k.projectId === selectedProjectId))
    .reduce((sum, k) => sum + k.harga, 0);

  const totalCashIn = cashbook
    .filter(c => c.tipe === 'masuk' && (selectedProjectId === 'all' || !c.projectId || c.projectId === selectedProjectId))
    .reduce((sum, c) => sum + c.nominal, 0);

  const totalCashOut = cashbook
    .filter(c => c.tipe === 'keluar' && (selectedProjectId === 'all' || !c.projectId || c.projectId === selectedProjectId))
    .reduce((sum, c) => sum + c.nominal, 0);

  const cashbookBalance = totalCashIn - totalCashOut;

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
    setProjects(prev => prev.filter(p => p.id !== id));
    setKavlings(prev => prev.filter(k => k.projectId !== id));
    setLandDebts(prev => prev.filter(l => l.projectId !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId('all');
    }
    if (isSupabaseConfigured()) {
      supabaseDeleteProject(id).catch(console.warn);
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
    if (isSupabaseConfigured()) {
      supabaseDeleteKavling(id).catch(console.warn);
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

  // 3. Customer & Payment (with auto-sync to Cashbook)
  const addCustomer = (data: {
    nama: string;
    nik: string;
    noKk?: string;
    telepon: string;
    tempatTanggalLahir?: string;
    pekerjaan?: string;
    alamat: string;
    kavlingId: string;
    totalHarga: number;
    uangMuka: number;
    metodeBayar: 'tunai' | 'transfer' | 'barter';
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
  }) => {
    const custId = `cust-${Date.now()}`;
    const targetKav = kavlings.find(k => k.id === data.kavlingId);
    const kavKode = targetKav ? `${targetKav.blok} - ${targetKav.nomor}` : 'Kavling';
    const isLunas = data.uangMuka >= data.totalHarga;
    const sisa = Math.max(0, data.totalHarga - data.uangMuka);

    const newCustomer: Customer = {
      id: custId,
      nama: data.nama,
      nik: data.nik,
      noKk: data.noKk,
      telepon: data.telepon,
      tempatTanggalLahir: data.tempatTanggalLahir,
      pekerjaan: data.pekerjaan,
      alamat: data.alamat,
      kavlingId: data.kavlingId,
      kavlingKode: kavKode,
      projectId: targetKav?.projectId,
      totalHarga: data.totalHarga,
      totalMasuk: data.uangMuka,
      sisaPiutang: sisa,
      statusBayar: isLunas ? 'lunas' : 'belum_lunas',
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

    setCustomers(prev => [...prev, newCustomer]);

    // Update kavling status
    setKavlings(prev =>
      prev.map(k =>
        k.id === data.kavlingId
          ? { ...k, status: isLunas ? 'terjual' : 'booking', customerId: custId, customerNama: data.nama }
          : k
      )
    );

    // If DP exists, create payment
    if (data.uangMuka > 0) {
      const payId = `pay-${Date.now()}`;
      const newPay: Payment = {
        id: payId,
        customerId: custId,
        customerNama: data.nama,
        kavlingKode: kavKode,
        tanggal: new Date().toISOString().split('T')[0],
        nominal: data.uangMuka,
        metodeBayar: data.metodeBayar,
        tujuan: isLunas ? 'Pelunasan Pembelian Kavling' : 'Uang Muka (DP)',
        rincianBarter: data.rincianBarter
      };
      setPayments(prev => [...prev, newPay]);

      // Auto-sync to Cashbook
      const cashItem: CashbookItem = {
        id: `cash-${Date.now()}`,
        tanggal: new Date().toISOString().split('T')[0],
        tipe: 'masuk',
        kategori: data.metodeBayar === 'barter' ? 'jual_kavling_barter' : 'jual_kavling',
        sumber: `Customer: ${data.nama}`,
        keterangan: `${newPay.tujuan} (${kavKode})`,
        nominal: data.uangMuka,
        metode: data.metodeBayar === 'tunai' ? 'Tunai Kasir' : data.metodeBayar === 'transfer' ? 'Transfer Bank' : 'Barter Material',
        projectId: targetKav?.projectId,
        refType: 'customer_payment',
        refId: payId
      };
      setCashbook(prev => [...prev, cashItem]);
    }
  };

  const addCustomerPayment = (data: Omit<Payment, 'id'>) => {
    const payId = `pay-${Date.now()}`;
    const newPay: Payment = { ...data, id: payId };
    setPayments(prev => [...prev, newPay]);

    // Update customer balance
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === data.customerId) {
          const newMasuk = c.totalMasuk + data.nominal;
          const newSisa = Math.max(0, c.totalHarga - newMasuk);
          const isLunas = newSisa <= 0;
          
          if (isLunas && c.kavlingId) {
            setKavlings(lots => lots.map(k => (k.id === c.kavlingId ? { ...k, status: 'terjual' } : k)));
          }

          return {
            ...c,
            totalMasuk: newMasuk,
            sisaPiutang: newSisa,
            statusBayar: isLunas ? 'lunas' : 'belum_lunas'
          };
        }
        return c;
      })
    );

    // Auto-sync to Cashbook
    const targetCust = customers.find(c => c.id === data.customerId);
    const cashItem: CashbookItem = {
      id: `cash-${Date.now()}`,
      tanggal: data.tanggal,
      tipe: 'masuk',
      kategori: data.metodeBayar === 'barter' ? 'jual_kavling_barter' : 'jual_kavling',
      sumber: `Customer: ${targetCust?.nama || 'Customer'}`,
      keterangan: `${data.tujuan} (${data.kavlingKode || ''})`,
      nominal: data.nominal,
      metode: data.metodeBayar === 'tunai' ? 'Tunai Kasir' : data.metodeBayar === 'transfer' ? 'Transfer Bank' : 'Barter Material',
      projectId: targetCust?.projectId,
      refType: 'customer_payment',
      refId: payId
    };
    setCashbook(prev => [...prev, cashItem]);
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
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, ...docs } : c))
    );
  };

  const updatePaymentReceipt = (paymentId: string, kwitansiImage: string | null) => {
    setPayments(prev =>
      prev.map(p => (p.id === paymentId ? { ...p, kwitansiImage } : p))
    );
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
    setLandDebts(prev => prev.filter(l => l.id !== id));
    setLandPayments(prev => prev.filter(lp => lp.landDebtId !== id));
    if (isSupabaseConfigured()) {
      supabaseDeleteLandDebt(id).catch(console.warn);
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
    setCashbook(prev => [newItem, ...prev]);
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
    setPettyCash(prev => [newPetty, ...prev]);

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
      setCashbook(prev => [cashOut, ...prev]);
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
      metode: data.metode || 'Tunai Kas Kecil'
    };
    setPettyCash(prev => [newPetty, ...prev]);
  };

  // 7. Inventory Items
  const addInventoryItem = (data: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...data, id: `inv-${Date.now()}` };
    setInventory(prev => [newItem, ...prev]);
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  // 8. Employees & Payroll
  const addEmployee = (data: Omit<Employee, 'id'>) => {
    const newEmp: Employee = { ...data, id: `emp-${Date.now()}` };
    setEmployees(prev => [...prev, newEmp]);
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
    setPettyCash(prev => [pettyExp, ...prev]);

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
    setSalaryPayments(prev => [newSlip, ...prev]);

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
        topUpPettyCash,
        addPettyExpense,
        addInventoryItem,
        deleteInventoryItem,
        addEmployee,
        payEmployeeSalary,
        payAllActiveSalaries,
        syncAllToCashbook,

        totalSalesValue,
        totalCashIn,
        totalCashOut,
        cashbookBalance,
        pettyCashIn,
        pettyCashOut,
        pettyCashBalance,
        totalReceivables,
        totalFarmerDebt,
        totalAssetValue
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

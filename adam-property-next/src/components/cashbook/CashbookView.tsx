'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import ExportButtons from '@/components/common/ExportButtons';
import { 
  Vault, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Briefcase, 
  Search, 
  CheckCircle2, 
  Home, 
  Coins,
  Calendar,
  Filter,
  Layers,
  Receipt,
  X,
  Eye,
  CreditCard,
  Clock,
  Sparkles,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { CashbookItem } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface GroupedCashTransactions {
  monthKey: string;
  monthTitle: string;
  items: CashbookItem[];
  totalIn: number;
  totalOut: number;
  net: number;
}

function formatMonthYear(dateStr: string): string {
  if (!dateStr) return 'Lainnya';
  try {
    const parts = dateStr.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const date = new Date(year, month, 1);
      return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function groupCashByMonth(list: CashbookItem[]): GroupedCashTransactions[] {
  const sorted = [...list].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const groupsMap = new Map<string, CashbookItem[]>();

  for (const item of sorted) {
    const key = item.tanggal ? item.tanggal.substring(0, 7) : 'lainnya';
    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(item);
  }

  const result: GroupedCashTransactions[] = [];
  groupsMap.forEach((items, key) => {
    const totalIn = items.filter(i => i.tipe === 'masuk').reduce((s, i) => s + i.nominal, 0);
    const totalOut = items.filter(i => i.tipe === 'keluar').reduce((s, i) => s + i.nominal, 0);
    result.push({
      monthKey: key,
      monthTitle: key === 'lainnya' ? 'Lainnya' : formatMonthYear(key),
      items,
      totalIn,
      totalOut,
      net: totalIn - totalOut
    });
  });

  return result;
}

export default function CashbookView() {
  const { user, isReadOnly, canManagePayments, canFullAccess } = useAuth();
  const { 
    activeTab,
    setActiveTab,
    projects, 
    cashbook, 
    addCashbookItem, 
    totalCashIn, 
    totalCashOut, 
    cashbookBalance,
    pettyCashBalance,
    totalNonCashBarter
  } = useProperty();

  // Navigation Filter Pills
  const [streamFilter, setStreamFilter] = useState<'all' | 'masuk' | 'keluar' | 'jual_kavling' | 'investor' | 'lahan_petani' | 'operasional'>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'grouped' | 'flat'>('grouped');

  // Modals
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedCashDetail, setSelectedCashDetail] = useState<CashbookItem | null>(null);

  // Form Investor
  const [invNama, setInvNama] = useState('');
  const [invNominal, setInvNominal] = useState(100000000);
  const [invKategori, setInvKategori] = useState('Investasi Modal Awal Proyek');
  const [invMetode, setInvMetode] = useState('Transfer Bank BCA');
  const [invKeterangan, setInvKeterangan] = useState('Penyertaan modal kerja proyek kavling');

  // Form Expense
  const [expKategori, setExpKategori] = useState<CashbookItem['kategori']>('operasional');
  const [expSumber, setExpSumber] = useState('');
  const [expNominal, setExpNominal] = useState(15000000);
  const [expMetode, setExpMetode] = useState('Transfer Bank BCA');
  const [expKeterangan, setExpKeterangan] = useState('');

  // Counters for Quick Pills
  const countAll = cashbook.length;
  const countMasuk = cashbook.filter(c => c.tipe === 'masuk').length;
  const countKeluar = cashbook.filter(c => c.tipe === 'keluar').length;
  const countKavling = cashbook.filter(c => c.kategori === 'jual_kavling').length;
  const countInvestor = cashbook.filter(c => c.kategori === 'investor').length;
  const countPetani = cashbook.filter(c => c.kategori === 'lahan_petani').length;
  const countOperasional = cashbook.filter(c => c.kategori === 'operasional').length;

  // Filtering
  const filteredCash = cashbook.filter(c => {
    let matchStream = true;
    if (streamFilter === 'masuk') matchStream = c.tipe === 'masuk';
    else if (streamFilter === 'keluar') matchStream = c.tipe === 'keluar';
    else if (streamFilter === 'jual_kavling') matchStream = c.kategori === 'jual_kavling';
    else if (streamFilter === 'investor') matchStream = c.kategori === 'investor';
    else if (streamFilter === 'lahan_petani') matchStream = c.kategori === 'lahan_petani';
    else if (streamFilter === 'operasional') matchStream = c.kategori === 'operasional';

    const matchProj = filterProject === 'all' || !c.projectId || c.projectId === filterProject;
    const matchSearch = searchQuery === '' || 
      `${c.sumber} ${c.keterangan} ${c.metode || ''} ${c.kategori}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStream && matchProj && matchSearch;
  });

  const totalLotSales = cashbook
    .filter(c => c.kategori === 'jual_kavling')
    .reduce((sum, c) => sum + c.nominal, 0);

  const totalInvestor = cashbook
    .filter(c => c.kategori === 'investor')
    .reduce((sum, c) => sum + c.nominal, 0);

  // Subtotal for active filter
  const filteredTotalIn = filteredCash.filter(c => c.tipe === 'masuk').reduce((sum, c) => sum + c.nominal, 0);
  const filteredTotalOut = filteredCash.filter(c => c.tipe === 'keluar').reduce((sum, c) => sum + c.nominal, 0);
  const filteredNet = filteredTotalIn - filteredTotalOut;

  // Grouped by Month
  const monthGroups = groupCashByMonth(filteredCash);

  const getExportData = () => ({
    filename: `Laporan-Kas-Besar-${new Date().toISOString().split('T')[0]}`,
    title: 'Buku Kas Besar & Arus Modal Perusahaan',
    subtitle: 'Cluster Baitul Makmur, Jatikerto, Kromengan, Malang',
    category: 'BUKU KAS BESAR (GENERAL LEDGER)',
    headers: ['Tanggal', 'Tipe', 'Kategori', 'Sumber / Pihak', 'Keterangan', 'Nominal (Rp)', 'Metode Transaksi'],
    rows: filteredCash.map(c => [
      c.tanggal,
      c.tipe === 'masuk' ? 'PEMASUKAN' : 'PENGELUARAN',
      c.kategori.toUpperCase(),
      c.sumber,
      c.keterangan,
      `Rp ${c.nominal.toLocaleString('id-ID')}`,
      c.metode || '-'
    ]),
    summary: [
      { label: 'Total Kas Masuk', value: `Rp ${totalCashIn.toLocaleString('id-ID')}` },
      { label: 'Total Kas Keluar', value: `Rp ${totalCashOut.toLocaleString('id-ID')}` },
      { label: 'Saldo Kas Besar', value: `Rp ${cashbookBalance.toLocaleString('id-ID')}` },
      { label: 'Total Transaksi', value: `${filteredCash.length} Transaksi` }
    ]
  });

  const handleInvestorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCashbookItem({
      tanggal: new Date().toISOString().split('T')[0],
      tipe: 'masuk',
      kategori: 'investor',
      sumber: `Investor: ${invNama}`,
      keterangan: `${invKategori}: ${invKeterangan}`,
      nominal: Number(invNominal),
      metode: invMetode,
      rekening: invMetode,
      refType: 'manual'
    });
    setShowInvestorModal(false);
    setInvNama('');
    setInvNominal(100000000);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCashbookItem({
      tanggal: new Date().toISOString().split('T')[0],
      tipe: 'keluar',
      kategori: expKategori,
      sumber: expSumber,
      keterangan: expKeterangan,
      nominal: Number(expNominal),
      metode: expMetode,
      refType: 'manual'
    });
    setShowExpenseModal(false);
    setExpSumber('');
    setExpKeterangan('');
  };

  const renderCategoryBadge = (kategori: string) => {
    switch (kategori) {
      case 'jual_kavling':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">💰 Jual Kavling</span>;
      case 'jual_kavling_barter':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-100 text-amber-900 border border-amber-300">🔄 Barter Material</span>;
      case 'investor':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">🤝 Modal Investor</span>;
      case 'lahan_petani':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-orange-100 text-orange-900 border border-orange-200">🌾 Lahan Petani</span>;
      case 'operasional':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-sky-100 text-sky-800 border border-sky-200">🛠️ Operasional</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">{kategori.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      
      {/* ======================================================== */}
      {/* 1. CENTRAL CASH HUB TOP SWITCHER (KAS BESAR <-> KAS KECIL) */}
      {/* ======================================================== */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-200">
        <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setActiveTab('cashbook')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'cashbook'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Vault className="w-4 h-4 text-emerald-600" />
            <span>Kas Besar Likuid</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Rp {cashbookBalance.toLocaleString('id-ID')}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('pettyCash')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'pettyCash'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Kas Kecil Kantor</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Rp {pettyCashBalance.toLocaleString('id-ID')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nonCash')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'nonCash'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-indigo-600" />
            <span>Rekap Non-Tunai & Barter</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              Rp {totalNonCashBarter.toLocaleString('id-ID')}
            </span>
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 pr-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Navigasi Terpadu: Kas Besar, Kas Kecil, & Rekapitulasi Non-Tunai</span>
        </div>
      </div>

      {/* Management Read-Only Banner */}
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Vault className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <b>Mode Management (Read-Only):</b> Anda memiliki akses memantau seluruh arus kas masuk, pengeluaran kas, dan saldo kas besar. Input transaksi kas baru dikunci.
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 border border-amber-300 rounded-md shrink-0">
            Hanya Lihat
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              General Ledger
            </span>
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Auto-Sync Kas Cloud Aktif
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Vault className="w-5 h-5 text-emerald-600 shrink-0" />
            Buku Kas Besar & Arus Modal
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Sentral likuiditas: Transaksi penerimaan kas tunai & transfer bank resmi tercatat di buku kas ini. (Pembayaran barter tercatat terpisah di Rekap Non-Tunai).
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full md:w-auto justify-between md:justify-end">
          {!isReadOnly && (
            <>
              <button
                onClick={() => setShowInvestorModal(true)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Dana Investor</span>
                <span className="sm:hidden">+ Investor</span>
              </button>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Kas Keluar</span>
                <span className="sm:hidden">+ Keluar</span>
              </button>
            </>
          )}
          <ExportButtons getData={getExportData} />
        </div>
      </div>

      {/* 5 Financial Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-emerald-100">
            <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Total Kas Masuk</p>
            <h3 className="text-xs sm:text-base font-black text-emerald-600 truncate font-mono">
              Rp {totalCashIn.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Penerimaan Real</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-teal-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-teal-100">
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Jual Kavling</p>
            <h3 className="text-xs sm:text-base font-black text-teal-700 truncate font-mono">
              Rp {totalLotSales.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-teal-600 font-medium truncate">Murni Kas & Bank</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-indigo-100">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Modal Investor</p>
            <h3 className="text-xs sm:text-base font-black text-indigo-600 truncate font-mono">
              Rp {totalInvestor.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-indigo-500 font-medium truncate">Suntikan Modal</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-rose-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-rose-100">
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Total Kas Keluar</p>
            <h3 className="text-xs sm:text-base font-black text-rose-600 truncate font-mono">
              Rp {totalCashOut.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Lahan + Operasional</p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-3 sm:p-4 rounded-xl border border-slate-800 text-white shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center text-base sm:text-lg shrink-0 border border-white/20">
            <Vault className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold uppercase truncate">Saldo Kas Besar</p>
            <h3 className="text-xs sm:text-base font-black text-white truncate font-mono">
              Rp {cashbookBalance.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-slate-300 truncate">Likuiditas Sentral</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. INTERACTIVE FILTER PILLS & SEARCH TOOLBAR */}
      {/* ======================================================== */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        
        {/* Horizontal Scrollable Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 px-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kategori:</span>
          </span>

          <button
            type="button"
            onClick={() => setStreamFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>Semua Transaksi</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'all' ? 'bg-white/20 text-white' : 'bg-white text-slate-700'}`}>
              {countAll}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('masuk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'masuk'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span>🟢 Kas Masuk</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'masuk' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
              {countMasuk}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('keluar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'keluar'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <span>🔴 Kas Keluar</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'keluar' ? 'bg-white/20 text-white' : 'bg-rose-200 text-rose-900'}`}>
              {countKeluar}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('jual_kavling')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'jual_kavling'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
            }`}
          >
            <span>💰 Jual Kavling</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'jual_kavling' ? 'bg-white/20 text-white' : 'bg-teal-200 text-teal-900'}`}>
              {countKavling}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nonCash')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200"
            title="Buka Buku Rekapitulasi Non-Tunai & Barter Material"
          >
            <PackageCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Rekap Non-Tunai</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-200 text-indigo-900 font-mono">
              Rp {totalNonCashBarter.toLocaleString('id-ID')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('investor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'investor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
            }`}
          >
            <span>🤝 Investor</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'investor' ? 'bg-white/20 text-white' : 'bg-indigo-200 text-indigo-900'}`}>
              {countInvestor}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('lahan_petani')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'lahan_petani'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200'
            }`}
          >
            <span>🌾 Lahan Petani</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'lahan_petani' ? 'bg-white/20 text-white' : 'bg-orange-200 text-orange-900'}`}>
              {countPetani}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('operasional')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'operasional'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
            }`}
          >
            <span>🛠️ Operasional</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'operasional' ? 'bg-white/20 text-white' : 'bg-sky-200 text-sky-900'}`}>
              {countOperasional}
            </span>
          </button>
        </div>

        {/* Toolbar Pencarian & Filter Proyek */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, rekanan, nomor kavling..."
              className="w-full text-xs border border-slate-200 rounded-xl pl-8 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
            >
              <option value="all">Semua Cluster Lahan</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>

            {/* Layout Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewLayout('grouped')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  viewLayout === 'grouped'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Kelompokkan Berdasarkan Bulan Transaksi"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Per-Bulan</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('flat')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  viewLayout === 'flat'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilkan Semua Baris"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Semua Baris</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Subtotal Strip for Active Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="text-slate-600">
            Menampilkan <b>{filteredCash.length}</b> transaksi
            {streamFilter !== 'all' && (
              <span className="ml-1 text-slate-400">
                (Filter: <b>{streamFilter}</b>)
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono font-bold text-xs">
            <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
              Masuk: + Rp {filteredTotalIn.toLocaleString('id-ID')}
            </span>
            <span className="text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded">
              Keluar: - Rp {filteredTotalOut.toLocaleString('id-ID')}
            </span>
            <span className={`px-2 py-0.5 rounded ${filteredNet >= 0 ? 'bg-slate-200 text-slate-800' : 'bg-rose-200 text-rose-900'}`}>
              Netto: Rp {filteredNet.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TRANSACTION LIST: GROUPED BY MONTH OR FLAT TABLE */}
      {/* ======================================================== */}
      {viewLayout === 'grouped' ? (
        <div className="space-y-6">
          {monthGroups.map((group) => (
            <div key={group.monthKey} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              
              {/* Monthly Statement Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-slate-50/90 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span>{group.monthTitle}</span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {group.items.length} Transaksi
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                    + Rp {group.totalIn.toLocaleString('id-ID')}
                  </span>
                  <span className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                    - Rp {group.totalOut.toLocaleString('id-ID')}
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-lg">
                    Net: Rp {group.net.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-50/40 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 px-4 w-28">Tanggal</th>
                      <th className="py-2.5 px-4">Pihak / Rekanan</th>
                      <th className="py-2.5 px-4">Kategori & Keterangan</th>
                      <th className="py-2.5 px-4">Metode Bayar</th>
                      <th className="py-2.5 px-4 text-right">Uang Masuk</th>
                      <th className="py-2.5 px-4 text-right">Uang Keluar</th>
                      <th className="py-2.5 px-3 text-center w-16">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {group.items.map((item) => {
                      const isMasuk = item.tipe === 'masuk';
                      const isBarter = item.kategori === 'jual_kavling_barter';

                      return (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedCashDetail(item)}
                          className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{formatDisplayDate(item.tanggal)}</div>
                            <span className="text-[10px] text-slate-400">{item.tanggal}</span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${isMasuk ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{item.sumber}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="mb-1">{renderCategoryBadge(item.kategori)}</div>
                            <span className="text-slate-600 line-clamp-1">{item.keterangan}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono">
                              {item.metode || 'Transfer Bank'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                            {isMasuk ? `+ Rp ${item.nominal.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 whitespace-nowrap">
                            {!isMasuk ? `- Rp ${item.nominal.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCashDetail(item);
                              }}
                              className="p-1 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100/60 rounded-md transition"
                              title="Lihat Slip Voucher Kas"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat View Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Pihak / Rekanan</th>
                  <th className="py-3 px-4">Kategori & Keterangan</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4 text-right">Uang Masuk</th>
                  <th className="py-3 px-4 text-right">Uang Keluar</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCash.map((item) => {
                  const isMasuk = item.tipe === 'masuk';

                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedCashDetail(item)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{formatDisplayDate(item.tanggal)}</div>
                        <span className="text-[10px] text-slate-400">{item.tanggal}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{item.sumber}</td>
                      <td className="py-3 px-4">
                        <div className="mb-1">{renderCategoryBadge(item.kategori)}</div>
                        <span className="text-slate-600">{item.keterangan}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono">
                          {item.metode || 'Transfer Bank'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                        {isMasuk ? `+ Rp ${item.nominal.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 whitespace-nowrap">
                        {!isMasuk ? `- Rp ${item.nominal.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCashDetail(item);
                          }}
                          className="p-1 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100/60 rounded-md transition"
                          title="Lihat Slip Voucher Kas"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredCash.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Vault className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">Tidak Ada Transaksi Ditemukan</h3>
          <p className="text-xs text-slate-500 mb-4">Coba sesuaikan kata kunci pencarian atau ubah filter kategori di atas.</p>
          <button
            onClick={() => {
              setStreamFilter('all');
              setSearchQuery('');
              setFilterProject('all');
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL DETAIL VOUCHER KAS DIGITAL (KLIK DETAIL ROW) */}
      {/* ======================================================== */}
      {selectedCashDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            
            {/* Header Voucher */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Bukti Transaksi Kas Masuk / Keluar
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Voucher Kas: {selectedCashDetail.id}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCashDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Content */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Nominal Transaksi:</span>
                  <span className={`text-lg font-black font-mono ${selectedCashDetail.tipe === 'masuk' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedCashDetail.tipe === 'masuk' ? '+' : '-'} Rp {selectedCashDetail.nominal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedCashDetail.tipe === 'masuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedCashDetail.tipe === 'masuk' ? '🟢 Kas Masuk' : '🔴 Kas Keluar'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Tanggal Pencatatan:</span>
                  <span className="font-bold text-slate-900">{formatDisplayDate(selectedCashDetail.tanggal)}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Metode Pembayaran:</span>
                  <span className="font-bold text-slate-900">{selectedCashDetail.metode || 'Transfer Bank'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Pihak / Sumber / Rekanan:</span>
                <span className="font-extrabold text-slate-900 text-sm">{selectedCashDetail.sumber}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Kategori Akun Kas:</span>
                <div className="mt-1">{renderCategoryBadge(selectedCashDetail.kategori)}</div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Keterangan / Uraian Transaksi:</span>
                <p className="font-medium text-slate-800 whitespace-pre-line mt-0.5">
                  {selectedCashDetail.keterangan}
                </p>
              </div>

              {selectedCashDetail.refType && (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-mono">
                  Sistem Ref: {selectedCashDetail.refType} &bull; ID: {selectedCashDetail.refId || '-'}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCashDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Tutup Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catat Dana Investor */}
      {showInvestorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>+ Catat Dana Masuk Investor / Pemodal</span>
            </h3>

            <form onSubmit={handleInvestorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Investor *</label>
                <input
                  type="text"
                  required
                  value={invNama}
                  onChange={(e) => setInvNama(e.target.value)}
                  placeholder="Contoh: Bpk. H. Mahmud"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nominal Investasi (Rp) *</label>
                <input
                  type="number"
                  required
                  value={invNominal}
                  onChange={(e) => setInvNominal(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-indigo-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tujuan / Skema</label>
                  <select
                    value={invKategori}
                    onChange={(e) => setInvKategori(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Investasi Modal Awal Proyek">Modal Awal Proyek</option>
                    <option value="Suntikan Modal Kerja Tambahan">Modal Kerja Tambahan</option>
                    <option value="Dana Pembebasan Lahan">Pembebasan Lahan</option>
                    <option value="Bagi Hasil Modal Rekening">Bagi Hasil / Profit Sharing</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Metode Setoran</label>
                  <input
                    type="text"
                    value={invMetode}
                    onChange={(e) => setInvMetode(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={invKeterangan}
                  onChange={(e) => setInvKeterangan(e.target.value)}
                  placeholder="Tenor 18 bulan, bagi hasil 15%..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInvestorModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Simpan Setoran Modal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Catat Kas Keluar */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-600" />
              <span>+ Catat Pengeluaran Kas Besar</span>
            </h3>

            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Penerima Dana / Vendor *</label>
                <input
                  type="text"
                  required
                  value={expSumber}
                  onChange={(e) => setExpSumber(e.target.value)}
                  placeholder="Contoh: PT Citra Mandiri Alat Berat / Kantor Notaris"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Pengeluaran</label>
                  <select
                    value={expKategori}
                    onChange={(e) => setExpKategori(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="operasional">Operasional Proyek / Alat Berat</option>
                    <option value="lahan_petani">Pembebasan Lahan</option>
                    <option value="lainnya">Lain-lain</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={expNominal}
                    onChange={(e) => setExpNominal(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan Biaya</label>
                <textarea
                  rows={2}
                  value={expKeterangan}
                  onChange={(e) => setExpKeterangan(e.target.value)}
                  placeholder="Biaya sewa excavator, perataan jalan, dll..."
                  className="w-full border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Simpan Kas Keluar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import ExportButtons from '@/components/common/ExportButtons';
import { 
  Coins, 
  Vault,
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShoppingCart, 
  Search, 
  Fuel, 
  Coffee, 
  Paperclip, 
  Users,
  Calendar,
  Filter,
  Layers,
  Receipt,
  Eye,
  X,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { PettyCashItem } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface GroupedPettyTransactions {
  monthKey: string;
  monthTitle: string;
  items: PettyCashItem[];
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

function groupPettyByMonth(list: PettyCashItem[]): GroupedPettyTransactions[] {
  const sorted = [...list].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const groupsMap = new Map<string, PettyCashItem[]>();

  for (const item of sorted) {
    const key = item.tanggal ? item.tanggal.substring(0, 7) : 'lainnya';
    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(item);
  }

  const result: GroupedPettyTransactions[] = [];
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

export default function PettyCashView() {
  const { user, isReadOnly, canManagePayments, canFullAccess } = useAuth();
  const { 
    activeTab,
    setActiveTab,
    pettyCash, 
    topUpPettyCash, 
    addPettyExpense, 
    pettyCashIn, 
    pettyCashOut, 
    pettyCashBalance,
    cashbookBalance,
    totalNonCashBarter
  } = useProperty();

  // Navigation Filter Pills
  const [streamFilter, setStreamFilter] = useState<'all' | 'masuk' | 'keluar' | 'atk' | 'bensin' | 'konsumsi' | 'gaji_karyawan' | 'lainnya'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'grouped' | 'flat'>('grouped');

  // Modals
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedPettyDetail, setSelectedPettyDetail] = useState<PettyCashItem | null>(null);

  // Form Top Up
  const [topupNominal, setTopupNominal] = useState(5000000);
  const [topupSumber, setTopupSumber] = useState<'kas_besar' | 'investor'>('kas_besar');
  const [topupPenerima, setTopupPenerima] = useState('Kasir Kantor Operasional');
  const [topupKet, setTopupKet] = useState('Top Up Dana Kas Kecil Operasional Harian');

  // Form Belanja Harian
  const [expKategori, setExpKategori] = useState<PettyCashItem['kategori']>('atk');
  const [expPenerima, setExpPenerima] = useState('');
  const [expNominal, setExpNominal] = useState(250000);
  const [expKeterangan, setExpKeterangan] = useState('');

  // Counters for Quick Filter Pills
  const countAll = pettyCash.length;
  const countMasuk = pettyCash.filter(p => p.tipe === 'masuk').length;
  const countKeluar = pettyCash.filter(p => p.tipe === 'keluar').length;
  const countAtk = pettyCash.filter(p => p.kategori === 'atk').length;
  const countBensin = pettyCash.filter(p => p.kategori === 'bensin').length;
  const countKonsumsi = pettyCash.filter(p => p.kategori === 'konsumsi').length;
  const countGaji = pettyCash.filter(p => p.kategori === 'gaji_karyawan').length;

  const filteredPetty = pettyCash.filter(p => {
    let matchStream = true;
    if (streamFilter === 'masuk') matchStream = p.tipe === 'masuk';
    else if (streamFilter === 'keluar') matchStream = p.tipe === 'keluar';
    else if (streamFilter === 'atk') matchStream = p.kategori === 'atk';
    else if (streamFilter === 'bensin') matchStream = p.kategori === 'bensin';
    else if (streamFilter === 'konsumsi') matchStream = p.kategori === 'konsumsi';
    else if (streamFilter === 'gaji_karyawan') matchStream = p.kategori === 'gaji_karyawan';
    else if (streamFilter === 'lainnya') matchStream = p.kategori === 'lainnya';

    const matchSearch = searchQuery === '' || 
      `${p.penerima || ''} ${p.keterangan} ${p.kategori}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStream && matchSearch;
  });

  const totalPayrollFromPetty = pettyCash
    .filter(p => p.kategori === 'gaji_karyawan')
    .reduce((sum, p) => sum + p.nominal, 0);

  // Subtotal for active filter
  const filteredTotalIn = filteredPetty.filter(p => p.tipe === 'masuk').reduce((sum, p) => sum + p.nominal, 0);
  const filteredTotalOut = filteredPetty.filter(p => p.tipe === 'keluar').reduce((sum, p) => sum + p.nominal, 0);
  const filteredNet = filteredTotalIn - filteredTotalOut;

  // Monthly Grouping
  const monthGroups = groupPettyByMonth(filteredPetty);

  const getExportData = () => ({
    filename: `Laporan-Kas-Kecil-${new Date().toISOString().split('T')[0]}`,
    title: 'Buku Kas Kecil Kantor (Petty Cash)',
    subtitle: 'Cluster Baitul Makmur, Jatikerto, Kromengan, Malang',
    category: 'BUKU KAS KECIL OPERASIONAL',
    headers: ['Tanggal', 'Tipe', 'Kategori', 'Penerima / Toko', 'Keterangan', 'Nominal (Rp)', 'Sumber Dana'],
    rows: filteredPetty.map(p => [
      p.tanggal,
      p.tipe === 'masuk' ? 'TOP UP MASUK' : 'PENGELUARAN',
      p.kategori.toUpperCase(),
      p.penerima || '-',
      p.keterangan,
      `Rp ${p.nominal.toLocaleString('id-ID')}`,
      p.sumberDana || 'Kas Besar'
    ]),
    summary: [
      { label: 'Total Top Up Masuk', value: `Rp ${pettyCashIn.toLocaleString('id-ID')}` },
      { label: 'Total Pengeluaran Kasir', value: `Rp ${pettyCashOut.toLocaleString('id-ID')}` },
      { label: 'Saldo Kas Kecil Fisik', value: `Rp ${pettyCashBalance.toLocaleString('id-ID')}` },
      { label: 'Jumlah Transaksi', value: `${filteredPetty.length} Transaksi` }
    ]
  });

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    topUpPettyCash(Number(topupNominal), topupSumber, topupKet, topupPenerima);
    setShowTopupModal(false);
    alert('Top up kas kecil berhasil disimpan dan tersinkronisasi ke server!');
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPettyExpense({
      kategori: expKategori,
      penerima: expPenerima,
      keterangan: expKeterangan,
      nominal: Number(expNominal)
    });
    setShowExpenseModal(false);
    setExpPenerima('');
    setExpKeterangan('');
    alert('Pengeluaran kas kecil berhasil dicatat dan tersimpan!');
  };

  const renderPettyCategoryBadge = (kategori: string) => {
    switch (kategori) {
      case 'atk':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-100 text-blue-800 border border-blue-200">📄 ATK Kantor</span>;
      case 'bensin':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-100 text-amber-900 border border-amber-300">⛽ Bensin & Survey</span>;
      case 'konsumsi':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">☕ Konsumsi & Tamu</span>;
      case 'gaji_karyawan':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">👥 Gaji Staf</span>;
      case 'topup_kas_besar':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-100 text-purple-800 border border-purple-200">🏛️ Top Up Kas Besar</span>;
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
            <Coins className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <b>Mode Management (Read-Only):</b> Anda memiliki akses memantau mutasi kas kecil operasional, bon belanja, dan saldo fisik. Input pengeluaran baru dikunci.
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
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              Petty Cash
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
              Operasional Harian Kantor
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-violet-600 shrink-0" />
            Buku Kas Kecil Kantor (Petty Cash)
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Pengelolaan dana kasir operasional: ATK, konsumsi, bensin survey lahan, utilitas, dan payroll gaji karyawan.
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full md:w-auto justify-between md:justify-end">
          {!isReadOnly && (
            <>
              <button
                onClick={() => setShowTopupModal(true)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Top Up Kas Kecil</span>
                <span className="sm:hidden">+ Top Up</span>
              </button>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Belanja Harian</span>
                <span className="sm:hidden">+ Belanja</span>
              </button>
            </>
          )}
          <ExportButtons getData={getExportData} />
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 text-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold text-violet-400 uppercase tracking-wider text-[10px] sm:text-xs">Saldo Kas Kecil Fisik</span>
              <Coins className="w-4 h-4 text-violet-400 shrink-0" />
            </div>
            <h3 className="text-base sm:text-2xl font-black text-white font-mono truncate">
              Rp {pettyCashBalance.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-white/10 text-[9px] sm:text-[10px] text-slate-300 truncate">
            Tersedia di brankas kasir
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-violet-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-violet-100">
            <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Top Up Masuk</p>
            <h3 className="text-xs sm:text-base font-black text-violet-700 truncate font-mono">
              Rp {pettyCashIn.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Dari Kas Besar</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-rose-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-rose-100">
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Belanja Keluar</p>
            <h3 className="text-xs sm:text-base font-black text-rose-600 truncate font-mono">
              Rp {pettyCashOut.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Operasional + Gaji</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-indigo-100">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Gaji dari Petty</p>
            <h3 className="text-xs sm:text-base font-black text-indigo-600 truncate font-mono">
              Rp {totalPayrollFromPetty.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-indigo-500 font-medium truncate">Payroll Staf</p>
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
            <Filter className="w-3.5 h-3.5 text-violet-600" />
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
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200'
            }`}
          >
            <span>🟢 Top Up Masuk</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'masuk' ? 'bg-white/20 text-white' : 'bg-violet-200 text-violet-900'}`}>
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
            <span>🔴 Belanja Keluar</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'keluar' ? 'bg-white/20 text-white' : 'bg-rose-200 text-rose-900'}`}>
              {countKeluar}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('atk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'atk'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            <span>📄 ATK Kantor</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'atk' ? 'bg-white/20 text-white' : 'bg-blue-200 text-blue-900'}`}>
              {countAtk}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('bensin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'bensin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            <span>⛽ Bensin & Survey</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'bensin' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'}`}>
              {countBensin}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('konsumsi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'konsumsi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span>☕ Konsumsi & Tamu</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'konsumsi' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
              {countKonsumsi}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStreamFilter('gaji_karyawan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              streamFilter === 'gaji_karyawan'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
            }`}
          >
            <span>👥 Gaji Staf</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${streamFilter === 'gaji_karyawan' ? 'bg-white/20 text-white' : 'bg-indigo-200 text-indigo-900'}`}>
              {countGaji}
            </span>
          </button>
        </div>

        {/* Toolbar Pencarian & Layout Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penerima, toko, keperluan..."
              className="w-full text-xs border border-slate-200 rounded-xl pl-8 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

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

        {/* Live Subtotal Strip for Active Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="text-slate-600">
            Menampilkan <b>{filteredPetty.length}</b> transaksi
            {streamFilter !== 'all' && (
              <span className="ml-1 text-slate-400">
                (Filter: <b>{streamFilter}</b>)
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono font-bold text-xs">
            <span className="text-violet-700 bg-violet-100/60 px-2 py-0.5 rounded">
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
                  <span className="w-8 h-8 rounded-xl bg-violet-900 text-white flex items-center justify-center font-bold text-xs">
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
                  <span className="px-2 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg">
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
                      <th className="py-2.5 px-4">Penerima / Toko</th>
                      <th className="py-2.5 px-4">Kategori & Keterangan</th>
                      <th className="py-2.5 px-4 text-right">Top Up Masuk</th>
                      <th className="py-2.5 px-4 text-right">Belanja Keluar</th>
                      <th className="py-2.5 px-3 text-center w-16">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {group.items.map((item) => {
                      const isMasuk = item.tipe === 'masuk';

                      return (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedPettyDetail(item)}
                          className="hover:bg-violet-50/40 transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{formatDisplayDate(item.tanggal)}</div>
                            <span className="text-[10px] text-slate-400">{item.tanggal}</span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${isMasuk ? 'bg-violet-500' : 'bg-rose-500'}`} />
                              <span>{item.penerima || '-'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="mb-1">{renderPettyCategoryBadge(item.kategori)}</div>
                            <span className="text-slate-600 line-clamp-1">{item.keterangan}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-violet-700 whitespace-nowrap">
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
                                setSelectedPettyDetail(item);
                              }}
                              className="p-1 text-slate-400 group-hover:text-violet-600 group-hover:bg-violet-100/60 rounded-md transition"
                              title="Lihat Slip Voucher Kas Kecil"
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
                  <th className="py-3 px-4">Penerima / Toko</th>
                  <th className="py-3 px-4">Kategori & Keterangan</th>
                  <th className="py-3 px-4 text-right">Top Up Masuk</th>
                  <th className="py-3 px-4 text-right">Belanja Keluar</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPetty.map((item) => {
                  const isMasuk = item.tipe === 'masuk';

                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedPettyDetail(item)}
                      className="hover:bg-violet-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{formatDisplayDate(item.tanggal)}</div>
                        <span className="text-[10px] text-slate-400">{item.tanggal}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{item.penerima || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="mb-1">{renderPettyCategoryBadge(item.kategori)}</div>
                        <span className="text-slate-600">{item.keterangan}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-violet-700 whitespace-nowrap">
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
                            setSelectedPettyDetail(item);
                          }}
                          className="p-1 text-slate-400 group-hover:text-violet-600 group-hover:bg-violet-100/60 rounded-md transition"
                          title="Lihat Slip Voucher Kas Kecil"
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

      {filteredPetty.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">Tidak Ada Transaksi Kas Kecil Ditemukan</h3>
          <p className="text-xs text-slate-500 mb-4">Coba sesuaikan kata kunci pencarian atau ubah filter kategori di atas.</p>
          <button
            onClick={() => {
              setStreamFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL DETAIL VOUCHER KAS KECIL DIGITAL */}
      {/* ======================================================== */}
      {selectedPettyDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            
            {/* Header Voucher */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Bukti Kas Kecil Operasional
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-violet-600" />
                  <span>Voucher Petty Cash: {selectedPettyDetail.id}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPettyDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Content */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Nominal Pengeluaran:</span>
                  <span className={`text-lg font-black font-mono ${selectedPettyDetail.tipe === 'masuk' ? 'text-violet-700' : 'text-rose-700'}`}>
                    {selectedPettyDetail.tipe === 'masuk' ? '+' : '-'} Rp {selectedPettyDetail.nominal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedPettyDetail.tipe === 'masuk' ? 'bg-violet-100 text-violet-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedPettyDetail.tipe === 'masuk' ? '🟢 Top Up Masuk' : '🔴 Belanja Kasir'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Tanggal Bon / Bukti:</span>
                  <span className="font-bold text-slate-900">{formatDisplayDate(selectedPettyDetail.tanggal)}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Sumber Dana:</span>
                  <span className="font-bold text-slate-900">{selectedPettyDetail.sumberDana || 'Kas Besar'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Penerima / Toko / Kasir:</span>
                <span className="font-extrabold text-slate-900 text-sm">{selectedPettyDetail.penerima || '-'}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Kategori Belanja:</span>
                <div className="mt-1">{renderPettyCategoryBadge(selectedPettyDetail.kategori)}</div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Uraian / Keperluan Belanja:</span>
                <p className="font-medium text-slate-800 whitespace-pre-line mt-0.5">
                  {selectedPettyDetail.keterangan}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPettyDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Tutup Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Top Up Kas Kecil */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-violet-600" />
              <span>+ Top Up Dana Kas Kecil Kantor</span>
            </h3>

            <form onSubmit={handleTopupSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sumber Dana *</label>
                  <select
                    value={topupSumber}
                    onChange={(e) => setTopupSumber(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="kas_besar">Tarik dari Kas Besar (Auto-Mirror)</option>
                    <option value="investor">Langsung dari Investor</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nominal Top Up (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={topupNominal}
                    onChange={(e) => setTopupNominal(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-violet-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kasir / Penerima *</label>
                <input
                  type="text"
                  required
                  value={topupPenerima}
                  onChange={(e) => setTopupPenerima(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan Top Up</label>
                <input
                  type="text"
                  value={topupKet}
                  onChange={(e) => setTopupKet(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Simpan Top Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Belanja Harian */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-rose-600" />
              <span>+ Catat Belanja Harian Kasir</span>
            </h3>

            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Biaya *</label>
                  <select
                    value={expKategori}
                    onChange={(e) => setExpKategori(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="atk">ATK & Fotocopy</option>
                    <option value="bensin">Bensin & Transport</option>
                    <option value="konsumsi">Konsumsi & Tamu</option>
                    <option value="gaji_karyawan">Gaji Tukang / Staf</option>
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
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-rose-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Toko / Penerima *</label>
                <input
                  type="text"
                  required
                  value={expPenerima}
                  onChange={(e) => setExpPenerima(e.target.value)}
                  placeholder="Contoh: Toko Buku Anugerah / SPBU Kromengan"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan / Keperluan *</label>
                <textarea
                  rows={2}
                  required
                  value={expKeterangan}
                  onChange={(e) => setExpKeterangan(e.target.value)}
                  placeholder="Beli kertas F4 2 rim, bolpoin, map snelhechter..."
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
                  Simpan Belanja Kasir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

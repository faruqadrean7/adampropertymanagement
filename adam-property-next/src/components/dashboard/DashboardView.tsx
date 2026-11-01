'use client';

import React from 'react';
import { useProperty } from '@/context/PropertyContext';
import { CashbookItem } from '@/types';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Tractor, 
  PieChart as PieIcon, 
  Vault, 
  Building2, 
  RotateCw, 
  Printer, 
  ArrowUpRight, 
  ArrowDownLeft 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardView() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    kavlings,
    totalSalesValue,
    totalCashIn,
    totalReceivables,
    totalFarmerDebt,
    cashbook,
    cashbookBalance,
    pettyCashBalance,
    totalAssetValue
  } = useProperty();

  const filteredLots = kavlings.filter(
    k => selectedProjectId === 'all' || k.projectId === selectedProjectId
  );

  const soldCount = filteredLots.filter(k => k.status === 'terjual').length;
  const bookingCount = filteredLots.filter(k => k.status === 'booking').length;
  const openCount = filteredLots.filter(k => k.status === 'terbuka').length;
  const totalCount = filteredLots.length;
  const occupancyRate = totalCount > 0 ? Math.round(((soldCount + bookingCount) / totalCount) * 100) : 0;

  const totalLiquidity = cashbookBalance + pettyCashBalance;

  // Dynamically compute the last 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const now = new Date();
  const recentMonths: { label: string; year: number; month: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    recentMonths.push({
      label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      year: d.getFullYear(),
      month: d.getMonth()
    });
  }

  // Monthly aggregated numbers from cashbook & sales
  const cashInMonthly = recentMonths.map(m => {
    return cashbook
      .filter((c: CashbookItem) => {
        if (c.tipe !== 'masuk') return false;
        if (selectedProjectId !== 'all' && c.projectId && c.projectId !== selectedProjectId) return false;
        if (!c.tanggal) return false;
        const d = new Date(c.tanggal);
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      })
      .reduce((sum: number, c: CashbookItem) => sum + c.nominal, 0);
  });

  const cashOutMonthly = recentMonths.map(m => {
    return cashbook
      .filter((c: CashbookItem) => {
        if (c.tipe !== 'keluar') return false;
        if (selectedProjectId !== 'all' && c.projectId && c.projectId !== selectedProjectId) return false;
        if (!c.tanggal) return false;
        const d = new Date(c.tanggal);
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      })
      .reduce((sum: number, c: CashbookItem) => sum + c.nominal, 0);
  });

  const salesMonthly = recentMonths.map(m => {
    if (kavlings.length === 0) return 0;
    return kavlings
      .filter(k => k.status !== 'terbuka' && (selectedProjectId === 'all' || k.projectId === selectedProjectId))
      .reduce((sum: number, k) => sum + k.harga, 0);
  });

  // Chart 1 Data: Bar Trend
  const barData = {
    labels: recentMonths.map(m => m.label),
    datasets: [
      {
        label: 'Omzet Penjualan (Rp)',
        data: salesMonthly,
        backgroundColor: '#10b981',
        borderRadius: 6
      },
      {
        label: 'Kas Masuk Real (Rp)',
        data: cashInMonthly,
        backgroundColor: '#3b82f6',
        borderRadius: 6
      },
      {
        label: 'Pengeluaran Kas (Rp)',
        data: cashOutMonthly,
        backgroundColor: '#f43f5e',
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 12, font: { size: 11, family: 'Plus Jakarta Sans' } }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `Rp ${(value / 1000000).toFixed(0)} Jt`,
          font: { size: 10 }
        },
        grid: { color: '#f1f5f9' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  };

  // Chart 2 Data: Doughnut
  const doughnutData = {
    labels: ['Terjual', 'Booking (DP)', 'Terbuka (Ready)'],
    datasets: [
      {
        data: [soldCount, bookingCount, openCount],
        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-400/30">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">Executive Business Analytics</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Next.js Edition
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Monitoring penjualan kavling, arus kas likuiditas, piutang customer, kewajiban tanah petani & valuasi aset.
          </p>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="text-slate-900 font-semibold">Semua Lahan Proyek</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="text-slate-900 font-semibold">{p.nama}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button 
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* KPI 1: Omzet Penjualan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-bold uppercase tracking-wider text-slate-500">Omzet Penjualan</span>
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900 font-mono tracking-tight">
              Rp {totalSalesValue.toLocaleString('id-ID')}
            </h4>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 truncate">
            {soldCount + bookingCount} Unit Terjual/Booking
          </div>
        </div>

        {/* KPI 2: Kas Masuk Real */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-300 transition">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-bold uppercase tracking-wider text-teal-700">Kas Masuk Real</span>
              <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-black text-teal-700 font-mono tracking-tight">
              Rp {totalCashIn.toLocaleString('id-ID')}
            </h4>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-teal-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> DP & Modal Investor
          </div>
        </div>

        {/* KPI 3: Piutang Berjalan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-300 transition">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-bold uppercase tracking-wider text-amber-700">Piutang Berjalan</span>
              <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-black text-amber-600 font-mono tracking-tight">
              Rp {totalReceivables.toLocaleString('id-ID')}
            </h4>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 truncate">
            Sisa cicilan customer
          </div>
        </div>

        {/* KPI 4: Hutang ke Petani */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-rose-300 transition">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-bold uppercase tracking-wider text-rose-700">Hutang Petani</span>
              <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs">
                <Tractor className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-black text-rose-600 font-mono tracking-tight">
              Rp {totalFarmerDebt.toLocaleString('id-ID')}
            </h4>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-rose-600 font-semibold truncate">
            Kewajiban tanah mentah
          </div>
        </div>

        {/* KPI 5: Okupansi Kavling */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-bold uppercase tracking-wider text-indigo-700">Okupansi Kavling</span>
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                <PieIcon className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-black text-indigo-600 font-mono tracking-tight">
              {occupancyRate}%
            </h4>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 truncate">
            {soldCount} Terjual • {openCount} Terbuka
          </div>
        </div>

        {/* KPI 6: Kas Likuid Total */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 p-4 rounded-2xl border border-slate-800 text-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-bold uppercase tracking-wider text-emerald-400">Total Kas Likuid</span>
              <span className="w-6 h-6 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center text-xs">
                <Vault className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-black text-emerald-300 font-mono tracking-tight">
              Rp {totalLiquidity.toLocaleString('id-ID')}
            </h4>
          </div>
          <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-slate-300 truncate">
            Kas Besar + Kas Kecil
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trend Penjualan Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Tren Penjualan & Realisasi Uang Masuk</span>
              </h3>
              <p className="text-[11px] text-slate-500">Perbandingan omzet penjualan vs kas masuk dan belanja per bulan</p>
            </div>
          </div>
          <div className="relative w-full h-[280px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Status Stok Kavling (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-3 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              <span>Status Stok Unit Kavling</span>
            </h3>
            <p className="text-[11px] text-slate-500">Rasio kavling Terjual, Booking, dan Terbuka</p>
          </div>
          {totalCount > 0 ? (
            <div className="relative w-full h-[210px] flex items-center justify-center">
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
          ) : (
            <div className="h-[210px] flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <PieIcon className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">Belum Ada Unit Kavling</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                Mulai dengan membuat induk proyek & menambahkan unit kavling baru.
              </p>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Terjual Lunas:</span>
              <span className="font-bold text-slate-900 font-mono">{soldCount} unit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Booking (DP):</span>
              <span className="font-bold text-slate-900 font-mono">{bookingCount} unit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Siap Jual (Open):</span>
              <span className="font-bold text-slate-900 font-mono">{openCount} unit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset & Financial Health Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Saldo Kas Besar</p>
            <h4 className="text-lg font-bold text-emerald-700 font-mono">
              Rp {cashbookBalance.toLocaleString('id-ID')}
            </h4>
            <p className="text-[10px] text-slate-400">Modal Investor & Penjualan</p>
          </div>
          <Vault className="w-8 h-8 text-emerald-500/20" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Saldo Kas Kecil</p>
            <h4 className="text-lg font-bold text-violet-700 font-mono">
              Rp {pettyCashBalance.toLocaleString('id-ID')}
            </h4>
            <p className="text-[10px] text-slate-400">Operasional & Gaji Staff</p>
          </div>
          <ArrowUpRight className="w-8 h-8 text-violet-500/20" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Nilai Aktiva Tetap (Aset)</p>
            <h4 className="text-lg font-bold text-rose-700 font-mono">
              Rp {totalAssetValue.toLocaleString('id-ID')}
            </h4>
            <p className="text-[10px] text-slate-400">Peralatan Kantor, Theodolite & Laptop</p>
          </div>
          <Building2 className="w-8 h-8 text-rose-500/20" />
        </div>
      </div>
    </div>
  );
}

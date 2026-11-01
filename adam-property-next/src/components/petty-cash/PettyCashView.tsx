'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import ExportButtons from '@/components/common/ExportButtons';
import { 
  Coins, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShoppingCart, 
  Search, 
  Fuel, 
  Coffee, 
  Paperclip, 
  Users 
} from 'lucide-react';
import { PettyCashItem } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function PettyCashView() {
  const { user, isReadOnly, canManagePayments, canFullAccess } = useAuth();
  const { 
    pettyCash, 
    topUpPettyCash, 
    addPettyExpense, 
    pettyCashIn, 
    pettyCashOut, 
    pettyCashBalance 
  } = useProperty();

  const [filterCat, setFilterCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

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

  const filteredPetty = pettyCash.filter(p => {
    const matchCat = filterCat === 'all' || p.kategori === filterCat;
    const matchSearch = `${p.penerima} ${p.keterangan}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPayrollFromPetty = pettyCash
    .filter(p => p.kategori === 'gaji_karyawan')
    .reduce((sum, p) => sum + p.nominal, 0);

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
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
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
              Operasional Harian
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 shrink-0" />
            Buku Kas Kecil Kantor (Petty Cash)
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
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
            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Kas Besar/Investor</p>
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari penerima / keperluan..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterCat('all')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition text-xs shrink-0 ${filterCat === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterCat('atk')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition text-xs shrink-0 ${filterCat === 'atk' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            ATK
          </button>
          <button
            onClick={() => setFilterCat('bensin')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition text-xs shrink-0 ${filterCat === 'bensin' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Bensin
          </button>
          <button
            onClick={() => setFilterCat('konsumsi')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition text-xs shrink-0 ${filterCat === 'konsumsi' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Konsumsi
          </button>
          <button
            onClick={() => setFilterCat('gaji_karyawan')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition text-xs shrink-0 ${filterCat === 'gaji_karyawan' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Gaji
          </button>
        </div>
      </div>

      {/* Petty Cash Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Penerima / Toko</th>
                <th className="py-3 px-4">Kategori & Keterangan</th>
                <th className="py-3 px-4 text-right">Top Up Masuk</th>
                <th className="py-3 px-4 text-right">Belanja Keluar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPetty.map((item) => {
                const isMasuk = item.tipe === 'masuk';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600">{item.tanggal}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.penerima}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-violet-50 text-violet-800 border border-violet-200 block w-max mb-1">
                        {item.kategori.replace('_', ' ')}
                      </span>
                      <span className="text-slate-600">{item.keterangan}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {isMasuk ? `+ Rp ${item.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {!isMasuk ? `- Rp ${item.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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

              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800 text-[11px]">
                ℹ️ Jika sumber dari <b>Kas Besar</b>, sistem akan otomatis mencatat pengeluaran di Buku Kas Besar secara sinkron.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Top Up Dana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Catat Belanja Harian */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-rose-600" />
              <span>+ Catat Belanja Harian Kas Kecil</span>
            </h3>

            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Pengeluaran *</label>
                  <select
                    value={expKategori}
                    onChange={(e) => setExpKategori(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="atk">ATK, Kertas, Materai & Fotocopy</option>
                    <option value="bensin">Bensin Mobil/Motor Operasional</option>
                    <option value="konsumsi">Konsumsi, Snack, Makan Rapat</option>
                    <option value="utilitas">Listrik, PDAM, Internet Kantor</option>
                    <option value="kebersihan">Kebersihan & Perlengkapan</option>
                    <option value="lainnya">Lain-lain</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nominal Belanja (Rp) *</label>
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
                <label className="font-bold text-slate-700 block mb-1">Toko / Vendor / Penerima *</label>
                <input
                  type="text"
                  required
                  value={expPenerima}
                  onChange={(e) => setExpPenerima(e.target.value)}
                  placeholder="Contoh: Toko Buku Karunia / SPBU Kaliwungu"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rincian Barang yang Dibeli *</label>
                <textarea
                  rows={2}
                  required
                  value={expKeterangan}
                  onChange={(e) => setExpKeterangan(e.target.value)}
                  placeholder="Kertas HVS 2 rim, materai 10rb 5 lembar, spidol..."
                  className="w-full border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Pengeluaran Kas Kecil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

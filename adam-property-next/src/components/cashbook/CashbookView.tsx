'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import { 
  Vault, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Briefcase, 
  Printer, 
  Search, 
  CheckCircle2, 
  Home, 
  Building2 
} from 'lucide-react';
import { CashbookItem } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function CashbookView() {
  const { user, isReadOnly, canManagePayments, canFullAccess } = useAuth();
  const { 
    projects, 
    cashbook, 
    addCashbookItem, 
    totalCashIn, 
    totalCashOut, 
    cashbookBalance 
  } = useProperty();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTipe, setFilterTipe] = useState<'all' | 'masuk' | 'keluar'>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

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

  // Filtering
  const filteredCash = cashbook.filter(c => {
    const matchCat = filterCategory === 'all' || c.kategori === filterCategory;
    const matchTipe = filterTipe === 'all' || c.tipe === filterTipe;
    const matchProj = filterProject === 'all' || !c.projectId || c.projectId === filterProject;
    const matchSearch = `${c.sumber} ${c.keterangan} ${c.metode}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchTipe && matchProj && matchSearch;
  });

  const totalLotSales = cashbook
    .filter(c => c.kategori === 'jual_kavling' || c.kategori === 'jual_kavling_barter')
    .reduce((sum, c) => sum + c.nominal, 0);

  const totalInvestor = cashbook
    .filter(c => c.kategori === 'investor')
    .reduce((sum, c) => sum + c.nominal, 0);

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

  return (
    <div className="space-y-6">
      {/* Management Read-Only Banner */}
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
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
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                General Ledger & Liquidity
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Auto-Sync Penjualan Aktif
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Vault className="w-5 h-5 text-emerald-600" />
              Buku Kas Besar & Arus Modal Investor
            </h2>
            <p className="text-xs text-slate-500">
              Sentral mutasi keuangan real-time: Pembayaran kavling otomatis tercatat di sini bersama modal investor dan pengeluaran proyek.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!isReadOnly && (
              <>
                <button
                  onClick={() => setShowInvestorModal(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>+ Dana Investor</span>
                </button>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Kas Keluar</span>
                </button>
              </>
            )}
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* Toolbar Filters */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Filter Kategori:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5 bg-slate-50 focus:bg-white"
            >
              <option value="all">Semua Kategori</option>
              <option value="jual_kavling">💰 Penjualan Kavling (Auto)</option>
              <option value="investor">🤝 Modal Investor & Pemodal</option>
              <option value="lahan_petani">🌾 Bayar Lahan Petani (Auto)</option>
              <option value="operasional">🛠️ Operasional & Proyek</option>
              <option value="lainnya">📦 Lain-lain</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Arus Mutasi:</label>
            <select
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value as any)}
              className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5 bg-slate-50 focus:bg-white"
            >
              <option value="all">Semua (Masuk & Keluar)</option>
              <option value="masuk">🟢 Uang Masuk Saja</option>
              <option value="keluar">🔴 Uang Keluar Saja</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Filter Proyek:</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5 bg-slate-50 focus:bg-white"
            >
              <option value="all">Semua Lahan</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Pencarian Mutasi:</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sumber, keterangan..."
                className="w-full text-xs border border-slate-300 rounded-xl pl-8 pr-2.5 py-1.5 bg-slate-50 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* 5 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0 border border-emerald-100">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Total Kas Masuk</p>
            <h3 className="text-base font-black text-emerald-600 truncate font-mono">
              Rp {totalCashIn.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-slate-400">Penerimaan Real</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg shrink-0 border border-teal-100">
            <Home className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Jual Kavling</p>
            <h3 className="text-base font-black text-teal-700 truncate font-mono">
              Rp {totalLotSales.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-teal-600 font-medium">Auto-Sync Penjualan</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0 border border-indigo-100">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Modal Investor</p>
            <h3 className="text-base font-black text-indigo-600 truncate font-mono">
              Rp {totalInvestor.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-indigo-500 font-medium">Suntikan Modal</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg shrink-0 border border-rose-100">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Total Kas Keluar</p>
            <h3 className="text-base font-black text-rose-600 truncate font-mono">
              Rp {totalCashOut.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-slate-400">Petani + Operasional</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-4 rounded-xl border border-slate-800 text-white shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center text-lg shrink-0 border border-white/20">
            <Vault className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-emerald-400 font-semibold uppercase">Saldo Kas Besar</p>
            <h3 className="text-base font-black text-white truncate font-mono">
              Rp {cashbookBalance.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-slate-300">Likuiditas Sentral</p>
          </div>
        </div>
      </div>

      {/* General Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Sumber / Rekanan</th>
                <th className="py-3 px-4">Kategori & Keterangan</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Uang Masuk</th>
                <th className="py-3 px-4 text-right">Uang Keluar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCash.map((item) => {
                const isMasuk = item.tipe === 'masuk';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600">{item.tanggal}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.sumber}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 block w-max mb-1">
                        {item.kategori.replace('_', ' ')}
                      </span>
                      <span className="text-slate-600">{item.keterangan}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.metode}</td>
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

      {/* Modal Catat Dana Investor */}
      {showInvestorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs"
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

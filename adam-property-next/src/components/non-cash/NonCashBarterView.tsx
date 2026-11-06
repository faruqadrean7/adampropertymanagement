'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import { useAuth } from '@/context/AuthContext';
import ExportButtons from '@/components/common/ExportButtons';
import { 
  PackageCheck, 
  Package, 
  Vault, 
  Coins, 
  Sparkles, 
  Plus, 
  Search, 
  Receipt, 
  Calendar, 
  Building, 
  CheckCircle2, 
  Printer, 
  Eye, 
  X, 
  Upload, 
  FileText, 
  AlertCircle, 
  ShieldCheck,
  User,
  Phone,
  Tag,
  Check,
  FileCheck2
} from 'lucide-react';
import { Payment, Customer } from '@/types';

export default function NonCashBarterView() {
  const { 
    activeTab, 
    setActiveTab, 
    projects, 
    kavlings, 
    customers, 
    payments, 
    addCustomerPayment,
    cashbookBalance, 
    pettyCashBalance,
    totalNonCashBarter
  } = useProperty();

  const { isReadOnly, canFullAccess } = useAuth();

  // Filters & State
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterTujuan, setFilterTujuan] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBAST, setSelectedBAST] = useState<Payment | null>(null);
  const [previewImage, setPreviewImage] = useState<{ title: string; src: string } | null>(null);

  // Form State "+ Catat Barter Baru"
  const [selectedCustId, setSelectedCustId] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [nominal, setNominal] = useState<number>(10000000);
  const [tujuan, setTujuan] = useState('Angsuran Pembelian Kavling');
  const [rincianBarter, setRincianBarter] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [kwitansiImage, setKwitansiImage] = useState<string | null>(null);

  // Filter only barter / non-cash payments
  const barterPayments = payments.filter(p => p.metodeBayar === 'barter');

  const filteredBarter = barterPayments.filter(p => {
    // Project filter: check customer's project or kavling's project
    const cust = customers.find(c => c.id === p.customerId);
    const kav = kavlings.find(k => k.nomor === p.kavlingKode);
    const projId = cust?.projectId || kav?.projectId;
    const matchProj = filterProject === 'all' || !projId || projId === filterProject;

    // Tujuan filter
    const matchTujuan = filterTujuan === 'all' || p.tujuan.toLowerCase().includes(filterTujuan.toLowerCase());

    // Search query
    const matchSearch = searchQuery === '' || 
      `${p.customerNama || cust?.nama || ''} ${p.kavlingKode || ''} ${p.rincianBarter || ''} ${p.tujuan} ${p.keterangan || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchProj && matchTujuan && matchSearch;
  });

  // Calculate distinct customers who used barter
  const uniqueCustomerIds = new Set(barterPayments.map(p => p.customerId));
  const uniqueCustCount = uniqueCustomerIds.size;

  // Selected customer for modal form
  const activeCustomerForForm = customers.find(c => c.id === selectedCustId);

  // Export Data preparation
  const getExportData = () => ({
    filename: `Laporan-Rekapitulasi-Barter-NonTunai-${new Date().toISOString().split('T')[0]}`,
    title: 'Rekapitulasi Pembayaran Non-Tunai & Barter Material Kavling',
    subtitle: 'PT Adam Property Indonesia - Kompensasi Serah Terima Barang / Aset',
    category: 'BUKU REKAPITULASI NON-TUNAI (IN-KIND LEDGER)',
    headers: ['Tanggal', 'No BAST/ID', 'Nama Customer', 'Kavling', 'Peruntukan', 'Nilai Kompensasi (Rp)', 'Rincian Barang / Material', 'Catatan'],
    rows: filteredBarter.map(p => {
      const cust = customers.find(c => c.id === p.customerId);
      return [
        p.tanggal,
        p.id,
        p.customerNama || cust?.nama || 'Customer',
        p.kavlingKode || '-',
        p.tujuan,
        `Rp ${p.nominal.toLocaleString('id-ID')}`,
        p.rincianBarter || 'Barter Material Bangunan',
        p.keterangan || '-'
      ];
    }),
    summary: [
      { label: 'Total Nilai Kompensasi Barter', value: `Rp ${totalNonCashBarter.toLocaleString('id-ID')}` },
      { label: 'Total Transaksi Barter', value: `${filteredBarter.length} Transaksi` },
      { label: 'Total Customer Terlibat', value: `${uniqueCustCount} Pembeli` },
      { label: 'Dampak Kas Likuid', value: 'Rp 0 (Terisolasi 100% Aman)' }
    ]
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran file maksimal 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setKwitansiImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustId) {
      alert('Silakan pilih nama customer pembeli kavling terlebih dahulu.');
      return;
    }
    if (!rincianBarter.trim()) {
      alert('Silakan tuliskan rincian barang/material yang diserahterimakan (contoh: 500 sak Semen Holcim).');
      return;
    }
    if (Number(nominal) <= 0) {
      alert('Nominal nilai ekuivalen barter harus lebih besar dari Rp 0.');
      return;
    }

    const cust = customers.find(c => c.id === selectedCustId);
    const kavKode = cust?.kavlingId 
      ? kavlings.find(k => k.id === cust.kavlingId)?.nomor 
      : (cust?.kavlingIds && cust.kavlingIds.length > 0 
          ? kavlings.filter(k => cust.kavlingIds?.includes(k.id)).map(k => k.nomor).join(', ')
          : undefined);

    addCustomerPayment({
      customerId: selectedCustId,
      customerNama: cust?.nama,
      kavlingKode: kavKode,
      tanggal,
      nominal: Number(nominal),
      metodeBayar: 'barter',
      tujuan,
      keterangan: keterangan || `Kompensasi Barter Material: ${rincianBarter}`,
      rincianBarter: rincianBarter.trim(),
      kwitansiImage
    });

    alert(`Sukses! Pembayaran barter sebesar Rp ${Number(nominal).toLocaleString('id-ID')} untuk ${cust?.nama} berhasil dicatat. Sisa piutang pembeli telah dipotong otomatis dan Kas Besar tetap aman dari mutasi fiktif.`);

    // Reset Form
    setShowAddModal(false);
    setSelectedCustId('');
    setNominal(10000000);
    setRincianBarter('');
    setKeterangan('');
    setKwitansiImage(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      
      {/* ======================================================== */}
      {/* 1. CENTRAL CASH HUB TOP SWITCHER (3 PILAR KEUANGAN) */}
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
          <span>Buku Rekapitulasi Khusus Transaksi Non-Tunai & Barter Material</span>
        </div>
      </div>

      {/* Management Read-Only Banner */}
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <b>Mode Management (Read-Only):</b> Anda memiliki akses memantau seluruh rekapitulasi pembayaran non-tunai, serah terima material, dan arsip BAST.
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
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              In-Kind Asset Ledger
            </span>
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" /> Terisolasi 100% Dari Kas Likuid
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            Rekapitulasi Pembayaran Non-Tunai & Barter Material
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Pencatatan resmi kompensasi serah terima material bangunan, armada, atau pertukaran aset dari pembeli kavling yang memotong piutang tanpa menyentuh buku kas likuid.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap sm:flex-nowrap">
          {!isReadOnly && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Transaksi Barter</span>
            </button>
          )}
          <ExportButtons getData={getExportData} />
        </div>
      </div>

      {/* 4 Financial & Operational Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-indigo-100">
            <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Total Nilai Barter</p>
            <h3 className="text-xs sm:text-base font-black text-indigo-600 truncate font-mono">
              Rp {totalNonCashBarter.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Kompensasi Barang Diterima</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-amber-100">
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Transaksi Serah Terima</p>
            <h3 className="text-xs sm:text-base font-black text-amber-600 truncate font-mono">
              {barterPayments.length} Transaksi
            </h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Surat Jalan / BAST Valid</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-teal-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-teal-100">
            <Building className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Pembeli Skema Barter</p>
            <h3 className="text-xs sm:text-base font-black text-teal-600 truncate font-mono">
              {uniqueCustCount} Customer
            </h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Kavling Terbayar Material</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base sm:text-lg shrink-0 border border-emerald-100">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase truncate">Status Kas Likuid</p>
            <h3 className="text-xs sm:text-base font-black text-emerald-600 truncate">
              Kas Likuid Murni
            </h3>
            <p className="text-[9px] sm:text-[10px] text-emerald-700 font-medium truncate">Tidak Ada Selisih Fiktif</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pembeli, kavling, jenis barang (semen, besi)..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg sm:rounded-xl px-2.5 py-2 bg-slate-50 font-semibold focus:outline-none"
          >
            <option value="all">Semua Proyek Kavling</option>
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>{proj.nama}</option>
            ))}
          </select>

          <select
            value={filterTujuan}
            onChange={(e) => setFilterTujuan(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg sm:rounded-xl px-2.5 py-2 bg-slate-50 font-semibold focus:outline-none"
          >
            <option value="all">Semua Peruntukan</option>
            <option value="Uang Muka">Uang Muka (DP)</option>
            <option value="Angsuran">Angsuran / Cicilan</option>
            <option value="Pelunasan">Pelunasan</option>
          </select>
        </div>
      </div>

      {/* Main Table: Rekapitulasi Barter Non-Tunai */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
        <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Daftar Serah Terima Kompensasi Non-Tunai ({filteredBarter.length} Data)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Total Rekap: <b className="text-indigo-700">Rp {filteredBarter.reduce((sum, p) => sum + p.nominal, 0).toLocaleString('id-ID')}</b>
          </span>
        </div>

        {filteredBarter.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-3">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">Belum Ada Transaksi Barter Non-Tunai</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Seluruh transaksi pembayaran yang menggunakan metode non-tunai (barter material bangunan, kendaraan, atau pertukaran aset) akan otomatis direkap di sini tanpa masuk ke Kas Besar.
            </p>
            {!isReadOnly && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Barter Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-32">Tanggal & ID</th>
                  <th className="py-3 px-4">Pembeli & Kavling</th>
                  <th className="py-3 px-4">Peruntukan</th>
                  <th className="py-3 px-4 text-right">Nilai Kompensasi</th>
                  <th className="py-3 px-4 min-w-[260px]">Rincian Barang / Material Bangunan</th>
                  <th className="py-3 px-4 text-center w-28">Bukti / Nota</th>
                  <th className="py-3 px-4 text-center w-32">Berita Acara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBarter.map((pay, idx) => {
                  const cust = customers.find(c => c.id === pay.customerId);

                  return (
                    <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Tanggal & ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{pay.tanggal}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate" title={pay.id}>
                          #{pay.id.replace('pay-', '')}
                        </div>
                      </td>

                      {/* Pembeli & Kavling */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {pay.customerNama || cust?.nama || 'Customer'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 font-mono">
                            Unit {pay.kavlingKode || '-'}
                          </span>
                          {cust?.telepon && (
                            <span className="flex items-center gap-0.5 text-slate-400">
                              <Phone className="w-2.5 h-2.5" /> {cust.telepon}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Peruntukan Tagihan */}
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {pay.tujuan}
                        </span>
                        {pay.keterangan && (
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                            {pay.keterangan}
                          </div>
                        )}
                      </td>

                      {/* Nilai Kompensasi */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-indigo-700 text-sm">
                          Rp {pay.nominal.toLocaleString('id-ID')}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Potong Piutang
                        </div>
                      </td>

                      {/* Rincian Barang / Material Bangunan */}
                      <td className="py-3.5 px-4">
                        <div className="p-2 bg-indigo-50/60 border border-indigo-100 rounded-lg text-xs text-indigo-950 font-mono leading-relaxed whitespace-pre-line">
                          {pay.rincianBarter || 'Barter Material Bangunan'}
                        </div>
                      </td>

                      {/* Bukti Serah Terima / Nota */}
                      <td className="py-3.5 px-4 text-center">
                        {pay.kwitansiImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImage({
                              title: `Surat Jalan / Bukti Serah Terima: ${pay.customerNama || cust?.nama} (Rp ${pay.nominal.toLocaleString('id-ID')})`,
                              src: pay.kwitansiImage!
                            })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-[10px] transition cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Lihat Nota</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Tanpa Foto
                          </span>
                        )}
                      </td>

                      {/* Berita Acara BAST */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedBAST(pay)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Lihat & Cetak Berita Acara Serah Terima Barter"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                          <span>BAST</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: INPUT PEMBAYARAN / BARTER MATERIAL BARU */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Catat Pembayaran Barter Non-Tunai</h3>
                  <p className="text-[10px] text-slate-500">Otomatis memotong sisa piutang pembeli & terisolasi dari Kas Likuid</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBarterSubmit} className="space-y-3.5 text-xs mt-4">
              {/* 1. Pilih Customer */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Pembeli Kavling *</label>
                <select
                  required
                  value={selectedCustId}
                  onChange={(e) => setSelectedCustId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white font-medium"
                >
                  <option value="">-- Pilih Customer Terdaftar --</option>
                  {customers.map(c => {
                    const lotNames = c.kavlingId 
                      ? kavlings.find(k => k.id === c.kavlingId)?.nomor 
                      : (c.kavlingIds && c.kavlingIds.length > 0 
                          ? kavlings.filter(k => c.kavlingIds?.includes(k.id)).map(k => k.nomor).join(', ') 
                          : '-');
                    return (
                      <option key={c.id} value={c.id}>
                        {c.nama} (Kavling {lotNames}) - Sisa Piutang: Rp {c.sisaPiutang.toLocaleString('id-ID')}
                      </option>
                    );
                  })}
                </select>
              </div>

              {activeCustomerForForm && (
                <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-[11px] text-indigo-900 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Sisa Piutang Saat Ini:</span>
                    <span className="font-mono font-bold text-rose-700">Rp {activeCustomerForForm.sisaPiutang.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi Sisa Piutang Setelah Barter:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      Rp {Math.max(0, activeCustomerForForm.sisaPiutang - Number(nominal)).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              {/* 2. Tanggal & Nilai Kompensasi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Serah Terima *</label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nilai Kompensasi (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={nominal}
                    onChange={(e) => setNominal(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-indigo-700"
                  />
                </div>
              </div>

              {/* 3. Peruntukan */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Peruntukan Tagihan *</label>
                <select
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Uang Muka (DP)">Uang Muka (DP)</option>
                  <option value="Angsuran Pembelian Kavling">Angsuran / Cicilan Kavling</option>
                  <option value="Pelunasan Pembelian Kavling">Pelunasan Pembelian Kavling</option>
                </select>
              </div>

              {/* 4. Rincian Spesifikasi Barang */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Rincian Spesifikasi Barang / Material Bangunan *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rincianBarter}
                  onChange={(e) => setRincianBarter(e.target.value)}
                  placeholder="Contoh:&#10;- 500 Sak Semen Gresik 40kg @ Rp 65.000 = Rp 32.500.000&#10;- 100 Lonjor Besi 10mm SNI = Rp 8.000.000"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Tuliskan nama barang, spesifikasi teknis, jumlah kuantitas, dan satuan harga kesepakatan.
                </p>
              </div>

              {/* 5. Catatan Tambahan */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Serah Terima (Opsional)</label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Lokasi penurunan barang, nama mandor penerima, dsb."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              {/* 6. Upload Foto Surat Jalan / BAST */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Foto Surat Jalan / Nota Barang (Opsional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center hover:bg-slate-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {kwitansiImage ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Foto surat jalan berhasil dilampirkan</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Upload className="w-4 h-4 text-slate-400 mb-1" />
                      <span className="text-[11px] font-semibold">Klik untuk upload foto surat jalan / nota</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Rekap Barter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BERITA ACARA SERAH TERIMA (BAST) & KWITANSI CETAK */}
      {/* ======================================================== */}
      {selectedBAST && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Header Cetak */}
            <div className="text-center border-b border-slate-200 pb-3">
              <img src="/assets/logo-icon.svg" alt="Logo" className="w-10 h-10 mx-auto mb-1 object-contain" />
              <h3 className="font-black text-sm text-slate-900 tracking-tight">PT ADAM PROPERTY INDONESIA</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                BERITA ACARA SERAH TERIMA & KWITANSI BARTER MATERIAL
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">No. BAST: BAST-BARTER/{selectedBAST.tanggal.replace(/-/g, '')}/{selectedBAST.id.replace('pay-', '')}</p>
            </div>

            {/* Info Customer & Transaksi */}
            <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Pihak Pertama (Pembeli):</span>
                <span className="font-bold text-slate-900">{selectedBAST.customerNama || 'Customer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unit Kavling Terkait:</span>
                <span className="font-bold text-indigo-700">Kavling {selectedBAST.kavlingKode || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Serah Terima:</span>
                <span className="font-mono text-slate-800">{selectedBAST.tanggal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tujuan Kompensasi:</span>
                <span className="font-semibold text-slate-800">{selectedBAST.tujuan}</span>
              </div>
            </div>

            {/* Rincian Material */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Rincian Fisik Material / Barang Yang Diterima:</span>
              <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl text-xs font-mono whitespace-pre-line text-slate-800">
                {selectedBAST.rincianBarter || 'Barter Material Bangunan'}
              </div>
            </div>

            {/* Nilai Total */}
            <div className="p-3 bg-slate-900 text-white rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Nilai Pengakuan Pembayaran:</span>
                <span className="text-xs text-indigo-300 font-medium">Memotong Piutang Kavling Sah</span>
              </div>
              <span className="font-mono font-black text-lg text-amber-300">
                Rp {selectedBAST.nominal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Catatan Hukum & Keuangan */}
            <div className="p-2.5 bg-emerald-50 rounded-xl text-[10px] text-emerald-800 font-medium border border-emerald-200">
              ✓ <b>Pernyataan:</b> Nilai barang di atas telah disetujui bersama dan langsung diakui sebagai pembayaran angsuran/DP kavling. Transaksi ini tidak melibatkan kas tunai likuid perusahaan.
            </div>

            {/* Tanda Tangan */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-center text-[11px]">
              <div>
                <p className="text-slate-500 mb-12">Pihak Penyerah (Pembeli),</p>
                <p className="font-bold text-slate-900 underline">{selectedBAST.customerNama || 'Pembeli Kavling'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-12">Pihak Penerima (PT Adam Property),</p>
                <p className="font-bold text-slate-900 underline">Divisi Logistik & Keuangan</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBAST(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Berita Acara</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PREVIEW FOTO NOTA / SURAT JALAN */}
      {/* ======================================================== */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {previewImage.title}
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
              <img
                src={previewImage.src}
                alt="Lampiran BAST"
                className="w-full h-auto object-contain max-h-[70vh] rounded-lg"
              />
            </div>
            <div className="text-right">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

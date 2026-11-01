'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import { 
  Users, 
  Plus, 
  Search, 
  Receipt, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Package, 
  Phone, 
  CreditCard 
} from 'lucide-react';
import { Customer, Payment } from '@/types';

export default function CustomerView() {
  const { 
    customers, 
    payments, 
    kavlings, 
    addCustomer, 
    addCustomerPayment 
  } = useProperty();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'paid'>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustForPay, setSelectedCustForPay] = useState<Customer | null>(null);
  const [selectedCustDetail, setSelectedCustDetail] = useState<Customer | null>(null);

  // Form Add Customer
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [telepon, setTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [selectedKavlingId, setSelectedKavlingId] = useState('');
  const [totalHarga, setTotalHarga] = useState(120000000);
  const [uangMuka, setUangMuka] = useState(30000000);
  const [metodeBayar, setMetodeBayar] = useState<'tunai' | 'transfer' | 'barter'>('transfer');
  const [rincianBarter, setRincianBarter] = useState('');

  // Form Payment
  const [payNominal, setPayNominal] = useState<number>(10000000);
  const [payMetode, setPayMetode] = useState<'tunai' | 'transfer' | 'barter'>('transfer');
  const [payTujuan, setPayTujuan] = useState('Cicilan Bulanan');
  const [payKeterangan, setPayKeterangan] = useState('');
  const [payRincianBarter, setPayRincianBarter] = useState('');

  // Calculations
  const filteredCustomers = customers.filter(c => {
    const matchSearch = `${c.nama} ${c.nik} ${c.kavlingKode || ''} ${c.telepon}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'paid' && c.statusBayar === 'lunas') ||
      (filterStatus === 'unpaid' && c.statusBayar === 'belum_lunas');
    return matchSearch && matchStatus;
  });

  const totalNilaiKavling = customers.reduce((sum, c) => sum + c.totalHarga, 0);
  const totalUangMasuk = customers.reduce((sum, c) => sum + c.totalMasuk, 0);
  const totalSisaPiutang = customers.reduce((sum, c) => sum + c.sisaPiutang, 0);

  const availableLots = kavlings.filter(k => k.status === 'terbuka');

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKavlingId) {
      alert('Pilih unit kavling terlebih dahulu!');
      return;
    }
    addCustomer({
      nama,
      nik,
      telepon,
      alamat,
      kavlingId: selectedKavlingId,
      totalHarga: Number(totalHarga),
      uangMuka: Number(uangMuka),
      metodeBayar,
      rincianBarter: metodeBayar === 'barter' ? rincianBarter : undefined
    });
    setShowAddModal(false);
    // Reset form
    setNama('');
    setNik('');
    setTelepon('');
    setAlamat('');
    setRincianBarter('');
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForPay) return;

    addCustomerPayment({
      customerId: selectedCustForPay.id,
      customerNama: selectedCustForPay.nama,
      kavlingKode: selectedCustForPay.kavlingKode,
      tanggal: new Date().toISOString().split('T')[0],
      nominal: Number(payNominal),
      metodeBayar: payMetode,
      tujuan: payTujuan,
      keterangan: payKeterangan,
      rincianBarter: payMetode === 'barter' ? payRincianBarter : undefined
    });

    setSelectedCustForPay(null);
    setPayNominal(10000000);
    setPayKeterangan('');
    setPayRincianBarter('');
  };

  return (
    <div className="space-y-6">
      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Customer</p>
            <h3 className="text-xl font-bold text-slate-800 font-mono">{customers.length}</h3>
            <p className="text-[11px] text-slate-400">Pembeli Kavling Terdaftar</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Transaksi</p>
            <h3 className="text-xl font-bold text-slate-800 font-mono">
              Rp {totalNilaiKavling.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-slate-400">Nilai Kontrak Penjualan</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Uang/Barter Masuk</p>
            <h3 className="text-xl font-bold text-emerald-600 font-mono">
              Rp {totalUangMasuk.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium">
              {totalNilaiKavling > 0 ? Math.round((totalUangMasuk / totalNilaiKavling) * 100) : 0}% terbayar
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sisa Piutang Berjalan</p>
            <h3 className="text-xl font-bold text-amber-600 font-mono">
              Rp {totalSisaPiutang.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-slate-400">
              {customers.filter(c => c.statusBayar === 'belum_lunas').length} Customer Belum Lunas
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari customer, NIK, telepon, kavling..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('unpaid')}
              className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'unpaid' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600'}`}
            >
              Belum Lunas
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'paid' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600'}`}
            >
              Lunas
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Kavling</th>
                <th className="py-3 px-4 text-right">Nilai Kontrak</th>
                <th className="py-3 px-4 text-right">Sudah Masuk</th>
                <th className="py-3 px-4 text-right">Sisa Piutang</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCustomers.map((cust) => {
                const isLunas = cust.statusBayar === 'lunas';
                const hasBarter = payments.some(p => p.customerId === cust.id && p.metodeBayar === 'barter');

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">{cust.nama}</div>
                      <div className="text-[11px] text-slate-500 font-mono">NIK: {cust.nik}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {cust.telepon}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 font-mono block">
                        {cust.kavlingKode}
                      </span>
                      {hasBarter && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 mt-1 border border-amber-300">
                          <Package className="w-3 h-3" /> Barter Material
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      Rp {cust.totalHarga.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      Rp {cust.totalMasuk.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                      Rp {cust.sisaPiutang.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isLunas
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isLunas ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-1.5">
                      {!isLunas && (
                        <button
                          onClick={() => setSelectedCustForPay(cust)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                          title="Input Pembayaran / Barter"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Bayar</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedCustDetail(cust)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                        title="Lihat Riwayat Kwitansi & Berkas"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Riwayat</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            Tidak ada customer yang sesuai dengan filter pencarian.
          </div>
        )}
      </div>

      {/* Modal Input Pembayaran / Barter Material */}
      {selectedCustForPay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Catat Pembayaran Customer</h3>
                <p className="text-xs text-slate-500">
                  {selectedCustForPay.nama} &bull; {selectedCustForPay.kavlingKode}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCustForPay(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-amber-950">
                <span>Sisa Piutang Berjalan:</span>
                <span className="font-bold text-sm font-mono">
                  Rp {selectedCustForPay.sisaPiutang.toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nominal Pembayaran (Rp) *</label>
                <input
                  type="number"
                  required
                  value={payNominal}
                  onChange={(e) => setPayNominal(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-emerald-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Metode Pembayaran *</label>
                  <select
                    value={payMetode}
                    onChange={(e) => setPayMetode(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="transfer">Transfer Bank (BCA/Mandiri)</option>
                    <option value="tunai">Tunai Kasir Kantor</option>
                    <option value="barter">Barter Material Bangunan</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tujuan Pembayaran</label>
                  <input
                    type="text"
                    value={payTujuan}
                    onChange={(e) => setPayTujuan(e.target.value)}
                    placeholder="Cicilan ke-1 / Pelunasan"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {payMetode === 'barter' && (
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-300 space-y-1.5">
                  <label className="font-bold text-amber-900 block">
                    📦 Rincian Material Bangunan yang Diterima:
                  </label>
                  <textarea
                    rows={3}
                    value={payRincianBarter}
                    onChange={(e) => setPayRincianBarter(e.target.value)}
                    placeholder="Contoh: Semen Gresik 300 sak @ 68rb = 20.4jt, Besi 10mm 500 btg = 42.5jt..."
                    className="w-full border border-amber-300 rounded-xl p-2.5 text-xs bg-white"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={payKeterangan}
                  onChange={(e) => setPayKeterangan(e.target.value)}
                  placeholder="Kwitansi nomor, diserahkan via..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCustForPay(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Pembayaran (Auto-Sync Kas)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Riwayat Kwitansi Customer */}
      {selectedCustDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedCustDetail.nama}</h3>
                <p className="text-xs text-slate-500">
                  {selectedCustDetail.kavlingKode} &bull; NIK: {selectedCustDetail.nik}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCustDetail(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Total Kontrak</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {selectedCustDetail.totalHarga.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-800">
                  <span className="text-[10px] block">Terbayar</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {selectedCustDetail.totalMasuk.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-800">
                  <span className="text-[10px] block">Sisa Piutang</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {selectedCustDetail.sisaPiutang.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Riwayat Pembayaran & Kwitansi:</h4>
                {payments.filter(p => p.customerId === selectedCustDetail.id).map(pay => (
                  <div key={pay.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{pay.tujuan}</span>
                      <span className="font-mono font-bold text-emerald-700">
                        Rp {pay.nominal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Tanggal: {pay.tanggal}</span>
                      <span className="uppercase font-semibold text-slate-600">Metode: {pay.metodeBayar}</span>
                    </div>
                    {pay.rincianBarter && (
                      <div className="mt-1 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 whitespace-pre-line font-mono">
                        {pay.rincianBarter}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCustDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Customer Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              + Registrasi Customer & Pembelian Kavling
            </h3>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Pembeli *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Bpk. Bambang Sutrisno"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIK (KTP) *</label>
                  <input
                    type="text"
                    required
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="332408xxxxxxx"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="08123456789"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Domisili KTP</label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. Merak No. 12 Kaliwungu"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Unit Kavling yang Dibeli *</label>
                <select
                  required
                  value={selectedKavlingId}
                  onChange={(e) => {
                    setSelectedKavlingId(e.target.value);
                    const kav = kavlings.find(k => k.id === e.target.value);
                    if (kav) {
                      setTotalHarga(kav.harga);
                      setUangMuka(Math.round(kav.harga * 0.3));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="">-- Pilih Unit Kavling Siap Jual --</option>
                  {availableLots.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.blok} - {k.nomor} ({k.luas} m² - Rp {k.harga.toLocaleString('id-ID')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Harga Kesepakatan (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={totalHarga}
                    onChange={(e) => setTotalHarga(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Uang Muka / DP Dibayar (Rp)</label>
                  <input
                    type="number"
                    required
                    value={uangMuka}
                    onChange={(e) => setUangMuka(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Metode Pembayaran DP *</label>
                <select
                  value={metodeBayar}
                  onChange={(e) => setMetodeBayar(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="transfer">Transfer Bank (BCA / Mandiri)</option>
                  <option value="tunai">Tunai Kasir Kantor</option>
                  <option value="barter">Barter Material Bangunan (Semen, Besi, Pasir)</option>
                </select>
              </div>

              {metodeBayar === 'barter' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 space-y-1">
                  <label className="font-bold text-amber-900 block">
                    📦 Tulis Rincian Barang Barter Material:
                  </label>
                  <textarea
                    rows={3}
                    value={rincianBarter}
                    onChange={(e) => setRincianBarter(e.target.value)}
                    placeholder="Semen 1.000 sak @ 68rb, Besi ulir 500 btg..."
                    className="w-full border border-amber-300 rounded-xl p-2.5 bg-white text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

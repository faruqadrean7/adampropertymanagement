'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import { 
  Tractor, 
  Plus, 
  MapPin, 
  Coins, 
  Clock, 
  Receipt, 
  Phone, 
  FileCheck2, 
  Building2 
} from 'lucide-react';
import { LandDebt } from '@/types';

export default function LandDebtView() {
  const { 
    projects, 
    landDebts, 
    landPayments, 
    addLandDebt, 
    addLandPayment 
  } = useProperty();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLandForPay, setSelectedLandForPay] = useState<LandDebt | null>(null);
  const [selectedLandDetail, setSelectedLandDetail] = useState<LandDebt | null>(null);

  // Form Add Land Debt
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [namaPetani, setNamaPetani] = useState('');
  const [telepon, setTelepon] = useState('');
  const [luasTanah, setLuasTanah] = useState('');
  const [alasHak, setAlasHak] = useState('');
  const [hargaKesepakatan, setHargaKesepakatan] = useState(600000000);
  const [dpDibayar, setDpDibayar] = useState(250000000);
  const [alamatLahan, setAlamatLahan] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Form Land Payment
  const [payNominal, setPayNominal] = useState(50000000);
  const [payMetode, setPayMetode] = useState('Transfer Bank Mandiri');
  const [payKeterangan, setPayKeterangan] = useState('Cicilan Pembayaran Tanah Mentah');

  // Filtering per Lahan Proyek (agar catatan hutang tidak tercampur)
  const filteredLands = landDebts.filter(l => 
    selectedProjectId === 'all' || l.projectId === selectedProjectId
  );

  const totalNilaiTanah = filteredLands.reduce((sum, l) => sum + l.hargaKesepakatan, 0);
  const totalTerbayar = filteredLands.reduce((sum, l) => sum + l.dpDibayar + l.totalCicilan, 0);
  const totalSisaHutang = filteredLands.reduce((sum, l) => sum + l.sisaHutang, 0);

  const activeProjectLabel = selectedProjectId === 'all' 
    ? 'Semua Lahan Proyek (Rekap Terpadu)' 
    : (projects.find(p => p.id === selectedProjectId)?.nama || 'Lahan Terpilih');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLandDebt({
      projectId,
      namaPetani,
      telepon,
      luasTanah,
      alasHak,
      hargaKesepakatan: Number(hargaKesepakatan),
      dpDibayar: Number(dpDibayar),
      alamatLahan,
      keterangan
    });
    setShowAddModal(false);
    setNamaPetani('');
    setTelepon('');
    setLuasTanah('');
    setAlasHak('');
    setAlamatLahan('');
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLandForPay) return;

    addLandPayment({
      landDebtId: selectedLandForPay.id,
      tanggal: new Date().toISOString().split('T')[0],
      nominal: Number(payNominal),
      metode: payMetode,
      keterangan: payKeterangan
    });

    setSelectedLandForPay(null);
    setPayNominal(50000000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Per-Lahan Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-amber-600" />
              Manajemen Hutang Tanah ke Petani / Pemilik Lahan
            </h2>
            <p className="text-xs text-slate-500">
              Pencatatan pembebasan lahan mentah, perjanjian jual beli notaris, dan cicilan bertahap.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Beli Lahan Petani Baru</span>
          </button>
        </div>

        {/* DROPDOWN FILTER PILIH LAHAN AGAR TIDAK TERCAMPUR */}
        <div className="p-3.5 bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50 rounded-xl border border-amber-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Pilih Lahan Proyek yang Dikelola (Filter Terpisah):
              </span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="mt-0.5 px-3 py-1.5 border-2 border-amber-400 rounded-lg text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
              >
                <option value="all">Semua Lahan (Rekap Gabungan)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-amber-950 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Fokus Lahan: <b className="text-amber-800">{activeProjectLabel}</b></span>
          </div>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pemilik Lahan</p>
            <h3 className="text-xl font-bold text-slate-800 font-mono">{filteredLands.length}</h3>
            <p className="text-[11px] text-slate-400">Petani / Penjual Tanah</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Nilai Tanah</p>
            <h3 className="text-xl font-bold text-slate-800 font-mono">
              Rp {totalNilaiTanah.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-slate-400">Kesepakatan Akta Notaris</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sudah Dibayar</p>
            <h3 className="text-xl font-bold text-emerald-600 font-mono">
              Rp {totalTerbayar.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium">DP + Cicilan Terbayar</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xl shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sisa Hutang Petani</p>
            <h3 className="text-xl font-bold text-rose-600 font-mono">
              Rp {totalSisaHutang.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-slate-400">Kewajiban Belum Terbayar</p>
          </div>
        </div>
      </div>

      {/* Table Data Lahan Petani */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Petani / Pemilik</th>
                <th className="py-3 px-4">Proyek & Alas Hak</th>
                <th className="py-3 px-4 text-right">Kesepakatan</th>
                <th className="py-3 px-4 text-right">DP & Cicilan</th>
                <th className="py-3 px-4 text-right">Sisa Hutang</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLands.map((land) => {
                const isLunas = land.status === 'lunas';
                const terbayar = land.dpDibayar + land.totalCicilan;

                return (
                  <tr key={land.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">{land.namaPetani}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> {land.telepon}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">{land.alamatLahan}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-amber-900 block">{land.projectNama}</span>
                      <span className="text-[11px] text-slate-600 block">{land.luasTanah}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{land.alasHak}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      Rp {land.hargaKesepakatan.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      Rp {terbayar.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      Rp {land.sisaHutang.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isLunas
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isLunas ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-1.5">
                      {!isLunas && (
                        <button
                          onClick={() => setSelectedLandForPay(land)}
                          className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Cicil</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedLandDetail(land)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
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

        {filteredLands.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            Belum ada catatan pembelian lahan petani untuk proyek ini.
          </div>
        )}
      </div>

      {/* Modal Bayar Cicilan ke Petani */}
      {selectedLandForPay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bayar Cicilan Lahan Petani</h3>
                <p className="text-xs text-slate-500">
                  Kepada: {selectedLandForPay.namaPetani} &bull; {selectedLandForPay.projectNama}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLandForPay(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center text-rose-950">
                <span>Sisa Kewajiban Hutang:</span>
                <span className="font-bold text-sm font-mono">
                  Rp {selectedLandForPay.sisaHutang.toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nominal Cicilan Dibayarkan (Rp) *</label>
                <input
                  type="number"
                  required
                  value={payNominal}
                  onChange={(e) => setPayNominal(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-rose-700 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Metode Transfer / Pembayaran</label>
                <input
                  type="text"
                  value={payMetode}
                  onChange={(e) => setPayMetode(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan Cicilan</label>
                <input
                  type="text"
                  value={payKeterangan}
                  onChange={(e) => setPayKeterangan(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800 text-[11px]">
                ℹ️ Pembayaran ini otomatis mengurangi saldo Kas Besar dan mencatat mutasi keluar resmi.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLandForPay(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Bayar & Kurangi Kas Besar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Riwayat Cicilan */}
      {selectedLandDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedLandDetail.namaPetani}</h3>
                <p className="text-xs text-slate-500">
                  {selectedLandDetail.projectNama} &bull; {selectedLandDetail.luasTanah}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLandDetail(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Kesepakatan</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {selectedLandDetail.hargaKesepakatan.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-800">
                  <span className="text-[10px] block">Terbayar</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {(selectedLandDetail.dpDibayar + selectedLandDetail.totalCicilan).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-rose-800">
                  <span className="text-[10px] block">Sisa Hutang</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {selectedLandDetail.sisaHutang.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Riwayat Pembayaran ke Petani:</h4>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Uang Muka (DP Awal Pembebasan Lahan)</span>
                    <span className="font-mono text-emerald-700">
                      Rp {selectedLandDetail.dpDibayar.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Saat penandatanganan PPJB di hadapan Notaris</span>
                </div>

                {landPayments.filter(p => p.landDebtId === selectedLandDetail.id).map(pay => (
                  <div key={pay.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{pay.keterangan}</span>
                      <span className="font-mono font-bold text-emerald-700">
                        Rp {pay.nominal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Tanggal: {pay.tanggal}</span>
                      <span>Metode: {pay.metode}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLandDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Beli Lahan Petani Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              + Catat Pembelian Lahan Mentah ke Petani
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Induk Lahan Proyek *</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Petani / Penjual *</label>
                  <input
                    type="text"
                    required
                    value={namaPetani}
                    onChange={(e) => setNamaPetani(e.target.value)}
                    placeholder="Contoh: Bpk. H. Sugeng"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="081234xxxx"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Luas Tanah *</label>
                  <input
                    type="text"
                    required
                    value={luasTanah}
                    onChange={(e) => setLuasTanah(e.target.value)}
                    placeholder="6.000 m² (428 Ru)"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alas Hak / Surat Tanah *</label>
                  <input
                    type="text"
                    required
                    value={alasHak}
                    onChange={(e) => setAlasHak(e.target.value)}
                    placeholder="Letter C No. 45 / SHM No. 12"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Kesepakatan (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={hargaKesepakatan}
                    onChange={(e) => setHargaKesepakatan(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">DP Awal Dibayar (Rp)</label>
                  <input
                    type="number"
                    required
                    value={dpDibayar}
                    onChange={(e) => setDpDibayar(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lokasi Lahan</label>
                <input
                  type="text"
                  value={alamatLahan}
                  onChange={(e) => setAlamatLahan(e.target.value)}
                  placeholder="Sebelah barat pasar desa..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Perjanjian Notaris</label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="No. Akta Notaris, skema tempo 6 bulan..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Lahan & Catat DP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

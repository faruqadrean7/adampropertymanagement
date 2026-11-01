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
  Building2,
  UploadCloud,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  FileCheck,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { LandDebt } from '@/types';

export default function LandDebtView() {
  const { 
    projects, 
    landDebts, 
    landPayments, 
    addLandDebt, 
    updateLandDocuments,
    addLandPayment,
    updateLandPaymentReceipt
  } = useProperty();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLandForPay, setSelectedLandForPay] = useState<LandDebt | null>(null);
  const [selectedLandDetail, setSelectedLandDetail] = useState<LandDebt | null>(null);
  const [previewImage, setPreviewImage] = useState<{ title: string; src: string } | null>(null);

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
  const [sertifikatImage, setSertifikatImage] = useState<string | null>(null);
  const [perjanjianImage, setPerjanjianImage] = useState<string | null>(null);

  const handleUpdateLandDoc = (updates: { sertifikatImage?: string | null; perjanjianImage?: string | null }) => {
    if (!selectedLandDetail) return;
    updateLandDocuments(selectedLandDetail.id, updates);
    setSelectedLandDetail(prev => (prev ? { ...prev, ...updates } : null));
  };

  // Form Land Payment
  const [payNominal, setPayNominal] = useState(50000000);
  const [payMetode, setPayMetode] = useState('Transfer Bank Mandiri');
  const [payKeterangan, setPayKeterangan] = useState('Cicilan Pembayaran Tanah Mentah');
  const [payKwitansiImage, setPayKwitansiImage] = useState<string | null>(null);

  // Helper membaca file upload slip lokal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file maksimal 8 MB!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setter(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLandReceiptUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    paymentId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file maksimal 8 MB!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateLandPaymentReceipt(paymentId, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const generateSampleDoc = (title: string, subtitle: string, bg: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <rect width="600" height="380" fill="${bg}" rx="12"/>
      <rect x="20" y="20" width="560" height="340" fill="none" stroke="white" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>
      <circle cx="300" cy="140" r="45" fill="white" opacity="0.2"/>
      <text x="300" y="215" font-family="Arial" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
      <text x="300" y="245" font-family="Arial" font-size="14" fill="white" opacity="0.8" text-anchor="middle">${subtitle}</text>
      <text x="300" y="280" font-family="Arial" font-size="12" fill="white" opacity="0.6" text-anchor="middle">PT ADAM PROPERTY INDONESIA - KAS BESAR</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

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
      keterangan,
      sertifikatImage,
      perjanjianImage
    });
    setShowAddModal(false);
    setNamaPetani('');
    setTelepon('');
    setLuasTanah('');
    setAlasHak('');
    setAlamatLahan('');
    setKeterangan('');
    setSertifikatImage(null);
    setPerjanjianImage(null);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLandForPay) return;

    addLandPayment({
      landDebtId: selectedLandForPay.id,
      tanggal: new Date().toISOString().split('T')[0],
      nominal: Number(payNominal),
      metode: payMetode,
      keterangan: payKeterangan,
      kwitansiImage: payKwitansiImage
    });

    setSelectedLandForPay(null);
    setPayNominal(50000000);
    setPayKwitansiImage(null);
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
                      <span className="text-[11px] text-slate-400 font-mono block">{land.alasHak}</span>
                      
                      {/* Status Dokumen Legalitas Lahan */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {land.sertifikatImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Sertifikat Induk: ${land.namaPetani} (${land.projectNama})`, src: land.sertifikatImage! })}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition"
                            title="Klik untuk melihat Sertifikat Induk"
                          >
                            <FileCheck className="w-3 h-3 text-emerald-700" />
                            <span>SHM</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">SHM: -</span>
                        )}

                        {land.perjanjianImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Akta PPJB / Notaris: ${land.namaPetani} (${land.projectNama})`, src: land.perjanjianImage! })}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                            title="Klik untuk melihat Akta PPJB"
                          >
                            <FileText className="w-3 h-3 text-blue-700" />
                            <span>PPJB</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">PPJB: -</span>
                        )}
                      </div>
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
                          onClick={() => {
                            setSelectedLandForPay(land);
                            setPayKwitansiImage(null);
                          }}
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

              {/* UPLOAD BUKTI SLIP TRANSFER / PEMBAYARAN KE PETANI */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <Receipt className="w-4 h-4 text-amber-600" />
                    <span>Upload Bukti Bayar / Slip Transfer Bank</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Opsional</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sampleSlip = generateSampleDoc(
                          'BUKTI TRANSFER BANK - CICILAN LAHAN',
                          `Nominal: Rp ${payNominal.toLocaleString('id-ID')} • ${selectedLandForPay.namaPetani} (${selectedLandForPay.projectNama})`,
                          '#9a3412'
                        );
                        setPayKwitansiImage(sampleSlip);
                      }}
                      className="text-[10px] px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-semibold transition"
                    >
                      + Isi Sampel Slip Bank
                    </button>
                  </div>
                </div>

                {payKwitansiImage ? (
                  <div className="space-y-1.5">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden border border-amber-300 bg-slate-100 group">
                      <img
                        src={payKwitansiImage}
                        alt="Bukti Transfer Lahan"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ title: `Bukti Transfer Lahan: ${selectedLandForPay.namaPetani} - Rp ${payNominal.toLocaleString('id-ID')}`, src: payKwitansiImage })}
                          className="px-2.5 py-1 bg-white text-slate-900 rounded-md font-bold text-[11px] flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Lihat
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayKwitansiImage(null)}
                          className="px-2.5 py-1 bg-rose-600 text-white rounded-md font-bold text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-amber-800 font-semibold truncate flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" /> Slip transfer siap diarsipkan ke kas keluar
                      </span>
                      <button
                        type="button"
                        onClick={() => setPayKwitansiImage(null)}
                        className="text-rose-600 hover:underline font-semibold"
                      >
                        Ganti Berkas
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/30 rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center h-24">
                    <UploadCloud className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="font-bold text-slate-700 text-xs">Pilih File Bukti Transfer / Kwitansi</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, atau screenshot mutasi m-Banking (Maks 8MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setPayKwitansiImage)}
                      className="hidden"
                    />
                  </label>
                )}
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

              {/* BERKAS DOKUMEN LEGALITAS LAHAN INDUK */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Berkas Dokumen Legalitas Lahan Induk</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dokumen 1: Sertifikat Induk */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">Sertifikat / Alas Hak</span>
                      {selectedLandDetail.sertifikatImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>

                    {selectedLandDetail.sertifikatImage ? (
                      <div className="space-y-1.5">
                        <div className="relative h-24 w-full rounded-lg overflow-hidden border border-emerald-300 bg-slate-100 group">
                          <img
                            src={selectedLandDetail.sertifikatImage}
                            alt="Sertifikat Induk"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: `Sertifikat Induk: ${selectedLandDetail.namaPetani} (${selectedLandDetail.projectNama})`, src: selectedLandDetail.sertifikatImage! })}
                              className="px-2 py-1 bg-white text-slate-900 rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLandDoc({ sertifikatImage: null })}
                              className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Sertifikat Induk: ${selectedLandDetail.namaPetani} (${selectedLandDetail.projectNama})`, src: selectedLandDetail.sertifikatImage! })}
                            className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Lihat Dokumen
                          </button>
                          <label className="text-slate-500 hover:text-slate-800 cursor-pointer underline font-medium">
                            <span>Ganti Berkas</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (val) => handleUpdateLandDoc({ sertifikatImage: val }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30">
                          <UploadCloud className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[11px]">Upload Foto Sertifikat</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (val) => handleUpdateLandDoc({ sertifikatImage: val }))}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc(
                              'SERTIFIKAT INDUK LAHAN',
                              `${selectedLandDetail.alasHak} • ${selectedLandDetail.luasTanah} • ${selectedLandDetail.namaPetani}`,
                              '#065f46'
                            );
                            handleUpdateLandDoc({ sertifikatImage: sample });
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          + Pasang Sampel Sertifikat
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dokumen 2: Akta Notaris PPJB */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">Surat Perjanjian / Akta PPJB</span>
                      {selectedLandDetail.perjanjianImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>

                    {selectedLandDetail.perjanjianImage ? (
                      <div className="space-y-1.5">
                        <div className="relative h-24 w-full rounded-lg overflow-hidden border border-blue-300 bg-slate-100 group">
                          <img
                            src={selectedLandDetail.perjanjianImage}
                            alt="Akta PPJB"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: `Akta PPJB: ${selectedLandDetail.namaPetani} (${selectedLandDetail.projectNama})`, src: selectedLandDetail.perjanjianImage! })}
                              className="px-2 py-1 bg-white text-slate-900 rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLandDoc({ perjanjianImage: null })}
                              className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Akta PPJB: ${selectedLandDetail.namaPetani} (${selectedLandDetail.projectNama})`, src: selectedLandDetail.perjanjianImage! })}
                            className="text-blue-700 hover:underline font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Lihat Berkas
                          </button>
                          <label className="text-slate-500 hover:text-slate-800 cursor-pointer underline font-medium">
                            <span>Ganti Berkas</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (val) => handleUpdateLandDoc({ perjanjianImage: val }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30">
                          <UploadCloud className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[11px]">Upload Foto Akta PPJB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (val) => handleUpdateLandDoc({ perjanjianImage: val }))}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc(
                              'AKTA NOTARIS & PPJB LAHAN',
                              `PPJB Pembebasan Lahan • ${selectedLandDetail.namaPetani} • ${selectedLandDetail.projectNama}`,
                              '#1e40af'
                            );
                            handleUpdateLandDoc({ perjanjianImage: sample });
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                        >
                          + Pasang Sampel Akta PPJB
                        </button>
                      </div>
                    )}
                  </div>
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
                  <div key={pay.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
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

                    {/* Baris Bukti Slip Pembayaran ke Petani */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5 text-amber-600" />
                        <span>Bukti Slip / Nota Pembayaran:</span>
                      </span>

                      {pay.kwitansiImage ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Bukti Transfer Lahan: ${pay.keterangan} - Rp ${pay.nominal.toLocaleString('id-ID')}`, src: pay.kwitansiImage! })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[10px] transition"
                          >
                            <Eye className="w-3 h-3 text-amber-700" />
                            <span>Lihat Slip Transfer</span>
                          </button>
                          <label className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer font-semibold underline">
                            <span>Ganti</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLandReceiptUpload(e, pay.id)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => updateLandPaymentReceipt(pay.id, null)}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 italic">Belum ada slip</span>
                          <label className="text-[10px] px-2 py-0.5 bg-white border border-slate-300 hover:border-amber-400 text-slate-700 rounded font-semibold cursor-pointer transition flex items-center gap-1 shadow-2xs">
                            <UploadCloud className="w-3 h-3 text-slate-500" />
                            <span>Upload Slip</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLandReceiptUpload(e, pay.id)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const sample = generateSampleDoc(
                                'BUKTI TRANSFER BANK - CICILAN LAHAN',
                                `Nominal: Rp ${pay.nominal.toLocaleString('id-ID')} • ${pay.keterangan}`,
                                '#9a3412'
                              );
                              updateLandPaymentReceipt(pay.id, sample);
                            }}
                            className="text-[10px] px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded font-semibold transition"
                          >
                            + Sampel
                          </button>
                        </div>
                      )}
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

              {/* UPLOAD BERKAS DOKUMEN LEGALITAS LAHAN */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Upload Berkas Legalitas Lahan Induk (Opsional)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sertifikat Induk */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">Sertifikat / Alas Hak</span>
                      {sertifikatImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>
                    {sertifikatImage ? (
                      <div className="space-y-1">
                        <div className="relative h-20 w-full rounded-lg overflow-hidden border border-emerald-300 bg-slate-100 group">
                          <img src={sertifikatImage} alt="Sertifikat" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: 'Preview Sertifikat Induk', src: sertifikatImage })}
                              className="px-2 py-0.5 bg-white text-slate-900 rounded font-bold text-[10px]"
                            >
                              Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setSertifikatImage(null)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold text-[10px]"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-2.5 flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30">
                          <UploadCloud className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[10px]">Upload Sertifikat</span>
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setSertifikatImage)} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc('SERTIFIKAT INDUK LAHAN', `${alasHak || 'SHM / Letter C'} • ${luasTanah || 'Tanah Mentah'}`, '#065f46');
                            setSertifikatImage(sample);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          + Sampel SHM
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Akta Notaris PPJB */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">Akta Notaris / PPJB</span>
                      {perjanjianImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>
                    {perjanjianImage ? (
                      <div className="space-y-1">
                        <div className="relative h-20 w-full rounded-lg overflow-hidden border border-blue-300 bg-slate-100 group">
                          <img src={perjanjianImage} alt="Akta PPJB" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: 'Preview Akta PPJB', src: perjanjianImage })}
                              className="px-2 py-0.5 bg-white text-slate-900 rounded font-bold text-[10px]"
                            >
                              Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setPerjanjianImage(null)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold text-[10px]"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-2.5 flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30">
                          <UploadCloud className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[10px]">Upload Akta PPJB</span>
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPerjanjianImage)} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc('AKTA NOTARIS & PPJB LAHAN', `Perjanjian Pembebasan Lahan • ${namaPetani || 'Pemilik'}`, '#1e40af');
                            setPerjanjianImage(sample);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                        >
                          + Sampel PPJB
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4">
          <div className="w-full flex justify-between items-center text-white max-w-4xl pb-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm">{previewImage.title}</span>
            </div>
            <button
              onClick={() => setPreviewImage(null)}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
            >
              ✕ Tutup [ESC]
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 max-w-4xl max-h-[82vh] overflow-hidden">
            <img
              src={previewImage.src}
              alt="Preview Berkas"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>

          <div className="text-white/60 text-xs text-center pb-2">
            Klik Tutup untuk kembali ke aplikasi
          </div>
        </div>
      )}
    </div>
  );
}

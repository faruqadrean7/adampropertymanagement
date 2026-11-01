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
  CreditCard,
  UploadCloud,
  Image as ImageIcon,
  Eye,
  Trash2,
  X,
  UserCheck,
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  FileCheck
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
  const [previewImage, setPreviewImage] = useState<{ title: string; src: string } | null>(null);

  // Form Add Customer - Data Diri
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [noKk, setNoKk] = useState('');
  const [telepon, setTelepon] = useState('');
  const [tempatTanggalLahir, setTempatTanggalLahir] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [alamat, setAlamat] = useState('');

  // Form Add Customer - Berkas Dokumen Fisik
  const [ktpImage, setKtpImage] = useState<string | null>(null);
  const [kkImage, setKkImage] = useState<string | null>(null);

  // Form Add Customer - Transaksi Kavling
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

  // Helper untuk membaca upload file gambar lokal
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

  // Helper create dummy SVG preview jika pengguna ingin tes cepat
  const generateSampleDoc = (title: string, subtitle: string, bg: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <rect width="600" height="380" fill="${bg}" rx="12"/>
      <rect x="20" y="20" width="560" height="340" fill="none" stroke="white" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>
      <circle cx="300" cy="140" r="45" fill="white" opacity="0.2"/>
      <text x="300" y="215" font-family="Arial" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
      <text x="300" y="245" font-family="Arial" font-size="14" fill="white" opacity="0.8" text-anchor="middle">${subtitle}</text>
      <text x="300" y="280" font-family="Arial" font-size="12" fill="white" opacity="0.6" text-anchor="middle">PT ADAM PROPERTY INDONESIA</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  // Calculations
  const filteredCustomers = customers.filter(c => {
    const matchSearch = `${c.nama} ${c.nik} ${c.noKk || ''} ${c.kavlingKode || ''} ${c.telepon}`.toLowerCase().includes(searchQuery.toLowerCase());
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
      alert('Pilih unit kavling yang dibeli terlebih dahulu!');
      return;
    }
    addCustomer({
      nama,
      nik,
      noKk,
      telepon,
      tempatTanggalLahir,
      pekerjaan,
      alamat,
      kavlingId: selectedKavlingId,
      totalHarga: Number(totalHarga),
      uangMuka: Number(uangMuka),
      metodeBayar,
      rincianBarter: metodeBayar === 'barter' ? rincianBarter : undefined,
      ktpImage,
      kkImage
    });

    setShowAddModal(false);

    // Reset Form
    setNama('');
    setNik('');
    setNoKk('');
    setTelepon('');
    setTempatTanggalLahir('');
    setPekerjaan('');
    setAlamat('');
    setSelectedKavlingId('');
    setKtpImage(null);
    setKkImage(null);
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
            placeholder="Cari customer, NIK, No. KK, telepon, kavling..."
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
            <span>+ Tambah Customer & Upload Dokumen</span>
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Customer & Data Diri</th>
                <th className="py-3 px-4">Berkas Dokumen</th>
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
                      {cust.noKk && (
                        <div className="text-[10px] text-slate-400 font-mono">No. KK: {cust.noKk}</div>
                      )}
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> {cust.telepon}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {cust.ktpImage ? (
                          <button
                            onClick={() => setPreviewImage({ title: `Foto KTP: ${cust.nama}`, src: cust.ktpImage! })}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 hover:bg-blue-100 transition"
                            title="Klik untuk melihat berkas KTP"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>KTP ✓</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">KTP (-)</span>
                        )}

                        {cust.kkImage ? (
                          <button
                            onClick={() => setPreviewImage({ title: `Foto Kartu Keluarga: ${cust.nama}`, src: cust.kkImage! })}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 hover:bg-purple-100 transition"
                            title="Klik untuk melihat berkas KK"
                          >
                            <FileText className="w-3 h-3" />
                            <span>KK ✓</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">KK (-)</span>
                        )}
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
                        title="Lihat Detail Customer & Berkas"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Detail</span>
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

      {/* ======================================================== */}
      {/* MODAL 1: REGISTRASI CUSTOMER (DATA DIRI + UPLOAD KTP & KK) */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            
            {/* Header Modal */}
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>+ Registrasi Customer & Pembelian Kavling</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi identitas data diri, unggah berkas KTP & Kartu Keluarga (KK), serta detail kavling yang dibeli.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-5 text-xs">
              
              {/* ---------------------------------------------------- */}
              {/* BAGIAN 1: DATA DIRI & IDENTITAS KONSUMEN */}
              {/* ---------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>1. DATA DIRI & IDENTITAS KONSUMEN</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nama Lengkap Pembeli (Sesuai KTP) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Bpk. Bambang Sutrisno"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nomor Induk Kependudukan (NIK KTP - 16 Digit) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      placeholder="332408xxxxxxxxxx"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nomor Kartu Keluarga (No. KK - 16 Digit)
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={noKk}
                      onChange={(e) => setNoKk(e.target.value)}
                      placeholder="332408xxxxxxxxxx"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      No. WhatsApp / HP Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="08123456789"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tempat & Tanggal Lahir
                    </label>
                    <input
                      type="text"
                      value={tempatTanggalLahir}
                      onChange={(e) => setTempatTanggalLahir(e.target.value)}
                      placeholder="Contoh: Kendal, 15 Agustus 1985"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pekerjaan / Instansi
                  </label>
                  <input
                    type="text"
                    value={pekerjaan}
                    onChange={(e) => setPekerjaan(e.target.value)}
                    placeholder="Contoh: Wiraswasta / Karyawan BUMN / PNS"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alamat Lengkap Domisili KTP
                  </label>
                  <textarea
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Contoh: RT 03 / RW 02 Desa Sukamaju, Kec. Kaliwungu, Kab. Kendal"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* BAGIAN 2: UPLOAD BERKAS DOKUMEN FISIK (KTP & KK) */}
              {/* ---------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>2. UPLOAD BERKAS DOKUMEN FISIK (KTP & KK)</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setKtpImage(generateSampleDoc('KARTU TANDA PENDUDUK (KTP)', `NIK: ${nik || '3324081234560001'}`, '#1e3a8a'));
                        setKkImage(generateSampleDoc('KARTU KELUARGA (KK)', `No KK: ${noKk || '3324089876540002'}`, '#581c87'));
                      }}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 transition"
                      title="Isi sampel foto otomatis untuk pengujian"
                    >
                      + Isi Sampel Otomatis
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Format gambar: JPG, PNG, atau WebP (Maksimal 8 MB per file). Dokumen tersimpan aman untuk keperluan akta notaris & PPJB.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* UPLOAD KTP BOX */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Foto / Scan E-KTP</span>
                      </span>
                      {ktpImage && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          ✓ Siap
                        </span>
                      )}
                    </div>

                    {ktpImage ? (
                      <div className="space-y-2">
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                          <img 
                            src={ktpImage} 
                            alt="Preview KTP" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: 'Preview Berkas KTP', src: ktpImage })}
                              className="px-2.5 py-1 bg-white text-slate-900 rounded-md font-bold text-[11px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setKtpImage(null)}
                              className="px-2.5 py-1 bg-rose-600 text-white rounded-md font-bold text-[11px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500 truncate">Foto KTP terpilih</span>
                          <button
                            type="button"
                            onClick={() => setKtpImage(null)}
                            className="text-rose-600 hover:underline font-semibold"
                          >
                            Ganti Berkas
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center h-28">
                        <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="font-bold text-slate-700 text-xs">Pilih File KTP</span>
                        <span className="text-[10px] text-slate-400">Klik untuk jelajahi berkas</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setKtpImage)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* UPLOAD KK BOX */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>Foto / Scan Kartu Keluarga</span>
                      </span>
                      {kkImage && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          ✓ Siap
                        </span>
                      )}
                    </div>

                    {kkImage ? (
                      <div className="space-y-2">
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                          <img 
                            src={kkImage} 
                            alt="Preview KK" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: 'Preview Berkas Kartu Keluarga (KK)', src: kkImage })}
                              className="px-2.5 py-1 bg-white text-slate-900 rounded-md font-bold text-[11px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setKkImage(null)}
                              className="px-2.5 py-1 bg-rose-600 text-white rounded-md font-bold text-[11px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500 truncate">Foto KK terpilih</span>
                          <button
                            type="button"
                            onClick={() => setKkImage(null)}
                            className="text-rose-600 hover:underline font-semibold"
                          >
                            Ganti Berkas
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-300 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/30 rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center h-28">
                        <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="font-bold text-slate-700 text-xs">Pilih File KK</span>
                        <span className="text-[10px] text-slate-400">Klik untuk jelajahi berkas</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setKkImage)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* BAGIAN 3: UNIT KAVLING & SKEMA TRANSAKSI FINANSIAL */}
              {/* ---------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>3. PILIHAN KAVLING & SKEMA PEMBAYARAN</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pilih Unit Kavling yang Dibeli *
                  </label>
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
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Pilih Unit Kavling Siap Jual --</option>
                    {availableLots.map(k => (
                      <option key={k.id} value={k.id}>
                        {k.blok} - {k.nomor} ({k.luas} m² - Rp {k.harga.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Total Nilai Kesepakatan (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={totalHarga}
                      onChange={(e) => setTotalHarga(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Uang Muka / DP Dibayar (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      value={uangMuka}
                      onChange={(e) => setUangMuka(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-mono font-bold text-emerald-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Metode Pembayaran Uang Muka *
                  </label>
                  <select
                    value={metodeBayar}
                    onChange={(e) => setMetodeBayar(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
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
                      placeholder="Contoh: Semen Gresik 1.000 sak @ 68rb = 68jt, Besi 12mm 500 btg = 42jt..."
                      className="w-full border border-amber-300 rounded-xl p-2.5 bg-white text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold shadow-md shadow-emerald-950/20 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Transaksi & Berkas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DETAIL CUSTOMER (BIODATA + BERKAS KTP/KK + KWITANSI) */}
      {/* ======================================================== */}
      {selectedCustDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            
            {/* Header Detail */}
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedCustDetail.nama}</h3>
                <p className="text-xs text-slate-500">
                  Unit: <b className="text-slate-800 font-mono">{selectedCustDetail.kavlingKode}</b> &bull; NIK: <span className="font-mono">{selectedCustDetail.nik}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedCustDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1 text-xs">
              
              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Total Kontrak</span>
                  <span className="font-bold text-xs font-mono text-slate-900">
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

              {/* Biodata Lengkap Customer */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 pb-1.5 border-b border-slate-200">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Biodata Konsumen</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">NIK:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedCustDetail.nik}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nomor KK:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedCustDetail.noKk || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">WhatsApp:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedCustDetail.telepon}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pekerjaan:</span>
                    <span className="font-semibold text-slate-800">{selectedCustDetail.pekerjaan || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Alamat Domisili KTP:</span>
                    <span className="text-slate-800">{selectedCustDetail.alamat || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Dokumen Arsip KTP & KK */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 pb-1.5 border-b border-slate-200">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Berkas Dokumen Identitas (KTP & KK)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Card KTP */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-[11px] text-slate-800 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-blue-600" /> E-KTP Konsumen
                      </span>
                      {selectedCustDetail.ktpImage ? (
                        <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">Tersedia</span>
                      ) : (
                        <span className="text-[9px] text-slate-400">Belum Ada</span>
                      )}
                    </div>

                    {selectedCustDetail.ktpImage ? (
                      <div 
                        onClick={() => setPreviewImage({ title: `Foto E-KTP: ${selectedCustDetail.nama}`, src: selectedCustDetail.ktpImage! })}
                        className="cursor-pointer group relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        <img src={selectedCustDetail.ktpImage} alt="KTP" className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1">
                          <Eye className="w-4 h-4" /> Perbesar KTP
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs italic">
                        Belum diunggah
                      </div>
                    )}
                  </div>

                  {/* Card KK */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-[11px] text-slate-800 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-purple-600" /> Kartu Keluarga (KK)
                      </span>
                      {selectedCustDetail.kkImage ? (
                        <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">Tersedia</span>
                      ) : (
                        <span className="text-[9px] text-slate-400">Belum Ada</span>
                      )}
                    </div>

                    {selectedCustDetail.kkImage ? (
                      <div 
                        onClick={() => setPreviewImage({ title: `Foto KK: ${selectedCustDetail.nama}`, src: selectedCustDetail.kkImage! })}
                        className="cursor-pointer group relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        <img src={selectedCustDetail.kkImage} alt="KK" className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1">
                          <Eye className="w-4 h-4" /> Perbesar KK
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs italic">
                        Belum diunggah
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Riwayat Kwitansi & Pembayaran */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Riwayat Kwitansi & Transaksi Pembayaran:</span>
                </h4>
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

      {/* ======================================================== */}
      {/* MODAL 3: LIGHTBOX PREVIEW DOKUMEN (ZOOM KTP & KK) */}
      {/* ======================================================== */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4">
          <div className="w-full flex justify-between items-center text-white max-w-4xl pb-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">{previewImage.title}</span>
            </div>
            <button
              onClick={() => setPreviewImage(null)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-auto max-w-4xl max-h-[80vh] flex items-center justify-center p-2">
            <img 
              src={previewImage.src} 
              alt={previewImage.title} 
              className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
            />
          </div>

          <div className="text-center text-xs text-slate-400">
            PT Adam Property Indonesia &bull; Dokumen Kependudukan Konsumen
          </div>
        </div>
      )}

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
                <X className="w-5 h-5" />
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
                    className="w-full border border-amber-300 rounded-xl p-2.5 text-xs bg-white font-mono"
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
    </div>
  );
}

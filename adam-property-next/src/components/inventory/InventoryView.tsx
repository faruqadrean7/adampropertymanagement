'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import { 
  Boxes, 
  Plus, 
  Printer, 
  Search, 
  Laptop, 
  Compass, 
  ShieldCheck, 
  Armchair, 
  Trash2, 
  QrCode, 
  Tag 
} from 'lucide-react';
import { InventoryItem } from '@/types';

export default function InventoryView() {
  const { 
    inventory, 
    addInventoryItem, 
    deleteInventoryItem, 
    totalAssetValue 
  } = useProperty();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<InventoryItem | null>(null);

  // Form states
  const [kode, setKode] = useState(`INV-2026-00${inventory.length + 1}`);
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<InventoryItem['kategori']>('elektronik');
  const [kondisi, setKondisi] = useState<InventoryItem['kondisi']>('baik');
  const [lokasi, setLokasi] = useState('Ruang Kantor Administrasi');
  const [penanggungJawab, setPenanggungJawab] = useState('Staf Operasional');
  const [sumberDana, setSumberDana] = useState('Kas Besar Developer');
  const [nilaiPerolehan, setNilaiPerolehan] = useState(3500000);
  const [jumlah, setJumlah] = useState(1);
  const [satuan, setSatuan] = useState('Unit');
  const [nomorSeri, setNomorSeri] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const filteredItems = inventory.filter(item => {
    const matchCat = categoryFilter === 'all' || item.kategori === categoryFilter;
    const matchSearch = `${item.kode} ${item.nama} ${item.lokasi} ${item.penanggungJawab}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalUnits = inventory.reduce((sum, i) => sum + i.jumlah, 0);
  const goodUnits = inventory.filter(i => i.kondisi === 'baik').reduce((sum, i) => sum + i.jumlah, 0);
  const repairUnits = inventory.filter(i => i.kondisi !== 'baik').reduce((sum, i) => sum + i.jumlah, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      kode,
      nama,
      kategori,
      kondisi,
      lokasi,
      penanggungJawab,
      tanggal: new Date().toISOString().split('T')[0],
      sumberDana,
      nilaiPerolehan: Number(nilaiPerolehan),
      jumlah: Number(jumlah),
      satuan,
      nomorSeri,
      keterangan
    });
    setShowAddModal(false);
    // Reset
    setNama('');
    setNomorSeri('');
    setKeterangan('');
    setKode(`INV-2026-00${inventory.length + 2}`);
  };

  const getCategoryIcon = (kat: string) => {
    switch (kat) {
      case 'elektronik': return <Laptop className="w-4 h-4 text-blue-600" />;
      case 'survey': return <Compass className="w-4 h-4 text-amber-600" />;
      case 'keamanan': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'furniture': return <Armchair className="w-4 h-4 text-purple-600" />;
      default: return <Boxes className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center text-sm font-bold">
              <Boxes className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Manajemen Inventaris & Aset Kantor Tetap
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan sarana kantor, laptop, printer, theodolite alat ukur tanah, brankas, dan stiker label barcode aset.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Inventaris</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* 4 Financial & Quantity Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 p-5 rounded-2xl border border-slate-800 text-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium text-rose-400">Total Nilai Buku Aset</span>
              <Boxes className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-2xl font-black text-rose-300 font-mono tracking-tight">
              Rp {totalAssetValue.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <span>Nilai Akuisisi Perolehan</span>
            <span className="text-rose-400 font-bold">Aktiva Tetap</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-semibold">Total Unit Aset Fisik</span>
              <Tag className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-mono">
              {totalUnits} <span className="text-xs font-normal text-slate-400">Unit Barang</span>
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
            {inventory.length} item inventaris teregistrasi
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-semibold text-emerald-700">Kondisi Prima & Siap Pakai</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <h3 className="text-2xl font-black text-emerald-600 font-mono">
              {goodUnits} <span className="text-xs font-normal text-slate-400">Unit</span>
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-emerald-600 font-semibold">
            {totalUnits > 0 ? Math.round((goodUnits / totalUnits) * 100) : 0}% aset beroperasi normal
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-semibold text-amber-700">Perlu Servis / Perbaikan</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            </div>
            <h3 className="text-2xl font-black text-amber-600 font-mono">
              {repairUnits} <span className="text-xs font-normal text-slate-400">Unit</span>
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
            Perlu perawatan berkala
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
            placeholder="Cari kode, nama aset, penanggung jawab..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Semua Aset
          </button>
          <button
            onClick={() => setCategoryFilter('elektronik')}
            className={`px-3 py-1.5 rounded-lg transition ${categoryFilter === 'elektronik' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Elektronik
          </button>
          <button
            onClick={() => setCategoryFilter('survey')}
            className={`px-3 py-1.5 rounded-lg transition ${categoryFilter === 'survey' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Alat Survey
          </button>
          <button
            onClick={() => setCategoryFilter('keamanan')}
            className={`px-3 py-1.5 rounded-lg transition ${categoryFilter === 'keamanan' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Brankas
          </button>
          <button
            onClick={() => setCategoryFilter('furniture')}
            className={`px-3 py-1.5 rounded-lg transition ${categoryFilter === 'furniture' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Mebel & Meja
          </button>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {item.kode}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {item.kondisi}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                  {getCategoryIcon(item.kategori)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {item.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.lokasi}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">PIC / Pemegang:</span>
                  <span className="font-semibold text-slate-800">{item.penanggungJawab}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jumlah:</span>
                  <span className="font-semibold">{item.jumlah} {item.satuan}</span>
                </div>
                {item.nomorSeri && (
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-400 font-sans">Serial No:</span>
                    <span className="text-slate-700">{item.nomorSeri}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Nilai Perolehan:</span>
                <span className="font-mono font-bold text-rose-700 text-sm">
                  Rp {(item.nilaiPerolehan * item.jumlah).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedSticker(item)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  title="Cetak Stiker Label Barcode"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-600" />
                  <span>Stiker</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus data aset ${item.nama}?`)) {
                      deleteInventoryItem(item.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus Aset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          Tidak ada inventaris yang cocok dengan filter pencarian.
        </div>
      )}

      {/* Modal Preview Stiker Barcode Aset */}
      {selectedSticker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl bg-slate-50">
              <div className="flex items-center justify-center gap-2 mb-2 pb-2 border-b border-slate-200">
                <img src="/assets/logo-icon.svg" alt="Logo" className="w-6 h-6 object-contain" />
                <div className="text-left leading-none">
                  <span className="font-black text-xs text-slate-900 block">PT ADAM PROPERTY</span>
                  <span className="text-[9px] text-slate-500 font-semibold">LABEL INVENTARIS ASET</span>
                </div>
              </div>

              {/* Simulated Barcode */}
              <div className="py-2 bg-white rounded border border-slate-200 flex flex-col items-center justify-center">
                <div className="font-mono text-2xl tracking-widest font-black text-slate-800">
                  ||||| | |||| ||| ||
                </div>
                <span className="font-mono font-bold text-xs text-slate-900 mt-1">
                  {selectedSticker.kode}
                </span>
              </div>

              <div className="text-left mt-3 space-y-0.5 text-[11px] text-slate-700">
                <p className="font-bold truncate text-slate-900">{selectedSticker.nama}</p>
                <p className="text-slate-500">PIC: {selectedSticker.penanggungJawab}</p>
                <p className="text-slate-500">Lokasi: {selectedSticker.lokasi}</p>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <button
                onClick={() => setSelectedSticker(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Inventaris */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-600" />
              <span>+ Registrasi Aset / Inventaris Baru</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode Aset *</label>
                  <input
                    type="text"
                    required
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Aset *</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="elektronik">Elektronik & Komputer</option>
                    <option value="survey">Alat Survey & Ukur Tanah</option>
                    <option value="keamanan">Keamanan & Brankas</option>
                    <option value="furniture">Mebel & Meja Kursi</option>
                    <option value="kendaraan">Kendaraan Operasional</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Barang / Aset *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Digital Theodolite South / Laptop Asus ROG"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nilai Perolehan (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={nilaiPerolehan}
                    onChange={(e) => setNilaiPerolehan(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-rose-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah & Satuan *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={jumlah}
                      onChange={(e) => setJumlah(Number(e.target.value))}
                      className="w-20 border border-slate-300 rounded-xl px-3 py-2"
                    />
                    <input
                      type="text"
                      required
                      value={satuan}
                      onChange={(e) => setSatuan(e.target.value)}
                      className="flex-1 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lokasi Penempatan *</label>
                  <input
                    type="text"
                    required
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Penanggung Jawab (PIC) *</label>
                  <input
                    type="text"
                    required
                    value={penanggungJawab}
                    onChange={(e) => setPenanggungJawab(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Seri / Plat Nomor</label>
                <input
                  type="text"
                  value={nomorSeri}
                  onChange={(e) => setNomorSeri(e.target.value)}
                  placeholder="SN-12345-XXX"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan Spesifikasi</label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5"
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
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Aset Kantor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

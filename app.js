// app.js - Logika Aplikasi Pencatatan Customer Kavling (Adam Property)

let allCustomers = [];
let filteredCustomers = [];
let currentFilter = 'all'; // 'all', 'unpaid', 'paid'
let searchQuery = '';
let currentCustomer = null;
let currentCustomerPayments = [];

// Inisialisasi Aplikasi saat Dokumen Siap
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        await refreshCustomerList();
        
        // Atur default tanggal hari ini di form pembayaran
        const today = new Date().toISOString().split('T')[0];
        const payDateInput = document.getElementById('payTanggalInput');
        if (payDateInput) payDateInput.value = today;

    } catch (error) {
        console.error('Gagal inisialisasi database:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Database',
            text: 'Terjadi kendala saat membuka IndexedDB pada browser Anda.'
        });
    }
});

// Format Rupiah
function formatRupiah(number) {
    if (isNaN(number) || number === null || number === undefined) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
}

// Format Tanggal Indonesia
function formatTanggalIndo(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
}

// Format Input Uang saat mengetik
function formatCurrencyInput(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (!value) {
        input.value = '';
        return;
    }
    input.value = new Intl.NumberFormat('id-ID').format(value);
}

function parseCurrencyInput(str) {
    if (!str) return 0;
    return parseInt(str.toString().replace(/[^0-9]/g, ''), 10) || 0;
}

// ==========================================
// PENGAMBILAN & PERHITUNGAN DATA CUSTOMER
// ==========================================

async function refreshCustomerList() {
    try {
        const customers = await CustomerDB.getAll();
        const payments = await PaymentDB.getAll();

        // Hitung total uang masuk per customer
        const customerPaymentsMap = {};
        payments.forEach(p => {
            const cId = p.customerId;
            if (!customerPaymentsMap[cId]) {
                customerPaymentsMap[cId] = [];
            }
            customerPaymentsMap[cId].push(p);
        });

        allCustomers = customers.map(c => {
            const cPayments = customerPaymentsMap[c.id] || [];
            const totalMasuk = cPayments.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);
            const harga = Number(c.harga) || 0;
            const sisa = Math.max(0, harga - totalMasuk);
            const isLunas = harga > 0 && totalMasuk >= harga;

            return {
                ...c,
                totalMasuk,
                sisa,
                isLunas,
                paymentCount: cPayments.length
            };
        });

        // Urutkan customer terbaru di atas
        allCustomers.sort((a, b) => (b.id || 0) - (a.id || 0));

        updateDashboardMetrics();
        applyFilterAndSearch();

    } catch (err) {
        console.error('Error saat refresh data:', err);
    }
}

// Update Ringkasan Metric di Dashboard Atas
function updateDashboardMetrics() {
    const totalCustomers = allCustomers.length;
    const totalNilaiKavling = allCustomers.reduce((acc, c) => acc + (Number(c.harga) || 0), 0);
    const totalUangMasuk = allCustomers.reduce((acc, c) => acc + (c.totalMasuk || 0), 0);
    const totalSisa = allCustomers.reduce((acc, c) => acc + (c.sisa || 0), 0);
    const customerBelumLunas = allCustomers.filter(c => !c.isLunas).length;

    let persenMasuk = 0;
    if (totalNilaiKavling > 0) {
        persenMasuk = Math.min(100, Math.round((totalUangMasuk / totalNilaiKavling) * 100));
    }

    document.getElementById('statTotalCustomers').textContent = totalCustomers;
    document.getElementById('statTotalHarga').textContent = formatRupiah(totalNilaiKavling);
    document.getElementById('statTotalMasuk').textContent = formatRupiah(totalUangMasuk);
    document.getElementById('statPersenMasuk').textContent = `${persenMasuk}% dari target omset kavling`;
    document.getElementById('statTotalSisa').textContent = formatRupiah(totalSisa);
    document.getElementById('statCustomerBelumLunas').textContent = `${customerBelumLunas} Customer belum lunas`;
}

// Filter & Pencarian
function setFilter(filterType) {
    currentFilter = filterType;

    const btnAll = document.getElementById('btnFilterAll');
    const btnUnpaid = document.getElementById('btnFilterUnpaid');
    const btnPaid = document.getElementById('btnFilterPaid');

    [btnAll, btnUnpaid, btnPaid].forEach(btn => {
        btn.className = 'px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition';
    });

    if (filterType === 'all') {
        btnAll.className = 'px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-xs font-semibold transition';
    } else if (filterType === 'unpaid') {
        btnUnpaid.className = 'px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-xs font-semibold transition';
    } else if (filterType === 'paid') {
        btnPaid.className = 'px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-xs font-semibold transition';
    }

    applyFilterAndSearch();
}

function handleSearch(query) {
    searchQuery = (query || '').toLowerCase().trim();
    applyFilterAndSearch();
}

function applyFilterAndSearch() {
    filteredCustomers = allCustomers.filter(c => {
        // Filter Status
        if (currentFilter === 'unpaid' && c.isLunas) return false;
        if (currentFilter === 'paid' && !c.isLunas) return false;

        // Filter Cari
        if (searchQuery) {
            const nama = (c.nama || '').toLowerCase();
            const kavling = (c.kavling || '').toLowerCase();
            const telepon = (c.telepon || '').toLowerCase();
            if (!nama.includes(searchQuery) && !kavling.includes(searchQuery) && !telepon.includes(searchQuery)) {
                return false;
            }
        }
        return true;
    });

    renderCustomerTable();
}

// Render Tabel Utama Customer Kavling
function renderCustomerTable() {
    const tbody = document.getElementById('customerTableBody');
    const emptyState = document.getElementById('emptyState');

    if (filteredCustomers.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = filteredCustomers.map((c, index) => {
        const percent = c.harga > 0 ? Math.min(100, Math.round((c.totalMasuk / c.harga) * 100)) : 0;
        const statusBadge = c.isLunas
            ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <i class="fa-solid fa-circle-check text-[10px]"></i> Lunas
               </span>`
            : `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <i class="fa-solid fa-clock text-[10px]"></i> Mengangsur (${percent}%)
               </span>`;

        // Indikator Dokumen
        const hasKtp = !!c.ktpImage;
        const hasKk = !!c.kkImage;
        const docBadge = `
            <div class="flex items-center justify-center gap-1 text-[11px] text-slate-400 mt-1">
                <span class="${hasKtp ? 'text-blue-600 font-semibold' : 'text-slate-300'}" title="${hasKtp ? 'KTP Terlampir' : 'KTP Belum Ada'}">
                    <i class="fa-solid fa-id-card"></i> KTP
                </span>
                <span>•</span>
                <span class="${hasKk ? 'text-purple-600 font-semibold' : 'text-slate-300'}" title="${hasKk ? 'KK Terlampir' : 'KK Belum Ada'}">
                    <i class="fa-solid fa-people-roof"></i> KK
                </span>
            </div>
        `;

        return `
            <tr class="hover:bg-slate-50/80 transition group border-b border-slate-100">
                <td class="py-4 px-4 text-center font-medium text-slate-400 text-xs">${index + 1}</td>
                
                <!-- 1. Nama Customer -->
                <td class="py-4 px-4 font-semibold text-slate-900">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                            ${c.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div class="text-sm font-bold text-slate-800">${escapeHtml(c.nama)}</div>
                            <div class="text-xs text-slate-400 flex items-center gap-1">
                                ${c.telepon ? `<i class="fa-brands fa-whatsapp text-emerald-600"></i> ${escapeHtml(c.telepon)}` : '<span class="italic">No telp belum diisi</span>'}
                            </div>
                        </div>
                    </div>
                </td>

                <!-- 2. Kavling Yang Diambil -->
                <td class="py-4 px-4">
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200">
                        <i class="fa-solid fa-location-dot text-emerald-600 text-xs"></i>
                        <span>${escapeHtml(c.kavling)}</span>
                    </div>
                </td>

                <!-- 3. Harga Kavling -->
                <td class="py-4 px-4 text-right font-bold text-slate-800 text-sm">
                    ${formatRupiah(c.harga)}
                </td>

                <!-- Total Uang Masuk -->
                <td class="py-4 px-4 text-right">
                    <div class="font-bold text-emerald-600 text-sm">${formatRupiah(c.totalMasuk)}</div>
                    <div class="text-[11px] text-slate-400 font-medium">${c.paymentCount}x Pembayaran</div>
                </td>

                <!-- Sisa Pembayaran -->
                <td class="py-4 px-4 text-right">
                    <div class="font-bold ${c.sisa > 0 ? 'text-amber-600' : 'text-slate-400'} text-sm">
                        ${formatRupiah(c.sisa)}
                    </div>
                </td>

                <!-- Status Lunas / Belum -->
                <td class="py-4 px-4 text-center">
                    ${statusBadge}
                </td>

                <!-- 4. Data Customer & Riwayat Pembayaran (BUTTON UTAMA KE LAMAN DATA CUSTOMER) -->
                <td class="py-4 px-4 text-center">
                    <button onclick="openCustomerDetail(${c.id})" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition">
                        <i class="fa-solid fa-folder-open text-xs"></i>
                        <span>Buka Data Customer</span>
                    </button>
                    ${docBadge}
                </td>

                <!-- Aksi Edit / Hapus -->
                <td class="py-4 px-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="editCustomerById(${c.id})" title="Edit Data" class="w-8 h-8 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition flex items-center justify-center">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="deleteCustomer(${c.id})" title="Hapus Customer" class="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}


// ========================================================
// LAMAN DETAIL: "DATA CUSTOMER" (DOKUMEN KK/KTP + RIWAYAT PEMBAYARAN)
// ========================================================

async function openCustomerDetail(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) return;

    currentCustomer = customer;
    await refreshCustomerDetailView();

    document.getElementById('customerDetailModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeCustomerDetailModal() {
    document.getElementById('customerDetailModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    currentCustomer = null;
    currentCustomerPayments = [];
}

async function refreshCustomerDetailView() {
    if (!currentCustomer) return;

    // Ambil data customer terbaru dari DB
    const freshCust = await CustomerDB.getById(currentCustomer.id);
    if (freshCust) {
        currentCustomer = { ...currentCustomer, ...freshCust };
    }

    // Ambil riwayat pembayaran dari DB
    currentCustomerPayments = await PaymentDB.getByCustomerId(currentCustomer.id);

    // Hitung ulang keuangan
    const totalMasuk = currentCustomerPayments.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
    const harga = Number(currentCustomer.harga) || 0;
    const sisa = Math.max(0, harga - totalMasuk);
    const persen = harga > 0 ? Math.min(100, Math.round((totalMasuk / harga) * 100)) : 0;
    const isLunas = harga > 0 && totalMasuk >= harga;

    // Render Data Header Customer
    document.getElementById('detailCustomerName').textContent = currentCustomer.nama;
    document.getElementById('detailCustomerSubtitle').innerHTML = `
        <span class="font-bold text-emerald-400">Kavling: ${escapeHtml(currentCustomer.kavling)}</span> | 
        <span>Telp: ${escapeHtml(currentCustomer.telepon || '-')}</span> | 
        <span>Alamat: ${escapeHtml(currentCustomer.alamat || '-')}</span>
    `;

    document.getElementById('detailHargaKavling').textContent = formatRupiah(harga);
    document.getElementById('detailKavlingName').textContent = `Unit: ${escapeHtml(currentCustomer.kavling)}`;
    document.getElementById('detailTotalMasuk').textContent = formatRupiah(totalMasuk);
    document.getElementById('detailPersenLunas').textContent = `${persen}% Terbayar (${currentCustomerPayments.length} transaksi)`;
    document.getElementById('detailSisaPembayaran').textContent = formatRupiah(sisa);

    const badgeContainer = document.getElementById('detailStatusBadge');
    if (isLunas) {
        badgeContainer.innerHTML = `<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800"><i class="fa-solid fa-circle-check"></i> LUNAS</span>`;
    } else {
        badgeContainer.innerHTML = `<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800"><i class="fa-solid fa-clock"></i> BELUM LUNAS</span>`;
    }

    if (currentCustomer.createdAt) {
        document.getElementById('detailCreatedAtText').textContent = `Terdaftar sejak: ${formatTanggalIndo(currentCustomer.createdAt.slice(0, 10))}`;
    }

    // Render Dokumen KTP & KK
    renderDocumentsSection();

    // Render Tabel Riwayat Pembayaran / Uang Masuk
    renderPaymentsTable();
}

// Render Bagian Dokumen KTP & KK Customer
function renderDocumentsSection() {
    // 1. Dokumen KTP
    const ktpImgEl = document.getElementById('ktpImageEl');
    const ktpEmpty = document.getElementById('ktpEmptyState');
    const ktpOverlay = document.getElementById('ktpOverlay');
    const ktpDownloadBtn = document.getElementById('ktpDownloadBtn');
    const ktpStatusText = document.getElementById('ktpStatusText');

    if (currentCustomer.ktpImage) {
        ktpImgEl.src = currentCustomer.ktpImage;
        ktpImgEl.classList.remove('hidden');
        ktpEmpty.classList.add('hidden');
        ktpOverlay.classList.remove('hidden');
        ktpDownloadBtn.href = currentCustomer.ktpImage;
        ktpDownloadBtn.download = `KTP_${currentCustomer.nama.replace(/\s+/g, '_')}.jpg`;
        ktpStatusText.innerHTML = '<span class="text-emerald-600 font-semibold"><i class="fa-solid fa-check-circle"></i> File KTP siap dilihat</span>';
    } else {
        ktpImgEl.src = '';
        ktpImgEl.classList.add('hidden');
        ktpEmpty.classList.remove('hidden');
        ktpOverlay.classList.add('hidden');
        ktpStatusText.innerHTML = '<span class="text-slate-400">Belum ada dokumen KTP</span>';
    }

    // 2. Dokumen KK
    const kkImgEl = document.getElementById('kkImageEl');
    const kkEmpty = document.getElementById('kkEmptyState');
    const kkOverlay = document.getElementById('kkOverlay');
    const kkDownloadBtn = document.getElementById('kkDownloadBtn');
    const kkStatusText = document.getElementById('kkStatusText');

    if (currentCustomer.kkImage) {
        kkImgEl.src = currentCustomer.kkImage;
        kkImgEl.classList.remove('hidden');
        kkEmpty.classList.add('hidden');
        kkOverlay.classList.remove('hidden');
        kkDownloadBtn.href = currentCustomer.kkImage;
        kkDownloadBtn.download = `KK_${currentCustomer.nama.replace(/\s+/g, '_')}.jpg`;
        kkStatusText.innerHTML = '<span class="text-emerald-600 font-semibold"><i class="fa-solid fa-check-circle"></i> File KK siap dilihat</span>';
    } else {
        kkImgEl.src = '';
        kkImgEl.classList.add('hidden');
        kkEmpty.classList.remove('hidden');
        kkOverlay.classList.add('hidden');
        kkStatusText.innerHTML = '<span class="text-slate-400">Belum ada dokumen Kartu Keluarga</span>';
    }
}

// Upload / Update Dokumen KTP atau KK langsung dari laman detail
async function handleDocumentUpload(event, docType) {
    const file = event.target.files && event.target.files[0];
    if (!file || !currentCustomer) return;

    try {
        Swal.fire({
            title: 'Mengunggah Dokumen...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const compressedBase64 = await compressImage(file, 1600, 0.85);
        if (docType === 'ktp') {
            currentCustomer.ktpImage = compressedBase64;
        } else if (docType === 'kk') {
            currentCustomer.kkImage = compressedBase64;
        }

        await CustomerDB.update(currentCustomer.id, currentCustomer);
        await refreshCustomerList();
        await refreshCustomerDetailView();

        Swal.fire({
            icon: 'success',
            title: 'Dokumen Berhasil Disimpan',
            text: `Foto ${docType.toUpperCase()} berhasil diperbarui.`,
            timer: 1500,
            showConfirmButton: false
        });

    } catch (err) {
        console.error('Gagal upload dokumen:', err);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Mengunggah',
            text: 'Terjadi kesalahan saat memproses gambar.'
        });
    }
}

// Render Tabel Riwayat Pembayaran / Uang Masuk
function renderPaymentsTable() {
    const tbody = document.getElementById('detailPaymentTableBody');
    const emptyState = document.getElementById('paymentEmptyState');

    if (!currentCustomerPayments || currentCustomerPayments.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = currentCustomerPayments.map((p, idx) => {
        // Thumbnail Kwitansi
        const kwitansiThumb = p.kwitansiImage
            ? `<div class="relative inline-block group">
                <img src="${p.kwitansiImage}" alt="Kwitansi" class="w-12 h-12 object-cover rounded-lg border border-slate-200 clickable-image shadow-2xs" onclick="openLightbox('${p.kwitansiImage}', 'Kwitansi - ${escapeHtml(p.tujuan)} (${formatRupiah(p.nominal)})')">
                <button onclick="openLightbox('${p.kwitansiImage}', 'Kwitansi - ${escapeHtml(p.tujuan)}')" title="Lihat Foto Kwitansi" class="absolute inset-0 bg-black/40 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                </button>
               </div>`
            : `<span class="text-xs text-slate-300 italic"><i class="fa-regular fa-image"></i> Tanpa Foto</span>`;

        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                <td class="py-3 px-3 text-center text-xs text-slate-400 font-medium">${idx + 1}</td>
                <td class="py-3 px-3 whitespace-nowrap text-slate-700 font-medium text-xs">
                    <i class="fa-regular fa-calendar-days text-slate-400 mr-1"></i>
                    ${formatTanggalIndo(p.tanggal)}
                </td>
                <td class="py-3 px-3">
                    <span class="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        ${escapeHtml(p.tujuan)}
                    </span>
                </td>
                <td class="py-3 px-3 text-right font-bold text-emerald-600 text-sm whitespace-nowrap">
                    ${formatRupiah(p.nominal)}
                </td>
                <td class="py-3 px-3 text-xs text-slate-600 max-w-xs break-words">
                    ${escapeHtml(p.keterangan || '-')}
                </td>
                <td class="py-3 px-3 text-center">
                    ${kwitansiThumb}
                </td>
                <td class="py-3 px-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="printSingleReceipt(${p.id})" title="Cetak Kwitansi Ini" class="w-7 h-7 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition flex items-center justify-center">
                            <i class="fa-solid fa-print text-xs"></i>
                        </button>
                        <button onclick="deletePayment(${p.id})" title="Hapus Riwayat" class="w-7 h-7 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}


// ========================================================
// TAMBAH / EDIT CUSTOMER MODAL
// ========================================================

function openCustomerModal(editData = null) {
    const form = document.getElementById('customerForm');
    form.reset();

    const titleEl = document.getElementById('customerModalTitle');
    const idInput = document.getElementById('customerIdInput');

    if (editData) {
        titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Data Customer Kavling';
        idInput.value = editData.id;
        document.getElementById('namaInput').value = editData.nama || '';
        document.getElementById('kavlingInput').value = editData.kavling || '';
        document.getElementById('hargaInput').value = new Intl.NumberFormat('id-ID').format(editData.harga || 0);
        document.getElementById('teleponInput').value = editData.telepon || '';
        document.getElementById('alamatInput').value = editData.alamat || '';
    } else {
        titleEl.innerHTML = '<i class="fa-solid fa-user-plus"></i> Tambah Data Customer Kavling';
        idInput.value = '';
    }

    document.getElementById('customerFormModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeCustomerModal() {
    document.getElementById('customerFormModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

async function handleCustomerSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('customerIdInput').value;
    const nama = document.getElementById('namaInput').value.trim();
    const kavling = document.getElementById('kavlingInput').value.trim();
    const hargaRaw = document.getElementById('hargaInput').value;
    const harga = parseCurrencyInput(hargaRaw);
    const telepon = document.getElementById('teleponInput').value.trim();
    const alamat = document.getElementById('alamatInput').value.trim();

    if (!nama || !kavling || harga <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Data Belum Lengkap',
            text: 'Harap isi Nama Customer, Kavling, dan Harga Kavling dengan benar.'
        });
        return;
    }

    const ktpFile = document.getElementById('formKtpFile').files[0];
    const kkFile = document.getElementById('formKkFile').files[0];

    const submitBtn = document.getElementById('btnSubmitCustomer');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    try {
        let ktpImage = null;
        let kkImage = null;

        if (ktpFile) {
            ktpImage = await compressImage(ktpFile, 1600, 0.85);
        }
        if (kkFile) {
            kkImage = await compressImage(kkFile, 1600, 0.85);
        }

        if (id) {
            // Mode Update
            const existing = await CustomerDB.getById(id);
            const updated = {
                ...existing,
                nama,
                kavling,
                harga,
                telepon,
                alamat
            };
            if (ktpImage) updated.ktpImage = ktpImage;
            if (kkImage) updated.kkImage = kkImage;

            await CustomerDB.update(id, updated);
            Swal.fire({
                icon: 'success',
                title: 'Data Berhasil Diperbarui',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            // Mode Tambah Baru
            const newCust = {
                nama,
                kavling,
                harga,
                telepon,
                alamat,
                ktpImage: ktpImage || null,
                kkImage: kkImage || null
            };
            await CustomerDB.add(newCust);
            Swal.fire({
                icon: 'success',
                title: 'Customer Berhasil Ditambahkan',
                timer: 1500,
                showConfirmButton: false
            });
        }

        closeCustomerModal();
        await refreshCustomerList();

        // Jika modal detail sedang dibuka untuk customer ini, refresh viewnya
        if (currentCustomer && currentCustomer.id == id) {
            await refreshCustomerDetailView();
        }

    } catch (err) {
        console.error('Error saat simpan customer:', err);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan Data',
            text: err.message || 'Terjadi kesalahan sistem.'
        });
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Data Customer';
    }
}

async function editCustomerById(id) {
    const customer = await CustomerDB.getById(id);
    if (customer) {
        openCustomerModal(customer);
    }
}

function editCurrentCustomer() {
    if (currentCustomer) {
        openCustomerModal(currentCustomer);
    }
}

async function deleteCustomer(id) {
    const customer = allCustomers.find(c => c.id === id);
    const nama = customer ? customer.nama : 'Customer ini';

    const result = await Swal.fire({
        title: 'Hapus Customer?',
        html: `Apakah Anda yakin ingin menghapus data customer <b>${escapeHtml(nama)}</b>?<br><span class="text-xs text-red-500">Semua riwayat pembayaran, foto dokumen KK, KTP, dan kwitansi akan ikut terhapus permanen.</span>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        await CustomerDB.delete(id);
        if (currentCustomer && currentCustomer.id === id) {
            closeCustomerDetailModal();
        }
        await refreshCustomerList();
        Swal.fire({
            icon: 'success',
            title: 'Data Dihapus',
            timer: 1500,
            showConfirmButton: false
        });
    }
}


// ========================================================
// CATAT PEMBAYARAN / UANG MASUK & KWITANSI
// ========================================================

let tempKwitansiBase64 = null;

function openPaymentModal() {
    if (!currentCustomer) return;

    const form = document.getElementById('paymentForm');
    form.reset();
    tempKwitansiBase64 = null;
    clearKwitansiPreview();

    // Default tanggal hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('payTanggalInput').value = today;

    // Reset pilihan dropdown
    document.getElementById('payTujuanSelect').value = 'Booking Fee / Tanda Jadi';
    document.getElementById('payTujuanCustomInput').classList.add('hidden');

    document.getElementById('paymentFormModal').classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('paymentFormModal').classList.add('hidden');
    tempKwitansiBase64 = null;
}

function handleTujuanChange(val) {
    const customInput = document.getElementById('payTujuanCustomInput');
    if (val === 'Lainnya') {
        customInput.classList.remove('hidden');
        customInput.required = true;
        customInput.focus();
    } else {
        customInput.classList.add('hidden');
        customInput.required = false;
    }
}

async function previewKwitansiInput(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    try {
        const compressed = await compressImage(file, 1400, 0.8);
        tempKwitansiBase64 = compressed;

        document.getElementById('kwitansiUploadPrompt').classList.add('hidden');
        const previewBox = document.getElementById('kwitansiPreviewBox');
        const previewImg = document.getElementById('kwitansiPreviewImg');
        previewImg.src = compressed;
        previewBox.classList.remove('hidden');
    } catch (e) {
        console.error('Error preview kwitansi:', e);
    }
}

function clearKwitansiPreview() {
    tempKwitansiBase64 = null;
    const fileInput = document.getElementById('payKwitansiFile');
    if (fileInput) fileInput.value = '';
    document.getElementById('kwitansiUploadPrompt').classList.remove('hidden');
    document.getElementById('kwitansiPreviewBox').classList.add('hidden');
    document.getElementById('kwitansiPreviewImg').src = '';
}

async function handlePaymentSubmit(event) {
    event.preventDefault();
    if (!currentCustomer) return;

    const tanggal = document.getElementById('payTanggalInput').value;
    const selectTujuan = document.getElementById('payTujuanSelect').value;
    let tujuan = selectTujuan;
    if (selectTujuan === 'Lainnya') {
        tujuan = document.getElementById('payTujuanCustomInput').value.trim() || 'Pembayaran Lainnya';
    }

    const nominalRaw = document.getElementById('payNominalInput').value;
    const nominal = parseCurrencyInput(nominalRaw);
    const keterangan = document.getElementById('payKeteranganInput').value.trim();

    if (!tanggal || nominal <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Nominal Tidak Valid',
            text: 'Harap masukkan tanggal dan jumlah nominal uang masuk yang benar.'
        });
        return;
    }

    const submitBtn = document.getElementById('btnSubmitPayment');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    try {
        const paymentData = {
            customerId: currentCustomer.id,
            tanggal,
            tujuan,
            nominal,
            keterangan,
            kwitansiImage: tempKwitansiBase64 || null
        };

        await PaymentDB.add(paymentData);

        closePaymentModal();
        await refreshCustomerList();
        await refreshCustomerDetailView();

        Swal.fire({
            icon: 'success',
            title: 'Uang Masuk Berhasil Dicatat!',
            text: `Tercatat Rp ${new Intl.NumberFormat('id-ID').format(nominal)} untuk ${tujuan}.`,
            timer: 1800,
            showConfirmButton: false
        });

    } catch (err) {
        console.error('Gagal mencatat pembayaran:', err);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan Pembayaran',
            text: err.message
        });
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Pembayaran';
    }
}

async function deletePayment(paymentId) {
    const result = await Swal.fire({
        title: 'Hapus Catatan Pembayaran?',
        text: 'Riwayat uang masuk dan foto kwitansi ini akan dihapus dari sistem.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        await PaymentDB.delete(paymentId);
        await refreshCustomerList();
        await refreshCustomerDetailView();
        Swal.fire({
            icon: 'success',
            title: 'Riwayat Terhapus',
            timer: 1200,
            showConfirmButton: false
        });
    }
}


// ========================================================
// LIGHTBOX (PREVIEW GAMBAR FULLSCREEN)
// ========================================================

function openLightbox(imageSrc, title = 'Preview Dokumen') {
    if (!imageSrc) return;
    document.getElementById('lightboxTitle').textContent = title;
    const img = document.getElementById('lightboxImage');
    img.src = imageSrc;

    const downloadBtn = document.getElementById('lightboxDownload');
    downloadBtn.href = imageSrc;
    downloadBtn.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;

    document.getElementById('lightboxModal').classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightboxModal').classList.add('hidden');
    document.getElementById('lightboxImage').src = '';
}

// Tutup lightbox jika klik background
document.getElementById('lightboxModal').addEventListener('click', (e) => {
    if (e.target.id === 'lightboxModal' || e.target.id === 'lightboxImageContainer') {
        closeLightbox();
    }
});


// ========================================================
// FITUR CETAK KWITANSI RESMI & REKAP LAPORAN
// ========================================================

function printSingleReceipt(paymentId) {
    const payment = currentCustomerPayments.find(p => p.id === paymentId);
    if (!payment || !currentCustomer) return;

    const printableArea = document.getElementById('printableArea');
    const terbilangText = terbilang(payment.nominal) + ' Rupiah';

    printableArea.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 2px solid #0f766e; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f766e; padding-bottom: 15px; margin-bottom: 20px;">
                <div>
                    <h1 style="margin: 0; color: #047857; font-size: 24px; font-weight: bold; letter-spacing: 1px;">ADAM PROPERTY</h1>
                    <p style="margin: 3px 0 0; color: #475569; font-size: 13px;">Pengembangan Kavling Siap Bangun & Hunian Nyaman</p>
                </div>
                <div style="text-align: right;">
                    <div style="background-color: #047857; color: white; padding: 6px 16px; border-radius: 4px; font-weight: bold; font-size: 16px;">
                        KWITANSI PEMBAYARAN
                    </div>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #64748b;">No: KW-${currentCustomer.id}-${payment.id}</p>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 25px;">
                <tr style="height: 36px;">
                    <td style="width: 25%; font-weight: bold; color: #334155;">Telah Terima Dari</td>
                    <td style="width: 3%;">:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; font-weight: bold; color: #0f172a;">${escapeHtml(currentCustomer.nama)}</td>
                </tr>
                <tr style="height: 36px;">
                    <td style="font-weight: bold; color: #334155;">Uang Sejumlah</td>
                    <td>:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; font-style: italic; background-color: #f8fafc; padding: 4px 8px; color: #047857; font-weight: bold;">
                        ${terbilangText}
                    </td>
                </tr>
                <tr style="height: 36px;">
                    <td style="font-weight: bold; color: #334155;">Untuk Pembayaran</td>
                    <td>:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; color: #1e293b;">
                        <b>${escapeHtml(payment.tujuan)}</b> Kavling <b>${escapeHtml(currentCustomer.kavling)}</b>
                    </td>
                </tr>
                <tr style="height: 36px;">
                    <td style="font-weight: bold; color: #334155;">Keterangan</td>
                    <td>:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; color: #475569;">
                        ${escapeHtml(payment.keterangan || '-')}
                    </td>
                </tr>
            </table>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px;">
                <div>
                    <div style="border: 2px solid #047857; background: #ecfdf5; padding: 12px 20px; border-radius: 6px; display: inline-block;">
                        <span style="font-size: 13px; color: #065f46; display: block; font-weight: bold;">JUMLAH:</span>
                        <span style="font-size: 22px; font-weight: bold; color: #047857;">${formatRupiah(payment.nominal)}</span>
                    </div>
                    ${payment.kwitansiImage ? `
                    <div style="margin-top: 15px;">
                        <p style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Foto Lampiran Bukti / Nota:</p>
                        <img src="${payment.kwitansiImage}" style="max-height: 100px; border-radius: 4px; border: 1px solid #cbd5e1;">
                    </div>` : ''}
                </div>

                <div style="text-align: center; width: 220px;">
                    <p style="margin: 0; font-size: 13px; color: #475569;">Tanggal: ${formatTanggalIndo(payment.tanggal)}</p>
                    <p style="margin: 4px 0 60px; font-size: 13px; font-weight: bold; color: #334155;">Penerima,</p>
                    <p style="margin: 0; font-weight: bold; border-top: 1px solid #334155; padding-top: 4px; color: #0f172a;">( ADAM PROPERTY )</p>
                </div>
            </div>
        </div>
    `;

    window.print();
}

function printCustomerStatement() {
    if (!currentCustomer) return;

    const printableArea = document.getElementById('printableArea');
    const totalMasuk = currentCustomerPayments.reduce((acc, p) => acc + (Number(p.nominal) || 0), 0);
    const harga = Number(currentCustomer.harga) || 0;
    const sisa = Math.max(0, harga - totalMasuk);

    const rows = currentCustomerPayments.map((p, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
            <td style="padding: 8px; text-align: center;">${idx + 1}</td>
            <td style="padding: 8px;">${formatTanggalIndo(p.tanggal)}</td>
            <td style="padding: 8px; font-weight: bold;">${escapeHtml(p.tujuan)}</td>
            <td style="padding: 8px;">${escapeHtml(p.keterangan || '-')}</td>
            <td style="padding: 8px; text-align: right; font-weight: bold; color: #047857;">${formatRupiah(p.nominal)}</td>
        </tr>
    `).join('');

    printableArea.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 850px; margin: 0 auto; padding: 20px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px;">
                <div>
                    <h2 style="margin:0; color: #047857;">ADAM PROPERTY</h2>
                    <p style="margin:2px 0 0; font-size: 12px; color: #64748b;">Lembar Rekapitulasi Riwayat Pembayaran Customer</p>
                </div>
                <div style="text-align: right; font-size: 12px; color: #475569;">
                    <p style="margin:0;">Dicetak pada: ${formatTanggalIndo(new Date().toISOString().split('T')[0])}</p>
                </div>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <table style="width: 100%; font-size: 13px;">
                    <tr>
                        <td style="width: 20%; font-weight: bold;">Nama Customer</td>
                        <td style="width: 3%;">:</td>
                        <td style="width: 35%;">${escapeHtml(currentCustomer.nama)}</td>
                        <td style="width: 20%; font-weight: bold;">Harga Kavling</td>
                        <td style="width: 3%;">:</td>
                        <td style="font-weight: bold; color: #0f172a;">${formatRupiah(harga)}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">Kavling Diambil</td>
                        <td>:</td>
                        <td style="font-weight: bold; color: #047857;">${escapeHtml(currentCustomer.kavling)}</td>
                        <td style="font-weight: bold;">Total Terbayar</td>
                        <td>:</td>
                        <td style="font-weight: bold; color: #047857;">${formatRupiah(totalMasuk)}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">No. Telepon / WA</td>
                        <td>:</td>
                        <td>${escapeHtml(currentCustomer.telepon || '-')}</td>
                        <td style="font-weight: bold;">Sisa Pembayaran</td>
                        <td>:</td>
                        <td style="font-weight: bold; color: ${sisa > 0 ? '#b45309' : '#047857'};">${formatRupiah(sisa)} ${sisa === 0 ? '(LUNAS)' : ''}</td>
                    </tr>
                </table>
            </div>

            <h4 style="margin: 0 0 10px; font-size: 14px; color: #1e293b;">Riwayat Uang Masuk :</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background-color: #f1f5f9; text-align: left; font-size: 12px;">
                        <th style="padding: 8px; text-align: center; width: 5%;">#</th>
                        <th style="padding: 8px; width: 20%;">Tanggal</th>
                        <th style="padding: 8px; width: 25%;">Tujuan</th>
                        <th style="padding: 8px;">Keterangan</th>
                        <th style="padding: 8px; text-align: right; width: 20%;">Jumlah (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="5" style="text-align:center; padding:15px; color:#94a3b8;">Belum ada riwayat pembayaran</td></tr>'}
                </tbody>
                <tfoot>
                    <tr style="background-color: #ecfdf5; font-weight: bold; font-size: 13px;">
                        <td colspan="4" style="padding: 10px; text-align: right; color: #065f46;">TOTAL UANG MASUK:</td>
                        <td style="padding: 10px; text-align: right; color: #047857;">${formatRupiah(totalMasuk)}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="display: flex; justify-content: space-between; margin-top: 40px; font-size: 13px;">
                <div style="text-align: center; width: 200px;">
                    <p style="margin: 0 0 60px;">Customer,</p>
                    <p style="margin: 0; font-weight: bold; border-top: 1px solid #94a3b8; padding-top: 5px;">( ${escapeHtml(currentCustomer.nama)} )</p>
                </div>
                <div style="text-align: center; width: 200px;">
                    <p style="margin: 0 0 60px;">Pengelola ADAM PROPERTY,</p>
                    <p style="margin: 0; font-weight: bold; border-top: 1px solid #94a3b8; padding-top: 5px;">( Manajemen )</p>
                </div>
            </div>
        </div>
    `;

    window.print();
}


// ========================================================
// BACKUP & RESTORE
// ========================================================

function openBackupModal() {
    document.getElementById('backupModal').classList.remove('hidden');
}

function closeBackupModal() {
    document.getElementById('backupModal').classList.add('hidden');
}

async function handleExportBackup() {
    try {
        await BackupManager.exportBackup();
        Swal.fire({
            icon: 'success',
            title: 'Backup Berhasil Diunduh',
            text: 'Simpan file cadangan .json tersebut di tempat yang aman.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal Membuat Backup',
            text: err.message
        });
    }
}

async function handleImportBackup(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    const result = await Swal.fire({
        title: 'Pulihkan Data (Restore)?',
        text: 'Data saat ini akan digantikan dengan data dari file backup yang dipilih.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Pulihkan Sekarang',
        cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) {
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            await BackupManager.importBackup(e.target.result);
            closeBackupModal();
            await refreshCustomerList();
            Swal.fire({
                icon: 'success',
                title: 'Data Berhasil Dipulihkan!',
                text: 'Semua customer dan riwayat pembayaran telah dimuat kembali.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memulihkan Data',
                text: 'Format file tidak sesuai atau korup: ' + err.message
            });
        } finally {
            input.value = '';
        }
    };
    reader.readAsText(file);
}


// ========================================================
// CONTOH DATA (DEMO) UNTUK MEMUDAHKAN TESTING AWAL
// ========================================================

async function loadDemoData() {
    const result = await Swal.fire({
        title: 'Muat Contoh Data?',
        text: 'Aplikasi akan menambahkan 2 contoh customer kavling beserta dokumen sampel dan riwayat uang masuk untuk demonstrasi.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Muat Contoh',
        cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    // Helper SVG placeholder untuk contoh KTP & KK & Kwitansi
    function createDummySvg(text, bg) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
            <rect width="600" height="380" fill="${bg}"/>
            <circle cx="300" cy="150" r="45" fill="white" opacity="0.3"/>
            <text x="300" y="230" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">${text}</text>
            <text x="300" y="260" font-family="Arial" font-size="14" fill="white" opacity="0.8" text-anchor="middle">Contoh Dokumen Tersimpan (Adam Property)</text>
        </svg>`;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    const demoKtp1 = createDummySvg('KARTU TANDA PENDUDUK (KTP)', '#1e3a8a');
    const demoKk1 = createDummySvg('KARTU KELUARGA (KK)', '#581c87');
    const demoKwitansi1 = createDummySvg('BUKTI KWITANSI PEMBAYARAN', '#065f46');

    // Customer 1: Bpk. Bambang Sutrisno (Mengangsur)
    const cust1Id = await CustomerDB.add({
        nama: 'Bambang Sutrisno',
        kavling: 'Blok A-03 (Tipe 84 m²)',
        harga: 120000000,
        telepon: '081298765432',
        alamat: 'Jl. Melati Indah No. 15, RT 02/05',
        ktpImage: demoKtp1,
        kkImage: demoKk1
    });

    // Riwayat Pembayaran Customer 1
    await PaymentDB.add({
        customerId: cust1Id,
        tanggal: '2026-10-01',
        tujuan: 'Booking Fee / Tanda Jadi',
        nominal: 5000000,
        keterangan: 'Booking kavling Blok A-03 cash via Transfer BCA',
        kwitansiImage: demoKwitansi1
    });

    await PaymentDB.add({
        customerId: cust1Id,
        tanggal: '2026-10-15',
        tujuan: 'DP (Uang Muka)',
        nominal: 35000000,
        keterangan: 'Pembayaran DP tahap 1 via Teller Mandiri',
        kwitansiImage: demoKwitansi1
    });

    // Customer 2: Ibu Rahmawati Putri (LUNAS)
    const cust2Id = await CustomerDB.add({
        nama: 'Ibu Rahmawati Putri',
        kavling: 'Blok B-08 (Kavling Sudut 105 m²)',
        harga: 150000000,
        telepon: '085712345678',
        alamat: 'Perum Grand Harmoni Blok C-21',
        ktpImage: demoKtp1,
        kkImage: demoKk1
    });

    await PaymentDB.add({
        customerId: cust2Id,
        tanggal: '2026-09-10',
        tujuan: 'Booking Fee / Tanda Jadi',
        nominal: 10000000,
        keterangan: 'Tanda jadi kavling Blok B-08',
        kwitansiImage: demoKwitansi1
    });

    await PaymentDB.add({
        customerId: cust2Id,
        tanggal: '2026-09-25',
        tujuan: 'Pelunasan Kavling',
        nominal: 140000000,
        keterangan: 'Pelunasan Cash Keras ke rekening PT ADAM PROPERTY',
        kwitansiImage: demoKwitansi1
    });

    await refreshCustomerList();

    Swal.fire({
        icon: 'success',
        title: 'Contoh Data Berhasil Dimuat!',
        text: 'Silakan klik tombol "Buka Data Customer" pada salah satu baris untuk melihat dokumen KTP, KK, dan riwayat kwitansinya.',
        confirmButtonColor: '#059669'
    });
}


// ========================================================
// UTILITY HELPERS
// ========================================================

function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Terbilang Bahasa Indonesia
function terbilang(n) {
    const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    n = Math.floor(n);
    if (n < 12) return angka[n];
    if (n < 20) return terbilang(n - 10) + " Belas";
    if (n < 100) return terbilang(Math.floor(n / 10)) + " Puluh " + terbilang(n % 10);
    if (n < 200) return "Seratus " + terbilang(n - 100);
    if (n < 1000) return terbilang(Math.floor(n / 100)) + " Ratus " + terbilang(n % 100);
    if (n < 2000) return "Seribu " + terbilang(n - 1000);
    if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " Ribu " + terbilang(n % 1000);
    if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " Juta " + terbilang(n % 1000000);
    if (n < 1000000000000) return terbilang(Math.floor(n / 1000000000)) + " Miliar " + terbilang(n % 1000000000);
    return "";
}

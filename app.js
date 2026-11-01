// app.js - Logika Enterprise ADAM PROPERTY GROUP (Kavling, Customer, Barter Material & Hutang Lahan Petani)

let currentTab = 'kavling'; // 'kavling', 'customer', atau 'land_debt'
let allProjects = [];
let selectedProjectId = null;
let allKavlings = [];
let filteredKavlings = [];
let allCustomers = [];
let filteredCustomers = [];
let allLandDebts = [];
let selectedLandProjectId = 'all'; // Filter Lahan Aktif untuk Hutang Petani ('all' atau ID Proyek)

let currentFilter = 'all'; // Filter customer: 'all', 'unpaid', 'paid'
let searchQuery = '';
let searchKavlingQuery = '';
let filterKavlingStatus = 'all';

let currentCustomer = null;
let currentCustomerPayments = [];
let currentKavling = null;
let currentLandDebt = null;
let currentLandPayments = [];

// ==========================================
// INISIALISASI APLIKASI
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        await initializeData();

        const today = new Date().toISOString().split('T')[0];
        const payDateInput = document.getElementById('payTanggalInput');
        if (payDateInput) payDateInput.value = today;
        const landPayDateInput = document.getElementById('landPayTanggal');
        if (landPayDateInput) landPayDateInput.value = today;

    } catch (error) {
        console.error('Gagal inisialisasi aplikasi:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Database',
            text: 'Terjadi kendala saat membuka IndexedDB pada browser Anda.'
        });
    }
});

async function initializeData() {
    allProjects = await ProjectDB.getAll();

    if (allProjects.length === 0) {
        const defaultId = await ProjectDB.add({
            nama: 'Baitul Makmur Regency',
            lokasi: 'Kawasan Pengembangan Kavling Strategis',
            keterangan: 'Perumahan & Kavling Mandiri Siap Bangun'
        });
        allProjects = await ProjectDB.getAll();
        selectedProjectId = defaultId;
    } else {
        selectedProjectId = allProjects[0].id;
    }

    renderProjectDropdowns();
    await refreshKavlingView();
    await refreshCustomerList();
    await refreshLandDebtList();
}

// Navigasi Tab Utama (Company Feels: 3 Modul)
function switchMainTab(tab) {
    currentTab = tab;

    const navKavling = document.getElementById('navTabKavling');
    const navCustomer = document.getElementById('navTabCustomer');
    const navLandDebt = document.getElementById('navTabLandDebt');

    const viewKavling = document.getElementById('viewKavling');
    const viewCustomer = document.getElementById('viewCustomer');
    const viewLandDebt = document.getElementById('viewLandDebt');

    const headerActionText = document.getElementById('headerPrimaryActionText');

    // Reset tab styles
    [navKavling, navCustomer, navLandDebt].forEach(el => {
        if (el) el.className = 'corp-tab-inactive px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap';
    });

    viewKavling.classList.add('hidden');
    viewCustomer.classList.add('hidden');
    viewLandDebt.classList.add('hidden');

    if (tab === 'kavling') {
        navKavling.className = 'corp-tab-active px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap';
        viewKavling.classList.remove('hidden');
        headerActionText.textContent = '+ Tambah Kavling';
        refreshKavlingView();
    } else if (tab === 'customer') {
        navCustomer.className = 'corp-tab-active px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap';
        viewCustomer.classList.remove('hidden');
        headerActionText.textContent = '+ Tambah Customer';
        refreshCustomerList();
    } else if (tab === 'land_debt') {
        navLandDebt.className = 'corp-tab-active px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap';
        viewLandDebt.classList.remove('hidden');
        headerActionText.textContent = '+ Lahan Petani';
        refreshLandDebtList();
    }
}

function handlePrimaryAction() {
    if (currentTab === 'kavling') {
        openKavlingModal();
    } else if (currentTab === 'customer') {
        openCustomerModal();
    } else if (currentTab === 'land_debt') {
        openLandDebtModal();
    }
}


// ==========================================
// PENGELOLAAN INDUK KAVLING (PROYEK)
// ==========================================
function renderProjectDropdowns() {
    const projectSelect = document.getElementById('projectSelect');
    const formKavlingProjectId = document.getElementById('formKavlingProjectId');
    const custFormProjectSelect = document.getElementById('custFormProjectSelect');
    const formLandProjectId = document.getElementById('formLandProjectId');

    const optionsHtml = allProjects.map(p => `
        <option value="${p.id}" ${p.id === selectedProjectId ? 'selected' : ''}>
            ${escapeHtml(p.nama)}
        </option>
    `).join('');

    if (projectSelect) projectSelect.innerHTML = optionsHtml;
    if (formKavlingProjectId) formKavlingProjectId.innerHTML = optionsHtml;
    if (custFormProjectSelect) custFormProjectSelect.innerHTML = optionsHtml;
    if (formLandProjectId) formLandProjectId.innerHTML = optionsHtml;

    renderLandProjectDropdown();
    renderProjectListModal();
}

// Render Dropdown Pemilih Lahan Khusus di Dashboard Hutang Petani
function renderLandProjectDropdown() {
    const select = document.getElementById('landDebtProjectSelect');
    if (!select) return;

    let html = `<option value="all" ${selectedLandProjectId === 'all' ? 'selected' : ''}>🌐 Semua Lahan (Rekap Gabungan Seluruh Proyek)</option>`;
    html += allProjects.map(p => `
        <option value="${p.id}" ${selectedLandProjectId == p.id ? 'selected' : ''}>
            📍 ${escapeHtml(p.nama)} ${p.lokasi ? '(' + escapeHtml(p.lokasi) + ')' : ''}
        </option>
    `).join('');

    select.innerHTML = html;
    updateActiveLandProjectBanner();
}

function handleLandDebtProjectChange(val) {
    selectedLandProjectId = val;
    updateActiveLandProjectBanner();
    refreshLandDebtList();
}

function updateActiveLandProjectBanner() {
    const label = document.getElementById('activeLandProjectLabel');
    if (!label) return;

    if (selectedLandProjectId === 'all') {
        label.textContent = 'Semua Lahan (Rekap Gabungan)';
    } else {
        const proj = allProjects.find(p => p.id == selectedLandProjectId);
        label.textContent = proj ? proj.nama : 'Lahan Terpilih';
    }
}

async function handleProjectChange(projectId) {
    selectedProjectId = Number(projectId);
    await refreshKavlingView();
    renderLandProjectDropdown();
    await refreshLandDebtList();
}

function openProjectModal() {
    renderProjectListModal();
    document.getElementById('projectModal').classList.remove('hidden');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.add('hidden');
}

function renderProjectListModal() {
    const container = document.getElementById('projectListContainer');
    if (!container) return;

    if (allProjects.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-400 italic">Belum ada induk proyek.</p>`;
        return;
    }

    container.innerHTML = allProjects.map(p => `
        <div class="flex justify-between items-center p-2.5 bg-slate-100 rounded-lg text-xs">
            <div>
                <span class="font-bold text-slate-800">${escapeHtml(p.nama)}</span>
                <span class="text-slate-500 block text-[11px]">${escapeHtml(p.lokasi || '-')}</span>
            </div>
            <div class="flex items-center gap-1.5">
                ${allProjects.length > 1 ? `
                <button onclick="deleteProject(${p.id})" class="text-red-500 hover:text-red-700 px-2 py-1" title="Hapus Proyek">
                    <i class="fa-solid fa-trash"></i>
                </button>` : ''}
            </div>
        </div>
    `).join('');
}

async function handleProjectSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('newProjectName');
    const locInput = document.getElementById('newProjectLocation');

    const nama = nameInput.value.trim();
    const lokasi = locInput.value.trim();

    if (!nama) return;

    const newId = await ProjectDB.add({ nama, lokasi });
    nameInput.value = '';
    locInput.value = '';

    allProjects = await ProjectDB.getAll();
    selectedProjectId = newId;
    renderProjectDropdowns();
    await refreshKavlingView();
    await refreshLandDebtList();

    Swal.fire({
        icon: 'success',
        title: 'Induk Kavling Disimpan',
        timer: 1500,
        showConfirmButton: false
    });
}

async function deleteProject(id) {
    if (allProjects.length <= 1) {
        Swal.fire({ icon: 'warning', title: 'Minimal harus ada 1 Induk Kavling aktif.' });
        return;
    }
    const res = await Swal.fire({
        title: 'Hapus Induk Kavling Ini?',
        text: 'Semua unit kavling dan catatan lahan di bawah proyek ini akan ikut terhapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    });
    if (res.isConfirmed) {
        await ProjectDB.delete(id);
        allProjects = await ProjectDB.getAll();
        selectedProjectId = allProjects[0].id;
        renderProjectDropdowns();
        await refreshKavlingView();
        await refreshLandDebtList();
    }
}


// ========================================================
// MANAJEMEN KAVLING (SITE PLAN & SPEK FISIK)
// ========================================================
async function refreshKavlingView() {
    if (!selectedProjectId) return;

    allKavlings = await KavlingDB.getByProjectId(selectedProjectId);
    const customers = await CustomerDB.getAll();
    const customerMap = {};
    customers.forEach(c => { customerMap[c.id] = c; });

    allKavlings = allKavlings.map(k => {
        return {
            ...k,
            customerData: k.customerId ? customerMap[k.customerId] : null
        };
    });

    const currentProj = allProjects.find(p => p.id === selectedProjectId);
    document.getElementById('statProjectName').textContent = currentProj ? currentProj.nama : '-';

    const total = allKavlings.length;
    const terbuka = allKavlings.filter(k => k.status === 'terbuka').length;
    const booking = allKavlings.filter(k => k.status === 'booking').length;
    const terjual = allKavlings.filter(k => k.status === 'terjual').length;

    document.getElementById('statKavlingTotal').textContent = total;
    document.getElementById('statKavlingTerbuka').textContent = terbuka;
    document.getElementById('statKavlingBooking').textContent = booking;
    document.getElementById('statKavlingTerjual').textContent = terjual;

    applyKavlingFilters();
}

function handleSearchKavling(val) {
    searchKavlingQuery = (val || '').toLowerCase().trim();
    applyKavlingFilters();
}

function handleFilterKavlingStatus(val) {
    filterKavlingStatus = val;
    applyKavlingFilters();
}

function applyKavlingFilters() {
    filteredKavlings = allKavlings.filter(k => {
        if (filterKavlingStatus !== 'all' && k.status !== filterKavlingStatus) return false;
        if (searchKavlingQuery) {
            const blok = (k.blok || '').toLowerCase();
            const nomor = (k.nomor || '').toLowerCase();
            const cust = k.customerData ? (k.customerData.nama || '').toLowerCase() : '';
            if (!blok.includes(searchKavlingQuery) && !nomor.includes(searchKavlingQuery) && !cust.includes(searchKavlingQuery)) {
                return false;
            }
        }
        return true;
    });
    renderSitePlan();
}

function renderSitePlan() {
    const container = document.getElementById('sitePlanContainer');
    const emptyState = document.getElementById('emptyKavlingState');

    if (filteredKavlings.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    const blocksMap = {};
    filteredKavlings.forEach(k => {
        const blokName = (k.blok || 'Lainnya').trim();
        if (!blocksMap[blokName]) blocksMap[blokName] = [];
        blocksMap[blokName].push(k);
    });

    Object.keys(blocksMap).forEach(blok => {
        blocksMap[blok].sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true, sensitivity: 'base' }));
    });

    let html = '';

    for (const [blokName, kavlings] of Object.entries(blocksMap)) {
        const totalBlok = kavlings.length;
        const terjualBlok = kavlings.filter(k => k.status === 'terjual').length;
        const bookingBlok = kavlings.filter(k => k.status === 'booking').length;
        const terbukaBlok = kavlings.filter(k => k.status === 'terbuka').length;

        html += `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                            <i class="fa-solid fa-cubes"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-bold text-slate-800">${escapeHtml(blokName)}</h3>
                            <p class="text-xs text-slate-400">Total ${totalBlok} Kavling (${terbukaBlok} Terbuka • ${bookingBlok} Booking • ${terjualBlok} Terjual)</p>
                        </div>
                    </div>
                    <div class="text-xs font-semibold text-slate-500">
                        Klik pada kotak kavling untuk melihat spek & status customer
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    ${kavlings.map(k => renderSingleKavlingCard(k)).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderSingleKavlingCard(k) {
    let statusClass = 'kavling-card-terbuka';
    let statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🟢 Terbuka</span>';

    if (k.status === 'booking') {
        statusClass = 'kavling-card-booking';
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">🟡 Booking</span>';
    } else if (k.status === 'terjual') {
        statusClass = 'kavling-card-terjual';
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">🔴 Terjual</span>';
    }

    const customerInfo = k.customerData
        ? `<div class="mt-2 pt-1.5 border-t border-slate-100 text-[11px] truncate font-semibold text-slate-800 flex items-center gap-1">
            <i class="fa-solid fa-user text-emerald-600 text-[10px]"></i>
            <span class="truncate">${escapeHtml(k.customerData.nama)}</span>
           </div>`
        : `<div class="mt-2 pt-1.5 border-t border-slate-100 text-[11px] text-slate-400 italic">Belum ada pembeli</div>`;

    return `
        <div onclick="openKavlingDetail(${k.id})" class="kavling-card ${statusClass} border-2 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start mb-1.5">
                    <span class="text-sm font-black text-slate-900 tracking-tight">${escapeHtml(k.nomor)}</span>
                    ${statusBadge}
                </div>
                <div class="text-[11px] text-slate-500 font-medium leading-tight">
                    <span>${escapeHtml(k.dimensi || '-')}</span> • <span class="font-bold text-slate-700">${k.luas} m²</span>
                </div>
                <div class="text-xs font-bold text-emerald-700 mt-1">
                    ${formatRupiah(k.harga)}
                </div>
            </div>
            ${customerInfo}
        </div>
    `;
}

// Modal Detail Spek Kavling saat diklik
async function openKavlingDetail(kavlingId) {
    const kavling = allKavlings.find(k => k.id === kavlingId);
    if (!kavling) return;

    currentKavling = kavling;
    const project = allProjects.find(p => p.id === kavling.projectId);

    document.getElementById('detailKavlingCodeBadge').textContent = kavling.nomor;
    document.getElementById('detailKavlingTitle').textContent = `Kavling ${kavling.nomor}`;
    document.getElementById('detailKavlingProjectSubtitle').textContent = `${project ? project.nama : 'Proyek'} • ${kavling.blok}`;

    document.getElementById('detailSpekLuas').textContent = `${kavling.luas} m²`;
    document.getElementById('detailSpekDimensi').textContent = kavling.dimensi || '-';
    document.getElementById('detailSpekTipe').textContent = kavling.tipe || 'Hunian Standar';
    document.getElementById('detailSpekHarga').textContent = formatRupiah(kavling.harga);
    document.getElementById('detailSpekKeterangan').textContent = kavling.keterangan || 'Tidak ada catatan khusus';

    const pill = document.getElementById('detailStatusPill');
    if (kavling.status === 'booking') {
        pill.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300';
        pill.innerHTML = '🟡 STATUS: BOOKING';
    } else if (kavling.status === 'terjual') {
        pill.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-800 border border-red-300';
        pill.innerHTML = '🔴 STATUS: TERJUAL';
    } else {
        pill.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300';
        pill.innerHTML = '🟢 STATUS: TERBUKA';
    }

    const occupiedBox = document.getElementById('kavlingCustomerOccupied');
    const availableBox = document.getElementById('kavlingCustomerAvailable');

    if (kavling.customerId && kavling.customerData) {
        occupiedBox.classList.remove('hidden');
        availableBox.classList.add('hidden');

        const cust = kavling.customerData;
        document.getElementById('detailCustName').textContent = cust.nama;
        document.getElementById('detailCustPhone').textContent = cust.telepon ? `WA: ${cust.telepon}` : 'Kontak belum diisi';

        const payments = await PaymentDB.getByCustomerId(cust.id);
        const totalMasuk = payments.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
        const sisa = Math.max(0, (Number(cust.harga) || 0) - totalMasuk);

        document.getElementById('detailCustTerbayar').textContent = formatRupiah(totalMasuk);
        document.getElementById('detailCustSisa').textContent = formatRupiah(sisa);

        const hasKtp = !!cust.ktpImage;
        const hasKk = !!cust.kkImage;
        const hasAjb = !!cust.ajbImage;

        document.getElementById('detailCustDocBadge').innerHTML = `
            <span class="${hasKtp ? 'text-blue-600 font-bold' : 'text-slate-300'}">KTP ${hasKtp ? '✓' : '✗'}</span> • 
            <span class="${hasKk ? 'text-purple-600 font-bold' : 'text-slate-300'}">KK ${hasKk ? '✓' : '✗'}</span> • 
            <span class="${hasAjb ? 'text-emerald-700 font-bold' : 'text-slate-300'}">AJB ${hasAjb ? '✓' : '✗'}</span>
        `;
    } else {
        occupiedBox.classList.add('hidden');
        availableBox.classList.remove('hidden');
    }

    document.getElementById('kavlingDetailModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeKavlingDetailModal() {
    document.getElementById('kavlingDetailModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    currentKavling = null;
}

function openCustomerDetailFromKavling() {
    if (!currentKavling || !currentKavling.customerId) return;
    const custId = currentKavling.customerId;
    closeKavlingDetailModal();
    openCustomerDetail(custId);
}

async function quickUpdateKavlingStatus(newStatus) {
    if (!currentKavling) return;
    if (newStatus === 'terbuka' && currentKavling.customerId) {
        const res = await Swal.fire({
            title: 'Lepas Customer Terkait?',
            text: 'Mengubah status menjadi "Terbuka" akan melepaskan kaitan dari customer pembeli.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#059669',
            confirmButtonText: 'Ya, Lepaskan'
        });
        if (!res.isConfirmed) return;
        currentKavling.customerId = null;
    }
    await KavlingDB.updateStatus(currentKavling.id, newStatus, currentKavling.customerId);
    await refreshKavlingView();
    openKavlingDetail(currentKavling.id);
}

async function promptLinkCustomerToKavling() {
    if (!currentKavling) return;
    const customers = await CustomerDB.getAll();
    let optionsHtml = customers.map(c => `<option value="${c.id}">${escapeHtml(c.nama)}</option>`).join('');

    const { value: formValues } = await Swal.fire({
        title: `Hubungkan Kavling ${currentKavling.nomor}`,
        html: `
            <div class="text-left text-xs space-y-3 pt-2">
                <div>
                    <label class="font-bold block mb-1 text-slate-700">Pilih Customer Terdaftar:</label>
                    <select id="swalCustSelect" class="w-full p-2 border border-slate-300 rounded-lg text-xs">
                        <option value="">-- Atau Daftarkan Customer Baru --</option>
                        ${optionsHtml}
                    </select>
                </div>
                <div>
                    <label class="font-bold block mb-1 text-slate-700">Pilih Status Baru Kavling:</label>
                    <select id="swalStatusSelect" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold">
                        <option value="booking">🟡 Booking (Tanda Jadi)</option>
                        <option value="terjual">🔴 Terjual (Akad / Lunas)</option>
                    </select>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#059669',
        confirmButtonText: 'Hubungkan Sekarang',
        cancelButtonText: 'Batal',
        preConfirm: () => {
            return {
                customerId: document.getElementById('swalCustSelect').value,
                status: document.getElementById('swalStatusSelect').value
            };
        }
    });

    if (formValues) {
        if (!formValues.customerId) {
            closeKavlingDetailModal();
            openCustomerModalForKavling(currentKavling);
        } else {
            const cust = await CustomerDB.getById(formValues.customerId);
            const project = allProjects.find(p => p.id === currentKavling.projectId);
            cust.kavling = `${project ? project.nama : ''} - ${currentKavling.blok} (${currentKavling.nomor})`;
            cust.harga = currentKavling.harga;
            cust.kavlingId = currentKavling.id;
            cust.projectId = currentKavling.projectId;

            await CustomerDB.update(cust.id, cust);
            await KavlingDB.updateStatus(currentKavling.id, formValues.status, cust.id);

            await refreshKavlingView();
            await refreshCustomerList();
            openKavlingDetail(currentKavling.id);
        }
    }
}

async function unlinkCustomerFromKavling() {
    if (!currentKavling) return;
    const res = await Swal.fire({
        title: 'Lepas Kaitan Customer?',
        text: 'Kavling ini akan berstatus "Terbuka" kembali.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        confirmButtonText: 'Ya, Lepaskan'
    });
    if (res.isConfirmed) {
        await KavlingDB.updateStatus(currentKavling.id, 'terbuka', null);
        await refreshKavlingView();
        openKavlingDetail(currentKavling.id);
    }
}


// ========================================================
// TAMBAH / EDIT KAVLING & BATCH GENERATE
// ========================================================
async function openKavlingModal(editData = null) {
    const form = document.getElementById('kavlingForm');
    form.reset();

    const titleEl = document.getElementById('kavlingModalTitle');
    const idInput = document.getElementById('kavlingIdInput');
    const custSelect = document.getElementById('formKavlingCustomerId');
    const custBox = document.getElementById('formKavlingCustomerBox');

    const customers = await CustomerDB.getAll();
    custSelect.innerHTML = `<option value="">-- Pilih Customer Pembeli --</option>` +
        customers.map(c => `<option value="${c.id}">${escapeHtml(c.nama)}</option>`).join('');

    renderProjectDropdowns();

    if (editData) {
        titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Unit Kavling';
        idInput.value = editData.id;
        document.getElementById('formKavlingProjectId').value = editData.projectId || selectedProjectId;
        document.getElementById('formKavlingBlok').value = editData.blok || '';
        document.getElementById('formKavlingNomor').value = editData.nomor || '';
        document.getElementById('formKavlingLuas').value = editData.luas || '';
        document.getElementById('formKavlingDimensi').value = editData.dimensi || '';
        document.getElementById('formKavlingHarga').value = new Intl.NumberFormat('id-ID').format(editData.harga || 0);
        document.getElementById('formKavlingTipe').value = editData.tipe || 'Hunian Standar';
        document.getElementById('formKavlingStatus').value = editData.status || 'terbuka';
        document.getElementById('formKavlingKeterangan').value = editData.keterangan || '';

        if (editData.status !== 'terbuka') {
            custBox.classList.remove('hidden');
            custSelect.value = editData.customerId || '';
        } else {
            custBox.classList.add('hidden');
        }
    } else {
        titleEl.innerHTML = '<i class="fa-solid fa-square-plus"></i> Tambah Unit Kavling';
        idInput.value = '';
        document.getElementById('formKavlingProjectId').value = selectedProjectId;
        document.getElementById('formKavlingBlok').value = 'Blok A';
        document.getElementById('formKavlingLuas').value = '84';
        document.getElementById('formKavlingDimensi').value = '6 x 14 meter';
        document.getElementById('formKavlingHarga').value = '120.000.000';
        custBox.classList.add('hidden');
    }

    document.getElementById('kavlingFormModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeKavlingModal() {
    document.getElementById('kavlingFormModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function toggleFormCustomerSelect(status) {
    const box = document.getElementById('formKavlingCustomerBox');
    if (status === 'booking' || status === 'terjual') {
        box.classList.remove('hidden');
    } else {
        box.classList.add('hidden');
    }
}

async function handleKavlingSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('kavlingIdInput').value;
    const projectId = Number(document.getElementById('formKavlingProjectId').value);
    const blok = document.getElementById('formKavlingBlok').value.trim();
    const nomor = document.getElementById('formKavlingNomor').value.trim();
    const luas = Number(document.getElementById('formKavlingLuas').value);
    const dimensi = document.getElementById('formKavlingDimensi').value.trim();
    const harga = parseCurrencyInput(document.getElementById('formKavlingHarga').value);
    const tipe = document.getElementById('formKavlingTipe').value;
    const status = document.getElementById('formKavlingStatus').value;
    const customerId = (status !== 'terbuka') ? (Number(document.getElementById('formKavlingCustomerId').value) || null) : null;
    const keterangan = document.getElementById('formKavlingKeterangan').value.trim();

    if (!blok || !nomor || luas <= 0 || harga <= 0) {
        Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap' });
        return;
    }

    const kavlingPayload = { projectId, blok, nomor, luas, dimensi, harga, tipe, status, customerId, keterangan };

    if (id) {
        await KavlingDB.update(id, kavlingPayload);
    } else {
        await KavlingDB.add(kavlingPayload);
    }

    closeKavlingModal();
    selectedProjectId = projectId;
    renderProjectDropdowns();
    await refreshKavlingView();

    Swal.fire({ icon: 'success', title: 'Kavling Berhasil Disimpan', timer: 1500, showConfirmButton: false });
}

function editCurrentKavling() {
    if (currentKavling) {
        closeKavlingDetailModal();
        openKavlingModal(currentKavling);
    }
}

async function deleteCurrentKavling() {
    if (!currentKavling) return;
    const res = await Swal.fire({
        title: `Hapus Kavling ${currentKavling.nomor}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    });
    if (res.isConfirmed) {
        await KavlingDB.delete(currentKavling.id);
        closeKavlingDetailModal();
        await refreshKavlingView();
    }
}

function openBatchKavlingModal() {
    document.getElementById('batchKavlingModal').classList.remove('hidden');
}

function closeBatchKavlingModal() {
    document.getElementById('batchKavlingModal').classList.add('hidden');
}

async function handleBatchGenerateSubmit(event) {
    event.preventDefault();
    if (!selectedProjectId) return;

    const blok = document.getElementById('batchBlok').value.trim();
    const start = parseInt(document.getElementById('batchStart').value, 10);
    const end = parseInt(document.getElementById('batchEnd').value, 10);
    const luas = Number(document.getElementById('batchLuas').value);
    const dimensi = document.getElementById('batchDimensi').value.trim();
    const harga = parseCurrencyInput(document.getElementById('batchHarga').value);

    let prefix = blok.replace(/blok\s*/i, '').trim() || 'Kav';

    for (let i = start; i <= end; i++) {
        const lotNumber = i < 10 ? `0${i}` : `${i}`;
        const nomor = `${prefix}-${lotNumber}`;

        await KavlingDB.add({
            projectId: selectedProjectId,
            blok: blok,
            nomor: nomor,
            luas: luas,
            dimensi: dimensi,
            harga: harga,
            tipe: blok.toLowerCase().includes('ruko') ? 'Ruko Komersil' : 'Hunian Standar',
            status: 'terbuka',
            customerId: null,
            keterangan: 'Siap bangun'
        });
    }

    closeBatchKavlingModal();
    await refreshKavlingView();
    Swal.fire({ icon: 'success', title: 'Blok Berhasil Dibuat!', confirmButtonColor: '#059669' });
}


// ========================================================
// DATA CUSTOMER & PIUTANG (MENDUKUNG BARTER MATERIAL)
// ========================================================

async function refreshCustomerList() {
    try {
        const customers = await CustomerDB.getAll();
        const payments = await PaymentDB.getAll();

        const customerPaymentsMap = {};
        payments.forEach(p => {
            const cId = p.customerId;
            if (!customerPaymentsMap[cId]) customerPaymentsMap[cId] = [];
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

        allCustomers.sort((a, b) => (b.id || 0) - (a.id || 0));

        updateDashboardMetrics();
        applyFilterAndSearch();

    } catch (err) {
        console.error('Error refresh data customer:', err);
    }
}

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
    document.getElementById('statPersenMasuk').textContent = `${persenMasuk}% dari target omset`;
    document.getElementById('statTotalSisa').textContent = formatRupiah(totalSisa);
    document.getElementById('statCustomerBelumLunas').textContent = `${customerBelumLunas} Belum Lunas`;
}

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
        if (currentFilter === 'unpaid' && c.isLunas) return false;
        if (currentFilter === 'paid' && !c.isLunas) return false;

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

        const hasKtp = !!c.ktpImage;
        const hasKk = !!c.kkImage;
        const hasAjb = !!c.ajbImage;

        const docBadge = `
            <div class="flex items-center justify-center gap-1.5 text-[11px] mt-1">
                <span class="${hasKtp ? 'text-blue-600 font-bold' : 'text-slate-300'}" title="KTP">KTP</span> • 
                <span class="${hasKk ? 'text-purple-600 font-bold' : 'text-slate-300'}" title="KK">KK</span> • 
                <span class="${hasAjb ? 'text-emerald-700 font-bold' : 'text-slate-300'}" title="AJB">AJB</span>
            </div>
        `;

        return `
            <tr class="hover:bg-slate-50/80 transition group border-b border-slate-100">
                <td class="py-4 px-4 text-center font-medium text-slate-400 text-xs">${index + 1}</td>
                <td class="py-4 px-4 font-semibold text-slate-900">
                    <div class="text-sm font-bold text-slate-800">${escapeHtml(c.nama)}</div>
                    <div class="text-xs text-slate-400">${c.telepon ? `<i class="fa-brands fa-whatsapp text-emerald-600"></i> ${escapeHtml(c.telepon)}` : '-'}</div>
                </td>
                <td class="py-4 px-4">
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200">
                        <i class="fa-solid fa-location-dot text-emerald-600 text-xs"></i>
                        <span>${escapeHtml(c.kavling)}</span>
                    </div>
                </td>
                <td class="py-4 px-4 text-right font-bold text-slate-800 text-sm">${formatRupiah(c.harga)}</td>
                <td class="py-4 px-4 text-right">
                    <div class="font-bold text-emerald-600 text-sm">${formatRupiah(c.totalMasuk)}</div>
                    <div class="text-[11px] text-slate-400">${c.paymentCount}x Transaksi</div>
                </td>
                <td class="py-4 px-4 text-right">
                    <div class="font-bold ${c.sisa > 0 ? 'text-amber-600' : 'text-slate-400'} text-sm">${formatRupiah(c.sisa)}</div>
                </td>
                <td class="py-4 px-4 text-center">${statusBadge}</td>
                <td class="py-4 px-4 text-center">
                    <button onclick="openCustomerDetail(${c.id})" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition">
                        <i class="fa-solid fa-folder-open text-xs"></i>
                        <span>Buka Data Customer</span>
                    </button>
                    ${docBadge}
                </td>
                <td class="py-4 px-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="editCustomerById(${c.id})" class="w-8 h-8 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition flex items-center justify-center">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="deleteCustomer(${c.id})" class="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}


// ========================================================
// DETAIL CUSTOMER & RIWAYAT PEMBAYARAN / BARTER MATERIAL
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

    const freshCust = await CustomerDB.getById(currentCustomer.id);
    if (freshCust) currentCustomer = { ...currentCustomer, ...freshCust };

    currentCustomerPayments = await PaymentDB.getByCustomerId(currentCustomer.id);

    const totalMasuk = currentCustomerPayments.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
    const harga = Number(currentCustomer.harga) || 0;
    const sisa = Math.max(0, harga - totalMasuk);
    const persen = harga > 0 ? Math.min(100, Math.round((totalMasuk / harga) * 100)) : 0;
    const isLunas = harga > 0 && totalMasuk >= harga;

    document.getElementById('detailCustomerName').textContent = currentCustomer.nama;
    document.getElementById('detailCustomerSubtitle').innerHTML = `
        <span class="font-bold text-emerald-400">Kavling: ${escapeHtml(currentCustomer.kavling)}</span> | 
        <span>Telp: ${escapeHtml(currentCustomer.telepon || '-')}</span>
    `;

    document.getElementById('detailHargaKavling').textContent = formatRupiah(harga);
    document.getElementById('detailKavlingName').textContent = `Unit: ${escapeHtml(currentCustomer.kavling)}`;
    document.getElementById('detailTotalMasuk').textContent = formatRupiah(totalMasuk);
    document.getElementById('detailPersenLunas').textContent = `${persen}% Terbayar (${currentCustomerPayments.length}x transaksi)`;
    document.getElementById('detailSisaPembayaran').textContent = formatRupiah(sisa);

    const badgeContainer = document.getElementById('detailStatusBadge');
    if (isLunas) {
        badgeContainer.innerHTML = `<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800"><i class="fa-solid fa-circle-check"></i> LUNAS</span>`;
    } else {
        badgeContainer.innerHTML = `<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800"><i class="fa-solid fa-clock"></i> BELUM LUNAS</span>`;
    }

    renderDocumentsSection();
    renderPaymentsTable();
}

function renderDocumentsSection() {
    renderSingleDocCard('ktp', currentCustomer.ktpImage, `KTP_${currentCustomer.nama}.jpg`);
    renderSingleDocCard('kk', currentCustomer.kkImage, `KK_${currentCustomer.nama}.jpg`);
    renderSingleDocCard('ajb', currentCustomer.ajbImage, `AJB_${currentCustomer.nama}.jpg`);
}

function renderSingleDocCard(type, imgBase64, filename) {
    const imgEl = document.getElementById(`${type}ImageEl`);
    const emptyEl = document.getElementById(`${type}EmptyState`);
    const statusText = document.getElementById(`${type}StatusText`);

    let docTitle = type.toUpperCase();
    if (type === 'ajb') docTitle = 'AJB / Surat Perjanjian';

    if (imgBase64) {
        imgEl.src = imgBase64;
        imgEl.classList.remove('hidden');
        emptyEl.classList.add('hidden');
        statusText.innerHTML = `<span class="text-emerald-600 font-semibold"><i class="fa-solid fa-check-circle"></i> File ${docTitle} Terupload</span>`;
    } else {
        imgEl.src = '';
        imgEl.classList.add('hidden');
        emptyEl.classList.remove('hidden');
        statusText.innerHTML = `<span class="text-slate-400">Belum ada berkas ${docTitle}</span>`;
    }
}

async function handleDocumentUpload(event, docType) {
    const file = event.target.files && event.target.files[0];
    if (!file || !currentCustomer) return;

    try {
        Swal.fire({ title: 'Mengunggah...', didOpen: () => Swal.showLoading() });
        const compressedBase64 = await compressImage(file, 1600, 0.85);

        if (docType === 'ktp') currentCustomer.ktpImage = compressedBase64;
        else if (docType === 'kk') currentCustomer.kkImage = compressedBase64;
        else if (docType === 'ajb') currentCustomer.ajbImage = compressedBase64;

        await CustomerDB.update(currentCustomer.id, currentCustomer);
        await refreshCustomerList();
        await refreshCustomerDetailView();

        Swal.fire({ icon: 'success', title: 'Dokumen Disimpan!', timer: 1400, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal Mengunggah' });
    }
}

// Render Tabel Riwayat Pembayaran (Mendukung Tampilan Barter Material)
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
        let metodePill = '<span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">💵 Tunai</span>';
        if (p.metodeBayar === 'barter') {
            metodePill = '<span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">🧱 Barter Material</span>';
        } else if (p.metodeBayar === 'campuran') {
            metodePill = '<span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">🔄 Campuran</span>';
        }

        const buktiImage = p.suratJalanImage || p.kwitansiImage;
        const buktiThumb = buktiImage
            ? `<div class="relative inline-block group">
                <img src="${buktiImage}" alt="Bukti" class="w-10 h-10 object-cover rounded-lg border border-slate-200 clickable-image shadow-2xs" onclick="openLightbox('${buktiImage}', 'Bukti Transaksi - ${escapeHtml(p.tujuan)}')">
               </div>`
            : `<span class="text-xs text-slate-300 italic">Tanpa Foto</span>`;

        const rincianContent = p.rincianBarter
            ? `<div class="text-[11px] text-amber-900 bg-amber-50/80 p-1.5 rounded border border-amber-200 mt-1 whitespace-pre-line font-mono text-[10px]">
                <b>Rincian Material:</b><br>${escapeHtml(p.rincianBarter)}
               </div>`
            : '';

        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                <td class="py-3 px-3 text-center text-xs text-slate-400">${idx + 1}</td>
                <td class="py-3 px-3 text-xs whitespace-nowrap text-slate-700 font-medium">
                    ${formatTanggalIndo(p.tanggal)}
                </td>
                <td class="py-3 px-3">
                    <div class="flex items-center gap-1.5 mb-1">${metodePill}</div>
                    <div class="font-bold text-slate-800 text-xs">${escapeHtml(p.tujuan)}</div>
                </td>
                <td class="py-3 px-3 text-right font-bold text-emerald-600 text-sm whitespace-nowrap">
                    ${formatRupiah(p.nominal)}
                </td>
                <td class="py-3 px-3 text-xs text-slate-600 max-w-xs">
                    <div>${escapeHtml(p.keterangan || '-')}</div>
                    ${rincianContent}
                </td>
                <td class="py-3 px-3 text-center">${buktiThumb}</td>
                <td class="py-3 px-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="printSingleReceipt(${p.id})" title="Cetak Kwitansi / Tanda Terima" class="w-7 h-7 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition flex items-center justify-center">
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

// Modal Catat Pembayaran / Barter Customer
let tempKwitansiBase64 = null;

function openPaymentModal() {
    if (!currentCustomer) return;
    const form = document.getElementById('paymentForm');
    form.reset();
    tempKwitansiBase64 = null;
    clearKwitansiPreview();

    document.getElementById('payTanggalInput').value = new Date().toISOString().split('T')[0];
    document.getElementById('payMetodeSelect').value = 'tunai';
    handlePaymentMethodChange('tunai');

    document.getElementById('paymentFormModal').classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('paymentFormModal').classList.add('hidden');
    tempKwitansiBase64 = null;
}

function handlePaymentMethodChange(metode) {
    const barterSection = document.getElementById('barterMaterialSection');
    const labelNominal = document.getElementById('labelNominalBayar');
    const subtext = document.getElementById('subtextNominalBayar');

    if (metode === 'barter') {
        barterSection.classList.remove('hidden');
        labelNominal.innerHTML = 'Nilai Konversi Barter Material (Rp) <span class="text-red-500">*</span>';
        subtext.textContent = 'Total nilai bahan bangunan ini akan diakui sebagai pembayaran kavling hingga lunas.';
        document.getElementById('payTujuanSelect').value = 'Pelunasan via Barter Material';
    } else if (metode === 'campuran') {
        barterSection.classList.remove('hidden');
        labelNominal.innerHTML = 'Jumlah Total (Uang Tunai + Nilai Barter Material) (Rp) <span class="text-red-500">*</span>';
        subtext.textContent = 'Kombinasi uang muka tunai dan serah terima bahan bangunan.';
    } else {
        barterSection.classList.add('hidden');
        labelNominal.innerHTML = 'Jumlah Nominal Uang Masuk (Rp) <span class="text-red-500">*</span>';
        subtext.textContent = 'Pembayaran tunai / transfer bank yang disetorkan customer.';
    }
}

function handleTujuanChange(val) {
    const customInput = document.getElementById('payTujuanCustomInput');
    if (val === 'Lainnya') {
        customInput.classList.remove('hidden');
        customInput.required = true;
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
        document.getElementById('kwitansiPreviewImg').src = compressed;
        previewBox.classList.remove('hidden');
    } catch (e) {
        console.error(e);
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
    const metodeBayar = document.getElementById('payMetodeSelect').value;
    const rincianBarter = document.getElementById('payRincianBarterInput').value.trim();
    const selectTujuan = document.getElementById('payTujuanSelect').value;
    let tujuan = selectTujuan;
    if (selectTujuan === 'Lainnya') {
        tujuan = document.getElementById('payTujuanCustomInput').value.trim() || 'Pembayaran Lainnya';
    }

    const nominal = parseCurrencyInput(document.getElementById('payNominalInput').value);
    const keterangan = document.getElementById('payKeteranganInput').value.trim();

    if (!tanggal || nominal <= 0) {
        Swal.fire({ icon: 'warning', title: 'Nominal tidak valid' });
        return;
    }

    const suratJalanFile = document.getElementById('paySuratJalanFile').files[0];
    let suratJalanImage = null;
    if (suratJalanFile) {
        suratJalanImage = await compressImage(suratJalanFile, 1500, 0.85);
    }

    const submitBtn = document.getElementById('btnSubmitPayment');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    try {
        const paymentData = {
            customerId: currentCustomer.id,
            tanggal,
            metodeBayar,
            tujuan,
            nominal,
            rincianBarter: rincianBarter || null,
            keterangan,
            suratJalanImage: suratJalanImage || null,
            kwitansiImage: tempKwitansiBase64 || null
        };

        await PaymentDB.add(paymentData);

        // Periksa apakah total pembayaran customer sudah melunasi kavling
        if (currentCustomer.kavlingId) {
            const allPayments = await PaymentDB.getByCustomerId(currentCustomer.id);
            const totalMasuk = allPayments.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
            if (totalMasuk >= (Number(currentCustomer.harga) || 0)) {
                await KavlingDB.updateStatus(currentCustomer.kavlingId, 'terjual', currentCustomer.id);
            }
        }

        closePaymentModal();
        await refreshCustomerList();
        await refreshKavlingView();
        await refreshCustomerDetailView();

        Swal.fire({
            icon: 'success',
            title: metodeBayar === 'barter' ? 'Barter Material Dicatat!' : 'Pembayaran Dicatat!',
            text: `Senilai Rp ${new Intl.NumberFormat('id-ID').format(nominal)}.`,
            timer: 1800,
            showConfirmButton: false
        });

    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal Menyimpan' });
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Transaksi';
    }
}

async function deletePayment(paymentId) {
    const result = await Swal.fire({
        title: 'Hapus Catatan Pembayaran / Barter?',
        text: 'Data transaksi ini akan dihapus dari sistem.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    });
    if (result.isConfirmed) {
        await PaymentDB.delete(paymentId);
        await refreshCustomerList();
        await refreshKavlingView();
        await refreshCustomerDetailView();
    }
}


// ========================================================
// TAMBAH / EDIT DATA CUSTOMER
// ========================================================
async function openCustomerModal(editData = null) {
    const form = document.getElementById('customerForm');
    form.reset();

    const titleEl = document.getElementById('customerModalTitle');
    const idInput = document.getElementById('customerIdInput');

    renderProjectDropdowns();
    const currentProjId = selectedProjectId || (allProjects[0] ? allProjects[0].id : null);
    document.getElementById('custFormProjectSelect').value = currentProjId;
    await populateKavlingDropdownForCustomer(currentProjId);

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

async function openCustomerModalForKavling(kavling) {
    await openCustomerModal();
    const project = allProjects.find(p => p.id === kavling.projectId);
    document.getElementById('custFormProjectSelect').value = kavling.projectId;
    await populateKavlingDropdownForCustomer(kavling.projectId);

    document.getElementById('custFormKavlingSelect').value = kavling.id;
    document.getElementById('kavlingInput').value = `${project ? project.nama : ''} - ${kavling.blok} (${kavling.nomor})`;
    document.getElementById('hargaInput').value = new Intl.NumberFormat('id-ID').format(kavling.harga || 0);
}

function closeCustomerModal() {
    document.getElementById('customerFormModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

async function populateKavlingDropdownForCustomer(projectId) {
    const kavlingSelect = document.getElementById('custFormKavlingSelect');
    const kavlings = await KavlingDB.getByProjectId(projectId);

    if (kavlings.length === 0) {
        kavlingSelect.innerHTML = `<option value="">-- Belum ada kavling di proyek ini --</option>`;
        return;
    }

    kavlingSelect.innerHTML = `<option value="">-- Pilih Unit Kavling --</option>` +
        kavlings.map(k => {
            const statusLabel = k.status === 'terbuka' ? '🟢 Terbuka' : (k.status === 'booking' ? '🟡 Booking' : '🔴 Terjual');
            return `<option value="${k.id}" data-harga="${k.harga}" data-blok="${escapeHtml(k.blok)}" data-nomor="${escapeHtml(k.nomor)}">
                ${escapeHtml(k.blok)} - ${escapeHtml(k.nomor)} (${statusLabel} - ${formatRupiah(k.harga)})
            </option>`;
        }).join('');
}

function handleCustomerKavlingSelect(kavlingId) {
    if (!kavlingId) return;
    const select = document.getElementById('custFormKavlingSelect');
    const selectedOpt = select.options[select.selectedIndex];
    const harga = selectedOpt.getAttribute('data-harga');
    const blok = selectedOpt.getAttribute('data-blok');
    const nomor = selectedOpt.getAttribute('data-nomor');

    const projSelect = document.getElementById('custFormProjectSelect');
    const projName = projSelect.options[projSelect.selectedIndex].text;

    document.getElementById('kavlingInput').value = `${projName} - ${blok} (${nomor})`;
    if (harga) {
        document.getElementById('hargaInput').value = new Intl.NumberFormat('id-ID').format(harga);
    }
}

async function handleCustomerSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('customerIdInput').value;
    const nama = document.getElementById('namaInput').value.trim();
    const kavling = document.getElementById('kavlingInput').value.trim();
    const harga = parseCurrencyInput(document.getElementById('hargaInput').value);
    const telepon = document.getElementById('teleponInput').value.trim();
    const alamat = document.getElementById('alamatInput').value.trim();
    const selectedKavlingId = Number(document.getElementById('custFormKavlingSelect').value) || null;
    const selectedProjId = Number(document.getElementById('custFormProjectSelect').value) || null;

    if (!nama || !kavling || harga <= 0) {
        Swal.fire({ icon: 'warning', title: 'Harap lengkapi nama, kavling, dan harga.' });
        return;
    }

    const ktpFile = document.getElementById('formKtpFile').files[0];
    const kkFile = document.getElementById('formKkFile').files[0];
    const ajbFile = document.getElementById('formAjbFile').files[0];

    const submitBtn = document.getElementById('btnSubmitCustomer');
    submitBtn.disabled = true;

    try {
        let ktpImage = null, kkImage = null, ajbImage = null;
        if (ktpFile) ktpImage = await compressImage(ktpFile, 1600, 0.85);
        if (kkFile) kkImage = await compressImage(kkFile, 1600, 0.85);
        if (ajbFile) ajbImage = await compressImage(ajbFile, 1600, 0.85);

        let savedCustomerId = null;

        if (id) {
            const existing = await CustomerDB.getById(id);
            const updated = {
                ...existing,
                nama,
                kavling,
                harga,
                telepon,
                alamat,
                kavlingId: selectedKavlingId || existing.kavlingId,
                projectId: selectedProjId || existing.projectId
            };
            if (ktpImage) updated.ktpImage = ktpImage;
            if (kkImage) updated.kkImage = kkImage;
            if (ajbImage) updated.ajbImage = ajbImage;
            await CustomerDB.update(id, updated);
            savedCustomerId = Number(id);
        } else {
            const newCust = {
                nama,
                kavling,
                harga,
                telepon,
                alamat,
                kavlingId: selectedKavlingId,
                projectId: selectedProjId,
                ktpImage: ktpImage || null,
                kkImage: kkImage || null,
                ajbImage: ajbImage || null
            };
            savedCustomerId = await CustomerDB.add(newCust);
        }

        if (selectedKavlingId && savedCustomerId) {
            await KavlingDB.updateStatus(selectedKavlingId, 'booking', savedCustomerId);
        }

        closeCustomerModal();
        await refreshCustomerList();
        await refreshKavlingView();

        if (currentCustomer && currentCustomer.id == id) {
            await refreshCustomerDetailView();
        }

        Swal.fire({ icon: 'success', title: 'Data Customer Disimpan', timer: 1400, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal Menyimpan' });
    } finally {
        submitBtn.disabled = false;
    }
}

async function editCustomerById(id) {
    const customer = await CustomerDB.getById(id);
    if (customer) openCustomerModal(customer);
}

function editCurrentCustomer() {
    if (currentCustomer) openCustomerModal(currentCustomer);
}

async function deleteCustomer(id) {
    const customer = allCustomers.find(c => c.id === id);
    const res = await Swal.fire({
        title: `Hapus Customer ${customer ? customer.nama : ''}?`,
        text: 'Semua berkas identitas dan riwayat pembayaran akan ikut terhapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    });
    if (res.isConfirmed) {
        await CustomerDB.delete(id);
        if (currentCustomer && currentCustomer.id === id) closeCustomerDetailModal();
        await refreshCustomerList();
        await refreshKavlingView();
    }
}


// ========================================================
// MANAJEMEN HUTANG LAHAN PETANI (MODUL 3)
// ========================================================

async function refreshLandDebtList() {
    try {
        const debts = await LandDebtDB.getAll();
        const payments = await LandPaymentDB.getAll();

        const debtPaymentsMap = {};
        payments.forEach(p => {
            const dId = p.landDebtId;
            if (!debtPaymentsMap[dId]) debtPaymentsMap[dId] = [];
            debtPaymentsMap[dId].push(p);
        });

        allLandDebts = debts.map(d => {
            const dPayments = debtPaymentsMap[d.id] || [];
            const totalBayar = dPayments.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
            const harga = Number(d.totalKesepakatan) || 0;
            const sisa = Math.max(0, harga - totalBayar);
            const isLunas = harga > 0 && totalBayar >= harga;

            return {
                ...d,
                totalBayar,
                sisa,
                isLunas,
                paymentCount: dPayments.length
            };
        });

        // Filter berdasarkan Lahan / Proyek yang sedang dipilih agar catatan hutang TIDAK TERCAMPUR!
        let displayedDebts = allLandDebts;
        if (selectedLandProjectId !== 'all') {
            displayedDebts = allLandDebts.filter(d => d.projectId == Number(selectedLandProjectId));
        }

        // Update stats khusus untuk lahan/proyek yang sedang dipilih
        const totalOwners = displayedDebts.length;
        const totalLandValue = displayedDebts.reduce((sum, d) => sum + (Number(d.totalKesepakatan) || 0), 0);
        const totalLandPaid = displayedDebts.reduce((sum, d) => sum + (d.totalBayar || 0), 0);
        const totalLandDebt = displayedDebts.reduce((sum, d) => sum + (d.sisa || 0), 0);

        const percentPaid = totalLandValue > 0 ? Math.round((totalLandPaid / totalLandValue) * 100) : 0;

        document.getElementById('statTotalLandOwners').textContent = totalOwners;
        document.getElementById('statTotalLandValue').textContent = formatRupiah(totalLandValue);
        document.getElementById('statTotalLandPaid').textContent = formatRupiah(totalLandPaid);
        document.getElementById('statLandPaidPercent').textContent = `${percentPaid}% terbayar ke petani`;
        document.getElementById('statTotalLandDebt').textContent = formatRupiah(totalLandDebt);

        renderLandDebtTable(displayedDebts);

    } catch (err) {
        console.error('Error refresh hutang lahan:', err);
    }
}

function renderLandDebtTable(debtsToRender = allLandDebts) {
    const tbody = document.getElementById('landDebtTableBody');
    const emptyState = document.getElementById('emptyLandDebtState');

    if (!debtsToRender || debtsToRender.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');

        const emptyMsg = emptyState.querySelector('p');
        if (emptyMsg) {
            if (selectedLandProjectId !== 'all') {
                const curProj = allProjects.find(p => p.id == selectedLandProjectId);
                emptyMsg.innerHTML = `Belum ada catatan pembelian lahan petani untuk proyek <b>${curProj ? escapeHtml(curProj.nama) : 'lahan ini'}</b>. Catatan antar lahan dipisahkan agar rapi dan tidak tercampur.`;
            } else {
                emptyMsg.textContent = 'Catat pembelian lahan mentah ke petani sebelum proyek kavling dikembangkan.';
            }
        }
        return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = debtsToRender.map((d, index) => {
        const project = allProjects.find(p => p.id === d.projectId);
        const statusBadge = d.isLunas
            ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">🟢 Lunas</span>`
            : `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">🔴 Masih Ada Hutang</span>`;

        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                <td class="py-4 px-4 text-center font-medium text-slate-400 text-xs">${index + 1}</td>
                <td class="py-4 px-4 font-bold text-slate-900">
                    <div class="text-sm">${escapeHtml(d.namaPetani)}</div>
                    <div class="text-xs text-slate-400">${d.telepon ? `<i class="fa-brands fa-whatsapp text-emerald-600"></i> ${escapeHtml(d.telepon)}` : '-'}</div>
                </td>
                <td class="py-4 px-4 text-xs font-semibold text-slate-700">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                        <i class="fa-solid fa-location-dot text-amber-600 text-[10px]"></i> ${project ? escapeHtml(project.nama) : '-'}
                    </span>
                </td>
                <td class="py-4 px-4 text-xs">
                    <div class="font-bold text-slate-800">${escapeHtml(d.luasLahan)}</div>
                    <div class="text-[11px] text-slate-400">${escapeHtml(d.alasHak)}</div>
                </td>
                <td class="py-4 px-4 text-right font-bold text-slate-800 text-sm">
                    ${formatRupiah(d.totalKesepakatan)}
                </td>
                <td class="py-4 px-4 text-right font-bold text-emerald-600 text-sm">
                    ${formatRupiah(d.totalBayar)}
                </td>
                <td class="py-4 px-4 text-right font-bold text-red-600 text-sm">
                    ${formatRupiah(d.sisa)}
                </td>
                <td class="py-4 px-4 text-center">${statusBadge}</td>
                <td class="py-4 px-4 text-center">
                    <button onclick="openLandDebtDetail(${d.id})" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition">
                        <i class="fa-solid fa-folder-open"></i>
                        <span>Detail & Kwitansi Petani</span>
                    </button>
                </td>
                <td class="py-4 px-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="editLandDebtById(${d.id})" class="w-8 h-8 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition flex items-center justify-center">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="deleteLandDebt(${d.id})" class="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Modal Detail Hutang Lahan Petani
async function openLandDebtDetail(id) {
    const debt = allLandDebts.find(d => d.id === id);
    if (!debt) return;

    currentLandDebt = debt;
    await refreshLandDebtDetailView();

    document.getElementById('landDebtDetailModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeLandDebtDetailModal() {
    document.getElementById('landDebtDetailModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    currentLandDebt = null;
    currentLandPayments = [];
}

async function refreshLandDebtDetailView() {
    if (!currentLandDebt) return;

    const fresh = await LandDebtDB.getById(currentLandDebt.id);
    if (fresh) currentLandDebt = { ...currentLandDebt, ...fresh };

    currentLandPayments = await LandPaymentDB.getByLandDebtId(currentLandDebt.id);

    const totalBayar = currentLandPayments.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
    const harga = Number(currentLandDebt.totalKesepakatan) || 0;
    const sisa = Math.max(0, harga - totalBayar);
    const persen = harga > 0 ? Math.min(100, Math.round((totalBayar / harga) * 100)) : 0;
    const isLunas = harga > 0 && totalBayar >= harga;

    const project = allProjects.find(p => p.id === currentLandDebt.projectId);

    document.getElementById('detailPetaniName').textContent = currentLandDebt.namaPetani;
    document.getElementById('detailPetaniSubtitle').textContent = `Proyek: ${project ? project.nama : '-'} | Telp: ${currentLandDebt.telepon || '-'}`;

    document.getElementById('detailPetaniTotalHarga').textContent = formatRupiah(harga);
    document.getElementById('detailPetaniLuas').textContent = `Luas: ${currentLandDebt.luasLahan} (${currentLandDebt.alasHak})`;
    document.getElementById('detailPetaniTotalBayar').textContent = formatRupiah(totalBayar);
    document.getElementById('detailPetaniPersen').textContent = `${persen}% Terbayar (${currentLandPayments.length}x cicilan)`;
    document.getElementById('detailPetaniSisaHutang').textContent = formatRupiah(sisa);

    const badgeContainer = document.getElementById('detailPetaniStatusBadge');
    if (isLunas) {
        badgeContainer.innerHTML = `<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">🟢 LUNAS</span>`;
    } else {
        badgeContainer.innerHTML = `<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-800">🔴 SISA HUTANG</span>`;
    }

    // Dokumen Lahan Petani
    renderLandDocumentView();

    // Tabel Pembayaran ke Petani
    renderLandPaymentsTable();
}

function renderLandDocumentView() {
    const sertifikatImg = document.getElementById('landSertifikatImg');
    const sertifikatEmpty = document.getElementById('landSertifikatEmpty');
    if (currentLandDebt.sertifikatImage) {
        sertifikatImg.src = currentLandDebt.sertifikatImage;
        sertifikatImg.classList.remove('hidden');
        sertifikatEmpty.classList.add('hidden');
    } else {
        sertifikatImg.src = '';
        sertifikatImg.classList.add('hidden');
        sertifikatEmpty.classList.remove('hidden');
    }

    const perjanjianImg = document.getElementById('landPerjanjianImg');
    const perjanjianEmpty = document.getElementById('landPerjanjianEmpty');
    if (currentLandDebt.perjanjianImage) {
        perjanjianImg.src = currentLandDebt.perjanjianImage;
        perjanjianImg.classList.remove('hidden');
        perjanjianEmpty.classList.add('hidden');
    } else {
        perjanjianImg.src = '';
        perjanjianImg.classList.add('hidden');
        perjanjianEmpty.classList.remove('hidden');
    }
}

async function handleLandDocUpload(event, docType) {
    const file = event.target.files && event.target.files[0];
    if (!file || !currentLandDebt) return;

    try {
        Swal.fire({ title: 'Mengunggah Berkas Lahan...', didOpen: () => Swal.showLoading() });
        const compressedBase64 = await compressImage(file, 1600, 0.85);

        if (docType === 'sertifikat') currentLandDebt.sertifikatImage = compressedBase64;
        else if (docType === 'perjanjian') currentLandDebt.perjanjianImage = compressedBase64;

        await LandDebtDB.update(currentLandDebt.id, currentLandDebt);
        await refreshLandDebtList();
        await refreshLandDebtDetailView();

        Swal.fire({ icon: 'success', title: 'Berkas Lahan Disimpan', timer: 1400, showConfirmButton: false });
    } catch (e) {
        Swal.fire({ icon: 'error', title: 'Gagal mengunggah berkas' });
    }
}

function renderLandPaymentsTable() {
    const tbody = document.getElementById('landPaymentTableBody');
    const emptyState = document.getElementById('landPaymentEmptyState');

    if (!currentLandPayments || currentLandPayments.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = currentLandPayments.map((p, idx) => {
        const kwitansiThumb = p.kwitansiImage
            ? `<img src="${p.kwitansiImage}" alt="Kwitansi Materai" class="w-10 h-10 object-cover rounded border clickable-image mx-auto" onclick="openLightbox('${p.kwitansiImage}', 'Kwitansi Petani - ${escapeHtml(p.termin)}')">`
            : `<span class="text-xs text-slate-300 italic">Tanpa Foto</span>`;

        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                <td class="py-3 px-3 text-center text-xs text-slate-400">${idx + 1}</td>
                <td class="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">${formatTanggalIndo(p.tanggal)}</td>
                <td class="py-3 px-3 font-bold text-slate-800">${escapeHtml(p.termin)}</td>
                <td class="py-3 px-3 text-right font-bold text-emerald-600">${formatRupiah(p.nominal)}</td>
                <td class="py-3 px-3 text-xs">
                    <span class="font-semibold text-slate-700">${escapeHtml(p.metode || '-')}</span>
                    <span class="block text-slate-400 text-[11px]">${escapeHtml(p.keterangan || '')}</span>
                </td>
                <td class="py-3 px-3 text-center">${kwitansiThumb}</td>
                <td class="py-3 px-3 text-center">
                    <button onclick="deleteLandPayment(${p.id})" class="text-red-500 hover:text-red-700 p-1">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Modal Form Tambah / Edit Lahan Petani
function openLandDebtModal(editData = null) {
    const form = document.getElementById('landDebtForm');
    form.reset();

    const titleEl = document.getElementById('landDebtModalTitle');
    const idInput = document.getElementById('landDebtIdInput');

    renderProjectDropdowns();
    const defaultProjId = (selectedLandProjectId !== 'all') ? Number(selectedLandProjectId) : selectedProjectId;
    document.getElementById('formLandProjectId').value = defaultProjId;

    if (editData) {
        titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Data Lahan Petani';
        idInput.value = editData.id;
        document.getElementById('formLandProjectId').value = editData.projectId;
        document.getElementById('formLandPetaniNama').value = editData.namaPetani || '';
        document.getElementById('formLandPetaniTelepon').value = editData.telepon || '';
        document.getElementById('formLandLuas').value = editData.luasLahan || '';
        document.getElementById('formLandAlasHak').value = editData.alasHak || '';
        document.getElementById('formLandHarga').value = new Intl.NumberFormat('id-ID').format(editData.totalKesepakatan || 0);
        document.getElementById('formLandAlamat').value = editData.alamat || '';
    } else {
        titleEl.innerHTML = '<i class="fa-solid fa-tractor"></i> Tambah Data Pembelian Lahan Petani';
        idInput.value = '';
    }

    document.getElementById('landDebtFormModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeLandDebtModal() {
    document.getElementById('landDebtFormModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

async function handleLandDebtSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('landDebtIdInput').value;
    const projectId = Number(document.getElementById('formLandProjectId').value);
    const namaPetani = document.getElementById('formLandPetaniNama').value.trim();
    const telepon = document.getElementById('formLandPetaniTelepon').value.trim();
    const luasLahan = document.getElementById('formLandLuas').value.trim();
    const alasHak = document.getElementById('formLandAlasHak').value.trim();
    const totalKesepakatan = parseCurrencyInput(document.getElementById('formLandHarga').value);
    const alamat = document.getElementById('formLandAlamat').value.trim();

    if (!namaPetani || !luasLahan || totalKesepakatan <= 0) {
        Swal.fire({ icon: 'warning', title: 'Harap lengkapi nama petani, luas, dan harga tanah.' });
        return;
    }

    const fileSertifikat = document.getElementById('formLandFileSertifikat').files[0];
    const filePerjanjian = document.getElementById('formLandFilePerjanjian').files[0];

    let sertifikatImage = null, perjanjianImage = null;
    if (fileSertifikat) sertifikatImage = await compressImage(fileSertifikat, 1600, 0.85);
    if (filePerjanjian) perjanjianImage = await compressImage(filePerjanjian, 1600, 0.85);

    if (id) {
        const existing = await LandDebtDB.getById(id);
        const updated = {
            ...existing,
            projectId,
            namaPetani,
            telepon,
            luasLahan,
            alasHak,
            totalKesepakatan,
            alamat
        };
        if (sertifikatImage) updated.sertifikatImage = sertifikatImage;
        if (perjanjianImage) updated.perjanjianImage = perjanjianImage;
        await LandDebtDB.update(id, updated);
    } else {
        await LandDebtDB.add({
            projectId,
            namaPetani,
            telepon,
            luasLahan,
            alasHak,
            totalKesepakatan,
            alamat,
            sertifikatImage,
            perjanjianImage
        });
    }

    closeLandDebtModal();
    await refreshLandDebtList();
    Swal.fire({ icon: 'success', title: 'Data Lahan Petani Disimpan', timer: 1400, showConfirmButton: false });
}

function editLandDebtById(id) {
    const debt = allLandDebts.find(d => d.id === id);
    if (debt) openLandDebtModal(debt);
}

function editCurrentLandDebt() {
    if (currentLandDebt) {
        closeLandDebtDetailModal();
        openLandDebtModal(currentLandDebt);
    }
}

async function deleteLandDebt(id) {
    const res = await Swal.fire({
        title: 'Hapus Catatan Lahan Petani Ini?',
        text: 'Semua riwayat cicilan ke petani akan ikut terhapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    });
    if (res.isConfirmed) {
        await LandDebtDB.delete(id);
        if (currentLandDebt && currentLandDebt.id === id) closeLandDebtDetailModal();
        await refreshLandDebtList();
    }
}

// Modal Bayar Cicilan ke Petani
function openLandPaymentModal() {
    if (!currentLandDebt) return;
    document.getElementById('landPayTanggal').value = new Date().toISOString().split('T')[0];
    document.getElementById('landPayNominal').value = '';
    document.getElementById('landPayKeterangan').value = '';
    document.getElementById('landPayKwitansiFile').value = '';
    document.getElementById('landPaymentFormModal').classList.remove('hidden');
}

function closeLandPaymentModal() {
    document.getElementById('landPaymentFormModal').classList.add('hidden');
}

async function handleLandPaymentSubmit(event) {
    event.preventDefault();
    if (!currentLandDebt) return;

    const tanggal = document.getElementById('landPayTanggal').value;
    const termin = document.getElementById('landPayTermin').value;
    const nominal = parseCurrencyInput(document.getElementById('landPayNominal').value);
    const metode = document.getElementById('landPayMetode').value;
    const keterangan = document.getElementById('landPayKeterangan').value.trim();

    if (!tanggal || nominal <= 0) {
        Swal.fire({ icon: 'warning', title: 'Nominal pembayaran tidak valid' });
        return;
    }

    const kwitansiFile = document.getElementById('landPayKwitansiFile').files[0];
    let kwitansiImage = null;
    if (kwitansiFile) {
        kwitansiImage = await compressImage(kwitansiFile, 1500, 0.85);
    }

    await LandPaymentDB.add({
        landDebtId: currentLandDebt.id,
        tanggal,
        termin,
        nominal,
        metode,
        keterangan,
        kwitansiImage
    });

    closeLandPaymentModal();
    await refreshLandDebtList();
    await refreshLandDebtDetailView();

    Swal.fire({
        icon: 'success',
        title: 'Pembayaran ke Petani Dicatat!',
        text: `Tercatat Rp ${new Intl.NumberFormat('id-ID').format(nominal)}.`,
        timer: 1500,
        showConfirmButton: false
    });
}

async function deleteLandPayment(id) {
    const res = await Swal.fire({
        title: 'Hapus Catatan Pembayaran Petani Ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    });
    if (res.isConfirmed) {
        await LandPaymentDB.delete(id);
        await refreshLandDebtList();
        await refreshLandDebtDetailView();
    }
}


// ========================================================
// LIGHTBOX (IMAGE VIEWER FULLSCREEN)
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

document.getElementById('lightboxModal').addEventListener('click', (e) => {
    if (e.target.id === 'lightboxModal') closeLightbox();
});


// ========================================================
// CETAK KWITANSI RESMI & REKAP LAPORAN
// ========================================================
function printSingleReceipt(paymentId) {
    const payment = currentCustomerPayments.find(p => p.id === paymentId);
    if (!payment || !currentCustomer) return;

    const printableArea = document.getElementById('printableArea');
    const terbilangText = terbilang(payment.nominal) + ' Rupiah';

    const isBarter = payment.metodeBayar === 'barter' || payment.metodeBayar === 'campuran';

    printableArea.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 25px; border: 2px solid #0f766e; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f766e; padding-bottom: 15px; margin-bottom: 20px;">
                <div>
                    <h1 style="margin: 0; color: #047857; font-size: 24px; font-weight: bold; letter-spacing: 1px;">ADAM PROPERTY GROUP</h1>
                    <p style="margin: 3px 0 0; color: #475569; font-size: 13px;">Pengembangan Lahan, Kavling Mandiri & Bangunan Komersil</p>
                </div>
                <div style="text-align: right;">
                    <div style="background-color: #047857; color: white; padding: 6px 16px; border-radius: 4px; font-weight: bold; font-size: 15px;">
                        ${isBarter ? 'TANDA TERIMA BARTER MATERIAL' : 'KWITANSI PEMBAYARAN'}
                    </div>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #64748b;">No: AP-${currentCustomer.id}-${payment.id}</p>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 25px;">
                <tr style="height: 36px;">
                    <td style="width: 25%; font-weight: bold; color: #334155;">Telah Terima Dari</td>
                    <td style="width: 3%;">:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; font-weight: bold; color: #0f172a;">${escapeHtml(currentCustomer.nama)}</td>
                </tr>
                <tr style="height: 36px;">
                    <td style="font-weight: bold; color: #334155;">Nilai Sejumlah</td>
                    <td>:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; font-style: italic; background-color: #f8fafc; padding: 4px 8px; color: #047857; font-weight: bold;">
                        ${terbilangText}
                    </td>
                </tr>
                <tr style="height: 36px;">
                    <td style="font-weight: bold; color: #334155;">Metode Transaksi</td>
                    <td>:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; font-weight: bold; color: ${isBarter ? '#92400e' : '#047857'};">
                        ${isBarter ? '🧱 BARTER MATERIAL BAHAN BANGUNAN (NON-TUNAI)' : '💵 TUNAI / TRANSFER BANK'}
                    </td>
                </tr>
                <tr style="height: 36px;">
                    <td style="font-weight: bold; color: #334155;">Untuk Pembayaran</td>
                    <td>:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; color: #1e293b;">
                        <b>${escapeHtml(payment.tujuan)}</b> Kavling <b>${escapeHtml(currentCustomer.kavling)}</b>
                    </td>
                </tr>
                ${payment.rincianBarter ? `
                <tr>
                    <td style="font-weight: bold; color: #334155; padding-top: 8px; vertical-align: top;">Rincian Material</td>
                    <td style="vertical-align: top; padding-top: 8px;">:</td>
                    <td style="border-bottom: 1px dotted #94a3b8; padding-top: 8px; font-size: 12px; color: #475569; white-space: pre-line;">
                        ${escapeHtml(payment.rincianBarter)}
                    </td>
                </tr>` : ''}
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
                        <span style="font-size: 13px; color: #065f46; display: block; font-weight: bold;">NILAI TRANSAKSI:</span>
                        <span style="font-size: 22px; font-weight: bold; color: #047857;">${formatRupiah(payment.nominal)}</span>
                    </div>
                </div>

                <div style="text-align: center; width: 220px;">
                    <p style="margin: 0; font-size: 13px; color: #475569;">Tanggal: ${formatTanggalIndo(payment.tanggal)}</p>
                    <p style="margin: 4px 0 60px; font-size: 13px; font-weight: bold; color: #334155;">Penerima,</p>
                    <p style="margin: 0; font-weight: bold; border-top: 1px solid #334155; padding-top: 4px; color: #0f172a;">( ADAM PROPERTY GROUP )</p>
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
            <td style="padding: 8px; font-weight: bold;">${p.metodeBayar === 'barter' ? '🧱 Barter Material' : '💵 Tunai'} - ${escapeHtml(p.tujuan)}</td>
            <td style="padding: 8px;">${escapeHtml(p.keterangan || '-')}</td>
            <td style="padding: 8px; text-align: right; font-weight: bold; color: #047857;">${formatRupiah(p.nominal)}</td>
        </tr>
    `).join('');

    printableArea.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 850px; margin: 0 auto; padding: 20px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px;">
                <div>
                    <h2 style="margin:0; color: #047857;">ADAM PROPERTY GROUP</h2>
                    <p style="margin:2px 0 0; font-size: 12px; color: #64748b;">Lembar Rekapitulasi Riwayat Pembayaran & Barter Customer</p>
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
                        <td style="font-weight: bold;">Sisa Tagihan</td>
                        <td>:</td>
                        <td style="font-weight: bold; color: ${sisa > 0 ? '#b45309' : '#047857'};">${formatRupiah(sisa)} ${sisa === 0 ? '(LUNAS)' : ''}</td>
                    </tr>
                </table>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background-color: #f1f5f9; text-align: left; font-size: 12px;">
                        <th style="padding: 8px; text-align: center; width: 5%;">#</th>
                        <th style="padding: 8px; width: 20%;">Tanggal</th>
                        <th style="padding: 8px; width: 30%;">Metode & Tujuan</th>
                        <th style="padding: 8px;">Keterangan</th>
                        <th style="padding: 8px; text-align: right; width: 20%;">Nilai (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="5" style="text-align:center; padding:15px; color:#94a3b8;">Belum ada riwayat transaksi</td></tr>'}
                </tbody>
                <tfoot>
                    <tr style="background-color: #ecfdf5; font-weight: bold; font-size: 13px;">
                        <td colspan="4" style="padding: 10px; text-align: right; color: #065f46;">TOTAL MASUK:</td>
                        <td style="padding: 10px; text-align: right; color: #047857;">${formatRupiah(totalMasuk)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    window.print();
}


// ========================================================
// BACKUP & RESTORE DATABASE
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
            title: 'Backup Database Berhasil',
            text: 'File cadangan JSON berisi seluruh data kavling, customer, barter material, dan hutang lahan petani.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal Membuat Backup', text: err.message });
    }
}

async function handleImportBackup(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    const result = await Swal.fire({
        title: 'Pulihkan Database (Restore)?',
        text: 'Semua data yang ada saat ini akan digantikan dengan data dari file backup.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        confirmButtonText: 'Ya, Pulihkan'
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
            await initializeData();
            Swal.fire({
                icon: 'success',
                title: 'Data Berhasil Dipulihkan!',
                text: 'Proyek, unit kavling, customer, dokumen AJB, dan hutang petani telah dimuat.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal Memulihkan Data', text: err.message });
        } finally {
            input.value = '';
        }
    };
    reader.readAsText(file);
}


// ========================================================
// CONTOH DATA DEMO (PROYEK, BLOK, BARTER MATERIAL & PETANI)
// ========================================================
async function loadDemoData() {
    const result = await Swal.fire({
        title: 'Muat Data Sampel Perusahaan?',
        html: `Aplikasi akan memuat data operasional riil:
               <ul class="text-left text-xs list-disc pl-5 mt-2 space-y-1.5">
                 <li><b>Induk Proyek:</b> Baitul Makmur Regency</li>
                 <li><b>Blok Kavling:</b> Blok Ruko, Blok A, Blok B, Blok C</li>
                 <li><b>Hutang Lahan Petani:</b> Bpk. H. Sugeng (6.000 m², Kesepakatan 600 Juta, DP 250 Juta, Sisa Hutang 350 Juta)</li>
                 <li><b>Customer Barter Material:</b> Bpk. Ir. Hendro (Beli Ruko-01 senilai 250 Juta dibarter Semen, Besi, Bata Hebel & Pasir)</li>
                 <li><b>Customer Pembeli Tunai:</b> Bpk. Bambang Sutrisno (A-03) & Ibu Rahmawati Putri (B-02)</li>
               </ul>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        confirmButtonText: 'Ya, Muat Data Demo',
        cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    function createDummyDoc(title, subtitle, bg) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
            <rect width="600" height="380" fill="${bg}" rx="12"/>
            <rect x="20" y="20" width="560" height="340" fill="none" stroke="white" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>
            <circle cx="300" cy="140" r="45" fill="white" opacity="0.2"/>
            <text x="300" y="215" font-family="Arial" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
            <text x="300" y="245" font-family="Arial" font-size="14" fill="white" opacity="0.8" text-anchor="middle">${subtitle}</text>
            <text x="300" y="280" font-family="Arial" font-size="12" fill="white" opacity="0.6" text-anchor="middle">ADAM PROPERTY GROUP</text>
        </svg>`;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    const demoKtp = createDummyDoc('KARTU TANDA PENDUDUK (KTP)', 'NIK: 3324081234560001', '#1e3a8a');
    const demoKk = createDummyDoc('KARTU KELUARGA (KK)', 'No KK: 3324089876540002', '#581c87');
    const demoAjb = createDummyDoc('AKTA JUAL BELI (AJB) / PPJB', 'Nomor: 104/AJB/NOT/2026', '#065f46');
    const demoKwitansi = createDummyDoc('BUKTI KWITANSI RESMI', 'Tanda Terima Sah', '#0f766e');
    const demoSuratJalan = createDummyDoc('SURAT JALAN & NOTA MATERIAL', 'Toko Bangunan Berkah Mandiri', '#92400e');
    const demoLetterC = createDummyDoc('BUKU LETTER C / SERTIFIKAT LAHAN', 'Alas Hak Tanah Petani No. 45', '#78350f');

    // 1. Induk Proyek
    let baitulId = null;
    const existing = allProjects.find(p => p.nama.toLowerCase().includes('baitul'));
    if (existing) {
        baitulId = existing.id;
    } else {
        baitulId = await ProjectDB.add({
            nama: 'Baitul Makmur Regency',
            lokasi: 'Jl. Raya Kaliwungu KM 3, Kendal',
            keterangan: 'Kawasan Pengembangan Hunian Syariah & Ruko Komersil'
        });
    }

    // 2. Data Hutang Lahan ke Petani (Bpk. H. Sugeng)
    const sugengDebtId = await LandDebtDB.add({
        projectId: baitulId,
        namaPetani: 'Bpk. H. Sugeng',
        telepon: '081324567890',
        luasLahan: '6.000 m² (420 Ru)',
        alasHak: 'Letter C No. 45 Desa Kaliwungu',
        totalKesepakatan: 600000000,
        alamat: 'Dusun Krajan RT 02 / RW 01 Desa Kaliwungu',
        sertifikatImage: demoLetterC,
        perjanjianImage: demoLetterC
    });

    // Cicilan ke Petani H. Sugeng
    await LandPaymentDB.add({
        landDebtId: sugengDebtId,
        tanggal: '2026-08-10',
        termin: 'DP (Uang Muka Pembukaan Lahan)',
        nominal: 150000000,
        metode: 'Transfer Bank BRI',
        keterangan: 'DP Lahan 6.000 m2 disaksikan oleh Notaris & RT',
        kwitansiImage: demoKwitansi
    });
    await LandPaymentDB.add({
        landDebtId: sugengDebtId,
        tanggal: '2026-09-15',
        termin: 'Termin 1 (Pematangan Lahan & Alat Berat Masuk)',
        nominal: 100000000,
        metode: 'Transfer Bank BRI',
        keterangan: 'Pembayaran termin kedua sesuai kesepakatan perikatan notaris',
        kwitansiImage: demoKwitansi
    });

    // 2b. Buat Proyek Lahan Kedua (Griya Harmoni Asri) untuk menunjukkan pemisahan hutang petani antar lahan
    let griyaId = null;
    const existingGriya = allProjects.find(p => p.nama.toLowerCase().includes('griya'));
    if (existingGriya) {
        griyaId = existingGriya.id;
    } else {
        griyaId = await ProjectDB.add({
            nama: 'Griya Harmoni Asri',
            lokasi: 'Jl. Pemuda No. 88, Boja',
            keterangan: 'Proyek Perluasan Lahan Tahap 2'
        });
    }

    const suwardiDebtId = await LandDebtDB.add({
        projectId: griyaId,
        namaPetani: 'Bpk. Suwardi',
        telepon: '085290123456',
        luasLahan: '4.500 m² (315 Ru)',
        alasHak: 'SHM No. 882 / Desa Boja',
        totalKesepakatan: 450000000,
        alamat: 'Desa Boja RT 01 / RW 03',
        sertifikatImage: demoLetterC,
        perjanjianImage: demoLetterC
    });

    await LandPaymentDB.add({
        landDebtId: suwardiDebtId,
        tanggal: '2026-09-20',
        termin: 'DP (Uang Muka Pembebasan Lahan)',
        nominal: 100000000,
        metode: 'Transfer Bank Mandiri',
        keterangan: 'DP Lahan 4.500 m2 perikatan notaris',
        kwitansiImage: demoKwitansi
    });

    // 3. Customer 1 (Bpk. Ir. Hendro - Pembeli Barter Material Kavling Ruko-01 Rp 250jt)
    const custBarterId = await CustomerDB.add({
        nama: 'Bpk. Ir. Hendro (Supplier Bahan Bangunan)',
        kavling: 'Baitul Makmur Regency - Blok Ruko (Ruko-01)',
        harga: 250000000,
        telepon: '081198765432',
        alamat: 'Gudang Bahan Bangunan Berkah, Jl. Industri Raya No. 12',
        projectId: baitulId,
        ktpImage: demoKtp,
        kkImage: demoKk,
        ajbImage: demoAjb
    });

    // Transaksi Barter Material Rp 250 Juta
    await PaymentDB.add({
        customerId: custBarterId,
        tanggal: '2026-10-20',
        metodeBayar: 'barter',
        tujuan: 'Pelunasan via Barter Material',
        nominal: 250000000,
        rincianBarter: `1. Semen Gresik: 500 sak @ Rp 65.000 = Rp 32.500.000\n2. Besi Beton 10mm: 1.000 btg @ Rp 85.000 = Rp 85.000.000\n3. Bata Ringan (Hebel): 120 m3 @ Rp 600.000 = Rp 72.000.000\n4. Pasir Cor: 25 truk @ Rp 2.420.000 = Rp 60.500.000\nTOTAL BARTER: Rp 250.000.000 (Lunas)`,
        keterangan: 'Serah terima bahan bangunan untuk pembangunan fasilitas jalan paving dan ruko perumahan',
        suratJalanImage: demoSuratJalan,
        kwitansiImage: demoKwitansi
    });

    // 4. Customer 2 (Bpk. Bambang Sutrisno - Booking Kavling A-03)
    const cust1Id = await CustomerDB.add({
        nama: 'Bambang Sutrisno',
        kavling: 'Baitul Makmur Regency - Blok A (A-03)',
        harga: 120000000,
        telepon: '081298765432',
        alamat: 'Jl. Melati Indah No. 15',
        projectId: baitulId,
        ktpImage: demoKtp,
        kkImage: demoKk,
        ajbImage: demoAjb
    });

    await PaymentDB.add({
        customerId: cust1Id,
        tanggal: '2026-10-01',
        metodeBayar: 'tunai',
        tujuan: 'Booking Fee / Tanda Jadi',
        nominal: 5000000,
        keterangan: 'Booking via Transfer BCA',
        kwitansiImage: demoKwitansi
    });
    await PaymentDB.add({
        customerId: cust1Id,
        tanggal: '2026-10-15',
        metodeBayar: 'tunai',
        tujuan: 'DP (Uang Muka)',
        nominal: 35000000,
        keterangan: 'Pembayaran DP tahap 1 via Teller Mandiri (AJB terbit)',
        kwitansiImage: demoKwitansi
    });

    // 5. Unit Kavling (Ruko-01, Ruko-02, Blok A, Blok B, Blok C)
    const ruko1Id = await KavlingDB.add({
        projectId: baitulId,
        blok: 'Blok Ruko',
        nomor: 'Ruko-01',
        luas: 100,
        dimensi: '5 x 20 meter',
        harga: 250000000,
        tipe: 'Ruko Komersil',
        status: 'terjual',
        customerId: custBarterId,
        keterangan: 'Lunas via Barter Material Bangunan Bpk. Ir. Hendro'
    });
    await CustomerDB.update(custBarterId, { kavlingId: ruko1Id });

    await KavlingDB.add({
        projectId: baitulId,
        blok: 'Blok Ruko',
        nomor: 'Ruko-02',
        luas: 100,
        dimensi: '5 x 20 meter',
        harga: 250000000,
        tipe: 'Ruko Komersil',
        status: 'terbuka',
        customerId: null,
        keterangan: 'Kavling Ruko siap bangun'
    });

    // Blok A
    await KavlingDB.add({
        projectId: baitulId,
        blok: 'Blok A',
        nomor: 'A-01',
        luas: 84,
        dimensi: '6 x 14 meter',
        harga: 120000000,
        tipe: 'Hunian Standar',
        status: 'terbuka',
        customerId: null,
        keterangan: 'Hadap Timur'
    });
    const a03Id = await KavlingDB.add({
        projectId: baitulId,
        blok: 'Blok A',
        nomor: 'A-03',
        luas: 84,
        dimensi: '6 x 14 meter',
        harga: 120000000,
        tipe: 'Hunian Standar',
        status: 'booking',
        customerId: cust1Id,
        keterangan: 'Sudah DP 40 Juta'
    });
    await CustomerDB.update(cust1Id, { kavlingId: a03Id });

    await KavlingDB.add({
        projectId: baitulId,
        blok: 'Blok A',
        nomor: 'A-04',
        luas: 84,
        dimensi: '6 x 14 meter',
        harga: 120000000,
        tipe: 'Hunian Standar',
        status: 'terbuka',
        customerId: null,
        keterangan: 'Siap bangun'
    });

    // Blok B & C
    await KavlingDB.add({
        projectId: baitulId,
        blok: 'Blok B',
        nomor: 'B-01',
        luas: 105,
        dimensi: '7 x 15 meter',
        harga: 150000000,
        tipe: 'Hunian Standar',
        status: 'terbuka',
        customerId: null,
        keterangan: 'Siap bangun'
    });
    await KavlingDB.add({
        projectId: baitulId,
        blok: 'Blok C',
        nomor: 'C-01',
        luas: 72,
        dimensi: '6 x 12 meter',
        harga: 95000000,
        tipe: 'Hunian Standar',
        status: 'terbuka',
        customerId: null,
        keterangan: 'Tipe ekonomis'
    });

    allProjects = await ProjectDB.getAll();
    selectedProjectId = baitulId;
    renderProjectDropdowns();
    await refreshKavlingView();
    await refreshCustomerList();
    await refreshLandDebtList();

    Swal.fire({
        icon: 'success',
        title: 'Data Sampel Perusahaan Dimuat!',
        text: 'Data Hutang Lahan Petani, Barter Material Ruko, dan Site Plan siap dipelajari.',
        confirmButtonColor: '#059669'
    });
}


// ========================================================
// UTILITY HELPERS
// ========================================================
function formatRupiah(number) {
    if (isNaN(number) || number === null || number === undefined) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
}

function formatTanggalIndo(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

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

function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

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

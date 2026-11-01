// db.js - Layer Database IndexedDB & Image Helper untuk Adam Property (Versi 6: Inventaris Kantor & Aset Tetap)
const DB_NAME = 'AdamKavlingDB';
const DB_VERSION = 6;

let dbInstance = null;

// Inisialisasi Database IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // 1. Store Customer
            if (!db.objectStoreNames.contains('customers')) {
                const customerStore = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
                customerStore.createIndex('nama', 'nama', { unique: false });
                customerStore.createIndex('kavling', 'kavling', { unique: false });
                customerStore.createIndex('kavlingId', 'kavlingId', { unique: false });
            }

            // 2. Store Riwayat Pembayaran / Uang Masuk Customer (Mendukung Barter Material)
            if (!db.objectStoreNames.contains('payments')) {
                const paymentStore = db.createObjectStore('payments', { keyPath: 'id', autoIncrement: true });
                paymentStore.createIndex('customerId', 'customerId', { unique: false });
                paymentStore.createIndex('tanggal', 'tanggal', { unique: false });
            }

            // 3. Store Induk Kavling (Proyek, misal: Baitul Makmur Regency)
            if (!db.objectStoreNames.contains('projects')) {
                const projectStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
                projectStore.createIndex('nama', 'nama', { unique: false });
            }

            // 4. Store Unit Kavling (Spek, Ukuran, Luas, Harga, Status: Terbuka, Booking, Terjual)
            if (!db.objectStoreNames.contains('kavlings')) {
                const kavlingStore = db.createObjectStore('kavlings', { keyPath: 'id', autoIncrement: true });
                kavlingStore.createIndex('projectId', 'projectId', { unique: false });
                kavlingStore.createIndex('blok', 'blok', { unique: false });
                kavlingStore.createIndex('status', 'status', { unique: false });
                kavlingStore.createIndex('customerId', 'customerId', { unique: false });
            }

            // 5. Store Hutang Lahan ke Petani / Pemilik Tanah Mentah (NEW)
            if (!db.objectStoreNames.contains('land_debts')) {
                const landStore = db.createObjectStore('land_debts', { keyPath: 'id', autoIncrement: true });
                landStore.createIndex('projectId', 'projectId', { unique: false });
                landStore.createIndex('namaPetani', 'namaPetani', { unique: false });
            }

            // 6. Store Riwayat Pembayaran Cicilan Pengembang ke Petani
            if (!db.objectStoreNames.contains('land_payments')) {
                const landPayStore = db.createObjectStore('land_payments', { keyPath: 'id', autoIncrement: true });
                landPayStore.createIndex('landDebtId', 'landDebtId', { unique: false });
                landPayStore.createIndex('tanggal', 'tanggal', { unique: false });
            }

            // 7. Store Kas Besar (Master Cashbook / Arus Kas & Investor)
            if (!db.objectStoreNames.contains('cashbook')) {
                const cashStore = db.createObjectStore('cashbook', { keyPath: 'id', autoIncrement: true });
                cashStore.createIndex('tanggal', 'tanggal', { unique: false });
                cashStore.createIndex('tipe', 'tipe', { unique: false }); // 'masuk' | 'keluar'
                cashStore.createIndex('kategori', 'kategori', { unique: false }); // 'jual_kavling' | 'investor' | 'lahan_petani' | 'operasional' | 'lainnya'
                cashStore.createIndex('refType', 'refType', { unique: false });
                cashStore.createIndex('refId', 'refId', { unique: false });
                cashStore.createIndex('projectId', 'projectId', { unique: false });
            }

            // 8. Store Kas Kecil Kantor (Petty Cash Operasional Harian)
            if (!db.objectStoreNames.contains('petty_cash')) {
                const pettyStore = db.createObjectStore('petty_cash', { keyPath: 'id', autoIncrement: true });
                pettyStore.createIndex('tanggal', 'tanggal', { unique: false });
                pettyStore.createIndex('tipe', 'tipe', { unique: false }); // 'masuk' (top up) | 'keluar' (pengeluaran harian)
                pettyStore.createIndex('kategori', 'kategori', { unique: false });
                pettyStore.createIndex('sumberDana', 'sumberDana', { unique: false }); // 'kas_besar' | 'investor' | 'manual'
                pettyStore.createIndex('refType', 'refType', { unique: false });
                pettyStore.createIndex('refId', 'refId', { unique: false });
            }

            // 9. Store Inventaris Kantor & Aset Tetap Developer
            if (!db.objectStoreNames.contains('inventory')) {
                const invStore = db.createObjectStore('inventory', { keyPath: 'id', autoIncrement: true });
                invStore.createIndex('kode', 'kode', { unique: false });
                invStore.createIndex('kategori', 'kategori', { unique: false });
                invStore.createIndex('kondisi', 'kondisi', { unique: false });
                invStore.createIndex('lokasi', 'lokasi', { unique: false });
                invStore.createIndex('tanggalPerolehan', 'tanggalPerolehan', { unique: false });
                invStore.createIndex('penanggungJawab', 'penanggungJawab', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            dbInstance = event.target.result;
            resolve(dbInstance);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Helper Operasi CRUD Induk Kavling (Proyek)
const ProjectDB = {
    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('projects', 'readonly');
            const store = tx.objectStore('projects');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async getById(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('projects', 'readonly');
            const store = tx.objectStore('projects');
            const request = store.get(Number(id));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async add(projectData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('projects', 'readwrite');
            const store = tx.objectStore('projects');
            projectData.createdAt = new Date().toISOString();
            const request = store.add(projectData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(id, projectData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('projects', 'readwrite');
            const store = tx.objectStore('projects');
            projectData.id = Number(id);
            projectData.updatedAt = new Date().toISOString();
            const request = store.put(projectData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await initDB();
        // Hapus unit kavling & hutang lahan yang ada di bawah induk proyek ini
        const kavlings = await KavlingDB.getByProjectId(id);
        for (const k of kavlings) {
            await KavlingDB.delete(k.id);
        }
        const landDebts = await LandDebtDB.getByProjectId(id);
        for (const ld of landDebts) {
            await LandDebtDB.delete(ld.id);
        }

        return new Promise((resolve, reject) => {
            const tx = db.transaction('projects', 'readwrite');
            const store = tx.objectStore('projects');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
};

// Helper Operasi CRUD Unit Kavling
const KavlingDB = {
    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kavlings', 'readonly');
            const store = tx.objectStore('kavlings');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async getByProjectId(projectId) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kavlings', 'readonly');
            const store = tx.objectStore('kavlings');
            const index = store.index('projectId');
            const request = index.getAll(Number(projectId));
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async getById(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kavlings', 'readonly');
            const store = tx.objectStore('kavlings');
            const request = store.get(Number(id));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async add(kavlingData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kavlings', 'readwrite');
            const store = tx.objectStore('kavlings');
            kavlingData.projectId = Number(kavlingData.projectId);
            kavlingData.createdAt = new Date().toISOString();
            if (!kavlingData.status) kavlingData.status = 'terbuka';
            const request = store.add(kavlingData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(id, kavlingData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kavlings', 'readwrite');
            const store = tx.objectStore('kavlings');
            kavlingData.id = Number(id);
            kavlingData.projectId = Number(kavlingData.projectId);
            kavlingData.updatedAt = new Date().toISOString();
            const request = store.put(kavlingData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async updateStatus(id, status, customerId = null) {
        const kavling = await KavlingDB.getById(id);
        if (!kavling) return null;
        kavling.status = status;
        kavling.customerId = customerId ? Number(customerId) : null;
        return await KavlingDB.update(id, kavling);
    },

    async delete(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kavlings', 'readwrite');
            const store = tx.objectStore('kavlings');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
};

// Helper Operasi CRUD Customer (Mendukung Dokumen KTP, KK, AJB)
const CustomerDB = {
    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('customers', 'readonly');
            const store = tx.objectStore('customers');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async getById(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('customers', 'readonly');
            const store = tx.objectStore('customers');
            const request = store.get(Number(id));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async add(customerData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('customers', 'readwrite');
            const store = tx.objectStore('customers');
            customerData.createdAt = new Date().toISOString();
            customerData.updatedAt = new Date().toISOString();
            const request = store.add(customerData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(id, customerData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('customers', 'readwrite');
            const store = tx.objectStore('customers');
            customerData.id = Number(id);
            customerData.updatedAt = new Date().toISOString();
            const request = store.put(customerData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await initDB();
        const kavlings = await KavlingDB.getAll();
        for (const k of kavlings) {
            if (k.customerId === Number(id)) {
                await KavlingDB.updateStatus(k.id, 'terbuka', null);
            }
        }

        await PaymentDB.deleteByCustomerId(id);

        return new Promise((resolve, reject) => {
            const tx = db.transaction('customers', 'readwrite');
            const store = tx.objectStore('customers');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
};

// Helper Operasi CRUD Riwayat Pembayaran Customer (Termasuk Barter Material)
const PaymentDB = {
    async getByCustomerId(customerId) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('payments', 'readonly');
            const store = tx.objectStore('payments');
            const index = store.index('customerId');
            const request = index.getAll(Number(customerId));
            request.onsuccess = () => {
                const results = request.result || [];
                results.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async add(paymentData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('payments', 'readwrite');
            const store = tx.objectStore('payments');
            paymentData.customerId = Number(paymentData.customerId);
            paymentData.createdAt = new Date().toISOString();
            if (!paymentData.metodeBayar) paymentData.metodeBayar = 'tunai'; // 'tunai', 'barter', 'campuran'
            const request = store.add(paymentData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('payments', 'readwrite');
            const store = tx.objectStore('payments');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    async deleteByCustomerId(customerId) {
        const db = await initDB();
        const payments = await PaymentDB.getByCustomerId(customerId);
        if (!payments || payments.length === 0) return;

        return new Promise((resolve, reject) => {
            const tx = db.transaction('payments', 'readwrite');
            const store = tx.objectStore('payments');
            payments.forEach(p => store.delete(p.id));
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    },

    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('payments', 'readonly');
            const store = tx.objectStore('payments');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }
};

// ========================================================
// OPERASI DATABASE: HUTANG LAHAN KE PETANI / PEMILIK LAHAN
// ========================================================
const LandDebtDB = {
    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_debts', 'readonly');
            const store = tx.objectStore('land_debts');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async getByProjectId(projectId) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_debts', 'readonly');
            const store = tx.objectStore('land_debts');
            const index = store.index('projectId');
            const request = index.getAll(Number(projectId));
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async getById(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_debts', 'readonly');
            const store = tx.objectStore('land_debts');
            const request = store.get(Number(id));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async add(debtData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_debts', 'readwrite');
            const store = tx.objectStore('land_debts');
            debtData.projectId = Number(debtData.projectId);
            debtData.totalKesepakatan = Number(debtData.totalKesepakatan) || 0;
            debtData.createdAt = new Date().toISOString();
            debtData.updatedAt = new Date().toISOString();
            const request = store.add(debtData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(id, debtData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_debts', 'readwrite');
            const store = tx.objectStore('land_debts');
            debtData.id = Number(id);
            debtData.projectId = Number(debtData.projectId);
            debtData.totalKesepakatan = Number(debtData.totalKesepakatan) || 0;
            debtData.updatedAt = new Date().toISOString();
            const request = store.put(debtData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await initDB();
        // Hapus pembayaran ke petani terkait
        await LandPaymentDB.deleteByLandDebtId(id);

        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_debts', 'readwrite');
            const store = tx.objectStore('land_debts');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
};

// Helper Operasi CRUD Pembayaran Cicilan Developer ke Petani
const LandPaymentDB = {
    async getByLandDebtId(landDebtId) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_payments', 'readonly');
            const store = tx.objectStore('land_payments');
            const index = store.index('landDebtId');
            const request = index.getAll(Number(landDebtId));
            request.onsuccess = () => {
                const results = request.result || [];
                results.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async add(paymentData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_payments', 'readwrite');
            const store = tx.objectStore('land_payments');
            paymentData.landDebtId = Number(paymentData.landDebtId);
            paymentData.nominal = Number(paymentData.nominal) || 0;
            paymentData.createdAt = new Date().toISOString();
            const request = store.add(paymentData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_payments', 'readwrite');
            const store = tx.objectStore('land_payments');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    async deleteByLandDebtId(landDebtId) {
        const db = await initDB();
        const payments = await LandPaymentDB.getByLandDebtId(landDebtId);
        if (!payments || payments.length === 0) return;

        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_payments', 'readwrite');
            const store = tx.objectStore('land_payments');
            payments.forEach(p => store.delete(p.id));
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    },

    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('land_payments', 'readonly');
            const store = tx.objectStore('land_payments');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }
};

// ========================================================
// OPERASI DATABASE: KAS BESAR (MASTER CASHBOOK & ARUS KAS)
// ========================================================
const CashbookDB = {
    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cashbook', 'readonly');
            const store = tx.objectStore('cashbook');
            const request = store.getAll();
            request.onsuccess = () => {
                const results = request.result || [];
                // Urutkan tanggal terbaru ke terlama, jika tanggal sama urutkan ID terbesar
                results.sort((a, b) => {
                    const diff = new Date(b.tanggal) - new Date(a.tanggal);
                    if (diff !== 0) return diff;
                    return (b.id || 0) - (a.id || 0);
                });
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async getById(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cashbook', 'readonly');
            const store = tx.objectStore('cashbook');
            const request = store.get(Number(id));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getByRef(refType, refId) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cashbook', 'readonly');
            const store = tx.objectStore('cashbook');
            const request = store.getAll();
            request.onsuccess = () => {
                const items = request.result || [];
                const found = items.find(item => item.refType === refType && Number(item.refId) === Number(refId));
                resolve(found || null);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async add(entryData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cashbook', 'readwrite');
            const store = tx.objectStore('cashbook');
            const record = {
                ...entryData,
                nominal: Number(entryData.nominal) || 0,
                tipe: entryData.tipe || 'masuk', // 'masuk' atau 'keluar'
                kategori: entryData.kategori || 'lainnya', // 'jual_kavling', 'investor', 'lahan_petani', 'operasional', 'lainnya'
                metode: entryData.metode || 'transfer', // 'transfer', 'tunai', 'barter'
                projectId: entryData.projectId ? Number(entryData.projectId) : null,
                refType: entryData.refType || 'manual',
                refId: entryData.refId ? Number(entryData.refId) : null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const request = store.add(record);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(id, entryData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cashbook', 'readwrite');
            const store = tx.objectStore('cashbook');
            const record = {
                ...entryData,
                id: Number(id),
                nominal: Number(entryData.nominal) || 0,
                projectId: entryData.projectId ? Number(entryData.projectId) : null,
                refId: entryData.refId ? Number(entryData.refId) : null,
                updatedAt: new Date().toISOString()
            };
            const request = store.put(record);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cashbook', 'readwrite');
            const store = tx.objectStore('cashbook');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    async deleteByRef(refType, refId) {
        const db = await initDB();
        const items = await CashbookDB.getAll();
        const targets = items.filter(it => it.refType === refType && Number(it.refId) === Number(refId));
        if (targets.length === 0) return true;

        return new Promise((resolve, reject) => {
            const tx = db.transaction('cashbook', 'readwrite');
            const store = tx.objectStore('cashbook');
            targets.forEach(t => store.delete(t.id));
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    }
};

// ========================================================
// OPERASI DATABASE: KAS KECIL (PETTY CASH OPERASIONAL KANTOR)
// ========================================================
const PettyCashDB = {
    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('petty_cash', 'readonly');
            const store = tx.objectStore('petty_cash');
            const request = store.getAll();
            request.onsuccess = () => {
                const results = request.result || [];
                // Urutkan tanggal terbaru ke terlama, jika tanggal sama urutkan ID terbesar
                results.sort((a, b) => {
                    const diff = new Date(b.tanggal) - new Date(a.tanggal);
                    if (diff !== 0) return diff;
                    return (b.id || 0) - (a.id || 0);
                });
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async getById(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('petty_cash', 'readonly');
            const store = tx.objectStore('petty_cash');
            const request = store.get(Number(id));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async add(entryData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('petty_cash', 'readwrite');
            const store = tx.objectStore('petty_cash');
            const record = {
                ...entryData,
                nominal: Number(entryData.nominal) || 0,
                tipe: entryData.tipe || 'keluar', // 'masuk' (top up) atau 'keluar' (pengeluaran)
                sumberDana: entryData.sumberDana || (entryData.tipe === 'masuk' ? 'kas_besar' : null),
                kategori: entryData.kategori || 'operasional_lain',
                refType: entryData.refType || 'manual',
                refId: entryData.refId ? Number(entryData.refId) : null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const request = store.add(record);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(id, entryData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('petty_cash', 'readwrite');
            const store = tx.objectStore('petty_cash');
            const record = {
                ...entryData,
                id: Number(id),
                nominal: Number(entryData.nominal) || 0,
                updatedAt: new Date().toISOString()
            };
            const request = store.put(record);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('petty_cash', 'readwrite');
            const store = tx.objectStore('petty_cash');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    async deleteByRef(refType, refId) {
        const db = await initDB();
        const items = await PettyCashDB.getAll();
        const targets = items.filter(it => it.refType === refType && Number(it.refId) === Number(refId));
        if (targets.length === 0) return true;

        return new Promise((resolve, reject) => {
            const tx = db.transaction('petty_cash', 'readwrite');
            const store = tx.objectStore('petty_cash');
            targets.forEach(t => store.delete(t.id));
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    }
};

// Helper Operasi CRUD Inventaris Kantor (Aset Tetap Developer)
const InventoryDB = {
    async getAll() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('inventory', 'readonly');
            const store = tx.objectStore('inventory');
            const request = store.getAll();
            request.onsuccess = () => {
                const list = request.result || [];
                list.sort((a, b) => (b.id || 0) - (a.id || 0));
                resolve(list);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async getById(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('inventory', 'readonly');
            const store = tx.objectStore('inventory');
            const request = store.get(Number(id));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async add(itemData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('inventory', 'readwrite');
            const store = tx.objectStore('inventory');
            itemData.nilaiPerolehan = Number(itemData.nilaiPerolehan) || 0;
            itemData.jumlah = Number(itemData.jumlah) || 1;
            itemData.createdAt = new Date().toISOString();
            itemData.updatedAt = new Date().toISOString();
            const request = store.add(itemData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(id, itemData) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('inventory', 'readwrite');
            const store = tx.objectStore('inventory');
            itemData.id = Number(id);
            itemData.nilaiPerolehan = Number(itemData.nilaiPerolehan) || 0;
            itemData.jumlah = Number(itemData.jumlah) || 1;
            itemData.updatedAt = new Date().toISOString();
            const request = store.put(itemData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('inventory', 'readwrite');
            const store = tx.objectStore('inventory');
            const request = store.delete(Number(id));
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
};

// Helper Kompresi Gambar
function compressImage(file, maxWidth = 1500, quality = 0.82) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// Backup & Restore Database Lengkap
const BackupManager = {
    async exportBackup() {
        const projects = await ProjectDB.getAll();
        const kavlings = await KavlingDB.getAll();
        const customers = await CustomerDB.getAll();
        const payments = await PaymentDB.getAll();
        const landDebts = await LandDebtDB.getAll();
        const landPayments = await LandPaymentDB.getAll();
        const cashbook = await CashbookDB.getAll();
        const pettyCash = await PettyCashDB.getAll();
        const inventory = await InventoryDB.getAll();

        const data = {
            version: DB_VERSION,
            exportDate: new Date().toISOString(),
            company: 'ADAM PROPERTY DEVELOPER',
            projects,
            kavlings,
            customers,
            payments,
            landDebts,
            landPayments,
            cashbook,
            pettyCash,
            inventory
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `Backup_Adam_Property_Group_${new Date().toISOString().slice(0, 10)}.json`;
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    async importBackup(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (!data.customers || !Array.isArray(data.customers)) {
                throw new Error('Format file backup tidak valid.');
            }

            const db = await initDB();

            // 1. Projects
            if (data.projects && Array.isArray(data.projects)) {
                const tx = db.transaction('projects', 'readwrite');
                const store = tx.objectStore('projects');
                store.clear();
                for (const proj of data.projects) store.put(proj);
            }

            // 2. Kavlings
            if (data.kavlings && Array.isArray(data.kavlings)) {
                const tx = db.transaction('kavlings', 'readwrite');
                const store = tx.objectStore('kavlings');
                store.clear();
                for (const kav of data.kavlings) store.put(kav);
            }

            // 3. Customers
            const txCust = db.transaction('customers', 'readwrite');
            const cStore = txCust.objectStore('customers');
            cStore.clear();
            for (const c of data.customers) cStore.put(c);

            // 4. Payments
            if (data.payments && Array.isArray(data.payments)) {
                const txPay = db.transaction('payments', 'readwrite');
                const pStore = txPay.objectStore('payments');
                pStore.clear();
                for (const p of data.payments) pStore.put(p);
            }

            // 5. Land Debts (Hutang Petani)
            if (data.landDebts && Array.isArray(data.landDebts)) {
                const txLand = db.transaction('land_debts', 'readwrite');
                const lStore = txLand.objectStore('land_debts');
                lStore.clear();
                for (const ld of data.landDebts) lStore.put(ld);
            }

            // 6. Land Payments
            if (data.landPayments && Array.isArray(data.landPayments)) {
                const txLandPay = db.transaction('land_payments', 'readwrite');
                const lpStore = txLandPay.objectStore('land_payments');
                lpStore.clear();
                for (const lp of data.landPayments) lpStore.put(lp);
            }

            // 7. Cashbook (Kas Besar)
            if (data.cashbook && Array.isArray(data.cashbook)) {
                const txCash = db.transaction('cashbook', 'readwrite');
                const cbStore = txCash.objectStore('cashbook');
                cbStore.clear();
                for (const cb of data.cashbook) cbStore.put(cb);
            }

            // 8. Petty Cash (Kas Kecil)
            if (data.pettyCash && Array.isArray(data.pettyCash)) {
                const txPetty = db.transaction('petty_cash', 'readwrite');
                const pcStore = txPetty.objectStore('petty_cash');
                pcStore.clear();
                for (const pc of data.pettyCash) pcStore.put(pc);
            }

            // 9. Inventory (Inventaris Kantor & Aset Tetap)
            if (data.inventory && Array.isArray(data.inventory)) {
                const txInv = db.transaction('inventory', 'readwrite');
                const invStore = txInv.objectStore('inventory');
                invStore.clear();
                for (const item of data.inventory) invStore.put(item);
            }

            return true;
        } catch (err) {
            console.error('Import error:', err);
            throw err;
        }
    }
};

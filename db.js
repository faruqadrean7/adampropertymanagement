// db.js - Layer Database IndexedDB & Image Helper untuk Adam Property
const DB_NAME = 'AdamKavlingDB';
const DB_VERSION = 1;

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

            // Store Customer
            if (!db.objectStoreNames.contains('customers')) {
                const customerStore = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
                customerStore.createIndex('nama', 'nama', { unique: false });
                customerStore.createIndex('kavling', 'kavling', { unique: false });
            }

            // Store Riwayat Pembayaran / Uang Masuk
            if (!db.objectStoreNames.contains('payments')) {
                const paymentStore = db.createObjectStore('payments', { keyPath: 'id', autoIncrement: true });
                paymentStore.createIndex('customerId', 'customerId', { unique: false });
                paymentStore.createIndex('tanggal', 'tanggal', { unique: false });
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

// Helper Operasi CRUD Customer
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
        // Hapus juga pembayaran terkait
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

// Helper Operasi CRUD Riwayat Pembayaran / Uang Masuk
const PaymentDB = {
    async getByCustomerId(customerId) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('payments', 'readonly');
            const store = tx.objectStore('payments');
            const index = store.index('customerId');
            const request = index.getAll(Number(customerId));
            request.onsuccess = () => {
                // Urutkan berdasarkan tanggal descending (terbaru diatas)
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

// Helper Kompresi Gambar (Agar database cepat & hemat memori tanpa pecah)
function compressImage(file, maxWidth = 1400, quality = 0.8) {
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

                // Kembalikan base64 image jpeg
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// Backup & Restore Database
const BackupManager = {
    async exportBackup() {
        const customers = await CustomerDB.getAll();
        const payments = await PaymentDB.getAll();
        const data = {
            version: DB_VERSION,
            exportDate: new Date().toISOString(),
            customers,
            payments
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `Backup_Adam_Kavling_${new Date().toISOString().slice(0, 10)}.json`;
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

            // Clear current data and insert imported
            const tx1 = db.transaction('customers', 'readwrite');
            const cStore = tx1.objectStore('customers');
            cStore.clear();
            for (const c of data.customers) {
                cStore.put(c);
            }

            const tx2 = db.transaction('payments', 'readwrite');
            const pStore = tx2.objectStore('payments');
            pStore.clear();
            if (data.payments && Array.isArray(data.payments)) {
                for (const p of data.payments) {
                    pStore.put(p);
                }
            }

            return true;
        } catch (err) {
            console.error('Import error:', err);
            throw err;
        }
    }
};

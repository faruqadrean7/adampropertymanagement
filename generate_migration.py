import zipfile, xml.etree.ElementTree as ET, json

def get_rows(path):
    with zipfile.ZipFile(path, 'r') as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for elem in tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
                strings.append(elem.text or '')
        sheet = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        rows = []
        for row in sheet.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            row_data = []
            for c in row.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                t = c.get('t')
                v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                val = v.text if v is not None else ''
                if t == 's' and val.isdigit():
                    val = strings[int(val)]
                row_data.append(val)
            rows.append(row_data)
        return rows

tanah_rows = get_rows('Data_Tanah_20261101_065036.xlsx')
inv_rows = get_rows('Data_Inventaris_20261101_065027.xlsx')
kb_rows = get_rows('Data_Kas_Besar_20261101_065003.xlsx')
kk_rows = get_rows('Data_Kas_Kecil_20261101_065020.xlsx')

# 1. Projects
project_id = 'proj-bm1'
projects = [
    {
        'id': project_id,
        'nama': 'Baitul Makmur',
        'lokasi': 'Jl. Punden Gg 3 RT 42 RW 03, Jatikerto, Kec. Kromengan, Kab. Malang, Jawa Timur',
        'deskripsi': 'Cluster Baitul Makmur (BM1). Luas Total 5.620 m², SHM, Siap Jual.',
        'createdAt': '2026-09-01'
    }
]

# 2. Kavlings
# Kosongkan kavling (0 unit) sesuai instruksi user: "jangan generate kavling dulu itu nanti saya kasih sendiri"
kavlings = []

# 3. Customers
customers = [
    {
        'id': 'cust-nita',
        'nama': 'Ibu Nita Siswati',
        'nik': '3507125809850001',
        'telepon': '081234567890',
        'alamat': 'Kec. Kromengan, Kab. Malang, Jawa Timur',
        'kavlingId': None,
        'kavlingKode': '-',
        'projectId': project_id,
        'totalHarga': 0,
        'totalMasuk': 73000000,
        'sisaPiutang': 0,
        'statusBayar': 'belum_lunas',
        'tanggalBeli': '2026-09-05'
    },
    {
        'id': 'cust-reniati',
        'nama': 'Ibu Reniati (Kel. Bpk. Bari)',
        'nik': '3507126104880003',
        'telepon': '085732109876',
        'alamat': 'Jatikerto RT 42 RW 03, Kromengan, Malang',
        'kavlingId': None,
        'kavlingKode': '-',
        'projectId': project_id,
        'totalHarga': 0,
        'totalMasuk': 40500000,
        'sisaPiutang': 0,
        'statusBayar': 'belum_lunas',
        'tanggalBeli': '2026-09-05'
    },
    {
        'id': 'cust-ngateman',
        'nama': 'Bapak Ngateman',
        'nik': '3507121503750002',
        'telepon': '082198765432',
        'alamat': 'Kromengan, Malang, Jawa Timur',
        'kavlingId': None,
        'kavlingKode': '-',
        'projectId': project_id,
        'totalHarga': 0,
        'totalMasuk': 35000000,
        'sisaPiutang': 0,
        'statusBayar': 'belum_lunas',
        'tanggalBeli': '2026-10-24'
    }
]

# 4. Payments
payments = [
    {
        'id': 'pay-1',
        'customerId': 'cust-reniati',
        'customerNama': 'Ibu Reniati (Kel. Bpk. Bari)',
        'kavlingKode': '-',
        'tanggal': '2026-09-05',
        'nominal': 5000000,
        'metodeBayar': 'transfer',
        'tujuan': 'ITJ / Tanda Jadi (Disetor via Bpk. Bari)',
        'keterangan': 'ITJ - ITJ Pak Bari'
    },
    {
        'id': 'pay-2',
        'customerId': 'cust-nita',
        'customerNama': 'Ibu Nita Siswati',
        'kavlingKode': '-',
        'tanggal': '2026-09-05',
        'nominal': 5000000,
        'metodeBayar': 'transfer',
        'tujuan': 'ITJ / Tanda Jadi Unit Kavling',
        'keterangan': 'ITJ - ITJ Nita Siswati'
    },
    {
        'id': 'pay-3',
        'customerId': 'cust-nita',
        'customerNama': 'Ibu Nita Siswati',
        'kavlingKode': '-',
        'tanggal': '2026-10-03',
        'nominal': 60000000,
        'metodeBayar': 'transfer',
        'tujuan': 'Uang Muka / DP Kavling (AJB Notaris)',
        'keterangan': 'DP NITA SISWATI'
    },
    {
        'id': 'pay-4',
        'customerId': 'cust-reniati',
        'customerNama': 'Ibu Reniati (Kel. Bpk. Bari)',
        'kavlingKode': '-',
        'tanggal': '2026-10-07',
        'nominal': 35500000,
        'metodeBayar': 'transfer',
        'tujuan': 'Uang Muka / DP Kavling',
        'keterangan': 'DP KAVLING (RENIATI)'
    },
    {
        'id': 'pay-5',
        'customerId': 'cust-ngateman',
        'customerNama': 'Bapak Ngateman',
        'kavlingKode': '-',
        'tanggal': '2026-10-24',
        'nominal': 35000000,
        'metodeBayar': 'transfer',
        'tujuan': 'Uang Muka / DP Kavling',
        'keterangan': 'DP PAK NGATEMAN'
    },
    {
        'id': 'pay-6',
        'customerId': 'cust-nita',
        'customerNama': 'Ibu Nita Siswati',
        'kavlingKode': '-',
        'tanggal': '2026-10-27',
        'nominal': 8000000,
        'metodeBayar': 'transfer',
        'tujuan': 'Angsuran Cicilan Kavling',
        'keterangan': 'Angsuran Nita Siswati'
    }
]

# 5. Land Debt (Hutang Lahan Petani)
land_debts = [
    {
        'id': 'land-1',
        'projectId': project_id,
        'projectNama': 'Baitul Makmur',
        'namaPetani': 'Pemilik Lahan Asal Jatikerto',
        'telepon': '-',
        'luasTanah': '5.620 m²',
        'alasHak': 'SHM Cluster BM1',
        'hargaKesepakatan': 2800000000,
        'dpDibayar': 100000000,
        'totalCicilan': 222857600,
        'sisaHutang': 2477142400,
        'status': 'belum_lunas',
        'alamatLahan': 'Jl. Punden Gg 3 RT 42 RW 03, Jatikerto, Kromengan, Malang',
        'keterangan': 'Pembelian Lahan Induk Cluster Baitul Makmur'
    }
]

land_payments = [
    {'id': 'lp-1', 'landDebtId': 'land-1', 'tanggal': '2026-08-15', 'nominal': 15000000, 'keterangan': 'Kasbon Pemilik Lahan', 'metode': 'Transfer'},
    {'id': 'lp-2', 'landDebtId': 'land-1', 'tanggal': '2026-08-21', 'nominal': 25000000, 'keterangan': 'Kasbon Pemilik Lahan', 'metode': 'Transfer'},
    {'id': 'lp-3', 'landDebtId': 'land-1', 'tanggal': '2026-08-26', 'nominal': 10000000, 'keterangan': 'Kasbon Pemilik Lahan', 'metode': 'Transfer'},
    {'id': 'lp-4', 'landDebtId': 'land-1', 'tanggal': '2026-09-01', 'nominal': 100000000, 'keterangan': 'DP Pemilik Lahan (Kasbon)', 'metode': 'Transfer'},
    {'id': 'lp-5', 'landDebtId': 'land-1', 'tanggal': '2026-10-03', 'nominal': 47857600, 'keterangan': 'Bayar Pelepasan Sewa Lahan', 'metode': 'Transfer'},
    {'id': 'lp-6', 'landDebtId': 'land-1', 'tanggal': '2026-10-03', 'nominal': 50000000, 'keterangan': 'Pelepasan Sewa Lahan', 'metode': 'Transfer'},
    {'id': 'lp-7', 'landDebtId': 'land-1', 'tanggal': '2026-10-03', 'nominal': 40000000, 'keterangan': 'Pembayaran Sewa Lahan', 'metode': 'Transfer'},
    {'id': 'lp-8', 'landDebtId': 'land-1', 'tanggal': '2026-10-04', 'nominal': 10000000, 'keterangan': 'Pembayaran Sewa Lahan', 'metode': 'Transfer'},
    {'id': 'lp-9', 'landDebtId': 'land-1', 'tanggal': '2026-10-24', 'nominal': 25000000, 'keterangan': 'Pembayaran Tanah', 'metode': 'Transfer'}
]

# 6. Cashbook (46 rows)
# Category must be one of: 'jual_kavling' | 'jual_kavling_barter' | 'investor' | 'lahan_petani' | 'operasional' | 'lainnya'
cashbook = []
for idx, r in enumerate(kb_rows[1:], 1):
    tgl, kat, desc, ref, rek, nom, auto, by = r[:8]
    nom_val = float(nom) if nom else 0.0
    tipe = 'masuk' if kat.lower() == 'pemasukan' else 'keluar'
    
    clean_kat = 'operasional'
    desc_l = desc.lower()
    if 'investor' in desc_l:
        clean_kat = 'investor'
    elif 'dp' in desc_l or 'itj' in desc_l or 'angsuran' in desc_l:
        clean_kat = 'jual_kavling'
    elif 'lahan' in desc_l or 'tanah' in desc_l:
        clean_kat = 'lahan_petani'
    else:
        clean_kat = 'operasional'

    clean_desc = desc.replace('\u2013', '-').replace('\u2014', '-').replace('\ufffd', '-').strip()

    cashbook.append({
        'id': f'cash-{idx}',
        'tanggal': tgl,
        'tipe': tipe,
        'kategori': clean_kat,
        'sumber': 'Kas Besar',
        'keterangan': clean_desc,
        'nominal': nom_val,
        'metode': 'Transfer Bank',
        'projectId': project_id
    })

# 7. Petty Cash (79 rows)
# Category must be: 'topup_kas_besar' | 'investor' | 'atk' | 'konsumsi' | 'bensin' | 'kebersihan' | 'utilitas' | 'gaji_karyawan' | 'lainnya'
petty_cash = []
for idx, r in enumerate(kk_rows[1:], 1):
    tgl, kat, desc, ref, rek, nom, auto, by = r[:8]
    nom_val = float(nom) if nom else 0.0
    tipe = 'masuk' if kat.lower() == 'pemasukan' else 'keluar'
    clean_desc = desc.replace('\u2013', '-').replace('\u2014', '-').replace('\ufffd', '-').strip()
    desc_l = clean_desc.lower()
    
    kategori = 'lainnya'
    if 'kas besar' in desc_l or 'top up' in desc_l or 'topup' in desc_l:
        kategori = 'topup_kas_besar'
    elif 'investor' in desc_l:
        kategori = 'investor'
    elif 'konsumsi' in desc_l or 'makan' in desc_l or 'kopi' in desc_l or 'mie' in desc_l or 'kue' in desc_l or 'tumpeng' in desc_l:
        kategori = 'konsumsi'
    elif 'gaji' in desc_l or 'kasbon' in desc_l:
        kategori = 'gaji_karyawan'
    elif 'listrik' in desc_l or 'wifi' in desc_l:
        kategori = 'utilitas'
    elif 'hvs' in desc_l or 'stapler' in desc_l or 'map' in desc_l or 'stempel' in desc_l or 'amplop' in desc_l or 'clip' in desc_l:
        kategori = 'atk'
    elif 'oli' in desc_l or 'ban' in desc_l or 'bensin' in desc_l:
        kategori = 'bensin'
    elif 'sampah' in desc_l or 'tong' in desc_l:
        kategori = 'kebersihan'
    else:
        kategori = 'lainnya'

    petty_cash.append({
        'id': f'petty-{idx}',
        'tanggal': tgl,
        'tipe': tipe,
        'kategori': kategori,
        'sumberDana': 'kas_besar',
        'penerima': 'Operasional Kantor / Lapangan',
        'keterangan': clean_desc,
        'nominal': nom_val,
        'metode': 'Tunai'
    })

# 8. Inventory (10 items)
# Kategori: 'elektronik' | 'survey' | 'kendaraan' | 'keamanan' | 'furniture' | 'lainnya'
inventory = []
for idx, r in enumerate(inv_rows[1:], 1):
    r = r + [''] * (13 - len(r))
    _id, kode, nama, kat, jml, sat, kond, lok, tgl, hrg, sumber, habis, ket = r[:13]
    try:
        hrg_val = float(hrg)
    except:
        hrg_val = 0.0
    try:
        jml_val = int(float(jml))
    except:
        jml_val = 1

    clean_kat = 'elektronik' if 'elektronik' in kat.lower() else ('furniture' if 'furniture' in kat.lower() else ('kendaraan' if 'kendaraan' in kat.lower() else 'lainnya'))
    inventory.append({
        'id': f'inv-{idx}',
        'kode': kode,
        'nama': nama,
        'kategori': clean_kat,
        'kondisi': 'baik',
        'lokasi': lok,
        'penanggungJawab': 'Staff Operasional',
        'tanggal': tgl,
        'sumberDana': sumber or 'Kas Kantor',
        'nilaiPerolehan': hrg_val,
        'jumlah': jml_val,
        'satuan': sat,
        'keterangan': f'Sumber: {sumber}'
    })

# Output mockData.ts
mockdata_content = f"""import {{ 
  Project, 
  Kavling, 
  Customer, 
  Payment, 
  LandDebt, 
  LandPayment, 
  CashbookItem, 
  PettyCashItem, 
  InventoryItem, 
  Employee, 
  SalaryPayment 
}} from '@/types';

// ==============================================================================
// REAL OPERATIONAL DATA IMPORTED FROM EXCEL
// PT ADAM PROPERTY INDONESIA - CLUSTER BAITUL MAKMUR
// ==============================================================================

export const INITIAL_PROJECTS: Project[] = {json.dumps(projects, indent=2)};

export const INITIAL_KAVLINGS: Kavling[] = {json.dumps(kavlings, indent=2)};

export const INITIAL_CUSTOMERS: Customer[] = {json.dumps(customers, indent=2)};

export const INITIAL_PAYMENTS: Payment[] = {json.dumps(payments, indent=2)};

export const INITIAL_LAND_DEBTS: LandDebt[] = {json.dumps(land_debts, indent=2)};

export const INITIAL_LAND_PAYMENTS: LandPayment[] = {json.dumps(land_payments, indent=2)};

export const INITIAL_CASHBOOK: CashbookItem[] = {json.dumps(cashbook, indent=2)};

export const INITIAL_PETTY_CASH: PettyCashItem[] = {json.dumps(petty_cash, indent=2)};

export const INITIAL_INVENTORY: InventoryItem[] = {json.dumps(inventory, indent=2)};

export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_SALARY_PAYMENTS: SalaryPayment[] = [];
"""

with open('adam-property-next/src/lib/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(mockdata_content)

print('SUCCESS generating adam-property-next/src/lib/mockData.ts')

# Generate SQL seed file for Supabase SQL Editor
sql_lines = [
    "-- ==============================================================================",
    "-- SEED REAL OPERATIONAL DATA - CLUSTER BAITUL MAKMUR",
    "-- ==============================================================================",
    "",
    "-- 0. SCHEMA COMPATIBILITY CHECK",
    "ALTER TABLE public.petty_cash ADD COLUMN IF NOT EXISTS penerima TEXT;",
    "ALTER TABLE public.petty_cash ADD COLUMN IF NOT EXISTS sumber_dana TEXT;",
    "ALTER TABLE public.petty_cash ADD COLUMN IF NOT EXISTS sumber_tujuan TEXT;",
    "ALTER TABLE public.petty_cash ADD COLUMN IF NOT EXISTS metode TEXT DEFAULT 'Kas Tunai';",
    "ALTER TABLE public.petty_cash ADD COLUMN IF NOT EXISTS saldo_akhir NUMERIC DEFAULT 0;",
    "",
    "ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS kode_barang TEXT;",
    "ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS penanggung_jawab TEXT;",
    "ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS sumber_perolehan TEXT;",
    "ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS tanggal_beli DATE DEFAULT CURRENT_DATE;",
    "ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS tanggal_perolehan DATE;",
    "ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS keterangan TEXT;",
    "",
    "-- 1. PROJECTS",
    f"INSERT INTO public.projects (id, nama, lokasi, deskripsi, created_at)",
    f"VALUES ('{project_id}', 'Baitul Makmur', 'Jl. Punden Gg 3 RT 42 RW 03, Jatikerto, Kec. Kromengan, Kab. Malang, Jawa Timur', 'Cluster Baitul Makmur (BM1). Luas Total 5.620 m², SHM, Siap Jual.', '2026-09-01')",
    "ON CONFLICT (id) DO UPDATE SET nama = EXCLUDED.nama, lokasi = EXCLUDED.lokasi;",
    "",
    "-- 2. KAVLINGS",
]

for k in kavlings:
    c_id = f"'{k['customerId']}'" if k['customerId'] else 'NULL'
    c_nama = f"'{k['customerNama']}'" if k['customerNama'] else 'NULL'
    sql_lines.append(
        f"INSERT INTO public.kavlings (id, project_id, blok, nomor, luas, dimensi, harga, tipe, status, customer_id, customer_nama, keterangan) "
        f"VALUES ('{k['id']}', '{k['projectId']}', '{k['blok']}', '{k['nomor']}', {k['luas']}, '{k['dimensi']}', {k['harga']}, '{k['tipe']}', '{k['status']}', {c_id}, {c_nama}, '{k['keterangan']}') "
        f"ON CONFLICT (id) DO NOTHING;"
    )

sql_lines.append("\n-- 3. CUSTOMERS")
for c in customers:
    k_id_val = f"'{c['kavlingId']}'" if c['kavlingId'] else 'NULL'
    sql_lines.append(
        f"INSERT INTO public.customers (id, nama, nik, telepon, alamat, kavling_id, kavling_kode, project_id, total_harga, total_masuk, sisa_piutang, status_bayar, tanggal_beli) "
        f"VALUES ('{c['id']}', '{c['nama']}', '{c['nik']}', '{c['telepon']}', '{c['alamat']}', {k_id_val}, '{c['kavlingKode']}', '{c['projectId']}', {c['totalHarga']}, {c['totalMasuk']}, {c['sisaPiutang']}, '{c['statusBayar']}', '{c['tanggalBeli']}') "
        f"ON CONFLICT (id) DO NOTHING;"
    )

sql_lines.append("\n-- 4. PAYMENTS")
for p in payments:
    sql_lines.append(
        f"INSERT INTO public.payments (id, customer_id, customer_nama, kavling_kode, tanggal, nominal, metode_bayar, tujuan, keterangan) "
        f"VALUES ('{p['id']}', '{p['customerId']}', '{p['customerNama']}', '{p['kavlingKode']}', '{p['tanggal']}', {p['nominal']}, '{p['metodeBayar']}', '{p['tujuan']}', '{p['keterangan']}') "
        f"ON CONFLICT (id) DO NOTHING;"
    )

sql_lines.append("\n-- 5. LAND DEBTS")
for l in land_debts:
    sql_lines.append(
        f"INSERT INTO public.land_debts (id, project_id, project_nama, nama_petani, telepon, luas_tanah, alas_hak, harga_kesepakatan, dp_dibayar, total_cicilan, sisa_hutang, status, alamat_lahan, keterangan) "
        f"VALUES ('{l['id']}', '{l['projectId']}', '{l['projectNama']}', '{l['namaPetani']}', '{l['telepon']}', '{l['luasTanah']}', '{l['alasHak']}', {l['hargaKesepakatan']}, {l['dpDibayar']}, {l['totalCicilan']}, {l['sisaHutang']}, '{l['status']}', '{l['alamatLahan']}', '{l['keterangan']}') "
        f"ON CONFLICT (id) DO NOTHING;"
    )

sql_lines.append("\n-- 6. CASHBOOK (46 ROWS)")
for c in cashbook:
    ket_clean = c['keterangan'].replace("'", "''")
    sql_lines.append(
        f"INSERT INTO public.cashbook (id, tanggal, tipe, kategori, sumber, keterangan, nominal, metode, project_id) "
        f"VALUES ('{c['id']}', '{c['tanggal']}', '{c['tipe']}', '{c['kategori']}', '{c['sumber']}', '{ket_clean}', {c['nominal']}, '{c['metode']}', '{c['projectId']}') "
        f"ON CONFLICT (id) DO NOTHING;"
    )

sql_lines.append("\n-- 7. PETTY CASH (79 ROWS)")
for p in petty_cash:
    ket_clean = p['keterangan'].replace("'", "''")
    pen_clean = p['penerima'].replace("'", "''")
    sumber_dana = p.get('sumberDana') or 'kas_besar'
    sql_lines.append(
        f"INSERT INTO public.petty_cash (id, tanggal, tipe, kategori, keterangan, nominal, penerima, sumber_tujuan, sumber_dana, metode, saldo_akhir) "
        f"VALUES ('{p['id']}', '{p['tanggal']}', '{p['tipe']}', '{p['kategori']}', '{ket_clean}', {p['nominal']}, '{pen_clean}', '{pen_clean}', '{sumber_dana}', 'Kas Tunai', 0) "
        f"ON CONFLICT (id) DO NOTHING;"
    )

sql_lines.append("\n-- 8. INVENTORY (10 ITEMS)")
for inv in inventory:
    ket_clean = inv['keterangan'].replace("'", "''")
    sql_lines.append(
        f"INSERT INTO public.inventory (id, nama_barang, kategori, jumlah, satuan, kondisi, lokasi, tanggal_beli, tanggal_perolehan, nilai_perolehan, kode_barang, sumber_perolehan, penanggung_jawab, keterangan) "
        f"VALUES ('{inv['id']}', '{inv['nama']}', '{inv['kategori']}', {inv['jumlah']}, '{inv['satuan']}', '{inv['kondisi']}', '{inv['lokasi']}', '{inv['tanggal']}', '{inv['tanggal']}', {inv['nilaiPerolehan']}, '{inv['kode']}', '{inv['sumberDana']}', '{inv['penanggungJawab']}', '{ket_clean}') "
        f"ON CONFLICT (id) DO NOTHING;"
    )

with open('adam-property-next/supabase/seed_real_data.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print('SUCCESS generating adam-property-next/supabase/seed_real_data.sql')

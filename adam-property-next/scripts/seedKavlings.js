const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hnkwnklmxgxvihpaogpz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhua3dua2xteGd4dmlocGFvZ3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MDUyMzUsImV4cCI6MjEwOTA4MTIzNX0.ZF3tBua-KpyzV6r_qci6uMg9MOi1Utg_JfXqn5Hsjgs';

const supabase = createClient(supabaseUrl, supabaseKey);

const projectId = 'proj-bm1';

const kavlingsData = [
  // ==========================================
  // BLOK A (13 Unit)
  // ==========================================
  {
    id: 'kav-bm1-a1',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A1',
    luas: 75,
    dimensi: '6 x 12.5 meter',
    harga: 120000000,
    tipe: 'Hunian Standar',
    status: 'booking',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Booking (Tanda Silang Site Plan)'
  },
  {
    id: 'kav-bm1-a2',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A2',
    luas: 72,
    dimensi: '6 x 12 meter',
    harga: 115200000,
    tipe: 'Hunian Standar',
    status: 'terjual',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Sold Out / Terjual'
  },
  {
    id: 'kav-bm1-a3',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A3',
    luas: 78,
    dimensi: '6 x 13 meter',
    harga: 124800000,
    tipe: 'Hunian Standar',
    status: 'booking',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Booking (Tanda Silang Site Plan)'
  },
  {
    id: 'kav-bm1-a4',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A4',
    luas: 78,
    dimensi: '6 x 13 meter',
    harga: 124800000,
    tipe: 'Hunian Standar',
    status: 'terjual',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Sold Out / Terjual'
  },
  {
    id: 'kav-bm1-a5',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A5',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 134400000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-a6',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A6',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 134400000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-a7',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A7',
    luas: 87,
    dimensi: '6 x 14.5 meter',
    harga: 139220000,
    tipe: 'Hunian Standar',
    status: 'booking',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Booking (Tanda Silang Site Plan)'
  },
  {
    id: 'kav-bm1-a8',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A8',
    luas: 87,
    dimensi: '6 x 14.5 meter',
    harga: 139200000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-a9',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A9',
    luas: 91.80,
    dimensi: '6 x 12 meter (Hook)',
    harga: 146880000,
    tipe: 'Hunian Hook',
    status: 'terjual',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Sold Out / Terjual (Kavling Hook)'
  },
  {
    id: 'kav-bm1-a10',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A10',
    luas: 72,
    dimensi: '6 x 12 meter',
    harga: 115200000,
    tipe: 'Hunian Standar',
    status: 'booking',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Booking (Tanda Silang Site Plan)'
  },
  {
    id: 'kav-bm1-a11',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A11',
    luas: 72,
    dimensi: '6 x 12 meter',
    harga: 115200000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-a12',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A12',
    luas: 72,
    dimensi: '6 x 12 meter',
    harga: 115200000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-a13',
    project_id: projectId,
    blok: 'Blok A',
    nomor: 'A13',
    luas: 81.60,
    dimensi: '6 x 12 meter (Hook)',
    harga: 130560000,
    tipe: 'Hunian Hook',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual (Kavling Hook)'
  },

  // ==========================================
  // BLOK B (14 Unit)
  // ==========================================
  {
    id: 'kav-bm1-b1',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B1',
    luas: 97.50,
    dimensi: '6 x 12 meter (Hook/Trapesium)',
    harga: 151125000,
    tipe: 'Hunian Hook',
    status: 'terjual',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Sold Out / Terjual (Kavling Hook Depan)'
  },
  {
    id: 'kav-bm1-b2',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B2',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 130200000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-b3',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B3',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 130200000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-b4',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B4',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 130200000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-b5',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B5',
    luas: 60.50,
    dimensi: '5.5 x 11 meter',
    harga: 93775000,
    tipe: 'Hunian Standar',
    status: 'booking',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Booking (Tanda Silang Site Plan)'
  },
  {
    id: 'kav-bm1-b6',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B6',
    luas: 55,
    dimensi: '5 x 11 meter',
    harga: 85250000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-b7',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B7',
    luas: 57.50,
    dimensi: '5 x 11.5 meter',
    harga: 89125000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-b8',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B8',
    luas: 80.50,
    dimensi: '7 x 11.5 meter',
    harga: 124775000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-b9',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B9',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 130200000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-b10',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B10',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 130200000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-b11',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B11',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 130200000,
    tipe: 'Hunian Standar',
    status: 'terjual',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Sold Out / Terjual'
  },
  {
    id: 'kav-bm1-b12',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B12',
    luas: 72,
    dimensi: '6 x 12 meter',
    harga: 111600000,
    tipe: 'Hunian Standar',
    status: 'terjual',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Sold Out / Terjual'
  },
  {
    id: 'kav-bm1-b13',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B13',
    luas: 91,
    dimensi: '6 x 14 meter (Hook/Trapesium)',
    harga: 141050000,
    tipe: 'Hunian Hook',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual (Kavling Sudut)'
  },
  {
    id: 'kav-bm1-b14',
    project_id: projectId,
    blok: 'Blok B',
    nomor: 'B14',
    luas: 72,
    dimensi: '6 x 12 meter',
    harga: 111600000,
    tipe: 'Hunian Standar',
    status: 'terjual',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Sold Out / Terjual'
  },

  // ==========================================
  // BLOK C (18 Unit)
  // ==========================================
  {
    id: 'kav-bm1-c1',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C1',
    luas: 100.75,
    dimensi: '9 x 5 meter (Hook)',
    harga: 151125000,
    tipe: 'Hunian Hook',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual (Kavling Hook Depan)'
  },
  {
    id: 'kav-bm1-c2',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C2',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 126000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c3',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C3',
    luas: 84,
    dimensi: '6 x 14 meter',
    harga: 126000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c4',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C4',
    luas: 78,
    dimensi: '6 x 13 meter',
    harga: 117000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c5',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C5',
    luas: 78,
    dimensi: '6 x 13 meter',
    harga: 117000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c6',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C6',
    luas: 75,
    dimensi: '6 x 12.5 meter',
    harga: 112500000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c7',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C7',
    luas: 75,
    dimensi: '6 x 12.5 meter',
    harga: 112500000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c8',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C8',
    luas: 72,
    dimensi: '6 x 12 meter',
    harga: 108000000,
    tipe: 'Hunian Standar',
    status: 'booking',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Booking (Tanda Silang Site Plan)'
  },
  {
    id: 'kav-bm1-c9',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C9',
    luas: 63,
    dimensi: '6 x 10.5 meter',
    harga: 94500000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c10',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C10',
    luas: 55,
    dimensi: '5 x 11 meter',
    harga: 82500000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c11',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C11',
    luas: 66,
    dimensi: '5 x 12 meter',
    harga: 99000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c12',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C12',
    luas: 87,
    dimensi: '6 x 14.5 meter',
    harga: 130500000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c13',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C13',
    luas: 80,
    dimensi: '6 x 13.85 meter',
    harga: 120000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c14',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C14',
    luas: 78,
    dimensi: '6 x 13.1 meter',
    harga: 117000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c15',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C15',
    luas: 78,
    dimensi: '6 x 13 meter',
    harga: 117000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c16',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C16',
    luas: 76,
    dimensi: '6 x 12.75 meter',
    harga: 114000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c17',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C17',
    luas: 74,
    dimensi: '6 x 12.4 meter',
    harga: 111000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  },
  {
    id: 'kav-bm1-c18',
    project_id: projectId,
    blok: 'Blok C',
    nomor: 'C18',
    luas: 72,
    dimensi: '6 x 12 meter',
    harga: 108000000,
    tipe: 'Hunian Standar',
    status: 'terbuka',
    customer_id: null,
    customer_nama: null,
    keterangan: 'Tersedia / Siap Jual'
  }
];

async function seedDatabase() {
  console.log(`Menyimpan ${kavlingsData.length} data kavling ke Supabase...`);

  // Ensure project proj-bm1 exists in projects table
  const { data: existingProj, error: projErr } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single();

  if (!existingProj) {
    console.log('Menambahkan project Baitul Makmur (proj-bm1)...');
    await supabase.from('projects').upsert({
      id: projectId,
      nama: 'Baitul Makmur',
      lokasi: 'Jl. Punden Gg 3 RT 42 RW 03, Jatikerto, Kec. Kromengan, Kab. Malang, Jawa Timur',
      deskripsi: 'Cluster Baitul Makmur (BM1). Luas Total 5.620 m², SHM, Siap Jual.',
      created_at: '2026-09-01'
    });
  }

  // Insert batch
  const { data, error } = await supabase
    .from('kavlings')
    .upsert(kavlingsData, { onConflict: 'id' });

  if (error) {
    console.error('Error saat seeding kavling:', error);
  } else {
    console.log(`BERHASIL! ${kavlingsData.length} data kavling (Blok A, B, C) tersimpan di Supabase.`);
  }

  // Verify
  const { data: countData } = await supabase.from('kavlings').select('id, blok, nomor, status, harga');
  console.log('Total kavling sekarang di database:', countData?.length);
}

seedDatabase();

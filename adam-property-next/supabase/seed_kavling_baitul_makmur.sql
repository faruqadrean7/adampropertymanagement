-- ==============================================================================
-- SEEDER KAVLING CLUSTER BAITUL MAKMUR "JATIKERTO" (BLOK A, B, C)
-- Berdasarkan Brosur Site Plan & Daftar Harga Resmi PT Adam Property Indonesia
-- Total: 45 Unit Kavling (Blok A: 13 Unit, Blok B: 14 Unit, Blok C: 18 Unit)
-- ==============================================================================

-- Pastikan Project Baitul Makmur (proj-bm1) tersedia
INSERT INTO public.projects (id, nama, lokasi, deskripsi, created_at)
VALUES (
  'proj-bm1',
  'Baitul Makmur',
  'Jl. Punden Gg 3 RT 42 RW 03, Jatikerto, Kec. Kromengan, Kab. Malang, Jawa Timur',
  'Cluster Baitul Makmur (BM1). Luas Total 5.620 m², SHM, Siap Jual.',
  '2026-09-01'
)
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  lokasi = EXCLUDED.lokasi,
  deskripsi = EXCLUDED.deskripsi;

-- Insert & Upsert 45 Unit Kavling (Blok A, B, C)
INSERT INTO public.kavlings (id, project_id, blok, nomor, luas, dimensi, harga, tipe, status, customer_id, customer_nama, keterangan)
VALUES
  -- ----------------------------------------------------
  -- BLOK A (13 Unit)
  -- ----------------------------------------------------
  ('kav-bm1-a1',  'proj-bm1', 'Blok A', 'A1',  75.00, '6 x 12.5 meter',          120000000, 'Hunian Standar', 'booking', NULL, NULL, 'Booking (Tanda Silang Site Plan)'),
  ('kav-bm1-a2',  'proj-bm1', 'Blok A', 'A2',  72.00, '6 x 12 meter',            115200000, 'Hunian Standar', 'terjual', NULL, NULL, 'Sold Out / Terjual'),
  ('kav-bm1-a3',  'proj-bm1', 'Blok A', 'A3',  78.00, '6 x 13 meter',            124800000, 'Hunian Standar', 'booking', NULL, NULL, 'Booking (Tanda Silang Site Plan)'),
  ('kav-bm1-a4',  'proj-bm1', 'Blok A', 'A4',  78.00, '6 x 13 meter',            124800000, 'Hunian Standar', 'terjual', NULL, NULL, 'Sold Out / Terjual'),
  ('kav-bm1-a5',  'proj-bm1', 'Blok A', 'A5',  84.00, '6 x 14 meter',            134400000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-a6',  'proj-bm1', 'Blok A', 'A6',  84.00, '6 x 14 meter',            134400000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-a7',  'proj-bm1', 'Blok A', 'A7',  87.00, '6 x 14.5 meter',          139220000, 'Hunian Standar', 'booking', NULL, NULL, 'Booking (Tanda Silang Site Plan)'),
  ('kav-bm1-a8',  'proj-bm1', 'Blok A', 'A8',  87.00, '6 x 14.5 meter',          139200000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-a9',  'proj-bm1', 'Blok A', 'A9',  91.80, '6 x 12 meter (Hook)',     146880000, 'Hunian Hook',    'terjual', NULL, NULL, 'Sold Out / Terjual (Kavling Hook)'),
  ('kav-bm1-a10', 'proj-bm1', 'Blok A', 'A10', 72.00, '6 x 12 meter',            115200000, 'Hunian Standar', 'booking', NULL, NULL, 'Booking (Tanda Silang Site Plan)'),
  ('kav-bm1-a11', 'proj-bm1', 'Blok A', 'A11', 72.00, '6 x 12 meter',            115200000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-a12', 'proj-bm1', 'Blok A', 'A12', 72.00, '6 x 12 meter',            115200000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-a13', 'proj-bm1', 'Blok A', 'A13', 81.60, '6 x 12 meter (Hook)',     130560000, 'Hunian Hook',    'terbuka', NULL, NULL, 'Tersedia / Siap Jual (Kavling Hook)'),

  -- ----------------------------------------------------
  -- BLOK B (14 Unit)
  -- ----------------------------------------------------
  ('kav-bm1-b1',  'proj-bm1', 'Blok B', 'B1',  97.50, '6 x 12 meter (Hook)',     151125000, 'Hunian Hook',    'terjual', NULL, NULL, 'Sold Out / Terjual (Kavling Hook Depan)'),
  ('kav-bm1-b2',  'proj-bm1', 'Blok B', 'B2',  84.00, '6 x 14 meter',            130200000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-b3',  'proj-bm1', 'Blok B', 'B3',  84.00, '6 x 14 meter',            130200000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-b4',  'proj-bm1', 'Blok B', 'B4',  84.00, '6 x 14 meter',            130200000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-b5',  'proj-bm1', 'Blok B', 'B5',  60.50, '5.5 x 11 meter',           93775000, 'Hunian Standar', 'booking', NULL, NULL, 'Booking (Tanda Silang Site Plan)'),
  ('kav-bm1-b6',  'proj-bm1', 'Blok B', 'B6',  55.00, '5 x 11 meter',             85250000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-b7',  'proj-bm1', 'Blok B', 'B7',  57.50, '5 x 11.5 meter',           89125000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-b8',  'proj-bm1', 'Blok B', 'B8',  80.50, '7 x 11.5 meter',          124775000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-b9',  'proj-bm1', 'Blok B', 'B9',  84.00, '6 x 14 meter',            130200000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-b10', 'proj-bm1', 'Blok B', 'B10', 84.00, '6 x 14 meter',            130200000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-b11', 'proj-bm1', 'Blok B', 'B11', 84.00, '6 x 14 meter',            130200000, 'Hunian Standar', 'terjual', NULL, NULL, 'Sold Out / Terjual'),
  ('kav-bm1-b12', 'proj-bm1', 'Blok B', 'B12', 72.00, '6 x 12 meter',            111600000, 'Hunian Standar', 'terjual', NULL, NULL, 'Sold Out / Terjual'),
  ('kav-bm1-b13', 'proj-bm1', 'Blok B', 'B13', 91.00, '6 x 14 meter (Hook)',     141050000, 'Hunian Hook',    'terbuka', NULL, NULL, 'Tersedia / Siap Jual (Kavling Sudut)'),
  ('kav-bm1-b14', 'proj-bm1', 'Blok B', 'B14', 72.00, '6 x 12 meter',            111600000, 'Hunian Standar', 'terjual', NULL, NULL, 'Sold Out / Terjual'),

  -- ----------------------------------------------------
  -- BLOK C (18 Unit)
  -- ----------------------------------------------------
  ('kav-bm1-c1',  'proj-bm1', 'Blok C', 'C1', 100.75, '9 x 5 meter (Hook)',       151125000, 'Hunian Hook',    'terbuka', NULL, NULL, 'Tersedia / Siap Jual (Kavling Hook Depan)'),
  ('kav-bm1-c2',  'proj-bm1', 'Blok C', 'C2',  84.00, '6 x 14 meter',            126000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c3',  'proj-bm1', 'Blok C', 'C3',  84.00, '6 x 14 meter',            126000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c4',  'proj-bm1', 'Blok C', 'C4',  78.00, '6 x 13 meter',            117000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c5',  'proj-bm1', 'Blok C', 'C5',  78.00, '6 x 13 meter',            117000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c6',  'proj-bm1', 'Blok C', 'C6',  75.00, '6 x 12.5 meter',          112500000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c7',  'proj-bm1', 'Blok C', 'C7',  75.00, '6 x 12.5 meter',          112500000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c8',  'proj-bm1', 'Blok C', 'C8',  72.00, '6 x 12 meter',            108000000, 'Hunian Standar', 'booking', NULL, NULL, 'Booking (Tanda Silang Site Plan)'),
  ('kav-bm1-c9',  'proj-bm1', 'Blok C', 'C9',  63.00, '6 x 10.5 meter',           94500000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c10', 'proj-bm1', 'Blok C', 'C10', 55.00, '5 x 11 meter',             82500000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c11', 'proj-bm1', 'Blok C', 'C11', 66.00, '5 x 12 meter',             99000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c12', 'proj-bm1', 'Blok C', 'C12', 87.00, '6 x 14.5 meter',          130500000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c13', 'proj-bm1', 'Blok C', 'C13', 80.00, '6 x 13.85 meter',         120000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c14', 'proj-bm1', 'Blok C', 'C14', 78.00, '6 x 13.1 meter',          117000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c15', 'proj-bm1', 'Blok C', 'C15', 78.00, '6 x 13 meter',            117000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c16', 'proj-bm1', 'Blok C', 'C16', 76.00, '6 x 12.75 meter',         114000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c17', 'proj-bm1', 'Blok C', 'C17', 74.00, '6 x 12.4 meter',          111000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual'),
  ('kav-bm1-c18', 'proj-bm1', 'Blok C', 'C18', 72.00, '6 x 12 meter',            108000000, 'Hunian Standar', 'terbuka', NULL, NULL, 'Tersedia / Siap Jual')

ON CONFLICT (id) DO UPDATE SET
  project_id = EXCLUDED.project_id,
  blok = EXCLUDED.blok,
  nomor = EXCLUDED.nomor,
  luas = EXCLUDED.luas,
  dimensi = EXCLUDED.dimensi,
  harga = EXCLUDED.harga,
  tipe = EXCLUDED.tipe,
  status = EXCLUDED.status,
  keterangan = EXCLUDED.keterangan;

import { supabase } from './supabaseClient';
import { 
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
  SalaryPayment,
  AuthUser,
  UserRole
} from '@/types';

/**
 * Checks if Supabase credentials in environment variables are actively configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url && 
    !url.includes('your-project') && 
    !url.includes('xxxxxxxxxx') && 
    key && 
    !key.includes('your-anon-key')
  );
}

// ==============================================================================
// AUTH SERVICES
// ==============================================================================

export async function supabaseSignIn(email: string, password: string): Promise<{ user: AuthUser | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { user: null, error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { user: null, error: error?.message || 'Login gagal' };
    }

    // Fetch user profile to read the role
    const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profError || !profile) {
      // Fallback role from metadata if profile table row not found
      const userMetaRole = (data.user.user_metadata?.role as UserRole) || 'management';
      return {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          nama: data.user.user_metadata?.nama || email.split('@')[0],
          jabatan: data.user.user_metadata?.jabatan || 'Staff',
          role: userMetaRole
        }
      };
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        nama: profile.nama,
        jabatan: profile.jabatan,
        role: profile.role as UserRole
      }
    };
  } catch (err: any) {
    return { user: null, error: err.message || 'Koneksi ke Supabase bermasalah' };
  }
}

export async function supabaseSignOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut warning:', e);
    }
  }
}

// ==============================================================================
// STORAGE UPLOAD (DOCUMENTS & RECEIPTS)
// ==============================================================================

export async function supabaseUploadFile(
  bucketName: string,
  filePath: string,
  file: File | Blob
): Promise<{ url: string | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: true });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { url: null, error: err.message };
  }
}

// ==============================================================================
// DATA FETCHING & SYNCHRONIZATION HELPERS
// ==============================================================================

export async function supabaseFetchProjects(): Promise<Project[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
  if (error || !data) return null;
  return data.map(p => ({
    id: p.id,
    nama: p.nama,
    lokasi: p.lokasi,
    deskripsi: p.deskripsi,
    createdAt: p.created_at
  }));
}

export async function supabaseFetchKavlings(): Promise<Kavling[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('kavlings').select('*');
  if (error || !data) return null;
  return data.map(k => ({
    id: k.id,
    projectId: k.project_id,
    blok: k.blok,
    nomor: k.nomor,
    luas: Number(k.luas),
    dimensi: k.dimensi,
    harga: Number(k.harga),
    tipe: k.tipe,
    status: k.status,
    customerId: k.customer_id,
    customerNama: k.customer_nama,
    keterangan: k.keterangan
  }));
}

export async function supabaseFetchCustomers(): Promise<Customer[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error || !data) return null;
  return data.map(c => ({
    id: c.id,
    nama: c.nama,
    nik: c.nik,
    noKk: c.no_kk,
    telepon: c.telepon,
    tempatTanggalLahir: c.tempat_tanggal_lahir,
    pekerjaan: c.pekerjaan,
    alamat: c.alamat,
    kavlingId: c.kavling_id,
    kavlingKode: c.kavling_kode,
    projectId: c.project_id,
    totalHarga: Number(c.total_harga),
    totalMasuk: Number(c.total_masuk),
    sisaPiutang: Number(c.sisa_piutang),
    statusBayar: c.status_bayar,
    tanggalBeli: c.tanggal_beli,
    ktpImage: c.ktp_image,
    kkImage: c.kk_image,
    ajbImage: c.ajb_image,
    shmSplitImage: c.shm_split_image,
    noAjb: c.no_ajb,
    noShmSplit: c.no_shm_split,
    tanggalAjb: c.tanggal_ajb,
    tanggalShmSplit: c.tanggal_shm_split,
    notarisPpat: c.notaris_ppat
  }));
}

export async function supabaseFetchLandDebts(): Promise<LandDebt[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('land_debts').select('*').order('created_at', { ascending: false });
  if (error || !data) return null;
  return data.map(l => ({
    id: l.id,
    projectId: l.project_id,
    projectNama: l.project_nama,
    namaPetani: l.nama_petani,
    telepon: l.telepon,
    luasTanah: l.luas_tanah,
    alasHak: l.alas_hak,
    hargaKesepakatan: Number(l.harga_kesepakatan),
    dpDibayar: Number(l.dp_dibayar),
    totalCicilan: Number(l.total_cicilan),
    sisaHutang: Number(l.sisa_hutang),
    status: l.status,
    alamatLahan: l.alamat_lahan,
    keterangan: l.keterangan,
    sertifikatImage: l.sertifikat_image,
    perjanjianImage: l.perjanjian_image
  }));
}

export async function supabaseFetchCashbook(): Promise<CashbookItem[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('cashbook').select('*').order('tanggal', { ascending: true });
  if (error || !data) return null;
  return data.map(c => ({
    id: c.id,
    tanggal: c.tanggal,
    tipe: c.tipe,
    kategori: c.kategori,
    sumber: c.sumber,
    keterangan: c.keterangan,
    nominal: Number(c.nominal),
    metode: c.metode,
    projectId: c.project_id,
    refType: c.ref_type,
    refId: c.ref_id
  }));
}

// ==============================================================================
// UPDATE & DELETE HELPERS
// ==============================================================================

export async function supabaseInsertKavling(kav: Kavling): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('kavlings').upsert({
      id: kav.id,
      project_id: kav.projectId,
      blok: kav.blok,
      nomor: kav.nomor,
      luas: kav.luas,
      dimensi: kav.dimensi,
      harga: kav.harga,
      tipe: kav.tipe,
      status: kav.status,
      customer_id: kav.customerId || null,
      customer_nama: kav.customerNama || null,
      keterangan: kav.keterangan || null
    }, { onConflict: 'id' });
    if (error) console.warn('Supabase upsert kavling error:', error);
    return !error;
  } catch (e) {
    console.warn('Error inserting kavling:', e);
    return false;
  }
}

export async function supabaseInsertBatchKavlings(kavs: Kavling[]): Promise<boolean> {
  if (!isSupabaseConfigured() || kavs.length === 0) return false;
  try {
    const payload = kavs.map(kav => ({
      id: kav.id,
      project_id: kav.projectId,
      blok: kav.blok,
      nomor: kav.nomor,
      luas: kav.luas,
      dimensi: kav.dimensi,
      harga: kav.harga,
      tipe: kav.tipe,
      status: kav.status,
      customer_id: kav.customerId || null,
      customer_nama: kav.customerNama || null,
      keterangan: kav.keterangan || null
    }));
    const { error } = await supabase.from('kavlings').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('Supabase upsert batch kavlings error:', error);
    return !error;
  } catch (e) {
    console.warn('Error inserting batch kavlings:', e);
    return false;
  }
}

export async function supabaseUpdateKavling(id: string, updates: Partial<Kavling>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload: any = {};
    if (updates.projectId !== undefined) payload.project_id = updates.projectId;
    if (updates.blok !== undefined) payload.blok = updates.blok;
    if (updates.nomor !== undefined) payload.nomor = updates.nomor;
    if (updates.luas !== undefined) payload.luas = updates.luas;
    if (updates.dimensi !== undefined) payload.dimensi = updates.dimensi;
    if (updates.harga !== undefined) payload.harga = updates.harga;
    if (updates.tipe !== undefined) payload.tipe = updates.tipe;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.customerId !== undefined) payload.customer_id = updates.customerId;
    if (updates.customerNama !== undefined) payload.customer_nama = updates.customerNama;
    if (updates.keterangan !== undefined) payload.keterangan = updates.keterangan;
    
    const { error } = await supabase.from('kavlings').update(payload).eq('id', id);
    return !error;
  } catch (e) {
    console.warn('Error updating kavling:', e);
    return false;
  }
}

export async function supabaseDeleteKavling(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('kavlings').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('Error deleting kavling:', e);
    return false;
  }
}

export async function supabaseUpdateProject(id: string, updates: { nama?: string; lokasi?: string; deskripsi?: string }): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('projects').update(updates).eq('id', id);
    return !error;
  } catch (e) {
    console.warn('Error updating project:', e);
    return false;
  }
}

export async function supabaseDeleteProject(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('Error deleting project:', e);
    return false;
  }
}

export async function supabaseUpdateLandDebt(id: string, updates: Partial<LandDebt>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload: any = {};
    if (updates.projectId !== undefined) payload.project_id = updates.projectId;
    if (updates.projectNama !== undefined) payload.project_nama = updates.projectNama;
    if (updates.namaPetani !== undefined) payload.nama_petani = updates.namaPetani;
    if (updates.telepon !== undefined) payload.telepon = updates.telepon;
    if (updates.luasTanah !== undefined) payload.luas_tanah = updates.luasTanah;
    if (updates.alasHak !== undefined) payload.alas_hak = updates.alasHak;
    if (updates.hargaKesepakatan !== undefined) payload.harga_kesepakatan = updates.hargaKesepakatan;
    if (updates.dpDibayar !== undefined) payload.dp_dibayar = updates.dpDibayar;
    if (updates.totalCicilan !== undefined) payload.total_cicilan = updates.totalCicilan;
    if (updates.sisaHutang !== undefined) payload.sisa_hutang = updates.sisaHutang;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.alamatLahan !== undefined) payload.alamat_lahan = updates.alamatLahan;
    if (updates.keterangan !== undefined) payload.keterangan = updates.keterangan;
    if (updates.sertifikatImage !== undefined) payload.sertifikat_image = updates.sertifikatImage;
    if (updates.perjanjianImage !== undefined) payload.perjanjian_image = updates.perjanjianImage;
    
    const { error } = await supabase.from('land_debts').update(payload).eq('id', id);
    return !error;
  } catch (e) {
    console.warn('Error updating land debt:', e);
    return false;
  }
}

export async function supabaseDeleteLandDebt(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('land_debts').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('Error deleting land debt:', e);
    return false;
  }
}

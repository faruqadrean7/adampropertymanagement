import { Kavling } from '@/types';

export function parseKavlingSortKey(nomor?: string | null, blok?: string | null): {
  letter: string;
  num: number;
  full: string;
} {
  const nomorLetter = (nomor || '').match(/^[A-Za-z]/)?.[0]?.toUpperCase() || '';
  const cleanBlok = (blok || '').replace(/BLOK/gi, '').trim().toUpperCase();
  const letter = nomorLetter || cleanBlok.match(/[A-Z]/)?.[0] || 'Z';
  const numMatch = (nomor || '').match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 0;
  return { letter, num, full: nomor || '' };
}

export function sortKavlingsNaturally(list: Kavling[]): Kavling[] {
  return [...list].sort((a, b) => {
    const keyA = parseKavlingSortKey(a.nomor, a.blok);
    const keyB = parseKavlingSortKey(b.nomor, b.blok);
    const letterCompare = keyA.letter.localeCompare(keyB.letter);
    if (letterCompare !== 0) return letterCompare;
    if (keyA.num !== keyB.num) return keyA.num - keyB.num;
    return keyA.full.localeCompare(keyB.full, undefined, { numeric: true });
  });
}

export interface KavlingBlockGroup {
  blokKey: string;
  blokTitle: string;
  items: Kavling[];
  totalUnits: number;
  openUnits: number;
  bookingUnits: number;
  soldUnits: number;
  totalValue: number;
}

export function groupKavlingsByBlok(list: Kavling[]): KavlingBlockGroup[] {
  const sorted = sortKavlingsNaturally(list);
  const groupsMap = new Map<string, Kavling[]>();

  for (const k of sorted) {
    const key = parseKavlingSortKey(k.nomor, k.blok).letter;
    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(k);
  }

  const blockKeys = Array.from(groupsMap.keys()).sort((a, b) => a.localeCompare(b));

  return blockKeys.map(key => {
    const items = groupsMap.get(key) || [];
    const openUnits = items.filter(k => k.status === 'terbuka').length;
    const bookingUnits = items.filter(k => k.status === 'booking').length;
    const soldUnits = items.filter(k => k.status === 'terjual').length;
    const totalValue = items.reduce((sum, k) => sum + k.harga, 0);

    return {
      blokKey: key,
      blokTitle: `Blok ${key}`,
      items,
      totalUnits: items.length,
      openUnits,
      bookingUnits,
      soldUnits,
      totalValue
    };
  });
}

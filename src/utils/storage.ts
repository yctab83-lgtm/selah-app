import { SoapEntry, JournalEntry, PrayerItem, ReadingProgress, PinnedItem, BrainDumpEntry } from '../types';
import { INITIAL_SOAP_ENTRIES, INITIAL_JOURNAL_ENTRIES, INITIAL_PRAYERS, INITIAL_PINNED_ITEMS } from '../data/initialData';

const KEYS = {
  SOAP: 'selah_soap_entries_afrikaans_v2',
  JOURNAL: 'selah_journal_entries_afrikaans_v2',
  PRAYERS: 'selah_prayers_afrikaans_v2',
  READING_PROGRESS: 'selah_reading_progress_afrikaans_v2',
  PINNED_ITEMS: 'selah_pinned_items_afrikaans_v2',
  BRAIN_DUMP: 'selah_brain_dumps_afrikaans_v2',
};

export const getStoredSoapEntries = (): SoapEntry[] => {
  try {
    const data = localStorage.getItem(KEYS.SOAP);
    return data ? JSON.parse(data) : INITIAL_SOAP_ENTRIES;
  } catch (e) {
    console.error('Kon nie S.O.A.P.-inskrywings laai nie', e);
    return INITIAL_SOAP_ENTRIES;
  }
};

export const saveStoredSoapEntries = (entries: SoapEntry[]) => {
  try {
    localStorage.setItem(KEYS.SOAP, JSON.stringify(entries));
  } catch (e) {
    console.error('Kon nie S.O.A.P.-inskrywings stoor nie', e);
  }
};

export const getStoredJournalEntries = (): JournalEntry[] => {
  try {
    const data = localStorage.getItem(KEYS.JOURNAL);
    return data ? JSON.parse(data) : INITIAL_JOURNAL_ENTRIES;
  } catch (e) {
    console.error('Kon nie joernaalinskrywings laai nie', e);
    return INITIAL_JOURNAL_ENTRIES;
  }
};

export const saveStoredJournalEntries = (entries: JournalEntry[]) => {
  try {
    localStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
  } catch (e) {
    console.error('Kon nie joernaalinskrywings stoor nie', e);
  }
};

export const getStoredPrayers = (): PrayerItem[] => {
  try {
    const data = localStorage.getItem(KEYS.PRAYERS);
    return data ? JSON.parse(data) : INITIAL_PRAYERS;
  } catch (e) {
    console.error('Kon nie gebede laai nie', e);
    return INITIAL_PRAYERS;
  }
};

export const saveStoredPrayers = (prayers: PrayerItem[]) => {
  try {
    localStorage.setItem(KEYS.PRAYERS, JSON.stringify(prayers));
  } catch (e) {
    console.error('Kon nie gebede stoor nie', e);
  }
};

export const getStoredReadingProgress = (): Record<string, ReadingProgress> => {
  try {
    const data = localStorage.getItem(KEYS.READING_PROGRESS);
    if (data) return JSON.parse(data);
    return {
      'slagveld-van-die-denke': {
        planId: 'slagveld-van-die-denke',
        completedDays: [1, 2],
        startedAt: '2026-09-24',
        lastReadAt: '2026-09-26',
      }
    };
  } catch (e) {
    console.error('Kon nie leesplanvordering laai nie', e);
    return {};
  }
};

export const saveStoredReadingProgress = (progress: Record<string, ReadingProgress>) => {
  try {
    localStorage.setItem(KEYS.READING_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Kon nie leesplanvordering stoor nie', e);
  }
};

export const getStoredPinnedItems = (): PinnedItem[] => {
  try {
    const data = localStorage.getItem(KEYS.PINNED_ITEMS);
    return data ? JSON.parse(data) : INITIAL_PINNED_ITEMS;
  } catch (e) {
    console.error('Kon nie vasgepende items laai nie', e);
    return INITIAL_PINNED_ITEMS;
  }
};

export const saveStoredPinnedItems = (items: PinnedItem[]) => {
  try {
    localStorage.setItem(KEYS.PINNED_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Kon nie vasgepende items stoor nie', e);
  }
};

export const getStoredBrainDumps = (): BrainDumpEntry[] => {
  try {
    const data = localStorage.getItem(KEYS.BRAIN_DUMP);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Kon nie breinstortings laai nie', e);
    return [];
  }
};

export const saveStoredBrainDumps = (entries: BrainDumpEntry[]) => {
  try {
    localStorage.setItem(KEYS.BRAIN_DUMP, JSON.stringify(entries));
  } catch (e) {
    console.error('Kon nie breinstortings stoor nie', e);
  }
};

export const exportAllDataAfrikaans = () => {
  const backup = {
    toepassing: 'Selah - Afrikaanse Bybelstudie & Gebedsjoernaal',
    weergawe: '2.0',
    datumUitgevoer: new Date().toISOString(),
    soapInskrywings: getStoredSoapEntries(),
    joernaalInskrywings: getStoredJournalEntries(),
    gebede: getStoredPrayers(),
    vasgependeItems: getStoredPinnedItems(),
    breinstortings: getStoredBrainDumps(),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `selah-afrikaans-rugsteun-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

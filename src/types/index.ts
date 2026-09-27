export type ActiveTab = 'interlinear' | 'soap' | 'reading-plans' | 'journal' | 'prayers' | 'year-in-review';

export interface Scripture {
  id: string;
  reference: string; // bv. "Filippense 4:6-7"
  book: string;
  chapter: number;
  verse: string;
  text: string;
  translation: '1983-vertaling' | '1933/53-vertaling';
  theme: string; // bv. "Vrede & Angs", "Slagveld van die Denke", "Vertroue & Voorsiening"
  testament: 'Ou Testament' | 'Nuwe Testament';
}

export interface ReadingDay {
  day: number;
  title: string;
  passageRef: string;
  passageText: string;
  devotionalNote: string; // Daaglikse praktiese oordenking
  reflectionQuestion: string;
  declaration: string; // Positiewe geloofsbelydenis van die Woord
}

export interface ReadingPlan {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Slagveld van die Denke' | 'Begin Jou Dag Reg' | 'Vrede & Rus' | 'Wysheid & Groei' | 'Genade vir Elke Dag';
  durationDays: number;
  authorNote: string; // "Praktiese geestelike leringe en 1983-Bybelvertaling"
  days: ReadingDay[];
}

export interface ReadingProgress {
  planId: string;
  completedDays: number[];
  startedAt: string;
  lastReadAt: string;
}

export interface SoapEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  scriptureRef: string;
  scriptureText: string;
  observation: string;
  application: string;
  prayer: string;
  updatedAt: string;
}

export interface PinnedItem {
  id: string;
  title: string;
  sourceUrl?: string; // Pinterest skakel of web URL
  imageUrl: string;
  caption?: string;
  category: 'Skrifkunswerk' | 'Pinterest Inspirasie' | 'Aanhaling' | 'Gebedsmotivering' | 'Gemoedsbord';
  createdAt: string;
}

export interface BrainDumpAnalysis {
  summary: string;
  encouragingMessage: string;
  spiritualInsight?: string;
  recommendedScriptures: {
    reference: string;
    text: string;
    practicalApplication: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'google';
  lastLogin: string;
}

export interface BrainDumpEntry {
  id: string;
  date: string; // YYYY-MM-DD
  rawText: string;
  analysis?: BrainDumpAnalysis;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  reflection: string;
  gratitudes: string[]; // Toegewyde dankbaarheid wat na Jaaroorsig vloei
  scriptureRef?: string;
  tags?: string[];
  createdAt: string;
}

export interface PrayerItem {
  id: string;
  title: string;
  request: string;
  scriptureRef?: string;
  scriptureText?: string;
  category: 'Persoonlik' | 'Familie' | 'Genesing' | 'Leiding' | 'Geestelik' | 'Danksegging' | 'Gemeenskap' | 'Ander';
  prayerDate: string; // YYYY-MM-DD (Datum gebid)
  isAnswered: boolean;
  answeredDate?: string; // YYYY-MM-DD (Datum beantwoord)
  answeredNotes?: string; // Getuienis van hoe God geantwoord het
  speechRecorded?: boolean; // of die gebed via spraak-na-teks opgeneem is
  createdAt: string;
  updatedAt?: string;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  verified: boolean;
  provider: 'google';
  lastLogin: string;
}

const STORAGE_KEY = 'selah_google_user';

export function getStoredGoogleUser(): GoogleUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Kon nie Google-gebruiker laai nie:', e);
    return null;
  }
}

export function saveStoredGoogleUser(user: GoogleUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Kon nie Google-gebruiker stoor nie:', e);
  }
}

export function createGoogleUserFromEmail(email: string, name?: string): GoogleUser {
  const cleanEmail = email.trim().toLowerCase();
  const displayName = name?.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const initial = displayName.charAt(0).toUpperCase();
  
  // High quality SVG avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0B253A&color=ffffff&bold=true&size=128`;

  return {
    id: `g_${Date.now()}_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '')}`,
    name: displayName,
    email: cleanEmail,
    avatarUrl,
    verified: true,
    provider: 'google',
    lastLogin: new Date().toISOString(),
  };
}

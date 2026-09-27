const SANCTUARY_PASSWORD_KEY = 'selah_sanctuary_password';
const SANCTUARY_SESSION_KEY = 'selah_sanctuary_unlocked_session';

export function getSanctuaryPassword(): string | null {
  try {
    return localStorage.getItem(SANCTUARY_PASSWORD_KEY);
  } catch {
    return null;
  }
}

export function hasSanctuaryPassword(): boolean {
  const pwd = getSanctuaryPassword();
  return Boolean(pwd && pwd.length > 0);
}

export function setSanctuaryPassword(password: string): void {
  try {
    if (!password) {
      localStorage.removeItem(SANCTUARY_PASSWORD_KEY);
      sessionStorage.removeItem(SANCTUARY_SESSION_KEY);
    } else {
      localStorage.setItem(SANCTUARY_PASSWORD_KEY, password);
      // Automatically unlock for this session upon setting/changing
      sessionStorage.setItem(SANCTUARY_SESSION_KEY, 'unlocked');
    }
  } catch (e) {
    console.error('Kon nie heiligdom wagwoord stoor nie:', e);
  }
}

export function verifySanctuaryPassword(input: string): boolean {
  const current = getSanctuaryPassword();
  if (!current) return true; // No password set
  return current.trim() === input.trim();
}

export function isSanctuaryUnlockedInSession(): boolean {
  try {
    // If no password exists, it's not locked
    if (!hasSanctuaryPassword()) return true;
    return sessionStorage.getItem(SANCTUARY_SESSION_KEY) === 'unlocked';
  } catch {
    return false;
  }
}

export function setSanctuaryUnlockedInSession(unlocked: boolean): void {
  try {
    if (unlocked) {
      sessionStorage.setItem(SANCTUARY_SESSION_KEY, 'unlocked');
    } else {
      sessionStorage.removeItem(SANCTUARY_SESSION_KEY);
    }
  } catch (e) {
    console.error('Kon nie heiligdom sessie stoor nie:', e);
  }
}

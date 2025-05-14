import { SessionStore } from '../db/store';

export const OFFLINE_TOLERANCE_DAYS = 2;
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function verifyOfflineSession(): Promise<{
  isValid: boolean;
  error?: string;
}> {
  const session = await SessionStore.get();

  if (!session) {
    return { isValid: false, error: 'No hay sesión activa.' };
  }

  const now = Date.now();
  const offlineLimit = now - OFFLINE_TOLERANCE_DAYS * ONE_DAY_MS;

  if (session.expiresAt < now || session.lastValidated < offlineLimit) {
    return { isValid: false, error: 'Tu sesión es inválida o fue expirada.' };
  }

  return { isValid: true };
}

/**
 * Microphone Permission & Preference Manager
 * Ensures that microphone permission is only prompted ONCE.
 * Once asked, if denied or if user does not grant it, it NEVER pesters
 * the user or triggers repeated browser permission popups on login / page load.
 */

const KEY_MIC_PROMPTED = 'silicon_mic_access_asked_once';
const KEY_MIC_DENIED = 'silicon_mic_access_denied';
const KEY_MIC_NEVER_ASK = 'silicon_mic_never_ask_again';
const KEY_MIC_GRANTED = 'silicon_mic_access_granted';

export type MicPermissionState = 'granted' | 'denied' | 'prompt' | 'previously_denied';

export function hasMicBeenAskedOnce(): boolean {
  try {
    return localStorage.getItem(KEY_MIC_PROMPTED) === 'true';
  } catch {
    return false;
  }
}

export function isMicPermanentlyMutedOrDenied(): boolean {
  try {
    if (localStorage.getItem(KEY_MIC_NEVER_ASK) === 'true') return true;
    if (localStorage.getItem(KEY_MIC_DENIED) === 'true') return true;
    return false;
  } catch {
    return false;
  }
}

export function isMicAlreadyGranted(): boolean {
  try {
    return localStorage.getItem(KEY_MIC_GRANTED) === 'true';
  } catch {
    return false;
  }
}

export function recordMicAccessResult(status: 'granted' | 'denied' | 'dismissed'): void {
  try {
    localStorage.setItem(KEY_MIC_PROMPTED, 'true');
    if (status === 'granted') {
      localStorage.setItem(KEY_MIC_GRANTED, 'true');
      localStorage.removeItem(KEY_MIC_DENIED);
      localStorage.removeItem(KEY_MIC_NEVER_ASK);
    } else {
      // User denied, dismissed, or error occurred — remember to NEVER ask repeatedly again
      localStorage.removeItem(KEY_MIC_GRANTED);
      localStorage.setItem(KEY_MIC_DENIED, 'true');
      localStorage.setItem(KEY_MIC_NEVER_ASK, 'true');
    }
  } catch (e) {
    console.warn('Storage unavailable for mic permission cache:', e);
  }
}

export function resetMicPermissionPreference(): void {
  try {
    localStorage.removeItem(KEY_MIC_PROMPTED);
    localStorage.removeItem(KEY_MIC_DENIED);
    localStorage.removeItem(KEY_MIC_NEVER_ASK);
    localStorage.removeItem(KEY_MIC_GRANTED);
  } catch (e) {
    console.warn('Failed to reset mic preference:', e);
  }
}

/**
 * Checks whether the app is allowed to prompt for microphone access.
 * Returns false if:
 * 1. The user was already asked once and denied/dismissed.
 * 2. The browser's native permissions API reports 'denied'.
 */
export async function canSafelyRequestMic(explicitUserClick: boolean = false): Promise<boolean> {
  // If user explicitly clicked and mic was already granted, allow it
  if (isMicAlreadyGranted()) {
    return true;
  }

  // If user previously denied or we already asked once, and this is NOT an explicit retry:
  if (isMicPermanentlyMutedOrDenied()) {
    return false;
  }

  // If already asked once and not an explicit user click, DO NOT show permission prompt
  if (hasMicBeenAskedOnce() && !explicitUserClick) {
    return false;
  }

  // Check native browser permissions API if available
  if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
    try {
      const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (status.state === 'denied') {
        recordMicAccessResult('denied');
        return false;
      }
      if (status.state === 'granted') {
        recordMicAccessResult('granted');
        return true;
      }
    } catch {
      // Some browsers (e.g. Firefox/Safari) may not support querying 'microphone' permission
    }
  }

  return true;
}

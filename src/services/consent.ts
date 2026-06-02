const CONSENT_KEY = "tglinks_consent";

export type ConsentStatus = "accepted" | "rejected" | null;

/**
 * Verifica o status do consentimento do usuário.
 */
export function getConsentStatus(): ConsentStatus {
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

/**
 * Retorna true se o usuário aceitou o consentimento.
 */
export function hasConsent(): boolean {
  return getConsentStatus() === "accepted";
}

/**
 * Registra que o usuário aceitou o tracking.
 */
export function grantConsent(): void {
  localStorage.setItem(CONSENT_KEY, "accepted");
}

/**
 * Registra que o usuário recusou o tracking.
 */
export function rejectConsent(): void {
  localStorage.setItem(CONSENT_KEY, "rejected");
}

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { hasConsent } from "./consent";

// ── Tipos ──────────────────────────────────────────────

interface GeoData {
  city: string;
  region: string;        // código do estado (ex: "PB")
  regionName: string;    // nome completo do estado (ex: "Paraíba")
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

// Formato retornado pela ipwho.is
interface IpWhoResponse {
  success: boolean;
  city: string;
  region: string;         // nome completo do estado
  region_code: string;    // código do estado
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

export interface UtmData {
  source: string;   // ex: "instagram", "qrcode", "google", "direct"
  medium: string;   // ex: "bio", "story", "print", "organic"
  campaign: string; // ex: "lancamento", ""
}

// ── Session ID (único por aba/sessão) ──────────────────

const SESSION_ID = crypto.randomUUID();

// ── Cache de geolocalização ────────────────────────────

let geoCache: GeoData | null = null;

async function getGeoData(): Promise<GeoData | null> {
  if (geoCache) return geoCache;

  // Tenta ler do sessionStorage primeiro
  const cached = sessionStorage.getItem("tglinks_geo");
  if (cached) {
    try {
      geoCache = JSON.parse(cached);
      return geoCache;
    } catch {
      // ignore parse errors
    }
  }

  try {
    // ipwho.is: gratuito, sem limite diário, usa HTTPS (necessário em sites HTTPS)
    const response = await fetch("https://ipwho.is/");
    if (!response.ok) return null;

    const raw: IpWhoResponse = await response.json();
    if (!raw.success) return null;

    const data: GeoData = {
      city: raw.city,
      region: raw.region_code,    // código (ex: "PB")
      regionName: raw.region,     // nome (ex: "Paraíba")
      country: raw.country,
      countryCode: raw.country_code,
      lat: raw.latitude,
      lon: raw.longitude,
    };

    geoCache = data;
    sessionStorage.setItem("tglinks_geo", JSON.stringify(data));
    return data;
  } catch {
    return null;
  }
}

// ── UTM / Source Detection ─────────────────────────────

/**
 * Lê os parâmetros UTM da URL e persiste na sessão.
 * Deve ser chamado uma vez ao carregar a página.
 * Se não houver UTM, tenta inferir a origem pelo referrer.
 */
export function captureUtm(): UtmData {
  // Já capturado nesta sessão?
  const cached = sessionStorage.getItem("tglinks_utm");
  if (cached) {
    try { return JSON.parse(cached); } catch { /* ignore */ }
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource   = params.get("utm_source")   ?? "";
  const utmMedium   = params.get("utm_medium")   ?? "";
  const utmCampaign = params.get("utm_campaign") ?? "";

  let source   = utmSource;
  let medium   = utmMedium;
  const campaign = utmCampaign;

  // Se não tem UTM explícito, infere pelo referrer
  if (!source) {
    const ref = document.referrer;
    if (!ref) {
      source = "direct";
      medium = "none";
    } else if (ref.includes("instagram.com")) {
      source = "instagram";
      medium = "social";
    } else if (ref.includes("google.com")) {
      source = "google";
      medium = "organic";
    } else if (ref.includes("facebook.com") || ref.includes("fb.com")) {
      source = "facebook";
      medium = "social";
    } else if (ref.includes("twitter.com") || ref.includes("x.com")) {
      source = "twitter";
      medium = "social";
    } else if (ref.includes("whatsapp.com")) {
      source = "whatsapp";
      medium = "messaging";
    } else if (ref.includes("t.co")) {
      source = "twitter";
      medium = "social";
    } else {
      // Referrer externo desconhecido — extrai só o domínio
      try {
        source = new URL(ref).hostname.replace("www.", "");
      } catch {
        source = ref;
      }
      medium = "referral";
    }
  }

  const utm: UtmData = { source, medium, campaign };
  sessionStorage.setItem("tglinks_utm", JSON.stringify(utm));
  return utm;
}

// ── Tracking Functions ─────────────────────────────────

/**
 * Registra um click em um botão.
 * Só envia dados se o usuário deu consentimento.
 */
export async function trackClick(
  buttonLabel: string,
  buttonUrl: string
): Promise<void> {
  console.log("[tracking] trackClick called:", buttonLabel, "| consent:", hasConsent());
  if (!hasConsent()) return;

  try {
    const geo = await getGeoData();
    const utm = captureUtm();

    const docRef = await addDoc(collection(db, "clicks"), {
      buttonLabel,
      buttonUrl,
      timestamp: serverTimestamp(),
      sessionId: SESSION_ID,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "direct",
      utm,
      region: geo
        ? {
            city: geo.city,
            state: geo.regionName,
            stateCode: geo.region,
            country: geo.country,
            countryCode: geo.countryCode,
            lat: geo.lat,
            lon: geo.lon,
          }
        : null,
    });
    console.log("[tracking] ✅ Click salvo com sucesso! ID:", docRef.id);
  } catch (error) {
    console.error("[tracking] ❌ Falha ao registrar click:", error);
  }
}

/**
 * Registra uma visualização de página.
 * Só envia dados se o usuário deu consentimento.
 */
export async function trackPageView(): Promise<void> {
  console.log("[tracking] trackPageView called | consent:", hasConsent());
  if (!hasConsent()) return;

  try {
    const geo = await getGeoData();
    const utm = captureUtm();

    const docRef = await addDoc(collection(db, "pageviews"), {
      page: window.location.pathname,
      timestamp: serverTimestamp(),
      sessionId: SESSION_ID,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "direct",
      utm,
      region: geo
        ? {
            city: geo.city,
            state: geo.regionName,
            stateCode: geo.region,
            country: geo.country,
            countryCode: geo.countryCode,
            lat: geo.lat,
            lon: geo.lon,
          }
        : null,
    });
    console.log("[tracking] ✅ PageView salvo com sucesso! ID:", docRef.id);
  } catch (error) {
    console.error("[tracking] ❌ Falha ao registrar pageview:", error);
  }
}

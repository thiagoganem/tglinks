import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// ── Types ──────────────────────────────────────────────

export interface ClickRecord {
  buttonLabel: string;
  buttonUrl: string;
  timestamp: Timestamp;
  sessionId: string;
  userAgent: string;
  referrer: string;
  region: {
    city: string;
    state: string;
    stateCode: string;
    country: string;
    countryCode: string;
    lat: number;
    lon: number;
  } | null;
}

export interface PageViewRecord {
  page: string;
  timestamp: Timestamp;
  sessionId: string;
  userAgent: string;
  referrer: string;
  region: ClickRecord["region"];
}

export interface ButtonStats {
  label: string;
  count: number;
  percentage: number;
}

export interface RegionStats {
  location: string;
  count: number;
  percentage: number;
}

export interface TimelinePoint {
  date: string;
  clicks: number;
  pageviews: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// ── Helpers ────────────────────────────────────────────

function getStartOfDay(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function getDaysBetween(start: Date, end: Date): number {
  const diffMs = end.getTime() - start.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

// ── Query Functions ────────────────────────────────────

/**
 * Busca todos os clicks dentro de um período.
 * Aceita número de dias OU um DateRange customizado.
 */
export async function getClicks(
  daysOrRange?: number | DateRange
): Promise<ClickRecord[]> {
  const clicksRef = collection(db, "clicks");

  let q;
  if (daysOrRange) {
    let startDate: Date;
    let endDate: Date | undefined;

    if (typeof daysOrRange === "number") {
      startDate = getStartOfDay(daysOrRange);
    } else {
      startDate = new Date(daysOrRange.start);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(daysOrRange.end);
      endDate.setHours(23, 59, 59, 999);
    }

    if (endDate) {
      q = query(
        clicksRef,
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        where("timestamp", "<=", Timestamp.fromDate(endDate)),
        orderBy("timestamp", "desc")
      );
    } else {
      q = query(
        clicksRef,
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        orderBy("timestamp", "desc")
      );
    }
  } else {
    q = query(clicksRef, orderBy("timestamp", "desc"));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as ClickRecord);
}

/**
 * Busca todos os pageviews dentro de um período.
 * Aceita número de dias OU um DateRange customizado.
 */
export async function getPageViews(
  daysOrRange?: number | DateRange
): Promise<PageViewRecord[]> {
  const pvRef = collection(db, "pageviews");

  let q;
  if (daysOrRange) {
    let startDate: Date;
    let endDate: Date | undefined;

    if (typeof daysOrRange === "number") {
      startDate = getStartOfDay(daysOrRange);
    } else {
      startDate = new Date(daysOrRange.start);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(daysOrRange.end);
      endDate.setHours(23, 59, 59, 999);
    }

    if (endDate) {
      q = query(
        pvRef,
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        where("timestamp", "<=", Timestamp.fromDate(endDate)),
        orderBy("timestamp", "desc")
      );
    } else {
      q = query(
        pvRef,
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        orderBy("timestamp", "desc")
      );
    }
  } else {
    q = query(pvRef, orderBy("timestamp", "desc"));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as PageViewRecord);
}

/**
 * Agrupa clicks por botão.
 */
export function getClicksByButton(clicks: ClickRecord[]): ButtonStats[] {
  const map = new Map<string, number>();

  for (const click of clicks) {
    const label = click.buttonLabel;
    map.set(label, (map.get(label) || 0) + 1);
  }

  const total = clicks.length;
  const stats: ButtonStats[] = [];

  for (const [label, count] of map) {
    stats.push({
      label,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    });
  }

  return stats.sort((a, b) => b.count - a.count);
}

/**
 * Agrupa clicks por região (cidade + estado).
 */
export function getClicksByRegion(clicks: ClickRecord[]): RegionStats[] {
  const map = new Map<string, number>();

  for (const click of clicks) {
    const location = click.region
      ? `${click.region.city}, ${click.region.stateCode}`
      : "Desconhecido";
    map.set(location, (map.get(location) || 0) + 1);
  }

  const total = clicks.length;
  const stats: RegionStats[] = [];

  for (const [location, count] of map) {
    stats.push({
      location,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    });
  }

  return stats.sort((a, b) => b.count - a.count);
}

/**
 * Gera timeline de clicks e pageviews por dia.
 * Aceita número de dias OU um DateRange customizado.
 */
export function getTimeline(
  clicks: ClickRecord[],
  pageviews: PageViewRecord[],
  daysOrRange: number | DateRange
): TimelinePoint[] {
  const timeline: TimelinePoint[] = [];

  let totalDays: number;
  let getDay: (i: number) => Date;

  if (typeof daysOrRange === "number") {
    totalDays = daysOrRange;
    getDay = (i: number) => getStartOfDay(totalDays - 1 - i);
  } else {
    totalDays = getDaysBetween(daysOrRange.start, daysOrRange.end);
    const rangeStart = new Date(daysOrRange.start);
    rangeStart.setHours(0, 0, 0, 0);
    getDay = (i: number) => {
      const d = new Date(rangeStart);
      d.setDate(d.getDate() + i);
      return d;
    };
  }

  for (let i = 0; i < totalDays; i++) {
    const dayStart = getDay(i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayClicks = clicks.filter((c) => {
      const ts = c.timestamp?.toDate?.();
      return ts && ts >= dayStart && ts < dayEnd;
    });

    const dayPvs = pageviews.filter((p) => {
      const ts = p.timestamp?.toDate?.();
      return ts && ts >= dayStart && ts < dayEnd;
    });

    timeline.push({
      date: formatDate(dayStart),
      clicks: dayClicks.length,
      pageviews: dayPvs.length,
    });
  }

  return timeline;
}

/**
 * Conta sessões únicas.
 */
export function getUniqueSessions(
  clicks: ClickRecord[],
  pageviews: PageViewRecord[]
): number {
  const sessions = new Set<string>();
  for (const c of clicks) sessions.add(c.sessionId);
  for (const p of pageviews) sessions.add(p.sessionId);
  return sessions.size;
}

/**
 * Agrupa referrers.
 */
export function getReferrers(
  clicks: ClickRecord[],
  pageviews: PageViewRecord[]
): { referrer: string; count: number }[] {
  const map = new Map<string, number>();

  const all = [...clicks, ...pageviews];
  for (const item of all) {
    const ref = item.referrer || "direct";
    map.set(ref, (map.get(ref) || 0) + 1);
  }

  const result: { referrer: string; count: number }[] = [];
  for (const [referrer, count] of map) {
    result.push({ referrer, count });
  }

  return result.sort((a, b) => b.count - a.count).slice(0, 10);
}

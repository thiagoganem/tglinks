import { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  getClicks,
  getPageViews,
  getClicksByButton,
  getClicksByRegion,
  getClicksBySource,
  getTimeline,
  getUniqueSessions,
  getReferrers,
  type ClickRecord,
  type PageViewRecord,
  type ButtonStats,
  type RegionStats,
  type SourceStats,
  type TimelinePoint,
  type DateRange,
} from "../../services/analytics";


// ── Metric Descriptions ────────────────────────────────

const METRIC_INFO: Record<string, string> = {
  clicks:
    "Total de cliques em todos os botões/links da página. Cada clique é contado individualmente.",
  pageviews:
    "Quantas vezes a página foi carregada. Cada acesso ou reload conta como uma visualização.",
  sessions:
    "Visitantes únicos por sessão do navegador. Cada aba aberta gera uma sessão diferente.",
  ctr: "Click-Through Rate — porcentagem de cliques em relação às visualizações. Pode ultrapassar 100% se um visitante clicar em vários links.",
};

// ── Auth Gate ──────────────────────────────────────────

function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dashPassword = import.meta.env.VITE_DASHBOARD_PASSWORD;
    if (password === dashPassword) {
      sessionStorage.setItem("tglinks_dash_auth", "1");
      onAuth();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0b09] via-[#1a1714] to-[#0d0b09] px-3 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <svg
            className="w-8 h-8 text-brand-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-xs text-slate-500">Acesso restrito</p>
          </div>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha de acesso"
          className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 ${
            error ? "border-red-500/50 animate-shake" : "border-white/10"
          }`}
          autoFocus
        />

        {error && (
          <p className="mt-2 text-xs text-red-400">Senha incorreta</p>
        )}

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all duration-200 hover:shadow-brand-500/30 hover:brightness-110 active:scale-[0.97]"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

// ── Info Tooltip ────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="ml-1.5 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-slate-400 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-help"
        aria-label="Informação"
      >
        ?
      </button>
      {show && (
        <div className="absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-48 sm:w-64 rounded-xl border border-white/10 bg-[#1a1714]/95 backdrop-blur-xl px-3 py-2.5 text-xs text-slate-300 leading-relaxed shadow-2xl z-50 pointer-events-none animate-fade-in">
          {text}
          <div className="absolute top-full left-4 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 bg-[#1a1714]/95 border-r border-b border-white/10 rotate-45 -mt-1" />
        </div>
      )}
    </span>
  );
}

// ── Stat Card ──────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  accent = "brand",
  info,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
  info?: string;
}) {
  const accentMap: Record<string, string> = {
    brand: "from-brand-600/20 to-brand-500/5 border-brand-500/20",
    emerald: "from-emerald-600/20 to-emerald-500/5 border-emerald-500/20",
    violet: "from-violet-600/20 to-violet-500/5 border-violet-500/20",
    sky: "from-sky-600/20 to-sky-500/5 border-sky-500/20",
  };

  return (
    <div
      className={`rounded-xl sm:rounded-2xl border bg-gradient-to-br backdrop-blur-md p-3 sm:p-5 transition-all duration-300 hover:scale-[1.02] ${accentMap[accent] || accentMap.brand}`}
    >
      <div className="flex items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-3">
        <span className="text-base sm:text-xl">{icon}</span>
        <span className="text-[9px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider leading-tight">
          {label}
        </span>
        {info && <span className="hidden sm:inline-flex"><InfoTooltip text={info} /></span>}
      </div>
      <p className="text-xl sm:text-3xl font-bold text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}

// ── Bar Chart ──────────────────────────────────────────

function BarChart({
  data,
}: {
  data: { label: string; value: number; percentage: number }[];
}) {
  const colors = [
    "from-brand-500 to-brand-400",
    "from-amber-500 to-amber-400",
    "from-emerald-500 to-emerald-400",
    "from-violet-500 to-violet-400",
    "from-sky-500 to-sky-400",
    "from-rose-500 to-rose-400",
    "from-teal-500 to-teal-400",
  ];

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={item.label} className="group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs sm:text-sm text-slate-300 font-medium truncate max-w-[60%]">
              {item.label}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 tabular-nums">
              {item.value}{" "}
              <span className="text-xs text-slate-500">
                ({item.percentage}%)
              </span>
            </span>
          </div>
          <div className="h-2 sm:h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${colors[i % colors.length]} transition-all duration-700 ease-out`}
              style={{ width: `${Math.max(item.percentage, 2)}%` }}
            />
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-4">
          Nenhum dado disponível
        </p>
      )}
    </div>
  );
}

// ── Timeline Chart ─────────────────────────────────────

function TimelineChart({ data }: { data: TimelinePoint[] }) {
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.clicks, d.pageviews)),
    1
  );

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div
        className="flex items-end gap-1 sm:gap-1.5 h-40"
        style={{ minWidth: data.length > 14 ? `${data.length * 36}px` : "100%" }}
      >
        {data.map((point) => (
          <div
            key={point.date}
            className="flex-1 flex flex-col items-center gap-1 group relative min-w-[28px]"
          >
            {/* Tooltip */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              <div className="rounded-lg border border-white/10 bg-[#1a1714]/95 backdrop-blur-sm px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                <p className="text-white font-medium">{point.date}</p>
                <p className="text-brand-300">Clicks: {point.clicks}</p>
                <p className="text-sky-300">Views: {point.pageviews}</p>
              </div>
            </div>

            {/* Bars */}
            <div className="w-full flex gap-0.5 items-end h-32">
              <div
                className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-500 min-h-[2px]"
                style={{
                  height: `${(point.clicks / maxVal) * 100}%`,
                }}
              />
              <div
                className="flex-1 rounded-t bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-500 min-h-[2px]"
                style={{
                  height: `${(point.pageviews / maxVal) * 100}%`,
                }}
              />
            </div>

            {/* Label */}
            <span className="text-[9px] sm:text-[10px] text-slate-500">
              {point.date.slice(0, 5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Date Range Picker ──────────────────────────────────

function DateRangePicker({
  onSelect,
  onClose,
}: {
  onSelect: (range: DateRange) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function handleDayClick(day: number) {
    const clicked = new Date(viewYear, viewMonth, day);
    clicked.setHours(0, 0, 0, 0);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clicked);
      setEndDate(null);
    } else {
      if (clicked < startDate) {
        setEndDate(startDate);
        setStartDate(clicked);
      } else {
        setEndDate(clicked);
      }
    }
  }

  function handleApply() {
    if (startDate && endDate) {
      onSelect({ start: startDate, end: endDate });
      onClose();
    }
  }

  function isInRange(day: number): boolean {
    if (!startDate || !endDate) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d >= startDate && d <= endDate;
  }

  function isStart(day: number): boolean {
    if (!startDate) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d.toDateString() === startDate.toDateString();
  }

  function isEnd(day: number): boolean {
    if (!endDate) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d.toDateString() === endDate.toDateString();
  }

  function isFuture(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day);
    return d > today;
  }

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div
      ref={ref}
      className="fixed inset-x-3 sm:inset-x-auto sm:absolute sm:right-0 top-auto sm:top-full mt-2 z-50 rounded-2xl border border-white/10 bg-[#1a1714]/98 backdrop-blur-xl shadow-2xl shadow-black/50 p-3 sm:p-4 w-auto sm:w-[300px] animate-fade-in"
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-white capitalize">
          {monthName}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-slate-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const future = isFuture(day);
          const selected = isStart(day) || isEnd(day);
          const inRange = isInRange(day);

          return (
            <button
              key={day}
              disabled={future}
              onClick={() => handleDayClick(day)}
              className={`h-8 rounded-lg text-xs font-medium transition-all duration-150
                ${future ? "text-slate-700 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer"}
                ${selected ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30" : ""}
                ${inRange && !selected ? "bg-brand-500/20 text-brand-200" : ""}
                ${!selected && !inRange && !future ? "text-slate-300" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selection Info & Apply */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="text-xs text-slate-400 mb-3">
          {startDate && !endDate && (
            <span>
              Início:{" "}
              <span className="text-brand-300">
                {startDate.toLocaleDateString("pt-BR")}
              </span>{" "}
              — selecione a data final
            </span>
          )}
          {startDate && endDate && (
            <span>
              <span className="text-brand-300">
                {startDate.toLocaleDateString("pt-BR")}
              </span>
              {" → "}
              <span className="text-brand-300">
                {endDate.toLocaleDateString("pt-BR")}
              </span>
            </span>
          )}
          {!startDate && (
            <span>Selecione a data de início</span>
          )}
        </div>
        <button
          onClick={handleApply}
          disabled={!startDate || !endDate}
          className={`w-full rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200
            ${
              startDate && endDate
                ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/20 hover:brightness-110 active:scale-[0.97]"
                : "bg-white/5 text-slate-500 cursor-not-allowed"
            }
          `}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────

export function DashboardPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("tglinks_dash_auth") === "1"
  );
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<number | "custom">(7);
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [clicks, setClicks] = useState<ClickRecord[]>([]);
  const [pageviews, setPageviews] = useState<PageViewRecord[]>([]);
  const [buttonStats, setButtonStats] = useState<ButtonStats[]>([]);
  const [regionStats, setRegionStats] = useState<RegionStats[]>([]);
  const [sourceStats, setSourceStats] = useState<SourceStats[]>([]);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [sessions, setSessions] = useState(0);
  const [referrers, setReferrers] = useState<{ referrer: string; count: number }[]>([]);

  const dashboardRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParam =
        period === "custom" && customRange ? customRange : (period as number);

      const [clicksData, pvData] = await Promise.all([
        getClicks(queryParam),
        getPageViews(queryParam),
      ]);

      setClicks(clicksData);
      setPageviews(pvData);
      setButtonStats(getClicksByButton(clicksData));
      setRegionStats(getClicksByRegion(clicksData));
      setSourceStats(getClicksBySource(pvData));
      setTimeline(getTimeline(clicksData, pvData, queryParam));
      setSessions(getUniqueSessions(clicksData, pvData));
      setReferrers(getReferrers(clicksData, pvData));

    } catch (err) {
      console.error("[dashboard] Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [period, customRange]);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />;

  const ctr =
    pageviews.length > 0
      ? ((clicks.length / pageviews.length) * 100).toFixed(1)
      : "0";

  function handlePeriodClick(days: number) {
    setPeriod(days);
    setCustomRange(null);
    setShowCalendar(false);
  }

  function handleCustomRange(range: DateRange) {
    setCustomRange(range);
    setPeriod("custom");
  }

  function getPeriodLabel(): string {
    if (period === "custom" && customRange) {
      return `${customRange.start.toLocaleDateString("pt-BR")} — ${customRange.end.toLocaleDateString("pt-BR")}`;
    }
    return `Últimos ${period} dias`;
  }

  async function exportPDF() {
    if (!dashboardRef.current || exporting) return;
    setExporting(true);

    try {
      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: "#0d0b09",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 dimensions in points
      const pdfWidth = 595.28;
      const pdfHeight = 841.89;
      const margin = 20;

      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (imgHeight * contentWidth) / imgWidth;

      const pdf = new jsPDF({
        orientation: contentHeight > pdfHeight ? "portrait" : "portrait",
        unit: "pt",
        format: "a4",
      });

      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);

      // If content is taller than one page, we may need multiple pages
      let yOffset = margin;
      const availableHeight = pdfHeight - margin * 2;

      if (contentHeight <= availableHeight) {
        pdf.addImage(imgData, "PNG", margin, yOffset, contentWidth, contentHeight);
      } else {
        // Multi-page
        let remainingHeight = contentHeight;
        let sourceY = 0;

        while (remainingHeight > 0) {
          const sliceHeight = Math.min(availableHeight, remainingHeight);
          const sliceRatio = sliceHeight / contentHeight;

          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = Math.round(canvas.height * sliceRatio);
          const ctx = sliceCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              sliceCanvas.height,
              0,
              0,
              canvas.width,
              sliceCanvas.height
            );
          }

          const sliceImg = sliceCanvas.toDataURL("image/png");
          pdf.addImage(sliceImg, "PNG", margin, margin, contentWidth, sliceHeight);

          remainingHeight -= sliceHeight;
          sourceY += sliceCanvas.height;

          if (remainingHeight > 0) {
            pdf.addPage();
          }
        }
      }

      const dateStr = new Date().toLocaleDateString("pt-BR");
      pdf.save(`analytics-dashboard-${dateStr}.pdf`);
    } catch (err) {
      console.error("[dashboard] Erro ao exportar PDF:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0b09] via-[#1a1714] to-[#0d0b09]">
      {/* Header */}
      <header className="border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 py-3 sm:py-5">
          {/* Top row: Logo + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/20">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white">
                Analytics
              </h1>
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-2">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => handlePeriodClick(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    period === d
                      ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  {d}d
                </button>
              ))}

              {/* Calendar button */}
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    period === "custom"
                      ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  Personalizado
                </button>
                {showCalendar && (
                  <DateRangePicker
                    onSelect={handleCustomRange}
                    onClose={() => setShowCalendar(false)}
                  />
                )}
              </div>

              <div className="w-px h-6 bg-white/10 mx-1" />

              {/* Export PDF */}
              <button
                onClick={exportPDF}
                disabled={exporting}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-1.5 border border-transparent"
                title="Exportar como PDF"
              >
                {exporting ? (
                  <div className="w-3.5 h-3.5 border border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                )}
                PDF
              </button>

              {/* Reload */}
              <button
                onClick={loadData}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                title="Recarregar"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile: just reload + export */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={exportPDF}
                disabled={exporting}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                title="Exportar PDF"
              >
                {exporting ? (
                  <div className="w-4 h-4 border border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={loadData}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                title="Recarregar"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile: Period filters row */}
          <div className="flex sm:hidden items-center gap-1 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => handlePeriodClick(d)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  period === d
                    ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                {d}d
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                  period === "custom"
                    ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                Personalizado
              </button>
              {showCalendar && (
                <DateRangePicker
                  onSelect={handleCustomRange}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main ref={dashboardRef} className="mx-auto max-w-6xl px-3 sm:px-6 py-4 sm:py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-slate-500">Carregando dados...</p>
          </div>
        ) : (
          <>
            {/* Period Label */}
            {period === "custom" && customRange && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs text-slate-500">Período:</span>
                <span className="text-xs text-brand-300 font-medium bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
                  {getPeriodLabel()}
                </span>
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
              <StatCard
                label="Total Clicks"
                value={clicks.length.toLocaleString("pt-BR")}
                icon={
                  <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                  </svg>
                }
                accent="brand"
                info={METRIC_INFO.clicks}
              />
              <StatCard
                label="Page Views"
                value={pageviews.length.toLocaleString("pt-BR")}
                icon={
                  <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                accent="sky"
                info={METRIC_INFO.pageviews}
              />
              <StatCard
                label="Sessões"
                value={sessions.toLocaleString("pt-BR")}
                icon={
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                }
                accent="violet"
                info={METRIC_INFO.sessions}
              />
              <StatCard
                label="CTR"
                value={`${ctr}%`}
                icon={
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                }
                accent="emerald"
                info={METRIC_INFO.ctr}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
              {/* Clicks por Botão */}
              <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-3 sm:p-6">
                <h2 className="text-sm font-semibold text-white mb-4 sm:mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-400" />
                  Clicks por Botão
                </h2>
                <BarChart
                  data={buttonStats.map((s) => ({
                    label: s.label,
                    value: s.count,
                    percentage: s.percentage,
                  }))}
                />
              </div>

              {/* Regiões */}
              <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-3 sm:p-6">
                <h2 className="text-sm font-semibold text-white mb-4 sm:mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Clicks por Região
                </h2>
                <BarChart
                  data={regionStats.slice(0, 8).map((s) => ({
                    label: s.location,
                    value: s.count,
                    percentage: s.percentage,
                  }))}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-3 sm:p-6 mb-4 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-5 gap-2">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Timeline — {getPeriodLabel()}
                </h2>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-brand-600 to-brand-400" />
                    <span className="text-slate-400">Clicks</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-sky-600 to-sky-400" />
                    <span className="text-slate-400">Views</span>
                  </span>
                </div>
              </div>
              <TimelineChart data={timeline} />
            </div>

            {/* Origem dos Visitantes */}
            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-3 sm:p-6">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  Origem dos Visitantes
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  De onde os usuários chegaram ao site — baseado em UTM params e referrer
                </p>
              </div>

              <div className="space-y-3">
                {sourceStats.map((src, i) => {
                  const colors = [
                    "from-violet-500 to-violet-400",
                    "from-brand-500 to-brand-400",
                    "from-emerald-500 to-emerald-400",
                    "from-amber-500 to-amber-400",
                    "from-sky-500 to-sky-400",
                    "from-rose-500 to-rose-400",
                  ];
                  const color = colors[i % colors.length];

                  return (
                    <div key={`${src.source}|${src.medium}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                            {src.label}
                          </span>
                          <span className="hidden sm:inline-flex text-[10px] text-slate-500 bg-white/5 border border-white/8 rounded-full px-2 py-0.5 shrink-0">
                            {src.detail}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 tabular-nums shrink-0 ml-2">
                          {src.count}{" "}
                          <span className="text-slate-600">({src.percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
                          style={{ width: `${Math.max(src.percentage, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {sourceStats.length === 0 && (
                  <div className="py-6 text-center">
                    <p className="text-sm text-slate-500">Nenhum dado disponível</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Dados aparecem após novos acessos com o tracking ativo
                    </p>
                  </div>
                )}
              </div>

              {/* Legenda de como usar UTMs */}
              {sourceStats.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    <span className="text-slate-500 font-medium">Dica:</span> Para rastrear QR Codes e links do Instagram, adicione{" "}
                    <code className="text-brand-500/80 bg-brand-500/10 px-1 py-0.5 rounded">?utm_source=qrcode</code>{" "}
                    ou{" "}
                    <code className="text-brand-500/80 bg-brand-500/10 px-1 py-0.5 rounded">?utm_source=instagram&utm_medium=bio</code>{" "}
                    ao final da URL.
                  </p>
                </div>
              )}
            </div>


            {/* Footer */}
            <footer className="mt-8 sm:mt-10 text-center">
              <p className="text-xs text-slate-600">
                Dados atualizados em tempo real via Firestore
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

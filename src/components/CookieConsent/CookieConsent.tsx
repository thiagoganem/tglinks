import { useState, useEffect } from "react";
import { getConsentStatus, grantConsent } from "../../services/consent";
import { trackPageView } from "../../services/tracking";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const status = getConsentStatus();
    if (status === null) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleOk() {
    grantConsent();
    // Registra o page view que foi perdido antes do consent
    trackPageView();
    setExiting(true);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 transition-all duration-300 ease-out ${
        exiting
          ? "translate-y-full opacity-0"
          : "translate-y-0 opacity-100 animate-consent-in"
      }`}
    >
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#1a1714]/90 backdrop-blur-xl shadow-2xl shadow-black/40 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-500 w-6 h-6 shrink-0"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Aviso de Cookies
          </h3>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mb-5">
          Este site utiliza cookies anônimos para estatísticas de navegação.
          Nenhum dado pessoal é coletado ou compartilhado.
        </p>

        <button
          onClick={handleOk}
          className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all duration-200 hover:shadow-brand-500/30 hover:brightness-110 active:scale-[0.97]"
        >
          Ok, entendi
        </button>
      </div>
    </div>
  );
}

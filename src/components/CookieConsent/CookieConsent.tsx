import { useState, useEffect } from "react";
import { getConsentStatus, grantConsent } from "../../services/consent";
import { trackPageView } from "../../services/tracking";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const status = getConsentStatus();
    if (status === null) {
      // Mostra imediatamente — sem delay
      setVisible(true);
    }
  }, []);

  // Bloqueia scroll enquanto o modal estiver aberto
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  function handleOk() {
    grantConsent();
    trackPageView();
    setExiting(true);
    setTimeout(() => setVisible(false), 350);
  }

  if (!visible) return null;

  return (
    /* Overlay bloqueante — cobre toda a tela, impede cliques no fundo */
    <div
      className={`fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 sm:p-6 transition-all duration-350 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.65)" }}
      /* Impede fechar ao clicar fora */
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className={`w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1714]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-6 sm:p-8 transition-all duration-350 ${
          exiting ? "scale-95 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"
        }`}
        style={{ animation: exiting ? undefined : "consentSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-400"
            >
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <path d="M8.5 8.5v.01" />
              <path d="M16 15.5v.01" />
              <path d="M12 12v.01" />
              <path d="M11 17v.01" />
              <path d="M7 14v.01" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Aviso de Cookies</h3>
            <p className="text-xs text-slate-500">Precisamos da sua confirmação</p>
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          Este site utiliza cookies anônimos para estatísticas de navegação.{" "}
          <span className="text-slate-300">Nenhum dado pessoal é coletado ou compartilhado.</span>
        </p>

        {/* Pill de detalhes */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["📊 Estatísticas anônimas", "🔒 Sem dados pessoais", "🚫 Sem rastreamento de terceiros"].map((item) => (
            <span
              key={item}
              className="text-xs text-slate-400 bg-white/5 border border-white/8 rounded-full px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>

        {/* CTA único — sem opção de recusar */}
        <button
          id="cookie-consent-accept"
          onClick={handleOk}
          className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all duration-200 hover:shadow-brand-500/40 hover:brightness-110 active:scale-[0.97]"
        >
          Ok, entendi e aceito
        </button>
      </div>

      <style>{`
        @keyframes consentSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

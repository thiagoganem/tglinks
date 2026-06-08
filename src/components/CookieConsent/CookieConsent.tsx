import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getConsentStatus, grantConsent } from "../../services/consent";
import { trackPageView } from "../../services/tracking";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const status = getConsentStatus();
    if (status === null) {
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
    <div
      className={`fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 sm:p-6 transition-opacity duration-350 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.65)" }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className={`w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1714]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-6 sm:p-8 transition-all duration-350 ${
          exiting ? "scale-95 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"
        }`}
        style={{ animation: exiting ? undefined : "consentSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Title */}
        <h3 className="text-base font-bold text-white mb-1">Aviso de Cookies</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-5">
          Este site utiliza cookies exclusivamente para análise interna de navegação. Não coletamos
          dados de identificação direta, como nome, e-mail, CPF ou endereço IP completo. As
          informações são utilizadas apenas para estatísticas de uso do site e não são
          compartilhadas com terceiros.
        </p>

        {/* Link para política completa */}
        <button
          onClick={() => navigate("/cookies")}
          className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors duration-150 mb-6 block"
        >
          Ler política de cookies completa →
        </button>

        {/* CTA único */}
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

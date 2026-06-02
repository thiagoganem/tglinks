import { useEffect } from "react";
import { ProfileHeader, LinkButton, InstagramButton } from "../../components";
import { CookieConsent } from "../../components/CookieConsent";
import { CAUSES, INSTAGRAM_PROFILE } from "../../utils";
import { trackPageView } from "../../services/tracking";

export function RedesPage() {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <>
      {/* Textura de grão sutil */}
      <div className="bg-grain" />

      <main className="relative z-10 flex min-h-screen items-start justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Foto + Nome */}
          <ProfileHeader
            imageUrl="/thiago-ganem.jpg"
            name="Thiago Ganem"
          />

          {/* Links das causas */}
          <nav className="mt-8 flex flex-col gap-3" aria-label="Links das causas">
            {CAUSES.map((cause, index) => (
              <LinkButton
                key={cause.label}
                cause={cause}
                delay={200 + index * 80}
              />
            ))}
          </nav>

          {/* Separador */}
          <div
            className="my-6 flex items-center gap-3 animate-slide-up opacity-0"
            style={{ animationDelay: "700ms" }}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">
              Redes
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Instagram pessoal */}
          <InstagramButton
            label={INSTAGRAM_PROFILE.label}
            url={INSTAGRAM_PROFILE.url}
            delay={800}
          />

          {/* Footer */}
          <footer
            className="mt-10 text-center animate-slide-up opacity-0"
            style={{ animationDelay: "900ms" }}
          >
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} Thiago Ganem — Todos os direitos reservados
            </p>
          </footer>
        </div>
      </main>

      <CookieConsent />
    </>
  );
}

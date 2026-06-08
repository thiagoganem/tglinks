import { useNavigate } from "react-router-dom";

export function CookiePolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0b09] via-[#1a1714] to-[#0d0b09] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">

        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200 mb-10 group"
        >
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Política de Cookies
          </h1>
          <p className="text-sm text-slate-500">
            Última atualização: junho de 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-slate-400 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              O que são cookies?
            </h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu navegador quando você acessa
              um site. Eles são amplamente utilizados para fazer sites funcionarem de forma mais
              eficiente e fornecer informações aos proprietários do site.
            </p>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              Como usamos cookies?
            </h2>
            <p className="mb-4">
              Este site utiliza cookies exclusivamente para fins de análise interna de navegação.
              Nenhum dado é compartilhado com terceiros nem utilizado para fins comerciais ou
              publicitários.
            </p>
            <ul className="space-y-2">
              {[
                "Contagem de acessos e visualizações de página",
                "Identificação anônima de sessões do navegador",
                "Estatísticas de cliques em links e botões",
                "Geolocalização aproximada por região (cidade e estado)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-0.5 shrink-0">*</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              Quais dados são coletados?
            </h2>
            <ul className="space-y-2">
              {[
                "Identificador anônimo de sessão (gerado aleatoriamente, sem vínculo com você)",
                "Página acessada e botões clicados",
                "Data e hora do acesso",
                "Cidade e estado aproximados (via IP, não armazenamos o IP)",
                "Navegador e sistema operacional (user agent)",
                "Origem do acesso (referrer)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-0.5 shrink-0">*</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              O que não coletamos
            </h2>
            <ul className="space-y-2">
              {[
                "Nome, e-mail, CPF ou qualquer dado de identificação pessoal",
                "Endereço IP completo",
                "Dados de formulários ou senhas",
                "Histórico de navegação em outros sites",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-0.5 shrink-0">*</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              Por quanto tempo os dados são armazenados?
            </h2>
            <p>
              Os registros de acesso são mantidos por tempo indeterminado para fins de análise
              histórica, mas não contêm nenhuma informação que permita identificar você
              individualmente.
            </p>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              Armazenamento local
            </h2>
            <p>
              Além dos cookies, utilizamos o <span className="text-slate-300">localStorage</span> do
              navegador para salvar sua preferência de consentimento, e o{" "}
              <span className="text-slate-300">sessionStorage</span> para armazenar temporariamente
              os dados de geolocalização durante a sessão, evitando múltiplas chamadas à API.
            </p>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              Seus direitos
            </h2>
            <p>
              A qualquer momento você pode limpar os dados armazenados pelo site acessando as
              configurações de privacidade do seu navegador e limpando cookies e dados de sites
              para este domínio. Isso irá redefinir sua preferência de consentimento e os dados
              de sessão serão removidos.
            </p>
          </section>

        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-slate-600 text-center">
          Em caso de dúvidas, entre em contato pelo Instagram.
        </p>

      </div>
    </div>
  );
}

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
              Finalidade do uso de cookies
            </h2>
            <p className="mb-4">
              Os cookies utilizados neste site têm finalidade exclusivamente analítica e estatística,
              voltados à operação e melhoria do próprio site. Não utilizamos cookies para fins
              publicitários, de rastreamento comportamental entre sites ou de compartilhamento com
              terceiros.
            </p>
            <ul className="space-y-2">
              {[
                "Contagem de acessos e visualizações de página",
                "Identificação de sessões do navegador por meio de identificador aleatório",
                "Estatísticas de cliques em links e botões",
                "Geolocalização aproximada por região (cidade e estado), sem armazenar o IP",
                "Identificação da origem da visita (referrer e parâmetros UTM)",
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
              Quais informações são registradas?
            </h2>
            <p className="mb-4">
              As informações coletadas não incluem dados de identificação direta. Registramos:
            </p>
            <ul className="space-y-2">
              {[
                "Identificador aleatório de sessão (gerado a cada nova sessão, sem vínculo com sua identidade)",
                "Páginas acessadas e botões clicados",
                "Data e hora dos acessos",
                "Cidade e estado aproximados — obtidos via consulta à API de geolocalização por IP; o endereço IP completo não é armazenado",
                "Navegador e sistema operacional (user agent)",
                "Origem da visita (referrer) e parâmetros de campanha (UTM), quando presentes na URL",
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
                "Nome, e-mail, CPF ou qualquer outro dado de identificação direta",
                "Endereço IP completo",
                "Dados de formulários, senhas ou informações financeiras",
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
              Compartilhamento com terceiros
            </h2>
            <p>
              As informações coletadas não são compartilhadas, vendidas ou cedidas a terceiros
              para nenhuma finalidade. O tratamento ocorre exclusivamente no âmbito da operação
              e análise interna deste site.
            </p>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              Por quanto tempo os dados são mantidos?
            </h2>
            <p>
              Os registros são mantidos pelo período necessário para fins de análise estatística
              e histórica relacionados à operação e evolução do site. Por não conterem dados de
              identificação direta, a retenção é necessária para garantir a integridade das
              análises ao longo do tempo.
            </p>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              Armazenamento local no navegador
            </h2>
            <p className="mb-3">
              Além dos registros enviados ao servidor, utilizamos o armazenamento local do navegador:
            </p>
            <ul className="space-y-2">
              {[
                "localStorage — armazena sua preferência de consentimento (\"aceito\" ou \"recusado\"), de forma que o aviso não seja exibido novamente.",
                "sessionStorage — armazena temporariamente o identificador de sessão e os dados de geolocalização durante a visita, evitando chamadas repetidas à API. Esses dados são apagados automaticamente ao fechar a aba ou o navegador.",
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
              Base legal (LGPD)
            </h2>
            <p>
              O tratamento de dados descrito nesta política é realizado com base no{" "}
              <span className="text-slate-300">legítimo interesse</span> do titular do site
              (art. 7º, IX da Lei nº 13.709/2018 — LGPD), para fins de análise estatística da
              operação e melhoria do site, com coleta restrita ao mínimo necessário e sem
              impacto sobre os direitos e liberdades fundamentais dos usuários.
            </p>
          </section>

          <div className="border-t border-white/5" />

          <section>
            <h2 className="text-base font-semibold text-slate-200 mb-3">
              Seus direitos e como revogar o consentimento
            </h2>
            <p className="mb-3">
              A qualquer momento você pode revogar sua preferência de consentimento e remover
              os dados armazenados localmente pelo site. Para isso:
            </p>
            <ul className="space-y-2">
              {[
                "No seu navegador, acesse Configurações → Privacidade e segurança → Dados do site.",
                "Localize este domínio e clique em \"Limpar\" ou \"Excluir\".",
                "Isso apagará o registro de consentimento (localStorage) e os dados temporários de sessão (sessionStorage).",
                "Na próxima visita, o aviso de cookies será exibido novamente.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-0.5 shrink-0">*</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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

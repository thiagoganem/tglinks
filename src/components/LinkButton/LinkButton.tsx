import type { CauseLink } from "../../types";

interface LinkButtonProps {
  cause: CauseLink;
  delay: number;
}

export function LinkButton({ cause, delay }: LinkButtonProps) {
  return (
    <a
      href={cause.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-card flex items-center gap-4 group animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
      id={`link-${cause.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Ícone SVG */}
      <span className="flex-shrink-0 w-7 h-7 transition-transform duration-300 group-hover:scale-110">
        {cause.icon}
      </span>

      {/* Label */}
      <span className="flex-1 text-base font-medium text-white/90 group-hover:text-white transition-colors duration-300">
        {cause.label}
      </span>

      {/* Seta */}
      <svg
        className="w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

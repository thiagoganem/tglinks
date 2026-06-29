interface IconProps {
  className?: string;
}

// Causa Animal — Pata de animal bem definida
export function AnimalIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="animal-g" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      {/* Almofada principal */}
      <path d="M12 21c-1.5 0-3-.7-4-1.8-.8-.9-1.2-2-.8-3.2.5-1.5 2-2.5 3.5-2.8.5-.1 1-.1 1.3-.1s.8 0 1.3.1c1.5.3 3 1.3 3.5 2.8.4 1.2 0 2.3-.8 3.2-1 1.1-2.5 1.8-4 1.8z" fill="url(#animal-g)" />
      {/* Dedo superior esquerdo */}
      <ellipse cx="7.5" cy="9" rx="2.2" ry="3" transform="rotate(-10 7.5 9)" fill="url(#animal-g)" />
      {/* Dedo superior direito */}
      <ellipse cx="16.5" cy="9" rx="2.2" ry="3" transform="rotate(10 16.5 9)" fill="url(#animal-g)" />
      {/* Dedo lateral esquerdo */}
      <ellipse cx="4.5" cy="14" rx="1.8" ry="2.8" transform="rotate(-20 4.5 14)" fill="url(#animal-g)" />
      {/* Dedo lateral direito */}
      <ellipse cx="19.5" cy="14" rx="1.8" ry="2.8" transform="rotate(20 19.5 14)" fill="url(#animal-g)" />
    </svg>
  );
}

// Fibromialgia — Borboleta lilás (símbolo internacional da fibromialgia)
export function FibromyalgiaIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fibro-g" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      {/* Asa superior esquerda */}
      <path d="M12 12C11 9 8.5 5.5 5.5 5.5c-2 0-3 2-2.5 4 .5 1.8 2.5 3 5 3.2L12 12z" fill="url(#fibro-g)" opacity="0.85" />
      {/* Asa superior direita */}
      <path d="M12 12c1-3 3.5-6.5 6.5-6.5 2 0 3 2 2.5 4-.5 1.8-2.5 3-5 3.2L12 12z" fill="url(#fibro-g)" opacity="0.85" />
      {/* Asa inferior esquerda */}
      <path d="M12 12c-1 2-3 5.5-5.5 6-1.8.4-3-1-2.8-2.8.2-1.5 2-3 4.5-3.5L12 12z" fill="url(#fibro-g)" opacity="0.65" />
      {/* Asa inferior direita */}
      <path d="M12 12c1 2 3 5.5 5.5 6 1.8.4 3-1 2.8-2.8-.2-1.5-2-3-4.5-3.5L12 12z" fill="url(#fibro-g)" opacity="0.65" />
      {/* Corpo central */}
      <ellipse cx="12" cy="12" rx="0.7" ry="3.5" fill="url(#fibro-g)" />
      {/* Antenas */}
      <path d="M11.5 8.5Q10 6 9.5 5" stroke="url(#fibro-g)" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M12.5 8.5Q14 6 14.5 5" stroke="url(#fibro-g)" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="9.3" cy="4.7" r="0.5" fill="url(#fibro-g)" />
      <circle cx="14.7" cy="4.7" r="0.5" fill="url(#fibro-g)" />
    </svg>
  );
}

// Oncologia — Fita de conscientização (laço clássico)
export function OncologyIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="onco-g" x1="8" y1="2" x2="16" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Laço esquerdo */}
      <path d="M12 10C10.5 7 8 3.5 6 4c-1.8.5-1.5 3.5 0 5.5L12 12.5" fill="url(#onco-g)" opacity="0.9" />
      {/* Laço direito */}
      <path d="M12 10c1.5-3 4-6.5 6-6 1.8.5 1.5 3.5 0 5.5L12 12.5" fill="url(#onco-g)" opacity="0.9" />
      {/* Fita esquerda descendo */}
      <path d="M12 12.5l-3.5 9" stroke="url(#onco-g)" strokeWidth="2.2" strokeLinecap="round" />
      {/* Fita direita descendo */}
      <path d="M12 12.5l3.5 9" stroke="url(#onco-g)" strokeWidth="2.2" strokeLinecap="round" />
      {/* Nó */}
      <circle cx="12" cy="11.5" r="1.8" fill="url(#onco-g)" />
    </svg>
  );
}

// Autismo — Peça de quebra-cabeça (símbolo do autismo)
export function AutismIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="autism-g" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <path
        d="M7 2h3c0 0 0 1.5 2 1.5S14 2 14 2h3a2 2 0 012 2v3c0 0-1.5 0-1.5 2s1.5 2 1.5 2v3a2 2 0 01-2 2h-3c0 0 0-1.5-2-1.5S9 16 9 16H7a2 2 0 01-2-2v-3c0 0 1.5 0 1.5-2S5 7 5 7V4a2 2 0 012-2z"
        fill="url(#autism-g)"
        opacity="0.85"
      />
      {/* Infinito no centro (símbolo neurodiversidade) */}
      <path
        d="M9.2 9.5c-.8-.8-2-.6-2 .5s1.2 1.3 2 .5L12 9l1.8 1.5c.8.8 2 .6 2-.5s-1.2-1.3-2-.5L12 11l-2.8-1.5z"
        fill="white"
        opacity="0.5"
      />
    </svg>
  );
}

// Segurança — Escudo com check (proteção)
export function SecurityIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sec-g" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f87171" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      {/* Escudo */}
      <path
        d="M12 2.5L4.5 6v4.5c0 5.5 3.2 10.3 7.5 12 4.3-1.7 7.5-6.5 7.5-12V6L12 2.5z"
        fill="url(#sec-g)"
        opacity="0.85"
      />
      {/* Checkmark */}
      <path
        d="M8.5 12l2.5 2.5 4.5-5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Cristão — Cruz latina com brilho dourado
export function ChristianIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="christian-g" x1="8" y1="1" x2="16" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="christian-glow" cx="12" cy="8" r="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde68a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Brilho atrás da cruz */}
      <circle cx="12" cy="8" r="6" fill="url(#christian-glow)" />
      {/* Haste vertical */}
      <rect x="10.2" y="3" width="3.6" height="18" rx="1.2" fill="url(#christian-g)" opacity="0.9" />
      {/* Haste horizontal */}
      <rect x="5.5" y="6.5" width="13" height="3.6" rx="1.2" fill="url(#christian-g)" opacity="0.9" />
    </svg>
  );
}

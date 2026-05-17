interface InstagramButtonProps {
  label: string;
  url: string;
  delay: number;
}

export function InstagramButton({ label, url, delay }: InstagramButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id="link-instagram-profile"
      className="relative flex items-center justify-center gap-3 rounded-2xl border border-brand-500/40
                 bg-gradient-to-r from-brand-600/20 via-brand-500/10 to-brand-600/20
                 px-6 py-4 backdrop-blur-md
                 transition-all duration-300 ease-out
                 hover:border-brand-400/60 hover:from-brand-600/30 hover:via-brand-500/20 hover:to-brand-600/30
                 hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5
                 active:scale-[0.98]
                 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Instagram icon */}
      <svg className="w-5 h-5 text-brand-300 group-hover:text-brand-200 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>

      <span className="text-base font-semibold text-brand-200 group-hover:text-white transition-colors duration-300">
        {label}
      </span>

      <span className="text-xs text-brand-400 group-hover:text-brand-300 transition-colors duration-300">
        @thiagoganem_
      </span>
    </a>
  );
}

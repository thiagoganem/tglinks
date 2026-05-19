interface ProfileHeaderProps {
  imageUrl: string;
  name: string;
}

export function ProfileHeader({ imageUrl, name }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Avatar com glow ring */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 opacity-60 blur-md group-hover:opacity-80 transition-opacity duration-500" />
        <img
          src={imageUrl}
          alt={`Foto de ${name}`}
          width={140}
          height={140}
          loading="eager"
          className="relative w-[140px] h-[140px] rounded-full object-cover border-[3px] border-white/20 glow-ring transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Nome */}
      <h1 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-white">
        {name}
      </h1>

      {/* Subtítulo */}
      <p className="mt-1 text-sm text-slate-400 font-light tracking-wide">
        Conheça nossas causas
      </p>

      {/* Divider decorativo */}
      <div className="mt-4 w-12 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent rounded-full" />
    </div>
  );
}

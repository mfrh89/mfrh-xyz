import Image from 'next/image'

interface HeaderProps {
  name: string
  title: string
  email: string
  phone: string
  linkedin: string
  profileImage: string | null
}

function ProfileImage({ profileImage, name, className }: { profileImage: string | null; name: string; className: string }) {
  if (profileImage) {
    return (
      <Image
        src={profileImage}
        alt={name}
        width={72}
        height={72}
        className={`rounded-full object-cover ${className}`}
      />
    )
  }
  return (
    <div className={`flex items-center justify-center rounded-full bg-neutral-300 text-sm font-bold text-neutral-500 ${className}`}>
      {(name || '').split(' ').map((n) => n[0]).join('')}
    </div>
  )
}

export function Header({ name, title, email, phone, linkedin, profileImage }: HeaderProps) {
  return (
    <header className="px-4 py-6 md:px-6 md:py-8">
      {/* Desktop layout: single row — name/title | photo | contact */}
      <div className="hidden md:flex items-center gap-6">
        {/* Left: Name + Title */}
        <div className="flex-1">
          <h1 className="text-[28px] font-bold tracking-[0.05em] uppercase text-[var(--color-text)]">
            {name}
          </h1>
          {title && (
            <p className="mt-1 text-[13px] tracking-[0.03em] text-[var(--color-text-muted)]">
              {title}
            </p>
          )}
        </div>

        {/* Center: Profile image */}
        <ProfileImage profileImage={profileImage} name={name} className="h-[54px] w-[54px]" />

        {/* Right: Contact info */}
        <div className="text-right text-[12px] leading-relaxed text-[var(--color-text-muted)]">
          {email && (
            <p>
              {email} <span className="text-[var(--color-text)]">&#8599;</span>
            </p>
          )}
          {phone && (
            <p>
              {phone} <span className="text-[var(--color-text)]">&#8599;</span>
            </p>
          )}
          {linkedin && (
            <p>
              {linkedin} <span className="text-[var(--color-text)]">&#8599;</span>
            </p>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col md:hidden">
        <h1 className="text-[22px] font-bold tracking-[0.05em] uppercase text-[var(--color-text)]">
          {name}
        </h1>
        {title && (
          <p className="mt-0.5 text-[11px] tracking-[0.03em] text-[var(--color-text-muted)]">
            {title}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3">
          <div className="text-[11px] leading-relaxed text-[var(--color-text-muted)]">
            {email && (
              <p>
                {email} <span className="text-[var(--color-text)]">&#8599;</span>
              </p>
            )}
            {phone && (
              <p>
                {phone} <span className="text-[var(--color-text)]">&#8599;</span>
              </p>
            )}
            {linkedin && (
              <p>
                {linkedin} <span className="text-[var(--color-text)]">&#8599;</span>
              </p>
            )}
          </div>
          <ProfileImage profileImage={profileImage} name={name} className="h-[54px] w-[54px]" />
        </div>
      </div>
    </header>
  )
}

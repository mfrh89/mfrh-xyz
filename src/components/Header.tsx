import Image from 'next/image'

interface HeaderProps {
  name: string
  title: string
  email: string
  location?: string
  website?: string
  linkedin: string
  profileImage: string | null
  logo: string | null
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

function ensureExternalUrl(value: string) {
  if (!value) return ''
  return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
}

function ContactLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) {
    return <p>{children}</p>
  }

  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
      {children}
    </a>
  )
}

export function Header({ name, title, email, location, website, linkedin, profileImage, logo }: HeaderProps) {
  return (
    <header>
      {/* Desktop layout */}
      <div className="hidden md:flex cv-desktop-layout items-center gap-6 px-[9mm] pt-[9mm] pb-0">
        {logo && (
          <Image
            src={logo}
            alt="Logo"
            width={120}
            height={60}
            className="h-[54px] w-auto object-contain"
          />
        )}

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

        <div className="cv-profile-large hidden">
          <ProfileImage profileImage={profileImage} name={name} className="h-[34mm] w-[34mm]" />
        </div>
        <div className="cv-profile-small">
          <ProfileImage profileImage={profileImage} name={name} className="h-[54px] w-[54px]" />
        </div>

        <div className="text-right text-[12px] leading-relaxed text-[var(--color-text-muted)]">
          {email && (
            <ContactLink href={`mailto:${email}`}>
              {email} <span className="cv-arrow text-[var(--color-text)]">&#8599;</span>
            </ContactLink>
          )}
          {location && <p>{location}</p>}
          {website && (
            <ContactLink href={ensureExternalUrl(website)}>
              {website} <span className="cv-arrow text-[var(--color-text)]">&#8599;</span>
            </ContactLink>
          )}
          {linkedin && (
            <ContactLink href={ensureExternalUrl(linkedin)}>
              {linkedin} <span className="cv-arrow text-[var(--color-text)]">&#8599;</span>
            </ContactLink>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col md:hidden cv-mobile-layout px-4 py-6">
        {logo && (
          <Image
            src={logo}
            alt="Logo"
            width={80}
            height={40}
            className="h-[36px] w-auto object-contain mb-3"
          />
        )}

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
              <ContactLink href={`mailto:${email}`}>
                {email} <span className="text-[var(--color-text)]">&#8599;</span>
              </ContactLink>
            )}
            {location && <p>{location}</p>}
            {website && (
              <ContactLink href={ensureExternalUrl(website)}>
                {website} <span className="text-[var(--color-text)]">&#8599;</span>
              </ContactLink>
            )}
            {linkedin && (
              <ContactLink href={ensureExternalUrl(linkedin)}>
                {linkedin} <span className="text-[var(--color-text)]">&#8599;</span>
              </ContactLink>
            )}
          </div>
          <ProfileImage profileImage={profileImage} name={name} className="h-[54px] w-[54px]" />
        </div>
      </div>

      {/* Chevron separator (print-shell only) */}
      <div className="hidden cv-chevron-sep cv-header-separator mt-2 mb-0" />
    </header>
  )
}

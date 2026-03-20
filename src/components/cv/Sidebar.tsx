import { SkillDots } from './SkillDots'
import { SectionTitle, SubsectionTitle } from './SectionTitle'

interface SidebarProps {
  data: {
    readonly summary: string
    readonly skillMaxDots: number | null
    readonly skills: readonly { readonly name: string; readonly level: number | null }[]
    readonly languages: readonly { readonly name: string; readonly level: string }[]
    readonly education: readonly {
      readonly institution: string
      readonly degree: string
      readonly startDate: string
      readonly endDate: string
    }[]
    readonly certificates: readonly {
      readonly name: string
      readonly issuer: string
      readonly date: string
      readonly status: string
    }[]
  }
}

export function AboutSection({ summary }: { summary: string }) {
  if (!summary) return null
  return (
    <div>
      <SectionTitle id="about">Über Mich</SectionTitle>
      <p className="text-[12px] leading-[1.6] text-[var(--color-text-muted)]">
        {summary}
      </p>
    </div>
  )
}

export function SkillsSection({ data }: SidebarProps) {
  return (
    <div className="space-y-5">
      {/* Kompetenzen & Fähigkeiten */}
      <div>
        <SectionTitle id="skills">Kompetenzen & Fähigkeiten</SectionTitle>

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="mb-4">
            <SubsectionTitle>Sprachen</SubsectionTitle>
            <div className="space-y-0.5">
              {data.languages.map((lang, i) => (
                <div key={i} className="flex justify-between text-[12px]">
                  <span className="text-[var(--color-text-muted)]">{lang.name}</span>
                  <span className="text-[var(--color-text-light)]">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech & Software with dot ratings */}
        {data.skills.length > 0 && (
          <div>
            <SubsectionTitle>Tech & Software</SubsectionTitle>
            <div className="space-y-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-[var(--color-text-muted)]">
                    {skill.name}
                  </span>
                  <SkillDots level={skill.level ?? 0} max={data.skillMaxDots ?? 5} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Education */}
      {data.education.length > 0 && (
        <div>
          <SectionTitle id="education">Ausbildung</SectionTitle>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i}>
                <p className="text-[12px] text-[var(--color-text-light)]">
                  {edu.startDate} bis {edu.endDate}
                </p>
                <p className="text-[13px] font-bold uppercase text-[var(--color-text)]">
                  {edu.degree}
                </p>
                <p className="text-[12px] text-[var(--color-text-muted)]">
                  {edu.institution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {data.certificates.length > 0 && (
        <div>
          <SectionTitle id="certificates">Zertifikate</SectionTitle>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {data.certificates.map((cert, i) => (
              <div key={i}>
                <p className="text-[11px] text-[var(--color-text-light)]">
                  {cert.date}
                  {cert.status ? ` (${cert.status})` : ''}
                </p>
                <p className="text-[13px] font-bold text-[var(--color-text)]">
                  {cert.name}
                </p>
                <p className="text-[12px] text-[var(--color-text-muted)]">
                  {cert.issuer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

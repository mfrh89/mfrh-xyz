interface ExperienceSectionProps {
  experience: readonly {
    readonly duration: string
    readonly startDate: string
    readonly endDate: string
    readonly company: string
    readonly role: string
    readonly description: string
  }[]
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section>
      {/* Section header with underline */}
      <div className="mb-4">
        <h2 id="experience" className="text-[14px] font-bold tracking-[-0.05em] uppercase text-[var(--color-text)]">
          Berufserfahrung
        </h2>
        <div className="mt-1 h-px w-full bg-[var(--color-rule)]" />
      </div>

      <div className="space-y-8">
        {experience.map((job, i) => (
          <article key={i} className="no-break">
            {/* Meta line */}
            <p className="mb-0.5 text-[12px] text-[var(--color-text-light)]">
              {job.duration} &bull; {job.startDate} - {job.endDate} &bull;{' '}
              {job.company}
            </p>

            {/* Role */}
            <h3 className="mb-1.5 text-[14px] font-bold tracking-[0.05em] uppercase text-[var(--color-text)]">
              {job.role}
            </h3>

            {/* Bullet points */}
            <ul className="space-y-2">
              {(job.description || '').split('\n').map((point, j) => {
                const trimmed = point.trim()
                if (!trimmed) return null
                return (
                  <li
                    key={j}
                    className="flex gap-2 text-[12px] leading-[1.5] text-[var(--color-text-muted)]"
                  >
                    <span className="mt-[6px] h-[4px] w-[4px] shrink-0 rounded-full bg-[var(--color-text-muted)]" />
                    <span>{trimmed}</span>
                  </li>
                )
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

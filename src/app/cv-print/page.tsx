export const dynamic = 'force-dynamic'

import { getCV } from '@/lib/payload'
import { getMediaProps } from '@/lib/media'
import { calcDuration } from '@/components/cv/calcDuration'

export default async function CVPrintPage() {
  const cv = await getCV()
  const serverURL = process.env.SERVER_URL || 'http://localhost:3000'
  const profileImage = getMediaProps(cv.profileImage, serverURL)?.src || null

  return (
    <div className="cv-print-page">
      {/* Header */}
      <header className="cv-print-header">
        <div>
          <h1 className="cv-print-name">{cv.name}</h1>
          {cv.title && <p className="cv-print-title">{cv.title}</p>}
        </div>
        {profileImage && (
          <img
            src={profileImage}
            alt={cv.name || ''}
            width={128}
            height={128}
            className="h-[34mm] w-[34mm] rounded-full object-cover"
          />
        )}
        <div className="cv-print-contact">
          {cv.email && <a href={`mailto:${cv.email}`}>{cv.email}</a>}
          {cv.linkedin && <p>{cv.linkedin}</p>}
        </div>
      </header>

      {/* Two columns */}
      <div className="cv-print-columns">
        {/* Sidebar */}
        <aside className="cv-print-sidebar">
          {/* About */}
          {cv.summary && (
            <div className="cv-print-about">
              <div className="cv-print-section-title">
                <h2>Über Mich</h2>
                <span className="cv-print-accent" />
              </div>
              <p>{cv.summary}</p>
            </div>
          )}

          {/* Skills */}
          <div>
            <div className="cv-print-section-title">
              <h2>Kompetenzen & Fähigkeiten</h2>
              <span className="cv-print-accent" />
            </div>

            {cv.languages && cv.languages.length > 0 && (
              <div className="cv-print-subsection" style={{ marginBottom: 16 }}>
                <h3>Sprachen</h3>
                {cv.languages.map((lang, i) => (
                  <div key={i} className="cv-print-lang-row">
                    <span className="cv-print-lang-name">{lang.name}</span>
                    <span className="cv-print-lang-level">{lang.level}</span>
                  </div>
                ))}
              </div>
            )}

            {cv.skills && cv.skills.length > 0 && (
              <div className="cv-print-subsection">
                <h3>Tech & Software</h3>
                {cv.skills.map((skill, i) => (
                  <div key={i} className="cv-print-skill-row">
                    <span className="cv-print-skill-name">{skill.name}</span>
                    <div className="cv-print-dots">
                      {Array.from({ length: 5 }, (_, j) => (
                        <span
                          key={j}
                          className={`cv-print-dot ${j < (Number(skill.level) || 0) ? 'cv-print-dot-filled' : 'cv-print-dot-empty'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          {cv.education && cv.education.length > 0 && (
            <div>
              <div className="cv-print-section-title">
                <h2>Ausbildung</h2>
                <span className="cv-print-accent" />
              </div>
              {cv.education.map((edu, i) => (
                <div key={i} className="cv-print-edu-item">
                  <p className="cv-print-edu-date">{edu.startDate}{edu.endDate ? ` bis ${edu.endDate}` : ''}</p>
                  <p className="cv-print-edu-degree">{edu.degree}</p>
                  <p className="cv-print-edu-institution">{edu.institution}</p>
                </div>
              ))}
            </div>
          )}

          {/* Certificates */}
          {cv.certificates && cv.certificates.length > 0 && (
            <div>
              <div className="cv-print-section-title">
                <h2>Zertifikate</h2>
                <span className="cv-print-accent" />
              </div>
              <div className="cv-print-cert-grid">
                {cv.certificates.map((cert, i) => (
                  <div key={i}>
                    <p className="cv-print-cert-date">{cert.date}{cert.status ? ` (${cert.status})` : ''}</p>
                    <p className="cv-print-cert-name">{cert.name}</p>
                    <p className="cv-print-cert-issuer">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main: Experience */}
        <main className="cv-print-main">
          <div className="cv-print-section-title">
            <h2>Berufserfahrung</h2>
            <span className="cv-print-accent" />
          </div>

          <div className="cv-print-experience">
            {(cv.experience || []).map((job, i) => {
              const duration = calcDuration(job)
              return (
              <article key={i} className="no-break">
                <p className="cv-print-job-meta">
                  {duration
                    ? `${duration} \u2022 `
                    : job.startDate
                      ? `${job.startDate}${job.endDate ? ` - ${job.endDate}` : ''} \u2022 `
                      : ''}
                  {job.company}
                </p>
                <h3 className="cv-print-job-role">{job.role}</h3>
                <ul className="cv-print-job-bullets">
                  {(job.description || '').split('\n').map((point, j) => {
                    const trimmed = point.trim()
                    if (!trimmed) return null
                    return (
                      <li key={j}>
                        <span className="cv-print-bullet-dot" />
                        <span>{trimmed}</span>
                      </li>
                    )
                  })}
                </ul>
              </article>
            )})}
          </div>
        </main>
      </div>

      <script dangerouslySetInnerHTML={{ __html: 'window.onload=function(){window.print()}' }} />
    </div>
  )
}

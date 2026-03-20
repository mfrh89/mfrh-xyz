import { getCV } from '@/lib/payload'
import { Header } from '@/components/Header'
import { AboutSection, SkillsSection } from '@/components/cv/Sidebar'
import { ExperienceSection } from '@/components/cv/ExperienceSection'
import { PrintButton } from '@/components/PrintButton'
import { MobileNav } from '@/components/cv/MobileNav'
import Link from 'next/link'

function mapSidebarData(cv: Awaited<ReturnType<typeof getCV>>) {
  return {
    summary: cv.summary || '',
    skillMaxDots: cv.skillMaxDots ?? 5,
    skills: (cv.skills || []).map((s: any) => ({ name: s.name || '', level: s.level ?? 0 })),
    languages: (cv.languages || []).map((l: any) => ({ name: l.name || '', level: l.level || '' })),
    education: (cv.education || []).map((e: any) => ({ institution: e.institution || '', degree: e.degree || '', startDate: e.startDate || '', endDate: e.endDate || '' })),
    certificates: (cv.certificates || []).map((c: any) => ({ name: c.name || '', issuer: c.issuer || '', date: c.date || '', status: c.status || '' })),
  }
}

export default async function CVPage() {
  const cv = await getCV()
  const sidebarData = mapSidebarData(cv)

  return (
    <>
      {/* Navigation */}
      <nav className="print-hidden flex items-center justify-center gap-6 bg-white py-3 shadow-sm">
        <Link href="/" className="text-xs font-bold text-[var(--color-text)] underline underline-offset-4">
          CV
        </Link>
        <Link href="/cover-letter" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
          Anschreiben
        </Link>
      </nav>

      {/* CV Page */}
      <main className="flex justify-center py-8 pb-20 md:pb-8 print:py-0">
        <div className="cv-page flex w-full max-w-[260mm] min-h-[297mm] flex-col print:w-[210mm] print:shadow-none">
          {/* ── Full-width Header ── */}
          <Header
            name={cv.name || ''}
            title={cv.title || ''}
            email={cv.email || ''}
            phone={cv.phone || ''}
            linkedin={cv.linkedin || ''}
            profileImage={typeof cv.profileImage === 'object' && cv.profileImage?.url ? cv.profileImage.url : null}
          />

          {/* ── Mobile: single column ── */}
          <div className="flex flex-col px-4 pb-6 pt-5 md:hidden">
            <AboutSection summary={cv.summary || ''} />
            <div className="mt-5">
              <ExperienceSection experience={cv.experience || []} />
            </div>
            <div className="mt-5">
              <SkillsSection data={sidebarData} />
            </div>
          </div>

          {/* ── Desktop: two-column body ── */}
          <div className="hidden md:flex flex-1">
            {/* Left Column (sidebar) */}
            <div className="flex w-[36%] shrink-0 flex-col px-6 pb-6 pt-5 space-y-5">
              <AboutSection summary={cv.summary || ''} />
              <SkillsSection data={sidebarData} />
            </div>

            {/* Right Column */}
            <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
              <ExperienceSection experience={cv.experience || []} />
            </div>
          </div>
        </div>
      </main>

      <PrintButton />
      <MobileNav />
    </>
  )
}

import { Header } from '@/components/Header'
import { AboutSection, SkillsSection } from '@/components/cv/Sidebar'
import { ExperienceSection } from '@/components/cv/ExperienceSection'
import { getMediaProps } from '@/lib/media'
import { richTextToPlain } from '@/lib/utils'
import type { CVData } from '@/lib/types'

function mapSidebarData(cv: CVData) {
  return {
    summary: richTextToPlain(cv.summary),
    skills: (cv.skills || []).map((skill) => ({ name: skill.name || '', level: Number(skill.level) || 0 })),
    languages: (cv.languages || []).map((language) => ({ name: language.name || '', level: language.level || '' })),
    education: (cv.education || []).map((entry) => ({
      institution: entry.institution || '',
      degree: entry.degree || '',
      startDate: entry.startDate || '',
      endDate: entry.endDate || '',
    })),
    certificates: (cv.certificates || []).map((certificate) => ({
      name: certificate.name || '',
      issuer: certificate.issuer || '',
      date: certificate.date || '',
      status: certificate.status || '',
    })),
  }
}

export function CVDocument({ cv, serverURL }: { cv: CVData; serverURL: string }) {
  const sidebarData = mapSidebarData(cv)
  const profileImage = getMediaProps(cv.profileImage, serverURL)?.src || null
  const logo = getMediaProps(cv.logo, serverURL)?.src || null

  return (
    <div className="cv-page flex w-full max-w-[260mm] min-h-[297mm] flex-col">
      <Header
        name={cv.name || ''}
        title={cv.title || ''}
        email={cv.email || ''}
        location={cv.location || ''}
        website={cv.website || ''}
        linkedin={cv.linkedin || ''}
        profileImage={profileImage}
        logo={logo}
      />

      {/* Mobile only (hidden in cv-print-shell) */}
      <div className="flex flex-col px-4 pb-6 pt-5 md:hidden cv-mobile-layout">
        <AboutSection summary={sidebarData.summary} />
        <div className="mt-5">
          <ExperienceSection experience={cv.experience || []} />
        </div>
        <div className="mt-5">
          <SkillsSection data={sidebarData} />
        </div>
      </div>

      {/* Desktop + Print-shell: 2-column */}
      <div className="hidden flex-1 md:flex cv-desktop-layout">
        <div className="cv-sidebar-col flex w-[36%] shrink-0 flex-col space-y-5 px-[9mm] pb-6 pt-5">
          <AboutSection summary={sidebarData.summary} />
          <SkillsSection data={sidebarData} />
        </div>
        <div className="cv-main-col flex flex-1 flex-col px-[9mm] pb-6 pt-5">
          <ExperienceSection experience={cv.experience || []} />
        </div>
      </div>
    </div>
  )
}

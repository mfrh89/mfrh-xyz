'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { Header } from '@/components/Header'
import { AboutSection, SkillsSection } from '@/components/cv/Sidebar'
import { ExperienceSection } from '@/components/cv/ExperienceSection'

type CVData = {
  name: string
  title: string
  email: string
  phone: string
  linkedin: string
  profileImage: { url?: string } | string | null
  summary: string
  skillMaxDots: number
  skills: { name: string; level: number }[]
  languages: { name: string; level: string }[]
  education: { institution: string; degree: string; startDate: string; endDate: string }[]
  certificates: { name: string; issuer: string; date: string; status: string }[]
  experience: any[]
}

export function LiveCV({ initialData, serverURL }: { initialData: CVData; serverURL: string }) {
  const { data: cv } = useLivePreview<CVData>({
    initialData,
    serverURL,
    depth: 1,
  })

  const sidebarData = {
    summary: cv.summary || '',
    skillMaxDots: cv.skillMaxDots ?? 5,
    skills: (cv.skills || []).map((s) => ({ name: s.name || '', level: s.level ?? 0 })),
    languages: (cv.languages || []).map((l) => ({ name: l.name || '', level: l.level || '' })),
    education: (cv.education || []).map((e) => ({ institution: e.institution || '', degree: e.degree || '', startDate: e.startDate || '', endDate: e.endDate || '' })),
    certificates: (cv.certificates || []).map((c) => ({ name: c.name || '', issuer: c.issuer || '', date: c.date || '', status: c.status || '' })),
  }

  const profileImage = typeof cv.profileImage === 'object' && cv.profileImage?.url ? cv.profileImage.url : null

  return (
    <main className="flex justify-center py-8 print:py-0">
      <div className="cv-page flex w-full max-w-[260mm] min-h-[297mm] flex-col print:w-[210mm] print:shadow-none">
        <Header
          name={cv.name || ''}
          title={cv.title || ''}
          email={cv.email || ''}
          phone={cv.phone || ''}
          linkedin={cv.linkedin || ''}
          profileImage={profileImage}
        />

        <div className="flex flex-col px-4 pb-6 pt-5 md:hidden">
          <AboutSection summary={cv.summary || ''} />
          <div className="mt-5">
            <ExperienceSection experience={cv.experience || []} />
          </div>
          <div className="mt-5">
            <SkillsSection data={sidebarData} />
          </div>
        </div>

        <div className="hidden md:flex flex-1">
          <div className="flex w-[36%] shrink-0 flex-col px-6 pb-6 pt-5 space-y-5">
            <AboutSection summary={cv.summary || ''} />
            <SkillsSection data={sidebarData} />
          </div>
          <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
            <ExperienceSection experience={cv.experience || []} />
          </div>
        </div>
      </div>
    </main>
  )
}

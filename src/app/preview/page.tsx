import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { AboutSection, SkillsSection } from '@/components/cv/Sidebar'
import { ExperienceSection } from '@/components/cv/ExperienceSection'
import { PrintButton } from '@/components/PrintButton'

type Props = {
  searchParams: Promise<{ global?: string }>
}

export default async function PreviewPage({ searchParams }: Props) {
  const { global: globalSlug } = await searchParams

  // Verify the user is logged in by checking the JWT cookie
  const headersList = await headers()
  const cookie = headersList.get('cookie') || ''
  const payload = await getPayload({ config: configPromise })

  // Try to authenticate - if not logged in, redirect to admin login
  try {
    const { user } = await payload.auth({ headers: headersList })
    if (!user) redirect('/admin/login')
  } catch {
    redirect('/admin/login')
  }

  if (globalSlug === 'cover-letter') {
    const cv = await payload.findGlobal({ slug: 'cv', draft: true })
    const letter = await payload.findGlobal({ slug: 'cover-letter', draft: true })
    const paragraphs = (letter.body || '').split('\n\n').filter((p: string) => p.trim())

    return (
      <>
        <div className="bg-yellow-500 text-black text-center py-2 text-sm font-bold print-hidden">
          PREVIEW - Draft-Version (nicht veröffentlicht)
        </div>
        <main className="flex justify-center py-8 print:py-0">
          <div className="cover-letter-page flex w-[260mm] min-h-[297mm] flex-col print:w-[210mm] print:shadow-none">
            <Header
              name={cv.name || ''}
              title={cv.title || ''}
              email={cv.email || ''}
              phone={cv.phone || ''}
              linkedin={cv.linkedin || ''}
              profileImage={typeof cv.profileImage === 'object' && cv.profileImage?.url ? cv.profileImage.url : null}
            />
            <div className="flex-1 px-6 pb-6 pt-5">
              <div className="mb-5">
                <h2 className="text-[14px] font-bold tracking-[-0.05em] uppercase text-[var(--color-text)]">Anschreiben</h2>
                <div className="mt-1 h-px w-full bg-[var(--color-rule)]" />
              </div>
              <p className="mb-4 text-[13px] text-[var(--color-text)]">{letter.recipientSalutation}</p>
              <div className="space-y-3">
                {paragraphs.map((paragraph: string, i: number) => (
                  <p key={i} className="text-[12px] leading-[1.6] text-[var(--color-text-muted)]">{paragraph.trim()}</p>
                ))}
              </div>
              <div className="mt-8">
                <p className="text-[13px] text-[var(--color-text)]">{letter.closing}</p>
                <p className="mt-8 text-[13px] font-bold text-[var(--color-text)]">{letter.senderName}</p>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Default: CV preview
  const cv = await payload.findGlobal({ slug: 'cv', draft: true })

  return (
    <>
      <div className="bg-yellow-500 text-black text-center py-2 text-sm font-bold print-hidden">
        PREVIEW - Draft-Version (nicht veröffentlicht)
      </div>
      <main className="flex justify-center py-8 print:py-0">
        <div className="cv-page flex w-full max-w-[260mm] min-h-[297mm] flex-col print:w-[210mm] print:shadow-none">
          <Header
            name={cv.name || ''}
            title={cv.title || ''}
            email={cv.email || ''}
            phone={cv.phone || ''}
            linkedin={cv.linkedin || ''}
            profileImage={typeof cv.profileImage === 'object' && cv.profileImage?.url ? cv.profileImage.url : null}
          />
          <div className="hidden md:flex flex-1">
            <div className="flex w-[36%] shrink-0 flex-col px-6 pb-6 pt-5 space-y-5">
              <AboutSection summary={cv.summary || ''} />
              <SkillsSection data={{
                summary: cv.summary || '',
                skillMaxDots: cv.skillMaxDots ?? 5,
                skills: (cv.skills || []).map((s: any) => ({ name: s.name || '', level: s.level ?? 0 })),
                languages: (cv.languages || []).map((l: any) => ({ name: l.name || '', level: l.level || '' })),
                education: (cv.education || []).map((e: any) => ({ institution: e.institution || '', degree: e.degree || '', startDate: e.startDate || '', endDate: e.endDate || '' })),
                certificates: (cv.certificates || []).map((c: any) => ({ name: c.name || '', issuer: c.issuer || '', date: c.date || '', status: c.status || '' })),
              }} />
            </div>
            <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
              <ExperienceSection experience={cv.experience || []} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

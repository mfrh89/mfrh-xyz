'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { Header } from '@/components/Header'

type CoverLetterData = {
  recipientSalutation: string
  body: string
  closing: string
  senderName: string
}

type CVData = {
  name: string
  title: string
  email: string
  phone: string
  linkedin: string
  profileImage: { url?: string } | string | null
  logo: { url?: string } | string | null
}

export function LiveCoverLetter({
  initialData,
  cvData,
  serverURL,
}: {
  initialData: CoverLetterData
  cvData: CVData
  serverURL: string
}) {
  const { data: letter } = useLivePreview<CoverLetterData>({
    initialData,
    serverURL,
    depth: 1,
  })

  const paragraphs = (letter.body || '').split('\n\n').filter((p: string) => p.trim())
  const profileImage = typeof cvData.profileImage === 'object' && cvData.profileImage?.url ? cvData.profileImage.url : null

  return (
    <main className="flex justify-center py-8 print:py-0">
      <div className="cover-letter-page flex w-[260mm] min-h-[297mm] flex-col print:w-[210mm] print:shadow-none">
        <Header
          name={cvData.name || ''}
          title={cvData.title || ''}
          email={cvData.email || ''}
          phone={cvData.phone || ''}
          linkedin={cvData.linkedin || ''}
          profileImage={profileImage}
          logo={typeof cvData.logo === 'object' && cvData.logo?.url ? cvData.logo.url : null}
        />

        <div className="flex-1 px-6 pb-6 pt-5">
          <div className="mb-5">
            <h2 className="text-[14px] font-bold tracking-[-0.05em] uppercase text-[var(--color-text)]">
              Anschreiben
            </h2>
            <div className="mt-1 h-px w-full bg-[var(--color-rule)]" />
          </div>

          <p className="mb-4 text-[13px] text-[var(--color-text)]">
            {letter.recipientSalutation}
          </p>

          <div className="space-y-3">
            {paragraphs.map((paragraph: string, i: number) => (
              <p key={i} className="text-[12px] leading-[1.6] text-[var(--color-text-muted)]">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-[13px] text-[var(--color-text)]">
              {letter.closing}
            </p>
            <p className="mt-8 text-[13px] font-bold text-[var(--color-text)]">
              {letter.senderName}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

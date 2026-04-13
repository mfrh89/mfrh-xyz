import { Header } from '@/components/Header'
import { getMediaProps } from '@/lib/media'
import type { CVData, CoverLetterData } from '@/lib/types'

export function CoverLetterDocument({
  letter,
  cv,
  serverURL,
}: {
  letter: Pick<CoverLetterData, 'recipientSalutation' | 'body' | 'closing' | 'senderName'>
  cv: CVData
  serverURL: string
}) {
  const profileImage = getMediaProps(cv.profileImage, serverURL)?.src || null
  const logo = getMediaProps(cv.logo, serverURL)?.src || null
  const paragraphs = (letter.body || '').split('\n\n').filter((paragraph) => paragraph.trim())

  return (
    <div className="cover-letter-page flex w-full max-w-[260mm] min-h-[297mm] flex-col break-words print:w-[210mm] print:shadow-none">
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
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[12px] leading-[1.6] text-[var(--color-text-muted)]">
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
  )
}

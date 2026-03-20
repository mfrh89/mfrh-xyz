import { getCV, getCoverLetter } from '@/lib/payload'
import { Header } from '@/components/Header'
import { PrintButton } from '@/components/PrintButton'
import Link from 'next/link'

export default async function CoverLetterPage() {
  const cv = await getCV()
  const letter = await getCoverLetter()

  const paragraphs = (letter.body || '').split('\n\n').filter((p: string) => p.trim())

  return (
    <>
      {/* Navigation */}
      <nav className="print-hidden flex items-center justify-center gap-6 bg-white py-3 shadow-sm">
        <Link href="/" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
          CV
        </Link>
        <Link href="/cover-letter" className="text-xs font-bold text-[var(--color-text)] underline underline-offset-4">
          Anschreiben
        </Link>
      </nav>

      {/* Cover Letter Page */}
      <main className="flex justify-center py-8 print:py-0">
        <div className="cover-letter-page flex w-[260mm] min-h-[297mm] flex-col print:w-[210mm] print:shadow-none">
          {/* ── Full-width Header (same as CV) ── */}
          <Header
            name={cv.name || ''}
            title={cv.title || ''}
            email={cv.email || ''}
            phone={cv.phone || ''}
            linkedin={cv.linkedin || ''}
            profileImage={typeof cv.profileImage === 'object' && cv.profileImage?.url ? cv.profileImage.url : null}
          />

          {/* Content */}
          <div className="flex-1 px-6 pb-6 pt-5">
            {/* Section Title */}
            <div className="mb-5">
              <h2 className="text-[14px] font-bold tracking-[-0.05em] uppercase text-[var(--color-text)]">
                Anschreiben
              </h2>
              <div className="mt-1 h-px w-full bg-[var(--color-rule)]" />
            </div>

            {/* Salutation */}
            <p className="mb-4 text-[13px] text-[var(--color-text)]">
              {letter.recipientSalutation}
            </p>

            {/* Body */}
            <div className="space-y-3">
              {paragraphs.map((paragraph: string, i: number) => (
                <p
                  key={i}
                  className="text-[12px] leading-[1.6] text-[var(--color-text-muted)]"
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {/* Closing */}
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

      <PrintButton />
    </>
  )
}

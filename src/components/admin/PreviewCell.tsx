'use client'

import type { DefaultCellComponentProps } from 'payload'

export default function PreviewCell({ rowData }: DefaultCellComponentProps) {
  const id = rowData?.id
  if (!id) return null

  return (
    <a
      href={`/preview?collection=cover-letters&id=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Draft Preview"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--theme-text)',
        opacity: 0.6,
        transition: 'opacity 150ms',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
      onClick={(e) => e.stopPropagation()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  )
}

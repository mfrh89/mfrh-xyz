'use client'

import { useState } from 'react'
import { useField, useAllFormFields } from '@payloadcms/ui'

export default function AIGenerate({ hint }: { hint?: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { value, setValue, path } = useField<string>({ path: '' })
  const [fields] = useAllFormFields()

  const fieldName = path.split('.').pop() || path

  const handleGenerate = async (mode: 'generate' | 'rewrite') => {
    setLoading(true)
    setError(null)

    // Build context from sibling form fields
    const context: Record<string, unknown> = {}
    for (const [key, field] of Object.entries(fields)) {
      if (key !== path && field?.value != null && field.value !== '') {
        const label = key.split('.').pop() || key
        context[label] = field.value
      }
    }

    try {
      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fieldName,
          currentValue: mode === 'rewrite' ? value : undefined,
          context,
          hint,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Unknown error')
        return
      }

      if (data.text) {
        setValue(data.text)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const hasValue = typeof value === 'string' && value.trim().length > 0

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px',
      }}
    >
      <button
        type="button"
        onClick={() => handleGenerate(hasValue ? 'rewrite' : 'generate')}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '13px',
          fontWeight: 500,
          borderRadius: '6px',
          border: '1px solid var(--theme-elevation-150)',
          background: 'var(--theme-elevation-50)',
          color: 'var(--theme-text)',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'opacity 150ms',
        }}
      >
        {loading ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        )}
        {loading ? 'Generating...' : hasValue ? 'AI Rewrite' : 'AI Generate'}
      </button>

      {error && (
        <span style={{ fontSize: '12px', color: 'var(--theme-error-500)' }}>
          {error}
        </span>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

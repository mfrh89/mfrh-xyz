'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useField, useAllFormFields } from '@payloadcms/ui'

type OpenRouterModel = {
  id: string
  name: string
  pricing?: { prompt?: string; completion?: string }
  context_length?: number
}

function formatPrice(perToken: string | undefined): string {
  if (!perToken) return '—'
  const val = parseFloat(perToken)
  if (isNaN(val) || val === 0) return 'free'
  const perMillion = val * 1_000_000
  if (perMillion < 0.01) return '<$0.01/M'
  if (perMillion < 1) return `$${perMillion.toFixed(2)}/M`
  return `$${perMillion.toFixed(2)}/M`
}

export default function ModelSelect() {
  const { value, setValue } = useField<string>({ path: '' })
  const [fields] = useAllFormFields()
  const [models, setModels] = useState<OpenRouterModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const apiKey = fields?.openrouterApiKey?.value as string | undefined

  useEffect(() => {
    if (!apiKey) {
      setModels([])
      return
    }

    setLoading(true)
    setError(null)

    fetch('https://openrouter.ai/api/v1/models')
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.data || [])
          .sort((a: OpenRouterModel, b: OpenRouterModel) => a.id.localeCompare(b.id))
        setModels(sorted)
      })
      .catch(() => setError('Failed to load models'))
      .finally(() => setLoading(false))
  }, [apiKey])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = useMemo(() => {
    if (!search) return models
    const q = search.toLowerCase()
    return models.filter(
      (m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q),
    )
  }, [models, search])

  const selectedModel = models.find((m) => m.id === value)

  if (!apiKey) {
    return (
      <div style={{ marginBottom: 24 }}>
        <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>
          OpenRouter Model
        </label>
        <div
          style={{
            padding: '10px 14px',
            fontSize: 13,
            color: 'var(--theme-elevation-400)',
            background: 'var(--theme-elevation-50)',
            borderRadius: 4,
            border: '1px solid var(--theme-elevation-150)',
          }}
        >
          Enter an API key first to load available models.
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} style={{ marginBottom: 24, position: 'relative' }}>
      <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>
        OpenRouter Model
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: 13,
          textAlign: 'left',
          background: 'var(--theme-input-bg, var(--theme-elevation-0))',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 4,
          color: 'var(--theme-text)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>
            {loading
              ? 'Loading models...'
              : selectedModel
                ? selectedModel.id
                : value || 'Select a model...'}
          </span>
          {selectedModel?.pricing && (
            <span style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>
              In: {formatPrice(selectedModel.pricing.prompt)} · Out: {formatPrice(selectedModel.pricing.completion)}
            </span>
          )}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>

      {error && (
        <span style={{ fontSize: 12, color: 'var(--theme-error-500)', marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'var(--theme-elevation-0)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            maxHeight: 320,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: 8, borderBottom: '1px solid var(--theme-elevation-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 6px 6px', fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>Model</span>
              <span>Input / Output per 1M tokens</span>
            </div>
            <input
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: 13,
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: 4,
                background: 'var(--theme-elevation-50)',
                color: 'var(--theme-text)',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 260 }}>
            {filtered.length === 0 && (
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--theme-elevation-400)' }}>
                No models found
              </div>
            )}
            {filtered.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  setValue(model.id)
                  setOpen(false)
                  setSearch('')
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 14px',
                  fontSize: 13,
                  textAlign: 'left',
                  border: 'none',
                  background: model.id === value ? 'var(--theme-elevation-100)' : 'transparent',
                  color: 'var(--theme-text)',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--theme-elevation-50)',
                }}
                onMouseEnter={(e) => {
                  if (model.id !== value) e.currentTarget.style.background = 'var(--theme-elevation-50)'
                }}
                onMouseLeave={(e) => {
                  if (model.id !== value) e.currentTarget.style.background = 'transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: model.id === value ? 600 : 400 }}>{model.id}</span>
                  {model.pricing && (
                    <span style={{ fontSize: 11, color: 'var(--theme-elevation-400)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {formatPrice(model.pricing.prompt)} / {formatPrice(model.pricing.completion)}
                    </span>
                  )}
                </div>
                {(model.name !== model.id || model.context_length) && (
                  <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)', marginTop: 2 }}>
                    {model.name !== model.id ? model.name : ''}
                    {model.name !== model.id && model.context_length ? ' · ' : ''}
                    {model.context_length ? `${Math.round(model.context_length / 1000)}k ctx` : ''}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: 'var(--theme-elevation-400)', marginTop: 6 }}>
        {models.length > 0 ? `${models.length} models available` : ''}
      </div>
    </div>
  )
}

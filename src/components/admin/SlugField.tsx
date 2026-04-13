'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useField, useFormFields, TextInput, FieldLabel } from '@payloadcms/ui'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function SlugField() {
  const { value, setValue } = useField<string>({ path: 'slug' })
  const titleField = useFormFields(([fields]) => fields.title)
  const titleValue = (titleField?.value as string) || ''
  const manuallyEdited = useRef(false)
  const prevTitle = useRef(titleValue)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      manuallyEdited.current = true
      setValue(e.target.value)
    },
    [setValue],
  )

  useEffect(() => {
    if (titleValue !== prevTitle.current) {
      prevTitle.current = titleValue
      if (!manuallyEdited.current && titleValue) {
        setValue(slugify(titleValue))
      }
    }
  }, [titleValue, setValue])

  return (
    <div className="field-type text">
      <FieldLabel label="Slug" path="slug" />
      <TextInput
        path="slug"
        value={value || ''}
        onChange={handleChange}
        description="Auto-generated from title. Edit to override."
      />
    </div>
  )
}

const MONTH_MAP: Record<string, number> = {
  januar: 0, february: 1, februar: 1, march: 2, märz: 2, april: 3,
  mai: 4, may: 4, juni: 5, june: 5, juli: 6, july: 6, august: 7,
  september: 8, oktober: 9, october: 9, november: 10, dezember: 11, december: 11,
}

function parseMonthYear(value: string): Date | null {
  const parts = value.trim().toLowerCase().split(/\s+/)
  if (parts.length < 2) return null
  const month = MONTH_MAP[parts[0]]
  const year = parseInt(parts[1], 10)
  if (month == null || isNaN(year)) return null
  return new Date(year, month)
}

export function calcDuration(entry: { startDate?: string | null; endDate?: string | null }): string | null {
  if (!entry.startDate) return null
  const start = parseMonthYear(entry.startDate)
  if (!start) return null
  const end = entry.endDate?.toLowerCase() === 'heute' || entry.endDate?.toLowerCase() === 'present'
    ? new Date()
    : entry.endDate ? parseMonthYear(entry.endDate) : new Date()
  if (!end) return null
  const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (years > 0 && months > 0) return `${years} ${years === 1 ? 'Jahr' : 'Jahre'}, ${months} ${months === 1 ? 'Monat' : 'Monate'}`
  if (years > 0) return `${years} ${years === 1 ? 'Jahr' : 'Jahre'}`
  return `${months} ${months === 1 ? 'Monat' : 'Monate'}`
}

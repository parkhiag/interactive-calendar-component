import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
} from 'date-fns'

export function getCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  return eachDayOfInterval({ start, end })
}

export function isInMonth(date: Date, month: Date): boolean {
  return isSameMonth(date, month)
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function getOrderedRange(a: Date, b: Date) {
  return a <= b
    ? { start: a, end: b }
    : { start: b, end: a }
}

export function isRangeStart(
  date: Date,
  start: Date | null,
  end?: Date | null
): boolean {
  if (!start) return false
  if (!end) return isSameDay(date, start)

  const { start: realStart } = getOrderedRange(start, end)
  return isSameDay(date, realStart)
}

export function isRangeEnd(
  date: Date,
  end: Date | null,
  start?: Date | null
): boolean {
  if (!end) return false
  if (!start) return isSameDay(date, end)

  const { end: realEnd } = getOrderedRange(start, end)
  return isSameDay(date, realEnd)
}

export function isInRange(
  date: Date,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start || !end) return false

  const { start: realStart, end: realEnd } = getOrderedRange(start, end)

  return (
    isWithinInterval(date, { start: realStart, end: realEnd }) &&
    !isSameDay(date, realStart) &&
    !isSameDay(date, realEnd)
  )
}

export function isHoverPreview(
  date: Date,
  start: Date | null,
  hover: Date | null,
  selectionStep: 0 | 1
): boolean {
  if (selectionStep !== 1 || !start || !hover) return false

  const { start: realStart, end: realEnd } = getOrderedRange(start, hover)

  return (
    isWithinInterval(date, { start: realStart, end: realEnd }) &&
    !isSameDay(date, realStart)
  )
}

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
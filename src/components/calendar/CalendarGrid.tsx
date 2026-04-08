import React, { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { useCalendarStore } from '../../store/calendarStore'
import { DayCell } from './DayCell'
import { MonthHeader } from './MonthHeader'
import {
  getCalendarDays,
  isInMonth,
  isToday,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isHoverPreview,
  WEEKDAYS,
} from '../../lib/calendarUtils'

export function CalendarGrid() {
  const {
    currentMonth,
    selectedStart,
    selectedEnd,
    hoverDate,
    selectionStep,
    handleDayClick,
    setHoverDate,
    hasNotesOnDate,
    clearSelection,
    nextMonth,
    prevMonth,
  } = useCalendarStore()

  const days = getCalendarDays(currentMonth)
  const monthKey = format(currentMonth, 'yyyy-MM')

  const handleMouseLeave = useCallback(() => {
    if (selectionStep === 1) {
      setHoverDate(null)
    }
  }, [selectionStep, setHoverDate])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tagName = target?.tagName

      const isTyping =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        target?.isContentEditable

      if (isTyping) return

      if (e.key === 'Escape') {
        clearSelection()
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevMonth()
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextMonth()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [clearSelection, nextMonth, prevMonth])

  return (
    <div className="flex flex-col">
      {/* Punch holes */}
      <div className="flex justify-around px-8 mb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="punch-hole" />
        ))}
      </div>

      {/* Red binding line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent mb-4" />

      <MonthHeader />

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center py-1">
            <span
              className={`text-[10px] font-mono tracking-wider uppercase ${
                d === 'Sun' ? 'text-[var(--accent-dark)]' : 'text-stone-400'
              }`}
            >
              {d}
            </span>
          </div>
        ))}
      </div>

      {/* Days grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-7 gap-y-1"
          onMouseLeave={handleMouseLeave}
        >
          {days.map((day) => (
            <DayCell
              key={day.toISOString()}
              date={day}
              isCurrentMonth={isInMonth(day, currentMonth)}
              isToday={isToday(day)}
              isRangeStart={isRangeStart(day, selectedStart)}
              isRangeEnd={isRangeEnd(day, selectedEnd)}
              isInRange={isInRange(day, selectedStart, selectedEnd)}
              isHoverPreview={isHoverPreview(day, selectedStart, hoverDate, selectionStep)}
              hasNotes={hasNotesOnDate(day)}
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => {
                if (selectionStep === 1 && !selectedEnd) {
                  setHoverDate(day)
                }
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="text-center mt-4 space-y-1">
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-[10px] font-mono text-stone-400"
  >
    {selectionStep === 0 && !selectedStart && 'Click a date to begin a range'}
    {selectionStep === 1 && 'Click another date to complete the range'}
    {selectionStep === 0 && selectedStart && selectedEnd && (
      <span className="text-[var(--accent)]">
        {format(selectedStart, 'MMM d')} → {format(selectedEnd, 'MMM d, yyyy')}
      </span>
    )}
    {selectionStep === 0 && selectedStart && !selectedEnd && (
      <span className="text-[var(--accent)]">
        {format(selectedStart, 'MMM d, yyyy')}
      </span>
    )}
  </motion.p>

  {selectionStep === 0 && !selectedStart && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-[9px] text-stone-300"
    >
      Press <span className="font-mono bg-stone-200 px-1 rounded">Esc</span> to clear range
    </motion.p>
  )}
</div>
    </div>
  )
}
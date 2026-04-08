import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import clsx from 'clsx'
import { getHolidayForDate } from '../../lib/holidays'

interface DayCellProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isInRange: boolean
  isHoverPreview: boolean
  hasNotes: boolean
  onClick: () => void
  onMouseEnter: () => void
}

export const DayCell = memo(function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isHoverPreview,
  hasNotes,
  onClick,
  onMouseEnter,
}: DayCellProps) {
  const holiday = getHolidayForDate(date)
  const isSelected = isRangeStart || isRangeEnd
  const isSunday = date.getDay() === 0
  const isSaturday = date.getDay() === 6

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Select ${format(date, 'MMMM d, yyyy')}`}
      className={clsx(
        'relative flex flex-col items-center py-0.5 cursor-pointer select-none group outline-none',
        // Final selected range strip
        isInRange && 'bg-[var(--accent-light)]/40',
        // Live hover preview strip
        isHoverPreview && !isInRange && 'bg-[var(--accent-light)]/20',
        // Start/end caps
        isRangeStart && 'rounded-l-full',
        isRangeEnd && 'rounded-r-full',
        // Outside current month
        !isCurrentMonth && 'opacity-25',
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Day number */}
      <motion.div
        whileHover={{ scale: isSelected ? 1 : 1.12 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={clsx(
          'relative z-10 w-8 h-8 flex items-center justify-center rounded-full',
          'text-sm font-body transition-colors duration-150',
          // Default
          !isSelected &&
            !isToday &&
            'text-stone-700 group-hover:bg-[var(--accent-light)]/60',
          // Today
          isToday && !isSelected && 'bg-stone-800 text-cream-50 font-medium',
          // Selected start/end
          isSelected && 'bg-[var(--accent)] text-white font-semibold shadow-md',
          // Weekend
          !isSelected && !isToday && isSunday && 'text-[var(--accent-dark)]',
          !isSelected && !isToday && isSaturday && 'text-[var(--accent-dark)]/70',
        )}
      >
        {format(date, 'd')}

        {/* Note dot */}
        {hasNotes && !isSelected && (
          <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-80" />
        )}
      </motion.div>

      {/* Holiday label */}
      {holiday && (
        <span className="text-[8px] leading-tight font-mono text-[var(--accent-dark)] opacity-70 mt-0.5 text-center px-0.5 truncate max-w-full">
          {holiday.name}
        </span>
      )}
    </div>
  )
})
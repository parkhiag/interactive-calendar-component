import React from 'react'
import { motion } from 'framer-motion'
import { format, isSameMonth } from 'date-fns'
import { useCalendarStore } from '../../store/calendarStore'

export function MonthHeader() {
  const { currentMonth, nextMonth, prevMonth, goToToday } = useCalendarStore()
  const isCurrentRealMonth = isSameMonth(currentMonth, new Date())

  return (
    <div className="flex items-center justify-between px-2 mb-4">
      {/* Prev */}
      <motion.button
        type="button"
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.88 }}
        onClick={prevMonth}
        className="w-9 h-9 flex items-center justify-center rounded-full text-stone-500 hover:bg-stone-200/60 hover:text-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
        aria-label="Previous month"
        title="Previous month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      {/* Month + Year */}
      <div className="text-center">
        <motion.h2
          key={format(currentMonth, 'yyyy-MM')}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="font-display text-2xl font-semibold text-stone-800 leading-none"
        >
          {format(currentMonth, 'MMMM')}
        </motion.h2>

        <motion.p
          key={`year-${format(currentMonth, 'yyyy')}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-xs text-stone-400 tracking-widest mt-0.5"
        >
          {format(currentMonth, 'yyyy')}
        </motion.p>
      </div>

      {/* Today + Next */}
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={goToToday}
          disabled={isCurrentRealMonth}
          className="px-3 h-9 rounded-full text-sm font-medium text-stone-700 bg-stone-200/60 hover:bg-stone-300/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          aria-label="Go to today"
          title="Go to today"
        >
          Today
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.88 }}
          onClick={nextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full text-stone-500 hover:bg-stone-200/60 hover:text-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          aria-label="Next month"
          title="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
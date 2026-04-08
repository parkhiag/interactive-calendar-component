import React from 'react'
import { motion } from 'framer-motion'
import { HeroPanel } from './components/ui/HeroPanel'
import { CalendarGrid } from './components/calendar/CalendarGrid'
import { NotesPanel } from './components/notes/NotesPanel'
import { useCalendarStore } from './store/calendarStore'

const MONTH_ABBR = ['J','F','M','A','M','J','J','A','S','O','N','D']

function QuickMonthDot({ month }: { month: number }) {
  const { currentMonth, goToMonth } = useCalendarStore()
  const isActive = currentMonth.getMonth() + 1 === month

  return (
    <motion.button
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.85 }}
      onClick={() => goToMonth(new Date(currentMonth.getFullYear(), month - 1, 1))}
      className={`w-5 h-5 flex items-center justify-center rounded-full text-[8px] font-mono transition-all
        ${isActive
          ? 'bg-[var(--accent)] text-white shadow-sm'
          : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
        }`}
      title={new Date(2024, month - 1, 1).toLocaleString('default', { month: 'long' })}
    >
      {MONTH_ABBR[month - 1]}
    </motion.button>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream-200 flex items-center justify-center p-4 md:p-8">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent-light)]/25 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-stone-300/30 blur-[80px]" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full bg-cream-400/20 blur-[60px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl"
      >
        {/* Calendar card */}
        <div className="relative bg-cream-100 rounded-3xl shadow-paper-lg overflow-hidden paper-texture">

          {/* Top binding strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-dark)]/60 via-[var(--accent)] to-[var(--accent-dark)]/60 z-10" />

          <div className="flex flex-col md:flex-row">

            {/* ── Left: Hero Image panel ── */}
            <div className="w-full md:w-[38%] flex-shrink-0 p-4 pb-0 md:p-5 md:pr-0">
              <div className="h-56 sm:h-64 md:h-full md:min-h-[560px]">
                <HeroPanel />
              </div>
            </div>

            {/* ── Right: Calendar + Notes ── */}
            <div className="flex-1 flex flex-col sm:flex-row">

              {/* Calendar grid */}
              <div className="flex-1 px-5 pt-6 pb-4 md:px-7 md:pt-8 md:pb-6">
                <CalendarGrid />
              </div>

              {/* Vertical divider (desktop) */}
              <div className="hidden sm:block w-px bg-stone-200/50 my-6 flex-shrink-0" />

              {/* Horizontal divider (mobile) */}
              <div className="sm:hidden h-px bg-stone-200/50 mx-5" />

              {/* Notes panel */}
              <div className="w-full sm:w-48 md:w-52 lg:w-56 flex-shrink-0 px-4 pt-4 pb-5 sm:px-4 sm:pt-6 md:px-5 md:pt-8 md:pb-6 bg-white/20">
                <NotesPanel />
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div className="flex items-center justify-between px-5 md:px-6 py-2.5 border-t border-stone-200/50 bg-stone-50/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[var(--accent)]/15 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" stroke="var(--accent)" strokeWidth="1"/>
                  <path d="M3 0.5V2M7 0.5V2" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M0.5 3.5h9" stroke="var(--accent)" strokeWidth="0.75"/>
                </svg>
              </div>
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-stone-300">
                Wall Calendar
              </span>
            </div>

            {/* Quick month nav dots */}
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <QuickMonthDot key={m} month={m} />
              ))}
            </div>
          </div>
        </div>

        {/* Hanging shadow layers */}
        <div className="mx-6 h-2.5 rounded-b-2xl bg-black/[0.06] blur-sm" />
        <div className="mx-12 h-2 rounded-b-xl bg-black/[0.04] blur-sm" />
      </motion.div>
    </div>
  )
}

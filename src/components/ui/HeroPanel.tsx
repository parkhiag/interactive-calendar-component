import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { useCalendarStore } from '../../store/calendarStore'

const PRESET_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    label: 'Alpine Summit',
  },
  {
    url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
    label: 'Lake Reflections',
  },
  {
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    label: 'Forest Mist',
  },
  {
    url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc81?w=800&q=80',
    label: 'Spring Bloom',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    label: 'Golden Shore',
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    label: 'Winter Peak',
  },
]

export function HeroPanel() {
  const { heroImage, setHeroImage, currentMonth } = useCalendarStore()
  const [showPicker, setShowPicker] = useState(false)
  const [customUrl, setCustomUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showPicker && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showPicker])

  const applyCustomImage = () => {
    if (!customUrl.trim()) return
    setHeroImage(customUrl.trim())
    setCustomUrl('')
    setShowPicker(false)
  }

  return (
    <div className="relative w-full h-full min-h-[220px] overflow-hidden rounded-2xl md:rounded-3xl">
      {/* Main image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={heroImage}
          src={heroImage}
          alt="Calendar hero"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />

      {/* Month label overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <motion.p
          key={`hero-month-${format(currentMonth, 'yyyy-MM')}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 mb-1"
        >
          {format(currentMonth, 'yyyy')}
        </motion.p>

        <motion.h1
          key={`hero-title-${format(currentMonth, 'yyyy-MM')}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl md:text-4xl font-semibold text-white leading-none tracking-tight"
        >
          {format(currentMonth, 'MMMM')}
        </motion.h1>
      </div>

      {/* Image picker toggle */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setShowPicker((prev) => !prev)}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-colors z-30"
        aria-label="Change image"
        title="Change image"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M8 7l1.5-1.5L11 7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      {/* Image picker panel */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-3 w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-paper-lg p-3 z-20"
          >
            <p className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-2 px-1">
              Choose scene
            </p>

            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => {
                    setHeroImage(img.url)
                    setShowPicker(false)
                  }}
                  className="relative group overflow-hidden rounded-lg aspect-video"
                  title={img.label}
                  aria-label={`Use ${img.label}`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {heroImage === img.url && (
                    <div className="absolute inset-0 ring-2 ring-[var(--accent)] rounded-lg bg-[var(--accent)]/20" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Paste image URL…"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 text-xs bg-stone-100 rounded-lg px-2 py-1.5 outline-none text-stone-600 placeholder-stone-300 focus:bg-stone-50"
                onKeyDown={(e) => {
                  e.stopPropagation()

                  if (e.key === 'Enter') {
                    e.preventDefault()
                    applyCustomImage()
                  }
                }}
              />

              <button
                type="button"
                onClick={applyCustomImage}
                className="text-xs bg-[var(--accent)] text-white px-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Set
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {showPicker && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowPicker(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
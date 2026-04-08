import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isSameDay } from 'date-fns'
import { useCalendarStore, Note } from '../../store/calendarStore'

function NoteItem({ note, onDelete, onEdit }: {
  note: Note
  onDelete: () => void
  onEdit: (text: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(note.text)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && taRef.current) {
      taRef.current.focus()
      taRef.current.select()
    }
  }, [isEditing])

  const commit = () => {
    if (draft.trim()) {
      onEdit(draft.trim())
    }
    setIsEditing(false)
  }

  const start = new Date(note.startDate)
  const end = new Date(note.endDate)
  const isSingle = isSameDay(start, end)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.22 }}
      className="group relative rounded-xl overflow-hidden"
      style={{ borderLeft: `3px solid ${note.color}` }}
    >
      <div className="bg-white/70 backdrop-blur-sm px-3 py-2.5">
        {/* Date label */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
            {isSingle
              ? format(start, 'MMM d, yyyy')
              : `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
            }
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
              aria-label="Edit note"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8.5 1.5l2 2L3 11H1V9L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="text-stone-400 hover:text-red-500 p-0.5 rounded transition-colors"
              aria-label="Delete note"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M4.5 3V2h3v1M5 5.5v3M7 5.5v3M3 3l.7 7h4.6L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {isEditing ? (
          <textarea
            ref={taRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit() }
              if (e.key === 'Escape') { setDraft(note.text); setIsEditing(false) }
            }}
            rows={2}
            className="w-full text-sm text-stone-700 bg-transparent resize-none outline-none font-body leading-relaxed"
          />
        ) : (
          <p
            className="text-sm text-stone-700 leading-relaxed font-body cursor-text"
            onDoubleClick={() => setIsEditing(true)}
          >
            {note.text}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export function NotesPanel() {
  const {
    selectedStart,
    selectedEnd,
    currentMonth,
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForRange,
    clearSelection,
  } = useCalendarStore()

  const [newText, setNewText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Determine context
  const hasSelection = selectedStart !== null
  const rangeStart = selectedStart ?? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const rangeEnd = selectedEnd ?? selectedStart ?? new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

  const contextNotes = hasSelection
    ? getNotesForRange(rangeStart, rangeEnd)
    : notes.filter(n => {
        const ns = new Date(n.startDate)
        return ns.getFullYear() === currentMonth.getFullYear() &&
               ns.getMonth() === currentMonth.getMonth()
      })

  const handleAdd = () => {
    if (!newText.trim()) return
    addNote({
      text: newText.trim(),
      startDate: rangeStart.toISOString(),
      endDate: rangeEnd.toISOString(),
      color: '',
    })
    setNewText('')
  }

  const contextLabel = hasSelection && selectedStart
    ? (selectedEnd && !isSameDay(selectedStart, selectedEnd)
        ? `${format(selectedStart, 'MMM d')} – ${format(selectedEnd, 'MMM d')}`
        : format(selectedStart, 'MMMM d, yyyy'))
    : format(currentMonth, 'MMMM yyyy')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-base font-semibold text-stone-800 leading-none">Notes</h3>
          <p className="text-[10px] font-mono text-stone-400 mt-0.5 tracking-wide">{contextLabel}</p>
        </div>
        {hasSelection && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={clearSelection}
            className="text-[10px] font-mono text-stone-400 hover:text-[var(--accent)] px-2 py-1 rounded-full hover:bg-[var(--accent-light)]/30 transition-colors"
          >
            clear ×
          </motion.button>
        )}
      </div>

      {/* Add note input */}
      <div className="relative mb-3">
        <textarea
          ref={inputRef}
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() }
          }}
          placeholder={`Add a note for ${hasSelection ? 'this range' : 'this month'}…`}
          rows={2}
          className="w-full text-sm bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl px-3 py-2.5 resize-none outline-none text-stone-700 placeholder-stone-300 focus:border-[var(--accent)]/50 focus:bg-white/80 transition-all font-body leading-relaxed"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="absolute right-2 bottom-2 w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--accent)] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shadow-sm"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </motion.button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        <AnimatePresence initial={false}>
          {contextNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 4h12M3 8h8M3 12h6" stroke="#c9b99a" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-xs font-body text-stone-400 max-w-[140px] text-balance">
                {hasSelection ? 'No notes for this selection' : 'No notes this month'}
              </p>
            </motion.div>
          ) : (
            contextNotes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={() => deleteNote(note.id)}
                onEdit={(text) => updateNote(note.id, text)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Note count */}
      {contextNotes.length > 0 && (
        <p className="text-[9px] font-mono text-stone-300 text-right mt-2">
          {contextNotes.length} note{contextNotes.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}




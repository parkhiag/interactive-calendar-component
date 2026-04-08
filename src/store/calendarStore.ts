import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { startOfMonth, isSameDay, isWithinInterval, min, max } from 'date-fns'

export interface Note {
  id: string
  text: string
  startDate: string // ISO string
  endDate: string   // ISO string
  color: string
  createdAt: string
}

export interface CalendarState {
  currentMonth: Date
  selectedStart: Date | null
  selectedEnd: Date | null
  hoverDate: Date | null
  notes: Note[]
  heroImage: string
  selectionStep: 0 | 1 // 0 = no selection, 1 = start selected

  // Actions
  goToMonth: (date: Date) => void
  nextMonth: () => void
  prevMonth: () => void
  goToToday: () => void
  handleDayClick: (date: Date) => void
  setHoverDate: (date: Date | null) => void
  clearSelection: () => void
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void
  updateNote: (id: string, text: string) => void
  deleteNote: (id: string) => void
  setHeroImage: (url: string) => void
  getNotesForRange: (start: Date, end: Date) => Note[]
  hasNotesOnDate: (date: Date) => boolean
}

const NOTE_COLORS = [
  '#c2714f', '#5b8a6e', '#5b7fa6', '#a0567a', '#7a7040'
]

let noteColorIndex = 0

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      currentMonth: startOfMonth(new Date()),
      selectedStart: null,
      selectedEnd: null,
      hoverDate: null,
      selectionStep: 0,
      notes: [],
      heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',

      goToMonth: (date) => set({ currentMonth: startOfMonth(date) }),

      nextMonth: () => {
        const { currentMonth } = get()
        const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        set({ currentMonth: next })
      },

      prevMonth: () => {
        const { currentMonth } = get()
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        set({ currentMonth: prev })
      },

      goToToday: () => set({ currentMonth: startOfMonth(new Date()) }),

      handleDayClick: (date) => {
        const { selectionStep, selectedStart } = get()

        if (selectionStep === 0) {
          set({ selectedStart: date, selectedEnd: null, selectionStep: 1 })
        } else if (selectionStep === 1) {
          if (selectedStart && isSameDay(date, selectedStart)) {
            set({ selectedEnd: date, selectionStep: 0 })
          } else {
            const start = selectedStart!
            const realStart = min([start, date])
            const realEnd = max([start, date])
            set({ selectedStart: realStart, selectedEnd: realEnd, selectionStep: 0 })
          }
        }
      },

      setHoverDate: (date) => set({ hoverDate: date }),

      clearSelection: () =>
        set({
          selectedStart: null,
          selectedEnd: null,
          hoverDate: null,
          selectionStep: 0,
        }),

      addNote: (note) => {
        const color = NOTE_COLORS[noteColorIndex % NOTE_COLORS.length]
        noteColorIndex++

        const newNote: Note = {
          ...note,
          id: `note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: new Date().toISOString(),
          color,
        }

        set((state) => ({ notes: [...state.notes, newNote] }))
      },

      updateNote: (id, text) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, text } : n)),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
      },

      setHeroImage: (url) => set({ heroImage: url }),

      getNotesForRange: (start, end) => {
        const { notes } = get()

        return notes.filter((n) => {
          const ns = new Date(n.startDate)
          const ne = new Date(n.endDate)

          return (
            isWithinInterval(ns, { start, end }) ||
            isWithinInterval(ne, { start, end }) ||
            (ns <= start && ne >= end)
          )
        })
      },

      hasNotesOnDate: (date) => {
        const { notes } = get()

        return notes.some((n) => {
          const ns = new Date(n.startDate)
          const ne = new Date(n.endDate)
          return isWithinInterval(date, { start: ns, end: ne })
        })
      },
    }),
    {
      name: 'wall-calendar-storage',
      partialize: (state) => ({
        notes: state.notes,
        heroImage: state.heroImage,
      }),
    }
  )
)
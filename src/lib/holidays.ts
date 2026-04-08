export interface Holiday {
  month: number  // 1-12
  day: number
  name: string
}

export const HOLIDAYS: Holiday[] = [
  { month: 1, day: 1, name: "New Year's Day" },
  { month: 1, day: 26, name: "Republic Day" },
  { month: 2, day: 14, name: "Valentine's Day" },
  { month: 3, day: 8, name: "Women's Day" },
  { month: 3, day: 17, name: "St. Patrick's Day" },
  { month: 4, day: 1, name: "April Fools'" },
  { month: 4, day: 14, name: "Baisakhi" },
  { month: 4, day: 18, name: "Good Friday" },
  { month: 4, day: 20, name: "Easter" },
  { month: 5, day: 1, name: "Labour Day" },
  { month: 5, day: 12, name: "Mother's Day" },
  { month: 6, day: 15, name: "Father's Day" },
  { month: 6, day: 21, name: "Summer Solstice" },
  { month: 8, day: 15, name: "Independence Day" },
  { month: 9, day: 5, name: "Teacher's Day" },
  { month: 10, day: 2, name: "Gandhi Jayanti" },
  { month: 10, day: 31, name: "Halloween" },
  { month: 11, day: 1, name: "Diwali" },
  { month: 12, day: 21, name: "Winter Solstice" },
  { month: 12, day: 25, name: "Christmas" },
  { month: 12, day: 31, name: "New Year's Eve" },
]

export function getHolidayForDate(date: Date): Holiday | null {
  return HOLIDAYS.find(h =>
    h.month === date.getMonth() + 1 && h.day === date.getDate()
  ) ?? null
}
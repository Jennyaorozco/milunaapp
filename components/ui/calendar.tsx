"use client"

import { useState } from "react"

interface CalendarProps {
  markedDays?: number[]
}

export function Calendar({ markedDays = [] }: CalendarProps) {
  const days = [
    [1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31],
  ]

  const [selectedDays, setSelectedDays] = useState<number[]>(markedDays)

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 text-center">
        {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
          <div key={i} className="text-xs font-medium text-pink-600">
            {day}
          </div>
        ))}
      </div>

      {days.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-1 mt-1">
          {weekIndex === 0 &&
            Array(7 - week.length)
              .fill(null)
              .map((_, i) => <div key={`empty-${i}`} className="h-8"></div>)}

          {week.map((day) => (
            <button
              key={day}
              className={`h-8 rounded-full flex items-center justify-center text-sm
                ${
                  selectedDays.includes(day) ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-800 hover:bg-pink-200"
                }`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

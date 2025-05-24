"use client"
import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

export function CalendarComponent() {
  const [value, setValue] = useState(new Date())

  return (
    <div className="rounded-xl overflow-hidden bg-white/90 p-4 shadow-md border border-pink-200 backdrop-blur-md">
      <Calendar
        onChange={setValue}
        value={value}
        locale="es-ES"
        className="!border-0 !bg-transparent [&_.react-calendar__tile--active]:!bg-pink-300 [&_.react-calendar__tile--active]:!text-white"
      />
    </div>
  )
}

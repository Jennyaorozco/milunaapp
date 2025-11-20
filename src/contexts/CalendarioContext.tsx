// contexts/CalendarioContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CalendarioData {
  fechaInicio: Date | null
  duracionPeriodo: number
  duracionCiclo: number
  proximoPeriodo: Date | null
  diasHastaPeriodo: number | null
  faseActual: string
}

interface CalendarioContextType {
  calendario: CalendarioData
  actualizarCalendario: (fechaInicio: Date, duracionPeriodo: number, duracionCiclo: number) => void
  calcularProximoPeriodo: () => void
}

const CalendarioContext = createContext<CalendarioContextType | undefined>(undefined)

export function CalendarioProvider({ children }: { children: ReactNode }) {
  const [calendario, setCalendario] = useState<CalendarioData>({
    fechaInicio: null,
    duracionPeriodo: 5,
    duracionCiclo: 28,
    proximoPeriodo: null,
    diasHastaPeriodo: null,
    faseActual: 'No configurado'
  })

  // ✅ Cargar datos de localStorage al iniciar
  useEffect(() => {
    const fechaGuardada = localStorage.getItem('fechaInicio')
    const duracionPeriodoGuardada = localStorage.getItem('duracionPeriodo')
    const duracionCicloGuardada = localStorage.getItem('duracionCiclo')

    if (fechaGuardada && duracionPeriodoGuardada && duracionCicloGuardada) {
      const fecha = new Date(fechaGuardada)
      const periodo = parseInt(duracionPeriodoGuardada)
      const ciclo = parseInt(duracionCicloGuardada)
      
      actualizarCalendario(fecha, periodo, ciclo)
    }
  }, [])

  // ✅ Calcular próximo periodo y fase actual
  const calcularProximoPeriodo = () => {
    if (!calendario.fechaInicio) return

    const hoy = new Date()
    const proximaFecha = new Date(calendario.fechaInicio)
    proximaFecha.setDate(proximaFecha.getDate() + calendario.duracionCiclo)

    const diasRestantes = Math.ceil((proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calcular fase del ciclo
    const diasDesdeInicio = Math.ceil((hoy.getTime() - calendario.fechaInicio.getTime()) / (1000 * 60 * 60 * 24))
    const diaEnCiclo = diasDesdeInicio % calendario.duracionCiclo
    
    let fase = 'Menstruación'
    if (diaEnCiclo > calendario.duracionPeriodo && diaEnCiclo <= 14) {
      fase = 'Fase Folicular'
    } else if (diaEnCiclo > 14 && diaEnCiclo <= 16) {
      fase = 'Ovulación'
    } else if (diaEnCiclo > 16) {
      fase = 'Fase Lútea'
    }

    setCalendario(prev => ({
      ...prev,
      proximoPeriodo: proximaFecha,
      diasHastaPeriodo: diasRestantes,
      faseActual: fase
    }))
  }

  // ✅ Actualizar calendario y guardarlo en localStorage
  const actualizarCalendario = (fechaInicio: Date, duracionPeriodo: number, duracionCiclo: number) => {
    localStorage.setItem('fechaInicio', fechaInicio.toISOString())
    localStorage.setItem('duracionPeriodo', duracionPeriodo.toString())
    localStorage.setItem('duracionCiclo', duracionCiclo.toString())

    setCalendario(prev => ({
      ...prev,
      fechaInicio,
      duracionPeriodo,
      duracionCiclo
    }))

    // Calcular próximo periodo inmediatamente
    setTimeout(() => {
      const hoy = new Date()
      const proximaFecha = new Date(fechaInicio)
      proximaFecha.setDate(proximaFecha.getDate() + duracionCiclo)

      const diasRestantes = Math.ceil((proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
      
      const diasDesdeInicio = Math.ceil((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))
      const diaEnCiclo = diasDesdeInicio % duracionCiclo
      
      let fase = 'Menstruación'
      if (diaEnCiclo > duracionPeriodo && diaEnCiclo <= 14) {
        fase = 'Fase Folicular'
      } else if (diaEnCiclo > 14 && diaEnCiclo <= 16) {
        fase = 'Ovulación'
      } else if (diaEnCiclo > 16) {
        fase = 'Fase Lútea'
      }

      setCalendario(prev => ({
        ...prev,
        proximoPeriodo: proximaFecha,
        diasHastaPeriodo: diasRestantes,
        faseActual: fase
      }))
    }, 100)
  }

  return (
    <CalendarioContext.Provider value={{ calendario, actualizarCalendario, calcularProximoPeriodo }}>
      {children}
    </CalendarioContext.Provider>
  )
}

// ✅ Hook personalizado para usar el contexto
export function useCalendario() {
  const context = useContext(CalendarioContext)
  if (context === undefined) {
    throw new Error('useCalendario debe ser usado dentro de CalendarioProvider')
  }
  return context
}

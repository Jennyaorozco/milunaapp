// contexts/CalendarioContext.tsx - VERSIÓN CORREGIDA
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { saveUserData, getUserData, getCurrentUser } from '../lib/userStorage'

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
  recargarCalendario: () => void
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

  // ✅ NUEVO: Estado para trackear el usuario actual
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)

  // ✅ Función para recargar calendario
  const recargarCalendario = () => {
    const user = getCurrentUser()
    const username = user?.username || null
    
    console.log('🔄 Recargando calendario para usuario:', username || 'ninguno')
    
    // ✅ NUEVO: Actualizar usuario actual
    setCurrentUsername(username)
    
    if (!username) {
      console.log('⚠️ No hay usuario activo, usando valores por defecto')
      setCalendario({
        fechaInicio: null,
        duracionPeriodo: 5,
        duracionCiclo: 28,
        proximoPeriodo: null,
        diasHastaPeriodo: null,
        faseActual: 'No configurado'
      })
      return
    }
    
    const fechaGuardada = getUserData('fechaInicio')
    const duracionPeriodoGuardada = getUserData('duracionPeriodo')
    const duracionCicloGuardada = getUserData('duracionCiclo')

    console.log('📋 Datos encontrados:', {
      fecha: fechaGuardada ? 'SÍ' : 'NO',
      periodo: duracionPeriodoGuardada || 'NO',
      ciclo: duracionCicloGuardada || 'NO'
    })

    if (fechaGuardada && duracionPeriodoGuardada && duracionCicloGuardada) {
      const fecha = new Date(fechaGuardada)
      const periodo = parseInt(duracionPeriodoGuardada)
      const ciclo = parseInt(duracionCicloGuardada)
      
      console.log('✅ Restaurando calendario del usuario')
      actualizarCalendarioDirecto(fecha, periodo, ciclo)
    } else {
      console.log('ℹ️ No hay datos previos del calendario')
      setCalendario({
        fechaInicio: null,
        duracionPeriodo: 5,
        duracionCiclo: 28,
        proximoPeriodo: null,
        diasHastaPeriodo: null,
        faseActual: 'No configurado'
      })
    }
  }

  // ✅ NUEVO: useEffect que se ejecuta cuando cambia el usuario
  useEffect(() => {
    // Verificar cada 500ms si el usuario cambió
    const interval = setInterval(() => {
      const user = getCurrentUser()
      const username = user?.username || null
      
      if (username !== currentUsername) {
        console.log('👤 Usuario cambió de:', currentUsername, 'a:', username)
        recargarCalendario()
      }
    }, 500)

    return () => clearInterval(interval)
  }, [currentUsername])

  // ✅ Cargar datos al montar por primera vez
  useEffect(() => {
    console.log('🚀 CalendarioContext montado')
    recargarCalendario()
  }, [])

  const calcularProximoPeriodo = () => {
    if (!calendario.fechaInicio) return

    const hoy = new Date()
    const proximaFecha = new Date(calendario.fechaInicio)
    proximaFecha.setDate(proximaFecha.getDate() + calendario.duracionCiclo)

    const diasRestantes = Math.ceil((proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    
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

  // ✅ Función interna para actualizar sin recursión
  const actualizarCalendarioDirecto = (fechaInicio: Date, duracionPeriodo: number, duracionCiclo: number) => {
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

    setCalendario({
      fechaInicio,
      duracionPeriodo,
      duracionCiclo,
      proximoPeriodo: proximaFecha,
      diasHastaPeriodo: diasRestantes,
      faseActual: fase
    })
  }

  const actualizarCalendario = (fechaInicio: Date, duracionPeriodo: number, duracionCiclo: number) => {
    console.log('💾 Actualizando calendario:', { fechaInicio, duracionPeriodo, duracionCiclo })
    
    // ✅ Guardar con userStorage
    saveUserData('fechaInicio', fechaInicio.toISOString())
    saveUserData('duracionPeriodo', duracionPeriodo.toString())
    saveUserData('duracionCiclo', duracionCiclo.toString())

    // ✅ Actualizar estado
    actualizarCalendarioDirecto(fechaInicio, duracionPeriodo, duracionCiclo)
    
    console.log('✅ Calendario actualizado en localStorage y estado')
  }

  return (
    <CalendarioContext.Provider value={{ 
      calendario, 
      actualizarCalendario, 
      calcularProximoPeriodo,
      recargarCalendario
    }}>
      {children}
    </CalendarioContext.Provider>
  )
}

export function useCalendario() {
  const context = useContext(CalendarioContext)
  if (context === undefined) {
    throw new Error('useCalendario debe ser usado dentro de CalendarioProvider')
  }
  return context
}

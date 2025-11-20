// app/consejos/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '../../components/mi_luna_logo'
import { Lightbulb, ArrowLeft, Home, Sparkles, Brain, Loader2, Calendar, Heart, Droplet, Activity } from 'lucide-react'
import { useCalendario } from '../../contexts/CalendarioContext'
import DescargarReporte from '../../components/DescargarReporte'
import ProtectedRoute from '../../components/ProtectedRoute' // ✅ NUEVO
import { getUserData, getCurrentUser } from '../../lib/userStorage' // ✅ NUEVO
import condicionesCategorias from './ciclo_menstrual_full.json'

interface Condicion {
  titulo: string
  detalle: string
}

interface Consejo {
  titulo: string
  detalle: string
  tipo: 'local' | 'gemini'
  icono: React.ReactNode
  color: string
}

export default function ConsejosPage() {
  const router = useRouter()
  const { calendario } = useCalendario()
  const [consejos, setConsejos] = useState<Consejo[]>([])
  const [consejosGemini, setConsejosGemini] = useState<string>('')
  const [loadingGemini, setLoadingGemini] = useState(false)
  const [geminiAnalizado, setGeminiAnalizado] = useState(false)
  const [username, setUsername] = useState<string>('') // ✅ NUEVO

  // ✅ NUEVO: Obtener usuario actual
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUsername(user.username)
      console.log('👤 Usuario en consejos:', user.username)
    }
  }, [])

  useEffect(() => {
    generarConsejosCompletos()
  }, [calendario])

  // ✅ MEJORADO: Usar getUserData para leer síntomas por usuario
  const generarConsejosCompletos = () => {
    console.log('📖 Cargando síntomas para generar consejos...')
    const sintomasGuardados = getUserData('misSintomas')
    const datosSintomas = sintomasGuardados ? JSON.parse(sintomasGuardados) : {}
    
    console.log('📋 Síntomas cargados:', datosSintomas)
    const nuevosConsejos: Consejo[] = []

    // 1️⃣ CONSEJOS BASADOS EN LA FASE DEL CICLO
    if (calendario.faseActual) {
      console.log('🌙 Generando consejos para fase:', calendario.faseActual)
      const consejosFase = obtenerConsejosPorFase(calendario.faseActual, calendario.diasHastaPeriodo || 0)
      nuevosConsejos.push(...consejosFase)
    }

    // 2️⃣ CONSEJOS BASADOS EN SÍNTOMAS FÍSICOS
    if (datosSintomas.sintomas) {
      console.log('💊 Analizando síntomas físicos')
      const consejosSintomas = analizarSintomas(datosSintomas.sintomas)
      nuevosConsejos.push(...consejosSintomas)
    }

    // 3️⃣ CONSEJOS BASADOS EN EMOCIONES
    if (datosSintomas.emociones) {
      console.log('💙 Analizando emociones')
      const consejosEmocionales = analizarEmociones(datosSintomas.emociones)
      nuevosConsejos.push(...consejosEmocionales)
    }

    // 4️⃣ CONSEJOS BASADOS EN FLUJO
    if (datosSintomas.flujo) {
      console.log('💧 Analizando flujo')
      const consejosFlujo = analizarFlujo(datosSintomas.flujo)
      nuevosConsejos.push(...consejosFlujo)
    }

    // 5️⃣ CONSEJOS DEL JSON ORIGINAL (condiciones específicas)
    const texto = Object.values(datosSintomas).join(' ').toLowerCase()
    const titulosAgregados = new Set<string>()

    Object.values(condicionesCategorias).forEach((categoria: any) => {
      categoria.forEach((condicion: Condicion) => {
        if (
          texto.includes(condicion.titulo.toLowerCase()) &&
          !titulosAgregados.has(condicion.titulo)
        ) {
          nuevosConsejos.push({
            titulo: condicion.titulo,
            detalle: condicion.detalle,
            tipo: 'local',
            icono: <Lightbulb className="w-7 h-7 text-white" />,
            color: 'from-pink-400 to-rose-400'
          })
          titulosAgregados.add(condicion.titulo)
        }
      })
    })

    // Si no hay consejos, agregar uno general
    if (nuevosConsejos.length === 0) {
      console.log('ℹ️ No hay consejos específicos, usando consejo general')
      nuevosConsejos.push({
        titulo: 'Bienestar General',
        detalle: 'Mantén una rutina saludable: duerme 7-8 horas, bebe suficiente agua, come balanceado y haz ejercicio moderado. Escucha las señales de tu cuerpo.',
        tipo: 'local',
        icono: <Heart className="w-7 h-7 text-white" />,
        color: 'from-pink-400 to-purple-400'
      })
    }

    console.log('✅ Consejos generados:', nuevosConsejos.length)
    setConsejos(nuevosConsejos)
  }

  // ✅ CONSEJOS SEGÚN LA FASE DEL CICLO
  const obtenerConsejosPorFase = (fase: string, diasHasta: number): Consejo[] => {
    const consejos: Consejo[] = []

    switch (fase) {
      case 'Menstruación':
        consejos.push({
          titulo: '🩸 Fase de Menstruación',
          detalle: `Estás en tus días de menstruación. Tu cuerpo está renovándose. 

**Recomendaciones:**
• Descansa lo suficiente y respeta tu necesidad de dormir más
• Consume alimentos ricos en hierro (espinacas, lentejas, carne roja)
• Aplica calor local si tienes cólicos (bolsa de agua caliente)
• Evita ejercicio intenso, opta por yoga suave o caminatas
• Toma mucha agua para mantenerte hidratada
• Considera infusiones de jengibre o manzanilla para el malestar`,
          tipo: 'local',
          icono: <Droplet className="w-7 h-7 text-white" />,
          color: 'from-red-400 to-pink-500'
        })
        break

      case 'Fase Folicular':
        consejos.push({
          titulo: '🌱 Fase Folicular',
          detalle: `Tu energía está aumentando después del periodo. Es momento de aprovechar tu vitalidad.

**Recomendaciones:**
• Incrementa gradualmente tu actividad física (cardio, fuerza)
• Planifica proyectos nuevos, tu creatividad está en auge
• Consume alimentos frescos, ensaladas y proteínas magras
• Es buen momento para socializar y hacer networking
• Aprovecha para aprender cosas nuevas, tu cerebro está receptivo
• Mantén una rutina de sueño regular (7-8 horas)`,
          tipo: 'local',
          icono: <Activity className="w-7 h-7 text-white" />,
          color: 'from-green-400 to-emerald-500'
        })
        break

      case 'Ovulación':
        consejos.push({
          titulo: '✨ Fase de Ovulación',
          detalle: `Estás en tu pico de energía y fertilidad. Aprovecha este momento de máximo potencial.

**Recomendaciones:**
• Tu libido puede estar elevada, es completamente normal
• Excelente momento para ejercicio intenso y desafiante
• Consume alimentos antioxidantes (frutos rojos, vegetales verdes)
• Tu comunicación es excelente, agenda reuniones importantes
• Cuida tu piel, puede estar más sensible o propensa a brotes
• Si no buscas embarazo, refuerza tu método anticonceptivo`,
          tipo: 'local',
          icono: <Sparkles className="w-7 h-7 text-white" />,
          color: 'from-yellow-400 to-amber-500'
        })
        break

      case 'Fase Lútea':
        if (diasHasta > 7) {
          consejos.push({
            titulo: '🌙 Fase Lútea Temprana',
            detalle: `Tu cuerpo se está preparando para el próximo ciclo. Es momento de cuidarte.

**Recomendaciones:**
• Reduce gradualmente la intensidad del ejercicio
• Consume alimentos ricos en magnesio (nueces, plátano, chocolate oscuro)
• Practica técnicas de relajación (meditación, respiración)
• Mantén rutinas que te den estructura y calma
• Reduce cafeína y sal para evitar retención de líquidos
• Permite momentos de introspección y descanso`,
            tipo: 'local',
            icono: <Calendar className="w-7 h-7 text-white" />,
            color: 'from-purple-400 to-pink-500'
          })
        } else {
          consejos.push({
            titulo: '🌙 Fase Premenstrual (SPM)',
            detalle: `Tu periodo está cerca (${diasHasta} días). Es normal sentir cambios físicos y emocionales.

**Recomendaciones SPM:**
• Consume alimentos ricos en vitamina B6 (garbanzos, salmón, aguacate)
• Evita alcohol, cafeína y alimentos muy procesados
• Haz ejercicio suave (yoga, natación, caminatas)
• Duerme al menos 8 horas, tu cuerpo lo necesita más
• Practica auto-compasión, tus emociones son válidas
• Ten productos de higiene listos para cuando llegue tu periodo
• Considera suplementos de magnesio (consulta con tu médico)`,
            tipo: 'local',
            icono: <Heart className="w-7 h-7 text-white" />,
            color: 'from-purple-500 to-pink-600'
          })
        }
        break
    }

    return consejos
  }

  // ✅ ANALIZAR SÍNTOMAS FÍSICOS
  const analizarSintomas = (sintomas: string): Consejo[] => {
    const consejos: Consejo[] = []
    const sintomasLower = sintomas.toLowerCase()

    if (sintomasLower.includes('cólico') || sintomasLower.includes('dolor') || sintomasLower.includes('calambre')) {
      consejos.push({
        titulo: '💊 Manejo de Cólicos',
        detalle: `**Para aliviar cólicos menstruales:**
• Aplica calor local (bolsa de agua caliente en el abdomen)
• Masajea suavemente el área abdominal en círculos
• Toma té de jengibre, manzanilla o canela
• Considera ibuprofeno o naproxeno (si no hay contraindicaciones)
• Haz ejercicio suave para liberar endorfinas
• Prueba posiciones de yoga: postura del niño o gato-vaca
• Si el dolor es muy intenso, consulta con tu ginecólogo`,
        tipo: 'local',
        icono: <Heart className="w-7 h-7 text-white" />,
        color: 'from-rose-400 to-red-500'
      })
    }

    if (sintomasLower.includes('hinchazón') || sintomasLower.includes('hinchada') || sintomasLower.includes('retención') || sintomasLower.includes('inflamada')) {
      consejos.push({
        titulo: '💧 Reducir Hinchazón',
        detalle: `**Para disminuir la retención de líquidos:**
• Bebe más agua (paradójicamente ayuda a eliminar retención)
• Reduce sal y alimentos procesados
• Consume alimentos diuréticos: pepino, sandía, té verde, espárragos
• Evita bebidas gaseosas y alcohol
• Eleva las piernas cuando descanses
• Usa ropa cómoda y holgada
• Haz caminatas ligeras para activar circulación`,
        tipo: 'local',
        icono: <Droplet className="w-7 h-7 text-white" />,
        color: 'from-blue-400 to-cyan-500'
      })
    }

    if (sintomasLower.includes('dolor de cabeza') || sintomasLower.includes('migraña') || sintomasLower.includes('cefalea')) {
      consejos.push({
        titulo: '🧠 Alivio de Dolor de Cabeza',
        detalle: `**Para dolores de cabeza menstruales:**
• Mantente bien hidratada (al menos 2 litros de agua al día)
• Descansa en un lugar oscuro y silencioso
• Aplica compresas frías en la frente o nuca
• Evita luces brillantes y pantallas
• Reduce cafeína gradualmente si eres consumidora regular
• Practica respiración profunda y relajación
• Considera magnesio (400mg diarios, consulta con médico)`,
        tipo: 'local',
        icono: <Brain className="w-7 h-7 text-white" />,
        color: 'from-indigo-400 to-purple-500'
      })
    }

    if (sintomasLower.includes('cansancio') || sintomasLower.includes('fatiga') || sintomasLower.includes('agotamiento') || sintomasLower.includes('sueño')) {
      consejos.push({
        titulo: '😴 Combatir la Fatiga',
        detalle: `**Para recuperar energía:**
• Prioriza 8-9 horas de sueño de calidad
• Consume alimentos ricos en hierro (carne, espinacas, legumbres)
• Toma vitamina C para mejor absorción del hierro
• Evita azúcares refinados que causan picos de energía
• Haz siestas cortas (20-30 minutos) si es posible
• Sal a caminar 15 minutos para activarte naturalmente
• Considera suplemento de vitamina B12 (consulta médico)`,
        tipo: 'local',
        icono: <Activity className="w-7 h-7 text-white" />,
        color: 'from-orange-400 to-yellow-500'
      })
    }

    return consejos
  }

  // ✅ ANALIZAR EMOCIONES
  const analizarEmociones = (emociones: string): Consejo[] => {
    const consejos: Consejo[] = []
    const emocionesLower = emociones.toLowerCase()

    if (emocionesLower.includes('tristeza') || emocionesLower.includes('triste') || emocionesLower.includes('deprimida') || emocionesLower.includes('llorar')) {
      consejos.push({
        titulo: '💙 Cuidado Emocional - Tristeza',
        detalle: `**Para manejar la tristeza menstrual:**
• Permite sentir y expresar tus emociones, es válido llorar
• Practica journaling: escribe cómo te sientes
• Sal a caminar en la naturaleza, el sol ayuda
• Escucha música que te reconforte
• Llama a alguien de confianza para conversar
• Practica gratitud: escribe 3 cosas buenas del día
• Recuerda que es temporal, pasará con el ciclo
• Si persiste fuera del ciclo, busca apoyo profesional`,
        tipo: 'local',
        icono: <Heart className="w-7 h-7 text-white" />,
        color: 'from-blue-400 to-indigo-500'
      })
    }

    if (emocionesLower.includes('ansiedad') || emocionesLower.includes('ansiosa') || emocionesLower.includes('nerviosa') || emocionesLower.includes('preocupada')) {
      consejos.push({
        titulo: '🧘‍♀️ Manejo de Ansiedad',
        detalle: `**Técnicas para calmar la ansiedad:**
• Respiración 4-7-8: inhala 4seg, sostén 7seg, exhala 8seg
• Limita cafeína y azúcar que intensifican ansiedad
• Practica meditación guiada (apps como Calm o Headspace)
• Haz ejercicio para liberar tensión acumulada
• Establece límites saludables, di "no" cuando sea necesario
• Evita decisiones importantes durante picos de ansiedad
• Prueba técnicas de grounding: 5-4-3-2-1 (sentidos)
• Considera terapia si la ansiedad afecta tu vida diaria`,
        tipo: 'local',
        icono: <Sparkles className="w-7 h-7 text-white" />,
        color: 'from-teal-400 to-green-500'
      })
    }

    if (emocionesLower.includes('irritable') || emocionesLower.includes('enojada') || emocionesLower.includes('frustrada') || emocionesLower.includes('molesta')) {
      consejos.push({
        titulo: '🔥 Gestión de Irritabilidad',
        detalle: `**Para manejar el enojo menstrual:**
• Reconoce que las hormonas amplifican emociones
• Toma pausas cuando sientas que vas a explotar
• Comunica tus necesidades con asertividad
• Haz ejercicio intenso para liberar frustración
• Practica técnicas de relajación muscular progresiva
• Evita confrontaciones importantes durante este periodo
• Date permiso de estar a solas si lo necesitas
• Duerme bien, la falta de sueño aumenta irritabilidad`,
        tipo: 'local',
        icono: <Activity className="w-7 h-7 text-white" />,
        color: 'from-orange-500 to-red-500'
      })
    }

    if (emocionesLower.includes('sensible') || emocionesLower.includes('vulnerable') || emocionesLower.includes('emocional')) {
      consejos.push({
        titulo: '🌸 Honrar tu Sensibilidad',
        detalle: `**Cuidado durante días sensibles:**
• Tu sensibilidad no es debilidad, es sabiduría de tu cuerpo
• Limita exposición a noticias o contenido perturbador
• Rodéate de personas que te apoyen y comprendan
• Practica auto-compasión y habla contigo con gentileza
• Haz actividades que nutran tu alma: arte, música, naturaleza
• Establece boundaries claros con tu energía y tiempo
• Acepta ayuda cuando la necesites
• Celebra tu capacidad de sentir profundamente`,
        tipo: 'local',
        icono: <Heart className="w-7 h-7 text-white" />,
        color: 'from-pink-400 to-rose-500'
      })
    }

    return consejos
  }

  // ✅ ANALIZAR FLUJO
  const analizarFlujo = (flujo: string): Consejo[] => {
    const consejos: Consejo[] = []
    const flujoLower = flujo.toLowerCase()

    if (flujoLower.includes('abundante') || flujoLower.includes('mucho') || flujoLower.includes('excesivo')) {
      consejos.push({
        titulo: '🩸 Flujo Abundante',
        detalle: `**Cuidados para flujo menstrual abundante:**
• Consume alimentos ricos en hierro para prevenir anemia
• Considera suplemento de hierro (consulta con médico)
• Usa productos de mayor absorción (copas menstruales, toallas nocturnas)
• Mantén control de cuánto sangrado tienes (si llenas una toalla cada hora, consulta médico)
• Bebe más líquidos de lo habitual
• Si tu flujo abundante es nuevo o empeoró, agenda cita ginecológica
• Descansa más, tu cuerpo está trabajando extra`,
        tipo: 'local',
        icono: <Droplet className="w-7 h-7 text-white" />,
        color: 'from-red-500 to-rose-600'
      })
    }

    if (flujoLower.includes('coágulo') || flujoLower.includes('grumo')) {
      consejos.push({
        titulo: '🔴 Coágulos en el Flujo',
        detalle: `**Sobre los coágulos menstruales:**
• Coágulos pequeños (menos de 1cm) son normales
• Indican que el flujo es abundante en ese momento
• Mantén buena hidratación
• Si son muy grandes (más de 2.5cm) o muy frecuentes, consulta médico
• Pueden indicar desequilibrio hormonal o fibromas
• Lleva registro de su frecuencia y tamaño para tu ginecólogo`,
        tipo: 'local',
        icono: <Activity className="w-7 h-7 text-white" />,
        color: 'from-rose-500 to-red-600'
      })
    }

    return consejos
  }

  // ✅ MEJORADO: Usar getUserData para Gemini
  const analizarConGemini = async () => {
    setLoadingGemini(true)
    
    try {
      const datosCalendario = {
        fechaInicio: calendario.fechaInicio?.toLocaleDateString('es-ES'),
        duracionPeriodo: calendario.duracionPeriodo,
        duracionCiclo: calendario.duracionCiclo,
        faseActual: calendario.faseActual,
        diasHastaPeriodo: calendario.diasHastaPeriodo
      }

      const sintomasGuardados = getUserData('misSintomas')
      const datosSintomas = sintomasGuardados ? JSON.parse(sintomasGuardados) : {}

      console.log('🤖 Solicitando análisis de Gemini...')

      const prompt = `Eres Luna, un asistente especializado en salud menstrual y bienestar femenino.

**INFORMACIÓN DEL CICLO MENSTRUAL:**
- Fecha de inicio del último periodo: ${datosCalendario.fechaInicio || 'No registrada'}
- Duración promedio del periodo: ${datosCalendario.duracionPeriodo} días
- Duración del ciclo menstrual: ${datosCalendario.duracionCiclo} días
- Fase actual del ciclo: ${datosCalendario.faseActual}
- Días hasta el próximo periodo: ${datosCalendario.diasHastaPeriodo !== null ? datosCalendario.diasHastaPeriodo : 'No calculado'}

**SÍNTOMAS Y EMOCIONES REGISTRADAS:**
- Aspecto del flujo: ${datosSintomas.flujo || 'No registrado'}
- Síntomas físicos: ${datosSintomas.sintomas || 'No registrados'}
- Por sanar (aspectos emocionales/espirituales): ${datosSintomas.sanar || 'No registrado'}
- Estado emocional: ${datosSintomas.emociones || 'No registrado'}

**INSTRUCCIONES:**
Con base en toda esta información, genera consejos personalizados, empáticos y profesionales para ayudar a la usuaria. Incluye:

1. **Análisis de su fase actual** - Explica qué está pasando en su cuerpo según la fase del ciclo
2. **Consejos nutricionales** - Alimentos recomendados para esta fase y síntomas
3. **Recomendaciones de actividad física** - Qué tipo de ejercicio es mejor ahora
4. **Cuidado emocional** - Cómo manejar las emociones y el bienestar mental
5. **Prácticas de autocuidado** - Técnicas específicas para sus síntomas

**IMPORTANTE:**
- Sé empática, cálida y comprensiva
- Usa un lenguaje cercano pero profesional
- Organiza los consejos de forma clara con emojis apropiados
- Si detectas síntomas preocupantes, sugiere consultar con un profesional de salud
- Enfócate en el bienestar integral: físico, emocional y espiritual

Genera una respuesta completa y personalizada:`;

      const response = await fetch('/api/rag/simple-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        setConsejosGemini(data.response)
        setGeminiAnalizado(true)
        console.log('✅ Análisis de Gemini completado')
      } else {
        throw new Error('No se pudo obtener respuesta de Gemini')
      }
    } catch (error) {
      console.error('❌ Error al analizar con Gemini:', error)
      setConsejosGemini('Lo siento, no pude analizar tus datos en este momento. Por favor intenta de nuevo más tarde.')
    } finally {
      setLoadingGemini(false)
    }
  }

  // ✅ MEJORADO: No borrar todos los datos
  const cerrarSesion = () => {
    const confirmar = confirm('¿Deseas cerrar sesión? Tus datos se mantendrán guardados.')
    
    if (confirmar) {
      console.log('👋 Cerrando sesión de:', username)
      
      localStorage.removeItem('usuarioActivo')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('currentUser')
      
      window.location.href = '/login'
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 relative overflow-hidden">

        {/* Topbar */}
        <header className="w-full bg-pink-700 text-white py-3 shadow-sm z-20">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <Link href="/sintomas" className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </Link>
            <div className="flex items-center gap-2">
              <MiLunaLogo size="small" className="text-white" />
              {username && (
                <span className="text-xs text-white/80 hidden sm:inline">
                  @{username}
                </span>
              )}
            </div>
            <button 
              onClick={cerrarSesion} 
              className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Banner rosado */}
        <section className="w-full bg-pink-200 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-pink-700 flex items-center justify-center gap-2">
              <Lightbulb className="w-7 h-7 text-pink-500" />
              Consejos Personalizados
            </h1>
            <p className="text-sm text-gray-700 mt-2">Basados en tu ciclo menstrual y cómo te sientes</p>
            {username && (
              <p className="text-xs text-gray-600 mt-1">
                Consejos para: <strong>{username}</strong>
              </p>
            )}
          </div>
        </section>

        <div className="relative z-10 flex flex-col items-center px-4 py-12">
          <div className="w-full max-w-6xl">
          
            {/* Sección de Descargar Reporte PDF */}
            <div className="mb-12 animate-fadeInUp border-2 border-purple-300 rounded-3xl p-8 bg-gradient-to-r from-purple-50 to-pink-50 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-700 mb-2">
                    📊 Genera tu Reporte Personalizado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Descarga un PDF completo con toda tu información de ciclo menstrual, síntomas registrados, 
                    fase actual y recomendaciones personalizadas. Perfecto para compartir con tu médico o llevar 
                    un registro histórico de tu salud.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2"><strong>El reporte incluye:</strong></p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>✅ Información completa de tu ciclo menstrual</li>
                      <li>✅ Fase actual y próximo período estimado</li>
                      <li>✅ Síntomas físicos y emocionales registrados</li>
                      <li>✅ Recomendaciones personalizadas según tu fase</li>
                      <li>✅ Consejos de autocuidado y bienestar</li>
                    </ul>
                  </div>
                </div>
              </div>
              <DescargarReporte />
            </div>

            {/* Botón de Análisis con IA */}
            {!geminiAnalizado && (
              <div className="glass-pink rounded-3xl p-8 card-soft shadow-2xl mb-8 animate-fadeInUp border-2 border-purple-300">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    ¿Quieres Consejos Más Profundos?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Usa inteligencia artificial para obtener un análisis completo y personalizado de tu ciclo, 
                    síntomas y bienestar emocional.
                  </p>
                  <button
                    onClick={analizarConGemini}
                    disabled={loadingGemini}
                    className="btn-gradient text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingGemini ? (
                      <>
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                        Analizando con IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 text-white" />
                        Analizar con Inteligencia Artificial
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Consejos de Gemini */}
            {geminiAnalizado && consejosGemini && (
              <div className="glass-pink rounded-3xl p-8 card-soft shadow-2xl mb-8 animate-fadeInUp border-2 border-purple-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-purple-700 mb-2 flex items-center gap-2">
                      Análisis Personalizado con IA
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Gemini AI</span>
                    </h3>
                    <p className="text-sm text-gray-600">Basado en tu ciclo menstrual y síntomas registrados</p>
                  </div>
                </div>
                <div className="prose prose-pink max-w-none">
                  <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {consejosGemini}
                  </div>
                </div>
              
                <div className="mt-6 pt-6 border-t border-purple-200 text-center">
                  <button
                    onClick={analizarConGemini}
                    disabled={loadingGemini}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2 mx-auto transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Actualizar análisis
                  </button>
                </div>
              </div>
            )}

            {/* Consejos locales mejorados */}
            {!geminiAnalizado && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-pink-500" />
                    Tus Consejos Personalizados
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Basados en tu fase del ciclo y síntomas registrados
                  </p>
                </div>
              
                <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  {consejos.map((consejo, index) => (
                    <div 
                      key={index} 
                      className="glass-pink rounded-3xl p-8 card-soft shadow-2xl hover:scale-[1.02] transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 bg-gradient-to-r ${consejo.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg`}>
                            {consejo.icono}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">{consejo.titulo}</h3>
                          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">{consejo.detalle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Botón volver al menú */}
            <div className="flex justify-center mt-12 animate-fadeInUp">
              <button
                onClick={() => router.push('/menu')}
                className="btn-gradient text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <Home className="w-6 h-6 text-white" />
                Volver al menú
              </button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}

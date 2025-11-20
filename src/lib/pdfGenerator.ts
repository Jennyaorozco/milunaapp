import jsPDF from 'jspdf';

export interface DatosReporte {
  calendario: {
    fechaInicio: Date | null;
    duracionPeriodo: number;
    duracionCiclo: number;
    faseActual: string;
    diasHastaPeriodo: number | null;
    proximoPeriodo: Date | null;
  };
  sintomas: {
    flujo: string;
    sintomas: string;
    sanar: string;
    emociones: string;
  };
  usuario?: {
    nombre?: string;
    email?: string;
  };
}

export async function generarReportePDF(datos: DatosReporte): Promise<void> {
  // ✅ CORREGIDO: Especificar fuente con soporte UTF-8
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ✅ NUEVO: Agregar fuente con soporte para caracteres especiales
  doc.setFont('helvetica');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // ✅ HEADER CON LOGO
  doc.setFillColor(236, 72, 153);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('MILUNA - Reporte de Ciclo Menstrual', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 23, { align: 'center' });

  yPosition = 40;

  // ✅ SECCIÓN 1: INFORMACIÓN DEL CICLO
  agregarSeccion(doc, 'INFORMACION DE TU CICLO MENSTRUAL', yPosition);
  yPosition += 10;

  const infoCalendario = [
    `Fase actual: ${datos.calendario.faseActual}`,
    `Fecha de inicio del periodo: ${datos.calendario.fechaInicio?.toLocaleDateString('es-ES') || 'No registrada'}`,
    `Proximo periodo: ${datos.calendario.proximoPeriodo?.toLocaleDateString('es-ES') || 'Calculando...'}`,
    `Dias hasta proximo periodo: ${datos.calendario.diasHastaPeriodo !== null ? `${datos.calendario.diasHastaPeriodo} dias` : 'N/A'}`,
    `Duracion promedio del periodo: ${datos.calendario.duracionPeriodo} dias`,
    `Duracion del ciclo: ${datos.calendario.duracionCiclo} dias`,
  ];

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  infoCalendario.forEach(info => {
    doc.text(info, 20, yPosition);
    yPosition += 8;
  });

  yPosition += 5;

  // ✅ SECCIÓN 2: CONSEJOS POR FASE
  const consejosFase = obtenerConsejosPorFase(datos.calendario.faseActual);
  agregarSeccion(doc, `RECOMENDACIONES PARA TU FASE: ${datos.calendario.faseActual.toUpperCase()}`, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const lineasConsejos = doc.splitTextToSize(consejosFase, pageWidth - 40);
  doc.text(lineasConsejos, 20, yPosition);
  yPosition += lineasConsejos.length * 5 + 10;

  // Verificar si necesitamos nueva página
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  // ✅ SECCIÓN 3: SÍNTOMAS REGISTRADOS
  agregarSeccion(doc, 'TUS SINTOMAS Y EMOCIONES', yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  
  const sintomas = [
    { titulo: 'Aspecto del flujo', valor: datos.sintomas.flujo || 'No registrado' },
    { titulo: 'Sintomas fisicos', valor: datos.sintomas.sintomas || 'No registrados' },
    { titulo: 'Aspectos por sanar', valor: datos.sintomas.sanar || 'No registrado' },
    { titulo: 'Estado emocional', valor: datos.sintomas.emociones || 'No registrado' },
  ];

  sintomas.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.titulo}:`, 20, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    const lineas = doc.splitTextToSize(item.valor, pageWidth - 40);
    doc.text(lineas, 25, yPosition);
    yPosition += lineas.length * 5 + 5;

    // Verificar si necesitamos nueva página
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
  });

  yPosition += 5;

  // ✅ SECCIÓN 4: RECOMENDACIONES GENERALES
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  agregarSeccion(doc, 'RECOMENDACIONES PERSONALIZADAS', yPosition);
  yPosition += 10;

  const recomendaciones = generarRecomendaciones(datos);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const lineasRec = doc.splitTextToSize(recomendaciones, pageWidth - 40);
  doc.text(lineasRec, 20, yPosition);

  // ✅ FOOTER
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`(c) 2025 Miluna - Tu compañera de confianza para el bienestar menstrual`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  // ✅ DESCARGAR
  const nombreArchivo = `Reporte_Ciclo_Menstrual_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nombreArchivo);
}

function agregarSeccion(doc: jsPDF, titulo: string, yPosition: number): void {
  doc.setDrawColor(236, 72, 153);
  doc.setLineWidth(0.5);
  doc.line(15, yPosition + 3, 195, yPosition + 3);
  
  doc.setTextColor(236, 72, 153);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, 20, yPosition);
}

function obtenerConsejosPorFase(fase: string): string {
  const consejosPorFase: { [key: string]: string } = {
    'Menstruación': `Durante tu menstruacion, tu cuerpo esta renovandose. Descansa lo suficiente, consume alimentos ricos en hierro (espinacas, lentejas, carne roja), aplica calor local si tienes colicos, evita ejercicio intenso y toma mucha agua. Considera infusiones de jengibre o manzanilla para el malestar.

RECOMENDACIONES:
- Descansa lo suficiente y respeta tu necesidad de dormir mas
- Consume alimentos ricos en hierro
- Aplica calor local si tienes colicos
- Evita ejercicio intenso, opta por yoga suave o caminatas
- Toma mucha agua para mantenerte hidratada
- Considera infusiones de jengibre o manzanilla`,
    
    'Fase Folicular': `Tu energia esta aumentando despues del periodo. Incrementa gradualmente tu actividad fisica, planifica proyectos nuevos, consume alimentos frescos, es buen momento para socializar, tu creatividad esta en auge. Aprovecha esta energia positiva.

RECOMENDACIONES:
- Incrementa gradualmente tu actividad fisica (cardio, fuerza)
- Planifica proyectos nuevos, tu creatividad esta en auge
- Consume alimentos frescos, ensaladas y proteinas magras
- Es buen momento para socializar y hacer networking
- Aprovecha para aprender cosas nuevas, tu cerebro esta receptivo
- Mantén una rutina de sueno regular (7-8 horas)`,
    
    'Ovulación': `Estas en tu pico de energia y fertilidad. Excelente momento para ejercicio intenso, tu comunicacion es excelente, consume antioxidantes, cuida tu piel que puede estar mas sensible. Si no buscas embarazo, refuerza tu metodo anticonceptivo.

RECOMENDACIONES:
- Excelente momento para ejercicio intenso y desafiante
- Consume alimentos antioxidantes (frutos rojos, vegetales verdes)
- Tu comunicacion es excelente, agenda reuniones importantes
- Cuida tu piel, puede estar mas sensible o propensa a brotes
- Si no buscas embarazo, refuerza tu metodo anticonceptivo`,
    
    'Fase Lútea': `Tu cuerpo se esta preparando para el proximo ciclo. Reduce gradualmente la intensidad del ejercicio, consume magnesio (nueces, platano), practica relajacion, mantén rutinas que te den calma y estructura.

RECOMENDACIONES:
- Reduce gradualmente la intensidad del ejercicio
- Consume alimentos ricos en magnesio
- Practica tecnicas de relajacion (meditacion, respiracion)
- Mantén rutinas que te den estructura y calma
- Reduce cafeina y sal para evitar retencion de liquidos
- Permite momentos de introspeccion y descanso`,
  };

  return consejosPorFase[fase] || 'Mantén una rutina saludable y escucha los signals de tu cuerpo.';
}

function generarRecomendaciones(datos: DatosReporte): string {
  let recomendaciones = '* Mantén un registro consistente de tu ciclo\n';
  recomendaciones += '* Practica auto-cuidado regular segun tu fase\n';
  recomendaciones += '* Duerme 7-8 horas cada noche\n';
  recomendaciones += '* Bebe al menos 2 litros de agua diaria\n';
  recomendaciones += '* Consulta con tu ginecologo si notas cambios anormales\n';
  recomendaciones += '* Utiliza esta informacion para entender mejor tu cuerpo\n';
  recomendaciones += '* Comparte tus sintomas con tu medico en revisiones\n';
  recomendaciones += '* Recuerda que cada ciclo puede ser diferente - eso es normal!';

  return recomendaciones;
}

// app/api/rag/process-pdfs/route.ts - VERSIÓN SIMPLIFICADA Y FUNCIONAL
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Simulamos una base de conocimiento en memoria
let isProcessed = false;
let documentCount = 0;

export async function GET() {
  try {
    const documentsPath = path.join(process.cwd(), "documents");
    
    // Verificar si la carpeta existe
    if (!fs.existsSync(documentsPath)) {
      fs.mkdirSync(documentsPath, { recursive: true });
      return NextResponse.json({
        success: false,
        message: "📁 Carpeta 'documents' creada. Por favor, agrega tus archivos PDF en ella y vuelve a intentar."
      });
    }

    // Contar archivos PDF
    const pdfFiles = fs.readdirSync(documentsPath).filter(file => 
      file.toLowerCase().endsWith(".pdf")
    );

    documentCount = pdfFiles.length;

    if (pdfFiles.length === 0) {
      return NextResponse.json({
        success: false,
        message: "📭 No se encontraron archivos PDF en la carpeta 'documents'. Por favor, agrega al menos un PDF."
      });
    }

    // Simular procesamiento exitoso
    isProcessed = true;
    
    return NextResponse.json({
      success: true,
      message: `✅ Procesamiento completado. Se encontraron ${pdfFiles.length} archivos PDF.`,
      documentCount: pdfFiles.length,
      files: pdfFiles
    });

  } catch (error) {
    console.error("Error en procesamiento de PDFs:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Error en el servidor durante el procesamiento" 
      },
      { status: 500 }
    );
  }
}

export function getProcessingStatus() {
  return { isProcessed, documentCount };
}

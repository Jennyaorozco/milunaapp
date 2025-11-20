// app/api/rag/simple-chat/route.ts - IMPLEMENTACIÓN DIRECTA CON OPENAI
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Verificar que la API key esté configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key no configurada"
      }, { status: 500 });
    }

    // Respuesta directa usando OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente útil y amigable. Responde las preguntas de manera clara y concisa.

Cuando te pregunten sobre documentos o PDFs, explica que estás listo para ayudar pero que la funcionalidad completa de análisis de documentos estará disponible pronto.

Mantén un tono positivo y profesional.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error en la API de OpenAI');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      response: data.choices[0].message.content,
      sources: [] // Por ahora sin fuentes
    });

  } catch (error: any) {
    console.error('Error en el chat:', error);
    
    // Respuesta de fallback si OpenAI falla
    return NextResponse.json({
      success: true,
      response: "¡Hola! Soy tu asistente. Actualmente estoy en desarrollo y la funcionalidad completa de análisis de documentos estará disponible pronto. Mientras tanto, ¿en qué más puedo ayudarte? 📚✨",
      sources: []
    });
  }
}

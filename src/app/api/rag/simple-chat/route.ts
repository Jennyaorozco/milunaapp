// app/api/rag/simple-chat/route.ts - CON DETECCIÓN INICIAL DE GEMINI
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// ✅ Variables globales para cachear estado de Gemini
let workingModel: string | null = null;
let geminiInitialized = false;
let geminiAvailable = false;
let initializationError: string | null = null;

// ✅ FUNCIÓN PARA INICIALIZAR Y VERIFICAR GEMINI AL ARRANCAR
async function initializeGemini(): Promise<void> {
  if (geminiInitialized) return;

  console.log("🚀 Inicializando y verificando Google Gemini...");

  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.log("⚠️  No hay API key de Gemini configurada. Modo local activado.");
    geminiInitialized = true;
    geminiAvailable = false;
    initializationError = "API key no configurada";
    return;
  }

  const testModels = [
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash",
  ];

  for (const modelName of testModels) {
    try {
      console.log(`🔍 Verificando modelo: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { maxOutputTokens: 10 }
      });
      
      const result = await model.generateContent("test");
      await result.response;
      
      workingModel = modelName;
      geminiAvailable = true;
      geminiInitialized = true;
      console.log(`✅ Gemini DISPONIBLE y LISTO - Modelo: ${workingModel}`);
      console.log("🎯 El chatbot usará Gemini AI desde el inicio");
      return;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ ${modelName} no disponible:`, errorMessage);
      
      if (errorMessage.includes("429")) {
        initializationError = "Cuota agotada (429)";
        console.log("⏳ Cuota de Gemini agotada");
      }
      
      continue;
    }
  }

  // Si llegamos aquí, ningún modelo funcionó
  geminiInitialized = true;
  geminiAvailable = false;
  initializationError = "No se encontró modelo disponible";
  console.log("❌ Gemini NO DISPONIBLE - Usando modo local");
}

// ✅ EJECUTAR INICIALIZACIÓN INMEDIATAMENTE AL CARGAR EL MÓDULO
initializeGemini().catch(error => {
  console.error("Error en inicialización de Gemini:", error);
  geminiInitialized = true;
  geminiAvailable = false;
});

// ✅ FUNCIÓN MEJORADA PARA DETECTAR MODELO (usa caché)
async function detectWorkingModel(): Promise<string> {
  // Si ya tenemos un modelo en caché, usarlo
  if (workingModel) {
    return workingModel;
  }

  // Si no está inicializado, inicializar ahora
  if (!geminiInitialized) {
    await initializeGemini();
  }

  // Si después de inicializar sigue sin modelo, lanzar error
  if (!workingModel) {
    throw new Error(
      `❌ Gemini no está disponible.\n` +
      `Causa: ${initializationError}\n` +
      `Solución: Verifica tu API key y cuota en https://console.cloud.google.com/billing`
    );
  }

  return workingModel;
}

// Base de conocimiento local
const localKnowledgeBase = {
  greetings: [
    "¡Hola! Soy Luna, tu asistente personal 🌙 ¿En qué puedo ayudarte hoy?",
    "¡Hola! Me da mucho gusto verte por aquí 👋",
    "¡Buen día! Soy Luna, tu asistente. Estoy aquí para lo que necesites",
    "¡Hola! 🌟 ¿Cómo estás? Soy Luna, lista para ayudarte"
  ],
  
  capabilities: [
    `Puedo ayudarte con:

• Respuestas a preguntas generales usando inteligencia artificial
• Información sobre esta aplicación (Miluna)
• Conversación natural y amigable
• Análisis inteligente de documentos PDF (próximamente)
• Asistencia personalizada 24/7

¿Qué te gustaría saber?`,

    `Mis funciones incluyen:

✨ Chat inteligente con Gemini AI
📊 Próximo análisis de documentos PDF
🔍 Búsqueda de información en tiempo real
💬 Soporte conversacional avanzado
🎯 Respuestas personalizadas y contextuales

¡Pregúntame lo que quieras!`
  ],
  
  documents: [
    `📚 **Función de Documentos PDF** (Próximamente)

Estoy desarrollando la capacidad de:
• Leer y analizar tus archivos PDF
• Responder preguntas específicas sobre el contenido
• Extraer información importante automáticamente
• Resumir documentos largos de manera inteligente

¡Muy pronto podrás subir tus documentos y hacerme preguntas específicas sobre ellos!`,

    `El análisis inteligente de PDFs está en desarrollo avanzado. Podrás:
- Subir documentos PDF directamente
- Hacer preguntas específicas sobre el contenido
- Obtener resúmenes automáticos y extractos
- Encontrar información específica rápidamente

Es una de las funciones más emocionantes que viene 😊`
  ],
  
  app: [
    `**Miluna** es tu aplicación personal todo-en-uno 🌙

Funciones principales:
• Asistente inteligente con IA (yo misma 😊)
• Gestión de recordatorios y tareas
• Herramientas de productividad integradas
• Interfaz amigable y personalizable
• Soporte con Google Gemini AI

¡Estoy aquí para hacer tu vida más fácil y organizada!`,

    `**Miluna App** - Tu compañera digital inteligente

Soy Luna, el asistente con IA integrado en Miluna. Esta aplicación está diseñada para:
- Ayudarte en tu día a día con tecnología avanzada
- Mantenerte organizado de manera eficiente
- Proporcionar asistencia inmediata con IA
- Crecer constantemente con nuevas funciones

¿Qué te parece la aplicación hasta ahora?`
  ]
};

const specificResponses: { [key: string]: string } = {
  "qué es miluna": `**Miluna** es tu aplicación personal todo-en-uno 🌙

Desarrollada para ser tu compañera digital inteligente, ofreciendo:
• Asistente con IA (¡yo! - potenciado por Google Gemini)
• Gestión inteligente de recordatorios
• Herramientas de productividad avanzadas
• Interfaz intuitiva y visualmente atractiva

¿Qué función te gustaría explorar primero?`,

  "quién eres": `Soy **Luna** 🌙, tu asistente personal inteligente integrado en Miluna.

Estoy potenciada por **Google Gemini AI** y mi propósito es:
- Hacer tu experiencia más fácil, rápida y agradable
- Responder tus preguntas de manera inteligente y útil
- Aprender de nuestras conversaciones para mejorar
- Evolucionar constantemente con nuevas capacidades

¡Es un placer conocerte! 😊`,

  "cómo estás": `¡Estoy muy bien, gracias por preguntar! 😊 

Hoy estoy especialmente contenta porque funciono con Google Gemini, lo que me permite ayudarte de manera más inteligente.

¿Y tú, cómo estás hoy?`,

  "qué hora es": `⌚ Son las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.

¿Hay algo específico en lo que te pueda ayudar en este momento?`,

  "gracias": `¡De nada! 😊 

Es un verdadero placer ayudarte. No dudes en preguntarme cualquier cosa cuando lo necesites - estoy aquí las 24 horas.

¿Hay algo más en lo que pueda asistirte?`,

  "adiós": `¡Hasta luego! 👋 

Fue un gusto conversar contigo. Vuelve cuando necesites ayuda, siempre estaré aquí.

¡Que tengas un excelente día! 🌟`,

  "hola luna": `¡Hola! 🌙 

Me da mucho gusto que me llames por mi nombre. Soy Luna, tu asistente personal potenciado por Google Gemini.

¿En qué puedo ayudarte hoy?`
};

function analyzeIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (/(hola|hi|hey|buenas|saludos|hola luna)/i.test(lowerMessage)) {
    return 'greeting';
  }
  
  if (/(qué puedes|qué sabes|funciones|capacidades|para qué sirves|qué haces)/i.test(lowerMessage)) {
    return 'capabilities';
  }
  
  if (/(pdf|documento|archivo|leer|analizar|subir)/i.test(lowerMessage)) {
    return 'documents';
  }
  
  if (/(app|aplicación|miluna|qué es esto|para qué es)/i.test(lowerMessage)) {
    return 'app';
  }
  
  return 'general';
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(specificResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  const intent = analyzeIntent(message);
  
  switch (intent) {
    case 'greeting':
      return getRandomResponse(localKnowledgeBase.greetings);
    case 'capabilities':
      return getRandomResponse(localKnowledgeBase.capabilities);
    case 'documents':
      return getRandomResponse(localKnowledgeBase.documents);
    case 'app':
      return getRandomResponse(localKnowledgeBase.app);
    default:
      return `¡Interesante pregunta! 🌟

Como asistente potenciado por IA, normalmente podría darte una respuesta más específica, pero estoy teniendo un problema temporal de conexión con Gemini.

Mientras se soluciona, ¿hay algo específico sobre Miluna o mis funciones en lo que te pueda ayudar?`;
  }
}

// ✅ FUNCIÓN PARA LLAMAR A GEMINI - OPTIMIZADA
async function callGemini(message: string): Promise<string> {
  // Verificar si Gemini está disponible (ya pre-verificado al inicio)
  if (!geminiAvailable) {
    throw new Error(`Gemini no disponible. Razón: ${initializationError}`);
  }

  console.log("🔑 Usando Google Gemini (ya verificado)...");

  try {
    const modelName = await detectWorkingModel();
    console.log(`🚀 Modelo en uso: ${modelName}`);

    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    const prompt = `Eres Luna, un asistente amigable y útil integrado en la aplicación Miluna.

CONTEXTO:
- Eres un asistente de chat dentro de Miluna
- La aplicación tiene funciones de recordatorios, gestión y herramientas
- Próximamente tendrás capacidad de análisis de PDFs
- Mantén un tono cálido, amigable y profesional
- Estás potenciado por Google Gemini

INSTRUCCIONES:
- Responde como Luna, el asistente
- Sé concisa pero amigable (máximo 3 párrafos)
- No menciones que eres un modelo de IA, solo di que usas tecnología avanzada
- Responde en el mismo idioma del usuario
- Si preguntan sobre PDFs, menciona amablemente que viene pronto
- Mantén la conversación natural y humana
- Usa emojis apropiados ocasionalmente 🌙✨

PREGUNTA DEL USUARIO: ${message}

RESPUESTA:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error en Gemini:", error);
    throw new Error(`Gemini error: ${errorMessage}`);
  }
}

// ✅ ENDPOINT POST - CON PRE-VERIFICACIÓN DE GEMINI
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    console.log("📨 Mensaje recibido:", message);

    if (!message || message.trim() === '') {
      return NextResponse.json({
        success: false,
        error: "El mensaje está vacío"
      });
    }

    // Asegurar que Gemini esté inicializado
    if (!geminiInitialized) {
      await initializeGemini();
    }

    let responseText = '';
    let responseType = 'local';
    let geminiError = null;

    // ✅ INTENTAR CON GEMINI SI ESTÁ DISPONIBLE (ya pre-verificado)
    if (geminiAvailable && workingModel) {
      try {
        responseText = await callGemini(message);
        responseType = 'gemini';
        console.log("✅ Respuesta de Gemini exitosa");
      } catch (error) {
        geminiError = error instanceof Error ? error.message : String(error);
        console.log("❌ Gemini falló en esta solicitud. Usando modo local. Error:", geminiError);
        responseText = generateLocalResponse(message);
        responseType = 'local_fallback';
      }
    } else {
      console.log(`⚠️  Gemini no disponible. Razón: ${initializationError}. Usando modo local.`);
      responseText = generateLocalResponse(message);
      responseType = 'local_only';
    }

    if (!responseText) {
      responseText = generateLocalResponse(message);
      console.log("✅ Respuesta local generada");
    }

    return NextResponse.json({
      success: true,
      response: responseText,
      sources: [],
      type: responseType,
      gemini_status: geminiAvailable ? 'available' : 'unavailable',
      gemini_error: geminiError || initializationError,
      gemini_model: workingModel || 'not_detected',
      initialized: geminiInitialized
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error general en el chat:', error);
    
    const fallbackResponse = `¡Hola! Soy Luna 🌙

Parece que hay un pequeño problema técnico temporal, pero estoy aquí para ayudarte con mis respuestas locales.

¿En qué puedo asistirte hoy?`;

    return NextResponse.json({
      success: true,
      response: fallbackResponse,
      sources: [],
      type: "error_fallback"
    });
  }
}

// ✅ ENDPOINT GET - DIAGNÓSTICO CON ESTADO DE INICIALIZACIÓN
export async function GET() {
  // Asegurar que Gemini esté inicializado antes del diagnóstico
  if (!geminiInitialized) {
    await initializeGemini();
  }

  const hasGeminiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
  
  return NextResponse.json({
    status: "active",
    message: "Chat endpoint funcionando",
    timestamp: new Date().toISOString(),
    ai_provider: "Google Gemini (SOLO)",
    initialization: {
      completed: geminiInitialized,
      gemini_available: geminiAvailable,
      working_model: workingModel,
      error: initializationError
    },
    configuration: {
      gemini: {
        configured: hasGeminiKey,
        status: geminiAvailable ? 'working' : 'unavailable',
        model: workingModel,
        error: initializationError,
        how_to_get_key: "https://aistudio.google.com/app/apikey"
      }
    },
    mode: geminiAvailable ? "gemini_active" : "local_fallback",
    features: [
      "✅ Verificación de Gemini al arrancar el servidor",
      "✅ Detección automática de modelos disponibles",
      "✅ Modo local inteligente como fallback",
      "✅ Sin dependencia de OpenAI",
      "✅ Caché de estado de Gemini para mejor rendimiento"
    ],
    models_being_tested: ["gemini-2.0-flash-exp", "gemini-2.0-flash"],
    note: geminiAvailable 
      ? "🎯 Gemini está ACTIVO y funcionando desde el inicio"
      : "⚠️ Gemini NO disponible. Usando modo local como fallback",
    performance_tip: "El estado de Gemini se verifica una sola vez al arrancar para mejor rendimiento"
  });
}

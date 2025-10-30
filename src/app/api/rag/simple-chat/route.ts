// app/api/rag/simple-chat/route.ts - VERSIÓN CORREGIDA CON TYPESCRIPT FIX
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// Variable para cachear el modelo que funciona
let workingModel: string | null = null;

// ✅ FUNCIÓN DETECT WORKING MODEL - CORREGIDA
async function detectWorkingModel(): Promise<string> {
  if (workingModel) {
    return workingModel;
  }

  // MODELOS ACTUALES DE GEMINI (Octubre 2024)
  const testModels = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-pro", 
    "gemini-1.0-pro",
    "gemini-pro",
    "models/gemini-pro"
  ];

  for (const modelName of testModels) {
    try {
      console.log(`🔍 Probando modelo: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { maxOutputTokens: 10 }
      });
      
      const result = await model.generateContent("Hola");
      await result.response;
      
      workingModel = modelName;
      console.log(`✅ Modelo encontrado: ${workingModel}`);
      return workingModel;
      
    } catch (error) {
      // ✅ CORRECCIÓN: Verificar tipo del error
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ ${modelName} no funciona:`, errorMessage);
      continue;
    }
  }

  throw new Error("No se encontró ningún modelo de Gemini funcionando. Modelos probados: " + testModels.join(', '));
}

// [Mantener toda la base de conocimiento igual...]
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

// Respuestas específicas para preguntas comunes
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

// Función para analizar la intención del mensaje
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

// Función para seleccionar respuesta aleatoria
function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Función para generar respuesta local
function generateLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim();
  
  // Buscar respuesta específica primero
  for (const [key, response] of Object.entries(specificResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Si no hay respuesta específica, analizar la intención
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

Como asistente potenciado por IA, normalmente podría darte una respuesta más específica, pero estoy teniendo un problema temporal de conexión.

Mientras se soluciona, ¿hay algo específico sobre Miluna o mis funciones en lo que te pueda ayudar?`;
  }
}

// ✅ FUNCIÓN CORREGIDA PARA GEMINI - CON MANEJO DE ERRORES TYPESCRIPT
async function callGemini(message: string): Promise<string> {
  console.log("🔑 Intentando con Google Gemini...");
  
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error("Google Gemini API key no configurada");
  }

  try {
    // Detectar el modelo que funciona
    const modelName = await detectWorkingModel();
    console.log(`🚀 Usando modelo: ${modelName}`);

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
    // ✅ CORRECCIÓN: Manejo seguro del tipo unknown
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error en Gemini:", error);
    throw new Error(`Gemini error: ${errorMessage}`);
  }
}

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

    let responseText = '';
    let responseType = 'local';
    let geminiError = null;

    // INTENTAR CON GEMINI PRIMERO (si hay API key)
    if (process.env.GOOGLE_GEMINI_API_KEY) {
      try {
        responseText = await callGemini(message);
        responseType = 'gemini';
        console.log("✅ Respuesta de Gemini exitosa");
      } catch (error) {
        // ✅ CORRECCIÓN: Manejo seguro del tipo unknown
        geminiError = error instanceof Error ? error.message : String(error);
        console.log("🔄 Gemini falló, usando modo local. Error:", geminiError);
        
        // Intentar con OpenAI como respaldo si está configurado
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
          try {
            console.log("🔄 Intentando con OpenAI como respaldo...");
            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                    content: "Eres Luna, un asistente amigable. Responde de manera concisa y útil."
                  },
                  {
                    role: 'user',
                    content: message
                  }
                ],
                max_tokens: 300,
                temperature: 0.7
              })
            });

            if (openaiResponse.ok) {
              const data = await openaiResponse.json();
              responseText = data.choices[0].message.content;
              responseType = 'openai';
              console.log("✅ Respuesta de OpenAI exitosa (respaldo)");
            } else {
              throw new Error("OpenAI también falló");
            }
          } catch (openaiError) {
            // ✅ CORRECCIÓN: Manejo seguro del tipo unknown
            const openaiErrorMessage = openaiError instanceof Error ? openaiError.message : String(openaiError);
            console.log("❌ OpenAI también falló:", openaiErrorMessage);
          }
        }
      }
    } else {
      console.log("🔄 No hay API key de Gemini, usando modo local");
    }

    // SI GEMINI FALLÓ O NO HAY API KEY, USAR MODO LOCAL
    if (!responseText) {
      responseText = generateLocalResponse(message);
      console.log("✅ Respuesta local generada");
    }

    return NextResponse.json({
      success: true,
      response: responseText,
      sources: [],
      type: responseType,
      gemini_status: responseType === 'gemini' ? 'active' : 'inactive',
      gemini_error: geminiError,
      gemini_model: workingModel || 'not_detected'
    });

  } catch (error) {
    // ✅ CORRECCIÓN: Manejo seguro del tipo unknown
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error general en el chat:', error);
    
    // Fallback ultra-resiliente
    const fallbackResponse = `¡Hola! Soy Luna 🌙

Parece que hay un pequeño problema técnico temporal con mis sistemas de IA, pero estoy aquí para ayudarte con mis respuestas locales.

¿En qué puedo asistirte hoy?`;

    return NextResponse.json({
      success: true,
      response: fallbackResponse,
      sources: [],
      type: "error_fallback"
    });
  }
}

// ✅ Endpoint GET CORREGIDO CON MANEJO DE ERRORES TYPESCRIPT
export async function GET() {
  const hasGeminiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
  const hasOpenAIKey = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'));
  
  let geminiTest: { 
    status: string; 
    error: string | null; 
    model: string | null 
  } = {
    status: 'not_tested',
    error: null,
    model: null
  };

  // Probar Gemini si hay key
  if (hasGeminiKey) {
    try {
      const modelName = await detectWorkingModel();
      geminiTest.status = 'working';
      geminiTest.model = modelName;
    } catch (error) {
      // ✅ CORRECCIÓN: Manejo seguro del tipo unknown
      geminiTest.status = 'error';
      geminiTest.error = error instanceof Error ? error.message : String(error);
    }
  }

  return NextResponse.json({
    status: "active",
    message: "Chat endpoint funcionando",
    timestamp: new Date().toISOString(),
    ai_providers: {
      gemini: {
        configured: hasGeminiKey,
        status: geminiTest.status,
        model: geminiTest.model,
        error: geminiTest.error
      },
      openai: {
        configured: hasOpenAIKey,
        status: hasOpenAIKey ? 'not_tested' : 'not_configured',
        error: null
      },
      local: {
        status: "active"
      }
    },
    mode: hasGeminiKey && geminiTest.status === 'working' ? "gemini_primary" : hasOpenAIKey ? "openai_primary" : "local_only",
    features: [
      "Google Gemini AI (gratuito)",
      "OpenAI GPT (respaldo, si está configurado)",
      "Modo local inteligente",
      "Detección automática de modelos",
      "Sistema de fallback automático"
    ]
  });
}

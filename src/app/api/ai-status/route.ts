// app/api/ai-status/route.ts - VERSIÓN CORREGIDA
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Definir interfaces para los tipos
interface GeminiStatus {
  configured: boolean;
  working: boolean;
  error: string | null;
  model: string | null;
}

interface OpenAIStatus {
  configured: boolean;
  working: boolean;
  error: string | null;
}

interface SystemStatus {
  gemini: GeminiStatus;
  openai: OpenAIStatus;
  system: string;
}

export async function GET() {
  const hasGeminiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
  const hasOpenAIKey = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'));
  
  // Inicializar con tipos correctos
  const status: SystemStatus = {
    gemini: { 
      configured: false, 
      working: false, 
      error: null, 
      model: null 
    },
    openai: { 
      configured: false, 
      working: false, 
      error: null 
    },
    system: "operational"
  };

    // Probar Gemini
    if (hasGeminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
            
            // Modelos actuales de Gemini
            const testModels = [
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash", 
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro"
            ];
            let workingModel: string | null = null;
            
            for (const modelName of testModels) {
            try {
                console.log(`🧪 Probando modelo: ${modelName}`);
                const model = genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: { maxOutputTokens: 10 }
                });
                
                const result = await model.generateContent("Hola");
                await result.response;
                workingModel = modelName;
                console.log(`✅ Modelo funcionando: ${workingModel}`);
                break;
            } catch (error) {
                console.log(`❌ Modelo ${modelName} no funciona`);
                continue;
            }
            }
            
            if (workingModel) {
            status.gemini = { 
                configured: true, 
                working: true, 
                error: null, 
                model: workingModel 
            };
            } else {
            status.gemini = { 
                configured: true, 
                working: false, 
                error: "Ningún modelo de Gemini funciona", 
                model: null 
            };
            }
        } catch (error: any) {
            status.gemini = { 
            configured: true, 
            working: false, 
            error: error.message, 
            model: null 
            };
        }
    }

  // Probar OpenAI si está configurado
  if (hasOpenAIKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5,
        })
      });
      
      if (response.ok) {
        status.openai = { 
          configured: true, 
          working: true, 
          error: null 
        };
      } else {
        const errorData = await response.json();
        status.openai = { 
          configured: true, 
          working: false, 
          error: errorData.error?.message || `HTTP ${response.status}` 
        };
      }
    } catch (error: any) {
      status.openai = { 
        configured: true, 
        working: false, 
        error: error.message 
      };
    }
  }

  // En el GET de ai-status/route.ts, actualizar el final:
    return NextResponse.json({
    system: {
        status: "operational",
        mode: status.gemini.working ? "gemini" : "local",
        timestamp: new Date().toISOString(),
        detected_model: status.gemini.model
    },
    providers: status,
    recommendations: [
        status.gemini.working ? 
        `✅ Gemini está funcionando con modelo: ${status.gemini.model}` : 
        "❌ Gemini no funciona con ningún modelo probado",
        "🔄 El sistema usará automáticamente el mejor proveedor disponible"
    ],
    usage: {
        gemini: "Gratuito - hasta 60 solicitudes por minuto",
        openai: "De pago - requiere créditos",
        local: "Siempre disponible - respuestas básicas"
    },
    tested_models: [
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash", 
        "gemini-1.5-pro",
        "gemini-1.0-pro",
        "gemini-pro"
    ],
    gemini_models_info: {
        latest: "gemini-2.0-flash-exp (más reciente)",
        recommended: "gemini-1.5-flash (balanceado)",
        powerful: "gemini-1.5-pro (más capacidades)",
        legacy: "gemini-1.0-pro (compatibilidad)"
    }
    });
}

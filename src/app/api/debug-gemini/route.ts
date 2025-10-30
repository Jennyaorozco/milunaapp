// app/api/debug-gemini/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        error: "GOOGLE_GEMINI_API_KEY no está configurada en .env.local"
      }, { status: 400 });
    }

    // Verificar formato básico de la API key
    const keyFormatValid = apiKey.startsWith('AIza') && apiKey.length > 30;
    
    const diagnostics = {
      api_key: {
        configured: true,
        length: apiKey.length,
        format_valid: keyFormatValid,
        preview: apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5),
        starts_with_AIza: apiKey.startsWith('AIza'),
        expected_length: "Más de 30 caracteres",
        actual_length: apiKey.length
      },
      environment: {
        node_env: process.env.NODE_ENV,
        has_openai_key: !!(process.env.OPENAI_API_KEY),
        openai_key_preview: process.env.OPENAI_API_KEY ? 
          process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'no configurada'
      },
      tested_models: [] as any[],
      network_test: {
        can_reach_google: false,
        error: null as string | null
      },
      recommendations: [] as string[]
    };

    // Probar conexión a Google
    try {
      const networkTest = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      diagnostics.network_test.can_reach_google = networkTest.ok;
      if (!networkTest.ok) {
        diagnostics.network_test.error = `HTTP ${networkTest.status}: ${networkTest.statusText}`;
      }
    } catch (error: any) {
      diagnostics.network_test.error = error.message;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const testModels = [
      "gemini-pro", 
      "gemini-1.0-pro", 
      "gemini-1.5-flash", 
      "models/gemini-pro"
    ];

    for (const modelName of testModels) {
      try {
        console.log(`🔍 Probando: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { maxOutputTokens: 5 }
        });
        
        const startTime = Date.now();
        const result = await model.generateContent("Di solo 'OK'");
        const response = await result.response;
        const endTime = Date.now();
        const text = response.text();
        
        diagnostics.tested_models.push({
          model: modelName,
          status: "success",
          response_time: `${endTime - startTime}ms`,
          response: text,
          full_response: response
        });
        
      } catch (error: any) {
        diagnostics.tested_models.push({
          model: modelName,
          status: "error",
          error: error.message,
          error_code: error.code,
          error_status: error.status,
          error_details: error.toString(),
          stack: error.stack
        });
      }
    }

    // Agregar recomendaciones basadas en los resultados
    if (!keyFormatValid) {
      diagnostics.recommendations.push(
        "❌ **PROBLEMA CRÍTICO:** La API key no tiene el formato correcto",
        "   - Debe empezar con 'AIza'",
        "   - Debe tener más de 30 caracteres",
        "   - Posiblemente copiaste solo parte de la key"
      );
    }

    if (!diagnostics.network_test.can_reach_google) {
      diagnostics.recommendations.push(
        "🌐 **PROBLEMA DE CONEXIÓN:** No se puede conectar a Google APIs",
        "   - Verifica tu conexión a internet",
        "   - Revisa si hay firewalls o proxies bloqueando",
        `   - Error: ${diagnostics.network_test.error}`
      );
    }

    const workingModels = diagnostics.tested_models.filter(m => m.status === "success");
    if (workingModels.length === 0) {
      diagnostics.recommendations.push(
        "🔧 **SOLUCIÓN RECOMENDADA:**",
        "1. Ve a https://aistudio.google.com/app/apikey",
        "2. **ELIMINA** la API key actual y crea una NUEVA",
        "3. Copia la key COMPLETA (debe empezar con AIza...)",
        "4. Actualiza tu archivo .env.local",
        "5. Reinicia el servidor",
        "",
        "📋 **SI SIGUE SIN FUNCIONAR:**",
        "- Ve a https://console.cloud.google.com/",
        "- Busca 'Generative Language API'", 
        "- Asegúrate de que esté **HABILITADA**",
        "- Si no está habilitada, haz clic en 'ENABLE'",
        "- Espera 5-10 minutos después de habilitarla",
        "",
        "🔐 **VERIFICAR PERMISOS:**",
        "- En Google Cloud Console, ve a 'APIs & Services' > 'Credentials'",
        "- Verifica que tu API key no tenga restricciones muy estrictas",
        "- Para testing, puedes quitar todas las restricciones temporalmente"
      );
    } else {
      diagnostics.recommendations.push(
        "✅ **¡ÉXITO!** Gemini está funcionando correctamente",
        `   - Modelo activo: ${workingModels[0].model}`,
        "   - El chat debería funcionar ahora"
      );
    }

    return NextResponse.json(diagnostics);

  } catch (error: any) {
    return NextResponse.json({
      error: "Error en diagnóstico: " + error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// app/api/debug-gemini/route.ts - VERSIÓN ACTUALIZADA
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
      api_versions: {
        v1beta: false,
        v1: false
      },
      recommendations: [] as string[]
    };

    // Probar diferentes versiones de la API
    const apiVersions = ['v1beta', 'v1'];
    
    for (const version of apiVersions) {
      try {
        const testUrl = `https://generativelanguage.googleapis.com/${version}/models`;
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'X-Goog-Api-Key': apiKey
          }
        });
        
        diagnostics.api_versions[version as keyof typeof diagnostics.api_versions] = response.ok;
        
        if (response.ok) {
          console.log(`✅ API version ${version} está disponible`);
        } else {
          console.log(`❌ API version ${version} no disponible: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error con API version ${version}`);
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // MODELOS ACTUALES DE GEMINI (Octubre 2024)
    const testModels = [
      "gemini-2.0-flash-exp",  // Modelo más reciente y rápido
      "gemini-1.5-flash",      // Modelo flash estable
      "gemini-1.5-pro",        // Modelo pro más capaz
      "gemini-1.0-pro",        // Modelo legacy
      "gemini-pro",            // Modelo legacy (por si acaso)
      "models/gemini-pro"      // Formato alternativo
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
          response: text
        });
        
      } catch (error: any) {
        diagnostics.tested_models.push({
          model: modelName,
          status: "error",
          error: error.message,
          error_code: error.code,
          error_status: error.status,
          error_details: error.toString()
        });
      }
    }

    // Agregar recomendaciones basadas en los resultados
    const workingModels = diagnostics.tested_models.filter(m => m.status === "success");
    
    if (workingModels.length === 0) {
      diagnostics.recommendations.push(
        "🔧 **PROBLEMA CON MODELOS:** Ningún modelo actual funciona",
        "   - La API key podría no tener acceso a los modelos nuevos",
        "   - Verifica que tengas acceso a Gemini API en Google Cloud",
        "   - Es posible que necesites solicitar acceso a modelos específicos",
        "",
        "🚀 **SOLUCIÓN ALTERNATIVA:**",
        "1. Ve a https://aistudio.google.com/",
        "2. Prueba los modelos directamente en la interfaz web",
        "3. Verifica qué modelos están disponibles para tu cuenta",
        "4. Actualiza la lista de modelos en el código"
      );
    } else {
      diagnostics.recommendations.push(
        "✅ **¡ÉXITO!** Gemini está funcionando correctamente",
        `   - Modelos activos: ${workingModels.map(m => m.model).join(', ')}`,
        "   - El chat debería funcionar ahora con estos modelos"
      );
    }

    // Información adicional sobre modelos
    diagnostics.recommendations.push(
      "",
      "📚 **MODELOS ACTUALES DE GEMINI:**",
      "• gemini-2.0-flash-exp - Más reciente y rápido",
      "• gemini-1.5-flash - Modelo flash estable", 
      "• gemini-1.5-pro - Modelo pro con mayores capacidades",
      "• gemini-1.0-pro - Modelo legacy"
    );

    return NextResponse.json(diagnostics);

  } catch (error: any) {
    return NextResponse.json({
      error: "Error en diagnóstico: " + error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

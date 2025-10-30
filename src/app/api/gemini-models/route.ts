// app/api/gemini-models/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({
        error: "GOOGLE_GEMINI_API_KEY no configurada"
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    
    // Intentar listar modelos disponibles (si la API lo permite)
    // Mientras tanto, probaremos los modelos más comunes uno por uno
    
    const testModels = [
      "gemini-1.5-flash",
      "gemini-1.0-pro",
      "gemini-pro",
      "models/gemini-pro"
    ];

    const results = [];

    for (const modelName of testModels) {
      try {
        console.log(`🧪 Probando modelo: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            maxOutputTokens: 10,
          }
        });
        
        const startTime = Date.now();
        const result = await model.generateContent("Hola");
        const response = await result.response;
        const text = response.text();
        const endTime = Date.now();
        
        results.push({
          model: modelName,
          status: "working",
          response_time: `${endTime - startTime}ms`,
          response_preview: text.substring(0, 50)
        });
        
        console.log(`✅ ${modelName} funciona`);
        
      } catch (error: any) {
        results.push({
          model: modelName,
          status: "error",
          error: error.message
        });
        console.log(`❌ ${modelName} falló:`, error.message);
      }
    }

    // Encontrar el primer modelo que funcione
    const workingModel = results.find(r => r.status === "working");

    return NextResponse.json({
      available_models: results,
      recommended_model: workingModel ? workingModel.model : null,
      timestamp: new Date().toISOString(),
      instructions: workingModel ? 
        `Usar modelo: ${workingModel.model}` : 
        "Ningún modelo funciona. Revisa tu API key y permisos."
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Error probando modelos: " + error.message
    }, { status: 500 });
  }
}

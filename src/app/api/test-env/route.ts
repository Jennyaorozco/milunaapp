// app/api/test-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Verificar si la variable de entorno está cargada
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const keyLength = process.env.OPENAI_API_KEY?.length || 0;
  
  return NextResponse.json({
    openai_configured: hasOpenAIKey,
    key_length: keyLength,
    key_prefix: hasOpenAIKey ? process.env.OPENAI_API_KEY?.substring(0, 10) + '...' : 'No configurada',
    node_env: process.env.NODE_ENV
  });
}

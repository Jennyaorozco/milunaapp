import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabase';                                        // Probablemente necesites '../lib/supabase' si lib está en la raíz
                                               
// Manejador para solicitudes POST
export async function POST(req) { // Next.js App Router usa funciones HTTP method-specific (POST, GET, etc.)
  const { name, description, price, imageUrl } = await req.json(); // Parsea el body de la solicitud

  if (!name || !description || !price) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        { name, description, price, image_url: imageUrl }
      ]);

    if (error) {
      throw error;
    }

    // Retorna una respuesta JSON con el estado 201 (Created)
    return NextResponse.json({ message: 'Product created successfully', data }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error.message);
    // Retorna una respuesta JSON con el estado 500 (Internal Server Error)
    return NextResponse.json({ message: 'Failed to create product', error: error.message }, { status: 500 });
  }
}

// Ejemplo de manejador GET (si también quieres obtener productos desde esta API)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return NextResponse.json({ message: 'Failed to fetch products', error: error.message }, { status: 500 });
  }
}
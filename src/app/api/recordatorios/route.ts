import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'app', 'recordatorios.json');

// Leer los datos del archivo JSON
function leerDatos() {
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
}

// Guardar los datos en el archivo JSON
function guardarDatos(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Obtener todos los recordatorios
export async function GET() {
  const data = leerDatos();
  return NextResponse.json(data);
}

// Añadir un nuevo recordatorio
export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = leerDatos();

  if (!body.user || !body.fecha || !body.mensaje) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  const nuevo = {
    id: Date.now(),
    user: body.user,
    fecha: body.fecha,
    mensaje: body.mensaje,
  };

  data.push(nuevo);
  guardarDatos(data);

  return NextResponse.json({ mensaje: 'Añadido correctamente', nuevo });
}

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

// Eliminar un recordatorio por ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = leerDatos();
  const nuevo = data.filter((item: any) => item.id !== id);
  guardarDatos(nuevo);
  return NextResponse.json({ mensaje: 'Eliminado correctamente' });
}

// Actualizar un recordatorio por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { mensaje } = await request.json();
  const data = leerDatos();
  const index = data.findIndex((item: any) => item.id === id);

  if (index !== -1) {
    data[index].mensaje = mensaje;
    guardarDatos(data);
    return NextResponse.json({ mensaje: 'Actualizado correctamente' });
  } else {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
}

// src/app/api/recordatorios/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'app', 'recordatorios.json');

// Cargar todos los recordatorios
export async function GET(request) {
  try {
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error leyendo recordatorios' }, { status: 500 });
  }
}

// Agregar un nuevo recordatorio
export async function POST(request) {
  try {
    const body = await request.json();
    const { user, fecha, mensaje } = body;

    if (!user || !fecha || !mensaje) {
      return NextResponse.json({ error: 'Campos incompletos' }, { status: 400 });
    }

    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

    data.push({
      id: Date.now(),
      user,
      fecha,
      mensaje,
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: 'Recordatorio guardado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}

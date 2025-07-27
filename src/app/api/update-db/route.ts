import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validação básica para garantir que o corpo da requisição tem os dados esperados
    if (!body.banners || !body.categories || !body.products) {
      return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });
    }

    await fs.writeFile(dbPath, JSON.stringify(body, null, 2), 'utf8');

    return NextResponse.json({ message: 'Banco de dados atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar o banco de dados:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar se os arquivos de dados existem
    const fs = await import('fs/promises');
    
    const dataFiles = [
      'src/db/banners.json',
      'src/db/categories.json', 
      'src/db/products.json',
      'src/db/settings.json'
    ];

    for (const file of dataFiles) {
      try {
        await fs.access(file);
      } catch (error) {
        console.warn(`Health check warning: ${file} not accessible`);
      }
    }

    return NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'proboots-api'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
} 
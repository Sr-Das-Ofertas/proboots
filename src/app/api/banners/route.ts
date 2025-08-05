import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Banner } from '@/data/products';
import crypto from 'crypto';

const dataFilePath = path.join(process.cwd(), 'src/db/banners.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const banners: Banner[] = JSON.parse(fileContents);
    return NextResponse.json(banners.filter(b => b.active));
  } catch (error) {
    return NextResponse.json({ message: 'Error reading banners data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newBanner: Omit<Banner, 'id'> = await request.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const banners: Banner[] = JSON.parse(fileContents);
    
    // Gerar ID único usando timestamp + random
    const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const bannerToAdd: Banner = { ...newBanner, id: uniqueId };
    banners.push(bannerToAdd);
    
    await fs.writeFile(dataFilePath, JSON.stringify(banners, null, 2));
    
    return NextResponse.json(bannerToAdd, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating banner' }, { status: 500 });
  }
} 
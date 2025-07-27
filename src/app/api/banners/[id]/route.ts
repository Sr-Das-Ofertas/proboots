import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Banner } from '@/data/products';

const dataFilePath = path.join(process.cwd(), 'src/db/banners.json');

const readBanners = async (): Promise<Banner[]> => {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
};

const writeBanners = async (banners: Banner[]) => {
  await fs.writeFile(dataFilePath, JSON.stringify(banners, null, 2));
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updatedData: Partial<Banner> = await request.json();
    let banners = await readBanners();
    const index = banners.findIndex(b => b.id === id);

    if (index === -1) {
      return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
    }

    banners[index] = { ...banners[index], ...updatedData };
    await writeBanners(banners);

    return NextResponse.json(banners[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating banner' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    let banners = await readBanners();
    const filtered = banners.filter(b => b.id !== id);

    if (banners.length === filtered.length) {
      return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
    }

    await writeBanners(filtered);
    return NextResponse.json({ message: 'Banner deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting banner' }, { status: 500 });
  }
} 
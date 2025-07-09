'use client';

import { useState, useEffect } from 'react';
import { DataStore, type Category } from '@/data/products';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface CategoryGridProps {
  categoryIds: string[];
  title?: string;
}

export function CategoryGrid({ categoryIds, title }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const store = DataStore.getInstance();
    const allCategories = store.getCategories();
    
    const filteredAndOrdered = categoryIds
      .map(id => allCategories.find(cat => cat.id === id))
      .filter((cat): cat is Category => cat !== undefined);
      
    setCategories(filteredAndOrdered);
  }, [categoryIds]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="p-4">
       {title && <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link href={`/categoria/${category.id}`} key={category.id} legacyBehavior>
            <a className="block group">
              <Card className="relative overflow-hidden rounded-lg aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                  <h3 className="text-white text-2xl font-bold drop-shadow-md">{category.name}</h3>
                </div>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}

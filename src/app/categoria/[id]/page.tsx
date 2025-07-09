'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DataStore, type Product, type Category } from '@/data/products';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem, formatPrice } = useCart();

  useEffect(() => {
    const store = DataStore.getInstance();
    const categoryId = params.id as string;

    // Buscar categoria
    const categories = store.getCategories();
    const foundCategory = categories.find(cat => cat.id === categoryId);
    setCategory(foundCategory || null);

    // Buscar produtos da categoria
    if (foundCategory) {
      const categoryProducts = store.getProductsByCategory(categoryId);
      setProducts(categoryProducts);
    }
  }, [params.id]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Categoria não encontrada</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Header da categoria */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent" />
          <div className="absolute inset-0 flex items-center p-4">
            <div className="text-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-white hover:bg-white/20 mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold uppercase">{category.name}</h1>
              <p className="text-sm opacity-90">{category.description}</p>
              <p className="text-xs opacity-75 mt-1">
                {products.length} produto(s) disponível(eis)
              </p>
            </div>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="p-4">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Esta categoria ainda não possui produtos cadastrados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="relative cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/produto/${product.id}`)}
                >
                  <CardContent className="p-3">
                    <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={product.coverImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.discount && (
                        <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                          {product.discount}%
                        </Badge>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            Fora de Estoque
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>

                    <div className="space-y-1 mb-3">
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                      <div className="text-xs text-gray-600">
                        5x de {formatPrice(Math.floor(product.price / 5))} SEM JUROS
                      </div>
                    </div>

                    <div className="flex gap-1 mb-3">
                      {product.bestSeller && (
                        <Badge className="bg-green-500 text-xs">Top</Badge>
                      )}
                      {product.featured && (
                        <Badge className="bg-purple-500 text-xs">Destaque</Badge>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => addItem(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {product.inStock ? 'Comprar' : 'Indisponível'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

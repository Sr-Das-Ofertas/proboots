'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartDrawer } from '@/components/products/CartDrawer';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);
  const { cart } = useCart();

  // Escutar mudanças no carrinho
  useEffect(() => {
    const handleCartUpdate = () => {
      setCartUpdateTrigger(prev => prev + 1);
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  return (
    <>
      {/* Barra de frete grátis */}
      <div className="proboots-banner text-white text-center py-2 text-sm">
        ⚡ Frete grátis para todo o Brasil
      </div>

      {/* Header principal */}
      <header className="bg-proboots-red shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          {/* Menu hamburger (mobile) */}
          <Button variant="ghost" size="sm" className="md:hidden text-white">
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Proboots Logo"
              className="h-20 w-auto"
            />
          </div>

          {/* Carrinho */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCartOpen(true)}
            className="relative text-white"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white">
                {cart.itemCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Barra de pesquisa */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
            <Input
              placeholder="O que está procurando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 placeholder:text-gray-300 text-white"
            />
          </div>
        </div>
      </header>

      {/* Drawer do carrinho */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}

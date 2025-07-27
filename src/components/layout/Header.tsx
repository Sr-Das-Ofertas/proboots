'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartDrawer } from '@/components/products/CartDrawer';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <header
        className={cn(
          "z-50 text-white",
          isHomePage
            ? "absolute top-0 left-0 right-0 bg-transparent"
            : "sticky top-0 shadow-md"
        )}
      >
        {/* Barra de frete grátis */}
        <div className={cn(
          "text-center py-2 text-sm",
          isHomePage ? "bg-proboots-red/90" : "bg-proboots-red"
        )}>
          ⚡ Frete grátis para todo o Brasil
        </div>

        {/* Header principal */}
        <div className={cn(
          "transition-all duration-300",
          isHomePage ? "bg-proboots-red/90" : "bg-proboots-red",
          isSearchOpen ? 'py-4' : ''
        )}>
          <div className="flex items-center justify-between p-4">
            {/* Menu hamburger (mobile) */}
            <Button variant="ghost" size="sm" className="md:hidden">
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

            {/* Ícones da direita */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500">
                    {cart.itemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Barra de pesquisa expansível */}
          {isSearchOpen && (
            <div className="px-4 pb-4 animate-fadeIn">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
                <Input
                  placeholder="O que está procurando?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 placeholder:text-gray-300"
                />
              </div>
            </div>
          )}
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

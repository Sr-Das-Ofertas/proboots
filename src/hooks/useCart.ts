import { useState, useEffect } from 'react';
import type { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const WHATSAPP_NUMBER = "5599985306285";

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  });

  // Carregar carrinho do localStorage apenas uma vez na inicialização
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('proboots-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    };

    loadCart();
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem('proboots-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, [cart]);

  // Recalcular totais
  const recalculateCart = (items: CartItem[]): Cart => {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      total,
      itemCount
    };
  };

  const addItem = (product: Product, quantity = 1, size?: string) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = [...currentCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        newItems = [...currentCart.items, { product, quantity, size }];
      }

      const newCart = recalculateCart(newItems);

      // Força re-render do componente
      setTimeout(() => {
        window.dispatchEvent(new Event('cart-updated'));
      }, 100);

      return newCart;
    });
  };

  const removeItem = (productId: string, size?: string) => {
    setCart(currentCart => {
      const newItems = currentCart.items.filter(
        item => !(item.product.id === productId && item.size === size)
      );
      return recalculateCart(newItems);
    });
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setCart(currentCart => {
      const newItems = currentCart.items.map(item => {
        if (item.product.id === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
      return recalculateCart(newItems);
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0
    });
  };

  const formatPrice = (price: number): string => {
    return `R$ ${(price / 100).toFixed(2).replace('.', ',')}`;
  };

  const generateWhatsAppMessage = (): string => {
    let message = "🛒 *PEDIDO PROBOOTS* 🛒\n\n";

    cart.items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      if (item.size) {
        message += `   Tamanho: ${item.size}\n`;
      }
      message += `   Quantidade: ${item.quantity}\n`;
      message += `   Valor: ${formatPrice(item.product.price)}\n\n`;
    });

    message += `💰 *Total: ${formatPrice(cart.total)}*\n\n`;
    message += "📋 Gostaria de finalizar este pedido!";

    return encodeURIComponent(message);
  };

  const sendToWhatsApp = () => {
    if (cart.items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(whatsappUrl, '_blank');
  };

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    sendToWhatsApp,
    formatPrice
  };
}

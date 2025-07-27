'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export interface UserData {
  name: string;
  cpf: string;
  phone: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserData) => void;
}

export function CheckoutModal({ isOpen, onClose, onSubmit }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({ name: false, cpf: false, phone: false });

  const validateAndSubmit = () => {
    const newErrors = {
      name: name.trim().split(' ').length < 2,
      cpf: !/^\d{11}$/.test(cpf.replace(/\D/g, '')),
      phone: !/^\d{10,11}$/.test(phone.replace(/\D/g, '')),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      return;
    }

    onSubmit({ name, cpf, phone });
  };
  
  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };
  
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quase lá!</DialogTitle>
          <DialogDescription>
            Precisamos de algumas informações para concluir seu pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Nome Completo</label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-xs text-red-600">Por favor, insira seu nome completo.</p>}
          </div>
          <div className="space-y-2">
             <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
            <Input 
              id="cpf" 
              value={cpf} 
              onChange={(e) => setCpf(formatCpf(e.target.value))} 
              className={errors.cpf ? 'border-red-500' : ''}
              placeholder="000.000.000-00"
            />
            {errors.cpf && <p className="text-xs text-red-600">CPF inválido. Insira 11 dígitos.</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Telefone / WhatsApp</label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(formatPhone(e.target.value))} 
              className={errors.phone ? 'border-red-500' : ''}
              placeholder="(00) 00000-0000"
            />
             {errors.phone && <p className="text-xs text-red-600">Telefone inválido. Insira DDD + número.</p>}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={validateAndSubmit} className="w-full bg-green-500 hover:bg-green-600">
            Enviar Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
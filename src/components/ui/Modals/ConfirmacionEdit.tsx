import { useState } from 'react';
import  X  from '@/assets/X.png';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface ConfirmacionEditProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
}

export default function ConfirmacionEdit({
  isOpen,
  onClose,
  companyName = 'Empresa',
}: ConfirmacionEditProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 md:px-0 px-4 bg-transparent border-none shadow-none max-w-2xl mx-auto">
      <div className="relative z-10">
        <div className="rounded-xl shadow-sm space-y-6 bg-white border">
        <DialogHeader className="bg-[#4a9bd6] text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <DialogTitle className="font-semibold text-4xl">Editar Empresa</DialogTitle>

            <Button
                onClick={onClose}
                variant="ghost"
                className="absolute right-2 top-2 text-[#1E2945] hover:bg-[#3C98CB] rounded-full p-2"
              >
                <Image
                  className='mt-5 ml-2'
                  src={X}
                  alt='Salir'
                  width={40}
                  height={40}

                />
              </Button>
          </div>
        </DialogHeader>
        <div className="p-6">
          <p className="text-start text-lg">
            <span className="text-[#4a9bd6] font-semibold text-3xl">{companyName}</span>, se ha{' '}
            editado correctamente.
          </p>
        </div>
        <DialogFooter className="sm:justify-start p-6">
          <Button
            type="button"
            className="bg-[#4a9bd6] hover:bg-blue-600 text-white px-8"
            onClick={onClose}
          >
            Aceptar
          </Button>
        </DialogFooter>
        </div>
    </div>
        
        
      </DialogContent>
    </Dialog>
  );
}

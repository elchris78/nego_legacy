'use client';

import React, { useState, useEffect } from 'react';
import X from '@/assets/X.png';
import Image from 'next/image';
import { TriangleAlert } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: string;
}

export const ShowModal: React.FC<ShowModalProps> = ({ isOpen, onClose, currentCompany }) => {
  const [companyName, setCompanyName] = useState(currentCompany);
  
  useEffect(() => {
    setCompanyName(currentCompany); 
  }, [currentCompany]);

  const handleClose = () => {
    setCompanyName(currentCompany);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-0">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl mx-4 relative lg:mx-0">
        <div className="bg-[#3c98cb] text-white px-4 sm:px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Visualizar Empresa</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition duration-150"
            aria-label="Cerrar modal"
          >
            <Image   
              src={X} 
              alt="Salir" 
              width={30}
              height={30}       
            />
          </button>
        </div>
        <div className="p-4 sm:p-6 pb-4">
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre de la empresa
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              disabled
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c98cb]"
            />
          </div>
          <div className="flex justify-start space-x-4 mt-6">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-[#3c98cb] text-[#3c98cb] rounded-md hover:bg-[#3c98cb] hover:text-white transition duration-150 w-full sm:w-auto"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

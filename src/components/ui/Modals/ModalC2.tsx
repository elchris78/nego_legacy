import React, { useState } from 'react';
import { X, TriangleAlert } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [existsError, setExistsError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setError('');
    setExistsError('');

    const trimmedCompanyName = companyName.trim();

    if (trimmedCompanyName.length === 0) {
      setError('Ingrese un nombre valido con al menos 4 caracteres.');
      return;
    }

    if (trimmedCompanyName.length < 4) {
      setError('El nombre de la empresa debe contener al menos 4 caracteres.');
      return;
    }

    if (trimmedCompanyName === 'MedTest') {
      setExistsError('Error. La empresa ya existe.');
      return;
    }

    alert(`Empresa "${trimmedCompanyName}" guardada exitosamente`);
    setCompanyName(''); // Limpiar el campo después de guardar
    setError('');
    setExistsError('');
    onClose(); // Cerrar el modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-xl">
        {/* Contenedor del modal */}
        <div className="bg-[#3c98cb] text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-semibold">Crear empresa</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition duration-150"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Div de error con posicionamiento absoluto */}
        {existsError && (
          <div className="absolute left-0 right-0 bottom-0 z-0 p-4 bg-[#CF5459] text-white rounded-b-xl flex items-center justify-center">
            <TriangleAlert className="mr-2" />
            <span>{existsError}</span>
          </div>
        )}
        
        <div className={`p-6 pb-4 ${existsError ? 'pb-16' : ''}`}>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre de la empresa *
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ingresa el nombre de la empresa"
              className={`w-full px-3 py-2 border ${error || existsError ? 'border-[#CF5459]' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c98cb]`}
            />
            {error && <p className="mt-1 text-sm text-[#CF5459]">{error}</p>}
          </div>
          <div className="flex justify-start space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#3c98cb] text-[#3c98cb] rounded-md hover:bg-[#3c98cb] hover:text-white transition duration-150"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#3c98cb] text-white rounded-md hover:bg-[#3188b8] transition duration-150"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

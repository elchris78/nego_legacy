import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2 } from 'lucide-react';
import Image from 'next/image';
import { CreateModal } from '@/Modals/Modal_Create';
import Empresas from '@/Asset/Empresas.png';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { createCompany } from '../../empresas/services/companyActions';
import Cookies from 'js-cookie';
import InfoIcon from '@/assets/TooltipInicio.svg';

interface WelcomeProps {
  title: string;
  subtitle: string;
  textButton: string;
  showTooltip?: boolean;
  companiesArray?: any[];
  tooltip?: string;
  tooltipPlacement?: "start" | "end";
  refreshCompanies: () => Promise<void>;
}

interface CompanyProps {
  companyId: number;
  name: string;
}

export const Welcome = ({
  title,
  subtitle,
  textButton, tooltip,
  showTooltip = true,
  tooltipPlacement = "start",
  refreshCompanies
  
}: WelcomeProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const token = Cookies.get('auth-token');
  const router = useRouter();
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleCreateCompany = async (company: CompanyProps) => {
    try {      
      const response = await createCompany({ ...company, token });
      console.log('Empresa creada exitosamente:', response);
      
      setModalOpen(false);
      
      await refreshCompanies();
      return 'Empresa creada exitosamente';
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al crear la empresa:', error);
        alert(`Error: ${error.message}`);
      } else {
        console.error('Error inesperado al crear la empresa:', error);
        alert('Error inesperado');
      }
      return undefined; 
    }
  };

  return (
    <div className="bg-white min-h-[calc(100vh-header-height)] flex flex-col items-center justify-center p-4">
      <div className="flex items-center space-x-2 mb-8 gap-2">        
        <div className="flex items-center space-x-2 mb-4 pt-4">
              <h1 className="text-[#3c98cb] text-4xl mt-6 font-bold text-center">{title}</h1>
          
        </div>
      </div>
      <div className='flex flex-row justify-center items-center'>
          <div className='mr-3'>
            <TooltipProvider>
              <Tooltip>
                <TooltipContent>
                  <p>Módulo desde el cual podrás gestionar las empresas</p>
                </TooltipContent>
                <TooltipTrigger className="flex items-center">
                  <span>
                  <Image className='mt-2'
                    src={InfoIcon}
                    alt='Info'
                    width={120}
                    height={120}
                  /> 
                  </span>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
              <p className="text-[#5D6D7E] text-center mt-3 text-2xl" style={{ whiteSpace: 'pre-line' }}>De momento, no tienes ninguna empresa creada <br /> Da click en <span className="font-bold text-[#5D6D7E] text-2xl">Crear nueva empresa</span>.</p>
          </div>

      </div>


            <div className='flex mt-16 justify-center'>
               <button
                onClick={handleOpenModal}
                className="w-full sm:w-auto bg-[#3c98cb] text-white px-3 py-2 rounded-md flex items-center justify-center whitespace-nowrap space-x-2 hover:bg-[#3188b8] transition duration-300"
                aria-label="Crear nueva empresa"
                >
                <Plus size={24} />
                <span>{textButton}</span>
              </button> 
            </div>

        {/* Modal */}
        <CreateModal isOpen={isModalOpen} onClose={handleCloseModal} onCreateCompany={handleCreateCompany} />
      </div>
    
  );
};

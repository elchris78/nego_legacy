import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Empresas from '@/assets/Empresas.png';
import Image from 'next/image';
import { selectCompany } from "../../../companies/services/companyActions";
import Loading from '@/components/ui/Modals/LoadingModal';
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { Tooltip as TooltipMUI } from '@mui/material';
import carruselIzq from '@/assets/carruselIzq.png';
import carruselDer from '@/assets/carrsuelDer.png';

interface SelectedCompany {
  companiesArray: any[];
  token?: string;
}

interface CompanyProps {
  companyId: number;
  name: string;
}

export const SelectedCompany = ({
  companiesArray = [],
}: SelectedCompany) => {
  const [selectedCompanyId, setSelectedCompany] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyProps[]>(companiesArray);
  const [companies, setCompanies] = useState<CompanyProps[]>(companiesArray);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la visibilidad del modal
  const router = useRouter();
  
  const [itemsPerPage, setItemsPerPage] = useState(4); 
  const [currentPage, setCurrentPage] = useState(0);



  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 780) {
        setItemsPerPage(1); // Extra pequeñas
      } else if (width < 1130) {
        setItemsPerPage(2); // Pequeñas
      } else {
        setItemsPerPage(3); // Grandes
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < companies.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getCurrentPageItems = () => {
    const start = currentPage * itemsPerPage;
    return companies.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const openModal = () => {
    setIsLoading(true); // Abre el modal de carga
    setIsModalOpen(true); // Aquí controlas el estado de visibilidad del modal
    // Simula un proceso (por ejemplo, una API call) y cierra el modal después de 2 segundos.
    setTimeout(() => {
      setIsLoading(false); // Cierra el modal de carga
      setIsModalOpen(false); // Opcional: Cierra el modal de empresa si también se desea
    }, 2000); // Ajusta el tiempo según tu necesidad
  };

  return (
    <div className="bg-white min-h-[calc(100vh-header-height)] flex mt-0 md:mt-12">
      {isLoading && <Loading />}
      
     

      <div className="flex flex-col items-center justify-center p-4 w-full">
        <h1 className="text-5xl text-center text-[#5B6670] font-bold">
          Bienvenido
        </h1>
        <p className="text-[#5D6D7E] mt-8 mb-3 text-center font-normal text-2xl">
          Selecciona la empresa a la que deseas acceder.
        </p>
        <div className="w-full max-w-6xl mx-auto mt-3 flex justify-center">
          <div className="flex justify-center w-[100%]">
            <div className="flex flex-wrap justify-center gap-6 w-full relative">
              {/* Flecha izquierda */}
              {currentPage > 0 && (
                <div
                  className="absolute left-0 top-1/2 md:ml-3 xl:mt-10 transform -translate-y-1/2 bg-[#5D6D7D] w-10 flex items-center justify-center rounded-l-3xl cursor-pointer"
                  style={{ height: '322px' }}
                  onClick={goToPreviousPage}
                >
                  <Image
                    src={carruselIzq}
                    alt="Carrusel izquierdo"
                    width={24}
                    height={24}
                  />
                </div>
              )}

              {getCurrentPageItems().map((company, index) => (
                <div key={company.companyId} className="relative flex flex-col items-center md:mx-10 xl:mt-20">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipContent>
                        <p>Haz doble clic para entrar a la empresa</p>
                      </TooltipContent>
                      <TooltipTrigger>
                        <div onClick={() => {
                            selectCompany(company.companyId, setSelectedCompany, setMessage, router);
                            openModal(); // Abre el modal cuando se seleccione la empresa
                          }}
                            
                          className={`flex flex-col items-center justify-center border-[#4197CB] border-4 p-4 transition duration-200 cursor-pointer ${
                            selectedCompanyId === company.companyId ? 'shadow-inner' : ' hover:shadow-lg'
                          } rounded-t-3xl relative`}
                          style={{
                            width: '245px',
                            height: '322px',
                            background:
                              selectedCompanyId === company.companyId
                                ? 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(228,228,228,1) 100%)'
                                : 'transparent',
                            boxShadow: selectedCompanyId === company.companyId ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
                          }}
                        >
                          {/* <div className="absolute top-0 right-0 bg-[#5D6D7D] text-white rounded-tr-2xl -translate-y-0">
                            <p className="block px-3 py-2">
                              {String(index + 1 + currentPage * itemsPerPage).padStart(2, '0')}
                            </p>
                          </div> */}

                          <Image src={Empresas} alt="empresa" width={120} height={120} />
                          {company.name.length > 20 ? (
                            <TooltipMUI title={company.name} placement="top">
                              <h3 className="text-lg font-semibold mt-2 text-center">{company.name.slice(0, 20)}...</h3>
                            </TooltipMUI>
                          ) : (
                            <h3 className="text-lg font-semibold mt-2 text-center">{company.name}</h3>
                          )}

                          
                        </div>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}

              {/* Flecha derecha */}
              {(currentPage + 1) * itemsPerPage < companies.length && (
                <div
                  className="absolute right-0 top-1/2 md:mr-3 xl:mt-10 transform -translate-y-1/2 mx:0 bg-[#5D6D7D] w-10 flex items-center justify-center rounded-r-3xl cursor-pointer"
                  style={{ height: '322px' }}
                  onClick={goToNextPage}
                >
                  <Image
                    src={carruselDer}
                    alt="Carrusel derecho"
                    width={24}
                    height={24}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedCompany;

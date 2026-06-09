"use client";
import React, { useEffect, useState } from 'react';
import { Layers, ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import home from '@/assets/inicio.png';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import axios from 'axios';
import { el } from 'date-fns/locale';


interface SubmenuItem {
  label: string;
  subSubmenuItems?: SubSubmenuItem[];
}

interface SubSubmenuItem {
  label: string;
  path: string;
}

export interface ButtonItem {
  icon: string;
  label: string;
  submenuItems: SubmenuItem[];
}

interface SidebarMenuProps {
  buttons?: ButtonItem[]; 
  customComponent?: React.ReactNode;
  icon?: React.JSX.Element;
}

interface Company {
  companyName: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ buttons, customComponent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [openSubSubmenus, setOpenSubSubmenus] = useState<Record<string, boolean>>({})
  const [isOpen, setIsOpen] = useState(false);
  const [openMEDSHIPSubmenu, setOenMEDSHIPSubmenu] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();
  
  const toggleSubmenu = (label: string) => {
    if (activeButton === label) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [label]: false,
      }));
      setActiveButton(null);
    } else {
      setOpenSubmenus((prev) => ({
        ...prev,
        [activeButton || '']: false, 
        [label]: true,
      }));
      setActiveButton(label);
    }
  };

  const toggleSubSubmenu = (label: string) => {
    setOpenSubSubmenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  const toggleNegoSubmenu = () => {
    setOenMEDSHIPSubmenu((prev) => !prev);
  };

  const handleRedirect = (path: string) => {
    if (path) {
      router.push(path)
    }
  };



  const handleRedirectMenu = () => {
    router.push('')
  }
  
  useEffect(() => {
    const fetchCompanies = async () => {
      const token = Cookies.get("auth-token");
      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/companies`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          setCompanies(response.data);
  
         
        } catch (error) {
          console.error("Error al obtener las empresas:", error);
        }
      } else {
        console.error("Token no encontrado. Por favor inicia sesión.");
        router.push("/login");
      }
    };
  
    fetchCompanies(); 
  }, []);

  
  const handleRedirectHome = () => {
    console.log(companies.length);
    if(companies.length == 1) {
     
     console.log('Redireccionando a la pantalla de inicio');
    }
    else if(companies.length >= 2) {
      console.log('Redireccionando a la pantalla de companies');
      router.push("/companies");
    }
    
    
};

  return (
    <>
      
{/*       
      <div className="w-full sm:w-[15%] bg-[#5D6D7D] flex flex-col max-h relative">
        <div className="mb-4">
          <div
            className="bg-[#3C98CB] text-white p-2 w-full flex justify-between items-center rounded-none cursor-pointer"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              toggleNegoSubmenu();
            }}
          >
            <div className="flex flex-row w-full items-center">
              <div className='flex justify-center flex-0 sm:justify-start mr-2'>
                <Image src={home} alt='home' />
              </div> 
              <div className='flex justify-center flex-1 sm:justify-start'>
                <p className='text-center'>MEDSHIP</p>
                <ChevronDown className={`ml-2 transition-transform ${openMEDSHIPSubmenu ? 'rotate-180' : ''}`} />
              </div>  
            </div>
          </div>

          {openMEDSHIPSubmenu && (
            <ul 
              className='space-y-2 absolute left-0 w-full'
              style={{ 
                background: "#EDEDED", 
                padding: "0.5rem", 
                border: "7px solid #1B3148", 
                borderRight: "none" 
              }}
            >
              <li className="flex items-center w-full">
                <Image src={home} alt='home' className="w-4 h-4 mr-2" />
                <span 
                  className="break-words w-full overflow-wrap word-wrap break-all"
                >
                  Medika Mekanika
                </span>
              </li>
              <li className="flex items-center w-full">
                <Image src={home} alt='home' className="w-4 h-4 mr-2" />
                <span 
                  className="break-words w-full overflow-wrap word-wrap break-all"
                >
                  Bodega Medika
                </span>
              </li>
              <li className="flex items-center w-full">
                <Image src={home} alt='home' className="w-4 h-4 mr-2" />
                <span 
                  className="break-words w-full overflow-wrap word-wrap break-all"
                >
                  NegoPromos
                </span>
              </li>
              {(companies && companies.length > 1) && <li
                className="flex items-center cursor-pointer w-full"
                onClick={handleRedirectHome}
                style={{
                  backgroundColor: '#1b3148',
                  color: 'white',
                  padding: '0.5rem',
                  width: '100%'
                }}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span 
                  className="break-words w-full overflow-wrap word-wrap break-all"
                >
                  Regresar a la pantalla inicial
                </span>
              </li>}
              
            </ul>
          )}
        </div>

        <div>
          <ul className="space-y-2 w-full pl-4">
          {buttons?.map ((button, index) => (
            <li key={index}>
              <Button style={{
                background: activeButton === button.label ? "#1B3148" : "transparent",
                color: activeButton === button.label ? "#FFFFFF" : "#000000",
                whiteSpace: 'normal', // Permite dividir el texto en varias líneas
                textOverflow: 'ellipsis',
                wordWrap: 'break-word', // Asegura que las palabras largas se dividan
                overflow: 'hidden', // Oculta el contenido que sobresale
                width: '100%', // Hace que el botón ocupe todo el ancho del contenedor
                textAlign: 'left',
                minHeight: 'auto',
                height: 'auto',
                padding: '8px',
                // fontSize: 'clamp(0.2rem, 1vw, 1rem)' // Control dinámico del tamaño de la fuente
              }}
              className="flex justify-start space-x-4 items-center rounded-sm font-bold p-2"
              onClick={() => toggleSubmenu(button.label)} >
                  <img src={button.icon} alt={button.label} className="w-6 h-6" />
                  <span>{button.label}</span>
              </Button>

              {openSubmenus[button.label] && (
                <ul className='space-y-2' style={{ background: "#EDEDED", width:"100%", padding: "0.2rem", border: "7px solid #1B3148", borderRight: "none" }}>
                  {button.submenuItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => toggleSubSubmenu(subItem.label)}
                      >
                        
                        {subItem.subSubmenuItems && subItem.subSubmenuItems.length > 0 && (
                          <ChevronRight className="h-4 w-4"/>
                        )}
                        <span style={{overflow: 'hidden'}}>{subItem.label}</span>  
                      </Button>
                      
                      {openSubSubmenus[subItem.label] && subItem.subSubmenuItems && (
                        <ul>
                          {subItem.subSubmenuItems.map((subSubItem, subSubIndex) => (
                            <li key={subSubIndex}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start break-words pl-12"
                                onClick={() => handleRedirect(subSubItem.path)}
                              >
                                <span style={{overflow: 'hidden'}}>{subSubItem.label}</span>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="sm:hidden bg-[#5D6D7D] text-white p-3 justify-start">
              <Layers />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-[#5D6D7D]">
            <div className="w-full p-3 mt-5 flex justify-center items-center bg-white border border-black">
              <h1 className="text-2xl font-bold text-[#3C98CB]">MEDSHIP</h1>
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              <ul className="space-y-2" style={{ width: "95%" }}>
                {buttons.map((button, index) => (
                  <li key={index}> 
                    <Button
                      style={{
                        background: activeButton === button.label ? "#1B3148" : "transparent",
                        color: activeButton === button.label ? "#FFFFFF" : "#000000"
                      }}
                      className="flex space-x-4 items-center rounded-sm font-bold "
                      onClick={() => toggleSubmenu(button.label)}
                    >
                      <img src={button.icon} alt={button.label} className="w-6 h-6 mr-2" />
                      <span>{button.label}</span>
                    </Button>
                    {openSubmenus[button.label] && (
                      <ul className='space-y-2' style={{ background: "#EDEDED", padding: "0.5rem", border: "7px solid #1B3148", borderRight: "none", width:"100%" }}>
                        {button.submenuItems.map((subItem, subIndex) => (
                          <li 
                            key={subIndex} 
                            onClick={() => handleRedirectMenu()} 
                            className="cursor-pointer hover:bg-gray-200 p-2"
                          >
                            {subItem.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
       */}
      
      
      <div className="w-full sm:w-[85%] ">
        {customComponent ? customComponent : <h2 className="text-2xl text-[#5D6D7E] font-bold">Bienvenido a tu perfil de MEDSHIP</h2>}
      </div>
    </>
  );
};

export default SidebarMenu;

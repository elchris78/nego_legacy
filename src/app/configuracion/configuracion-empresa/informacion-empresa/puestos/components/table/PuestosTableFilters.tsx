"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { Puestos, PuestosParams } from "../../services/puestosTypes";
import Image from "next/image";
import searchIcon from "@/Asset/searchIcon.png";
import FilterIcon from "@/components/ui/icons/Filter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import AccordionFilters from "./AccordionFilters";
import BadgeFiltersList from "./BadgeFiltersList";
import DropdownButton from "./DropdownButton";

interface Props {
  searchParams: PuestosParams;
  setSearchParams: Dispatch<SetStateAction<PuestosParams>>;

}

const statusOptions = [
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
];

const aplicaParableOptions = [
  { value: "Cliente", label: "Cliente" },
  { value: "Proveedor", label: "Proveedor" },
  { value: "Colaborador", label: "Colaborador" },
];

const PuestosTableFilter = ({
  searchParams,
  setSearchParams,
}: Props) => {
  const [inputValue, setInputValue] = useState(""); // Valor del input sin debounce
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);

  // Obtener claims del usuario al cargar el componente
  // useEffect(() => {
  //   const token = Cookies.get("auth-token") || "";
  //   dispatch(fetchClaims(token));
  // }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => ({ ...prev, searchQuery: inputValue }));
    }, 500); // Retraso de 500ms

    return () => {
      clearTimeout(handler); // Limpia el timeout anterior si el valor cambia antes de que termine
    };
  }, [inputValue]); // Solo se ejecuta cuando inputValue cambia

  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  return (
    <div className="px-4">
      <form
        className="flex flex-col items-center md:flex-row md:justify-between gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Primera sección de filtros */}
        <div className="flex w-full flex-wrap justify-center md:justify-start md:w-3/4 lg:w-4/6 gap-3">
          {/* Search */}
          <div className="flex-1 min-w-56 max-w-80">
            <div className="flex items-center gap-3 rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 h-[2.625rem]">
              <Image src={searchIcon} alt="Search" width={20} height={20} />
              <input
                id="search"
                type="search"
                placeholder="Buscar..."
                className="w-full p-2 placeholder:text-muted-foreground bg-white disabled:bg-gray-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>

          {/* Multi select Filter options */}
          <div className="w-auto">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-30 flex gap-2 py-5 px-3 border-gray-300"
                >
                  <div className="flex flex-row items-center justify-start gap-1">
                    <FilterIcon color="#5B6670" />
                    <span className="font-normal text-gray-700">Filtrar</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[93vw] p-0 ml-4 mr-6 sm:w-[35vw] sm:ml-0 sm:mr-0 max-h-[500px] overflow-y-auto"
              >
                <AccordionFilters
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  onClosePopover={() => setIsPopoverOpen(false)}
                  statusOptions={statusOptions}
                  aplicaParableOptions={aplicaParableOptions}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Options */}
        <div className="w-auto flex gap-2">
          {
            (hasClaim(
              "Configuración.Configuración empresa.Información de la empresa.Puestos.Crear"
            ) )
             && ( //TODO: Cambiar la validación de claims
              <Link
                href={
                  "/configuracion/configuracion-empresa/informacion-empresa/puestos/form?mode=new"
                }
                className="bg-[#3c98cb] text-white px-2 py-1 rounded-lg flex items-center justify-center w-[100px] space-x-2 hover:bg-[#3188b8] transition duration-300"
                aria-label="Crear nuevo departamento"
              >
                <Plus size={22} strokeWidth={3} />
                <div className="flex flex-rpw md:flex-col gap-1 md:gap-0 text-sm text-center">
                  <span>Agregar</span>
                </div>
              </Link>
            )
          }

          <DropdownButton
          />
        </div>
      </form>

      {/* Badge List */}
      <BadgeFiltersList
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setInputValue={setInputValue}
        statusOptions={statusOptions}
        responsableOptions={aplicaParableOptions}
      />
    </div>
  );
};

export default PuestosTableFilter;

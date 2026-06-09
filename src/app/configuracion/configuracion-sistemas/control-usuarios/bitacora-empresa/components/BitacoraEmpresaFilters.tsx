"use client";

import { SetStateAction, useEffect, useState, Dispatch } from "react";

import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ModulesSubmodules,
  submodulesParams,
} from "@/lib/services/departments/submodules";
import { BadgeFiltersList } from "./BadgeFiltersList";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/Tables/DatePickerWithRange";
import { DropdownButton } from "./DropdownButton";
import { GetActivityCompanyHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";
import { modulesParams } from "@/lib/services/departments/modules";
import { TimeRangePicker } from "@/components/ui/Tables/TimeRangePicker";
import AccordionFilters from "./AccordionFilters";
import FilterIcon from "@/components/ui/icons/Filter";
import searchIcon from "@/Asset/searchIcon.png";

interface downloadProps {
  searchParams: GetActivityCompanyHistoryRequest;
  setSearchParams: Dispatch<SetStateAction<GetActivityCompanyHistoryRequest>>;
}

const actionOptions = [
  { value: "creación", label: "Creación " },
  { value: "modificación", label: "Modificación" },
  { value: "eliminación", label: "Eliminación" },
  { value: "cambio de estatus", label: "Cambio de Estatus" },
  { value: "descarga", label: "Descarga" },
  { value: "acceso a la empresa", label: "Acceso a la empresa" },
  { value: "asignación de permisos", label: "Asignación de permisos" },
  { value: "Impresión", label: "Impresión" },
];

export const BitacoraEmpresaFilters: React.FC<downloadProps> = ({
  searchParams,
  setSearchParams,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [moduleOptions, setModuleOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [subModuleOptions, setSubModuleOptions] = useState<ModulesSubmodules>(
    {}
  );

  const fetchModules = async () => {
    const response = await modulesParams({ modules: ["modules"] });

    if (response.success && response.modules) {
      setModuleOptions(
        response.modules.map((module: string) => ({
          value: module,
          label: module,
        }))
      );
    } else {
      console.error("Error obteniendo módulos:", response.error);
    }
  };

  // Función para obtener submódulos
  const fetchSubmodules = async (modules: string[]) => {
    const response = await submodulesParams(modules);

    if (response.success && response.modules) {
      const fetchedSubmodules: ModulesSubmodules = response.modules;
      setSubModuleOptions(fetchedSubmodules);

      // Filtramos los submódulos para eliminar los que ya no correspondan a los módulos seleccionados
      setSearchParams((prev) => {
        // Generamos un conjunto de submódulos válidos de los módulos seleccionados
        const validSubModules = new Set(
          modules.flatMap((module) => fetchedSubmodules[module] ?? [])
        );

        // Filtramos los submódulos del state para conservar solo los válidos
        const updatedSubModules = prev.subModules?.filter((subModule) =>
          validSubModules.has(subModule)
        );

        return {
          ...prev,
          subModules: updatedSubModules,
        };
      });
    } else {
      console.error("Error obteniendo submódulos:", response.error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Actualiza los submódulos cuando cambian los módulos
  useEffect(() => {
    fetchSubmodules(searchParams.modules || []);
  }, [searchParams.modules]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => ({ ...prev, searchQuery: inputValue }));
    }, 500); // Retraso de 500ms

    return () => {
      clearTimeout(handler); // Limpia el timeout anterior si el valor cambia antes de que termine
    };
  }, [inputValue]); // Solo se ejecuta cuando inputValue cambia

  return (
    <div className="px-4">
      <form
        className="flex flex-col items-center md:flex-row md:justify-between gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Primera sección de filtros */}
        <div className="flex w-full flex-wrap md:w-3/4 lg:w-4/6 gap-3">
          {/* Search */}
          <div className="flex-1 min-w-56 max-w-80">
            <div className="flex items-center gap-3 rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 h-[2.625rem]">
              <Image src={searchIcon} alt="Search" width={20} height={20} />
              <input
                id="search"
                type="search"
                placeholder="Buscar..."
                className="w-full p-2 placeholder:text-muted-foreground bg-white disabled:bg-gray-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-sm"
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
                className="w-[93vw] p-0 ml-4 mr-6 sm:w-[60vw] sm:ml-0 sm:mr-0 max-h-[500px] overflow-y-auto"
              >
                <AccordionFilters
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  onClosePopover={() => setIsPopoverOpen(false)}
                  moduleOptions={moduleOptions}
                  subModuleOptions={subModuleOptions}
                  actionOptions={actionOptions}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date Range */}
          <div className="flex-1 min-w-56 w-full sm:max-w-80">
            <DatePickerWithRange
              searchParams={searchParams}
              onStartDateChange={(startDate) => {
                setSearchParams((prev) => ({ ...prev, startDate }));
              }}
              onEndDateChange={(endDate) => {
                setSearchParams((prev) => ({ ...prev, endDate }));
              }}
            />
          </div>

          {/* Time */}
          <div className="flex-1 min-w-56 w-full sm:max-w-80">
            <TimeRangePicker
              searchParams={searchParams}
              onStartTimeChange={(startTime) => {
                setSearchParams({ ...searchParams, startTime });
              }}
              onEndTimeChange={(endTime) => {
                setSearchParams({ ...searchParams, endTime });
              }}
            />
          </div>
        </div>

        <div className="w-auto">
          <div className="flex gap-2">
            <DropdownButton />
          </div>
        </div>
      </form>

      {/* Badges List */}
      <BadgeFiltersList
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setInputValue={setInputValue}
        actionOptions={actionOptions}
        moduleOptions={moduleOptions}
        subModuleOptions={subModuleOptions}
      />
    </div>
  );
};

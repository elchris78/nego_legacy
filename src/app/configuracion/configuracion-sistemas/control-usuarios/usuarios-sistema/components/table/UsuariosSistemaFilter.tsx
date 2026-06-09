"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";

import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DropdownButton } from "./DropdownButton";
import AccordionFilters from "./AccordionFilters";
import BadgeFiltersList from "./BadgeFiltersList";
import FilterIcon from "@/components/ui/icons/Filter";
import searchIcon from "@/Asset/searchIcon.png";

import type { GetActivityHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";

interface downloadProps {
  searchParams: GetActivityHistoryRequest;
  setSearchParams: Dispatch<SetStateAction<GetActivityHistoryRequest>>;
}

const connectionStatusesOptions = [
  { value: "Activo", label: "Activo" },
  { value: "No disponible", label: "No disponible" },
  { value: "Ausente", label: "Ausente" },
];

export const UsuariosSistemaFilter = ({
  searchParams,
  setSearchParams,
}: downloadProps) => {
  const [inputValue, setInputValue] = useState(""); // Valor del input sin debounce
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
                  connectionStatuses={connectionStatusesOptions}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-2">
          <DropdownButton />
        </div>
      </form>

      {/* Badges List */}
      <BadgeFiltersList
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setInputValue={setInputValue}
        connectionStatuses={connectionStatusesOptions}
      />
    </div>
  );
};

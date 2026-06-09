import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Chip, Stack } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import type { MonedasParams } from "../../services/monedasTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: MonedasParams;
  setSearchParams: Dispatch<SetStateAction<MonedasParams>>;
  statusOptions: Option[];
  countriesOptions: Option[];
  catMonedas: Option[];
  setInputValue: Dispatch<SetStateAction<string>>;
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  statusOptions,
  countriesOptions,
  catMonedas,
  setInputValue,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    searchParams.estatus && searchParams.estatus.length > 0 ||
    searchParams.monedaSatIds && searchParams.monedaSatIds.length > 0 ||
    searchParams.paisIds && searchParams.paisIds.length > 0;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      estatus: undefined,
      monedaSatIds: undefined,
      paisIds: undefined,
    });
    setInputValue(""); // Limpia el input de búsqueda
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<MonedasParams, "estatus" | "paisIds" | "monedaSatIds">
  ) => {
    setSearchParams((prevState) => {
      const currentArray = prevState[field] || [];
      const updatedArray = currentArray.filter((item) => item !== value);

      return {
        ...prevState,
        [field]: updatedArray.length > 0 ? updatedArray : undefined,
      };
    });
  };

  return (
    <Stack direction="row" flexWrap="wrap" gap={1} spacing={1} mt={2}>
      {/* Botón para limpiar todos los filtros */}
      {hasFiltersApplied && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-[#5b6670] hover:bg-[#49525a]"
                size="sm"
                onClick={cleanAllFilters}
              >
                <Paintbrush />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="ml-4 sm:ml-10 md:ml-4 lg:ml-2 xl:ml-16">
              <p>Limpiar filtros</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Filtros aplicados: estatus */}
      {searchParams.estatus &&
        searchParams.estatus.map((status) => {
          const statusOption = statusOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "estatus")}
            />
          );
        })}
      
      {/* Filtros aplicados: países */}

      {searchParams.paisIds &&
        searchParams.paisIds.map((pais) => {
          const countriesOption = countriesOptions.find(
            (opt) => opt.value === pais
          );
          return (
            <Chip
              key={pais}
              label={countriesOption?.label}
              onDelete={() => removeFilter(pais, "paisIds")}
            />
          );
        })}

      {searchParams.monedaSatIds &&
        searchParams.monedaSatIds.map((monedaSat) => {
          const catMonedasoption = catMonedas.find(
            (opt) => opt.value === monedaSat
          );
          return (
            <Chip
              key={monedaSat}
              label={catMonedasoption?.label}
              onDelete={() => removeFilter(monedaSat, "monedaSatIds")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

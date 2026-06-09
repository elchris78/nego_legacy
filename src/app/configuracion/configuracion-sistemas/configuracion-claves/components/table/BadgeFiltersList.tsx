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

import type { KeyConfigurationParams } from "../../services/keyConfigurationTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: KeyConfigurationParams;
  setSearchParams: Dispatch<SetStateAction<KeyConfigurationParams>>;
  moduloOptions: Option[];
  catalgoOptions: Option[];
  tipoClaveOptions: Option[];
  tipoPrefOptions: Option[];
  setInputValue: Dispatch<SetStateAction<string>>;
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  moduloOptions,
  catalgoOptions,
  tipoClaveOptions,
  tipoPrefOptions,
  setInputValue,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
const hasFiltersApplied =
  (searchParams.searchQuery && searchParams.searchQuery.length > 0) ||
  (searchParams.Modulo && searchParams.Modulo.length > 0) ||
  (searchParams.Catalogo && searchParams.Catalogo.length > 0) ||
  (searchParams.TipoClave && searchParams.TipoClave.length > 0) ||
  (searchParams.TipoPrefijo && searchParams.TipoPrefijo.length > 0) ||
  (searchParams.isActive && searchParams.isActive.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
      Modulo: undefined,
      Catalogo: undefined,
      TipoClave: undefined,
      TipoPrefijo: undefined,
    });
    setInputValue(""); // Limpia el input de búsqueda
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<KeyConfigurationParams, "Catalogo" | "Modulo" | "TipoClave" | "TipoPrefijo">
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
      {searchParams.Modulo &&
        searchParams.Modulo.map((status) => {
          const statusOption = moduloOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "Modulo")}
            />
          );
        })}
      {searchParams.Catalogo &&
        searchParams.Catalogo.map((status) => {
          const statusOption = catalgoOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "Catalogo")}
            />
          );
      })}
      {searchParams.TipoClave &&
        searchParams.TipoClave.map((status) => {
          const statusOption = tipoClaveOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "TipoClave")}
            />
          );
      })}
      {searchParams.TipoPrefijo &&
        searchParams.TipoPrefijo.map((status) => {
          const statusOption =   tipoPrefOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "TipoPrefijo")}
            />
          );
      })}
    </Stack>
  );
};

export default BadgeFiltersList;

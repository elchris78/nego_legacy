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

import type { CXCParams } from "../../services/cxcsTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: CXCParams;
  setSearchParams: Dispatch<SetStateAction<CXCParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  origenOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  origenOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (estatus u origen)
  const hasFiltersApplied =
    (Array.isArray(searchParams.isActive) && searchParams.isActive.length > 0) ||
    (Array.isArray(searchParams.origen) && searchParams.origen.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
      origen: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico (estatus u origen)
  const removeFilter = (
    value: string,
    field: keyof Pick<CXCParams, "isActive" | "origen">
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
      {Array.isArray(searchParams.isActive) &&
        searchParams.isActive.map((status) => {
          const statusOption = statusOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "isActive")}
            />
          );
        })}

      {/* Filtros aplicados: origen */}
      {Array.isArray(searchParams.origen) &&
        searchParams.origen.map((orig) => {
          const origenOption = origenOptions.find(
            (opt) => opt.value === orig
          );
          return (
            <Chip
              key={orig}
              label={origenOption?.label}
              onDelete={() => removeFilter(orig, "origen")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

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

import type { CancelConceptsParams } from "../../services/cancelConceptsTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: CancelConceptsParams;
  setSearchParams: Dispatch<SetStateAction<CancelConceptsParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  afectaOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams, 
  setSearchParams,
  setInputValue,
  statusOptions,
  afectaOptions
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    searchParams.isActive && searchParams.isActive.length > 0 ||
    searchParams.affectTo && searchParams.affectTo.length > 0;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<CancelConceptsParams, "isActive" | "affectTo">
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
      {searchParams.isActive &&
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

      {/* Filtros aplicados: Afecta a */}
      {searchParams.affectTo &&
        searchParams.affectTo.map((affect) => {
          const affectOption = afectaOptions.find(
            (opt) => opt.value === affect
          );
          return (
            <Chip
              key={affect}
              label={affectOption?.label}
              onDelete={() => removeFilter(affect, "affectTo")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

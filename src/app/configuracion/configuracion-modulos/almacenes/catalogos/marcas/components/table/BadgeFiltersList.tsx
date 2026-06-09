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
import type {  MarcasParams } from "../../services/MarcasTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: MarcasParams;
  setSearchParams: Dispatch<SetStateAction<MarcasParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  fabricanteOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  fabricanteOptions
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    searchParams.isActive && searchParams.isActive.length > 0 ||
    searchParams.fabricante && searchParams.fabricante.length > 0;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
      fabricante: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<MarcasParams, "isActive" | "fabricante">
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
        })
      }

      {searchParams.fabricante &&
        searchParams.fabricante.map((fab) => {
          const fabOptions = fabricanteOptions.find(
            (opt) => opt.value === fab
          );
          return (
            <Chip
              key={fab}
              label={fabOptions?.label}
              onDelete={() => removeFilter(fab, "fabricante")}
            />
          );
        })
      }
    </Stack>
  );
};

export default BadgeFiltersList;

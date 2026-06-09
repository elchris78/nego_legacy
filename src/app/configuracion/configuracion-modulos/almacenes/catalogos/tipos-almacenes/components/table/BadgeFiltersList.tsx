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
import type { TypesWarehousesParams } from "../../services/typesWarehousesTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: TypesWarehousesParams;
  setSearchParams: Dispatch<SetStateAction<TypesWarehousesParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  origenOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  origenOptions
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
const hasFiltersApplied =
  (searchParams.isActive && searchParams.isActive.length > 0) ||
  (searchParams.origen && searchParams.origen.length > 0);


  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
      origen: undefined,
    });
    setInputValue(""); // Limpia el input de búsqueda
  };

  // Eliminar un filtro específico
const removeFilter = (
  value: string,
  field: keyof Pick<TypesWarehousesParams, "isActive" | "origen">
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

      {searchParams.origen &&
        searchParams.origen.map((origin) => {
          const originOption = origenOptions.find((opt) => opt.value === origin);
          return (
            <Chip
              key={origin}
              label={originOption?.label}
              onDelete={() => removeFilter(origin, "origen")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

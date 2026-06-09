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
import { RoleTemplatesParams } from "../../services/plantillasCompanyTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: RoleTemplatesParams;
  setSearchParams: Dispatch<SetStateAction<RoleTemplatesParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  typeOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  typeOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.active && searchParams.active.length > 0) ||
    (searchParams.type && searchParams.type.length > 0) ||
    searchParams.startDate ||
    searchParams.endDate;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      active: undefined,
      type: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<RoleTemplatesParams, "active" | "type">
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
      {searchParams.active &&
        searchParams.active.map((status) => {
          const statusOption = statusOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "active")}
            />
          );
        })}

      {/* Filtros aplicados: tipo */}
      {searchParams.type &&
        searchParams.type.map((type) => {
          const typeOption = typeOptions.find((opt) => opt.value === type);
          return (
            <Chip
              key={type}
              label={typeOption?.label}
              onDelete={() => removeFilter(type, "type")}
            />
          );
        })}

      {/* Filtros aplicados: fecha de inicio */}
      {(searchParams.startDate || searchParams.endDate) && (
        <Chip
          label="Fecha"
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              startDate: undefined,
              endDate: undefined,
            }))
          }
        />
      )}
    </Stack>
  );
};

export default BadgeFiltersList;

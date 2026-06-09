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
import { RolTemplatesAdminParams } from "../../services/plantillasTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: RolTemplatesAdminParams;
  setSearchParams: Dispatch<SetStateAction<RolTemplatesAdminParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  empresasOptions: Option[];
  statusOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  empresasOptions,
  statusOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.companyId && searchParams.companyId.length > 0) ||
    (searchParams.active && searchParams.active.length > 0) ||
    searchParams.startDate ||
    searchParams.endDate;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      active: undefined,
      companyId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<RolTemplatesAdminParams, "active" | "companyId">
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
            <TooltipContent>
              <p>Limpiar filtros</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Filtros aplicados: departamentos */}
      {searchParams.companyId &&
        searchParams.companyId.map((empresa) => {
          const empresaOption = empresasOptions.find(
            (opt) => opt.value === empresa
          );
          return (
            <Chip
              key={empresa}
              label={empresaOption?.label}
              onDelete={() => removeFilter(empresa, "companyId")}
            />
          );
        })}

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

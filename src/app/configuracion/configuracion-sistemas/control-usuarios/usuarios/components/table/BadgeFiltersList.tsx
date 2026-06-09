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
import { GetCompanyUsersParams } from "../../services/companyUsersTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: GetCompanyUsersParams;
  setSearchParams: Dispatch<SetStateAction<GetCompanyUsersParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  plantillasOptions: Option[];
  statusOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  plantillasOptions,
  statusOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.roleTemplateId && searchParams.roleTemplateId.length > 0) ||
    (searchParams.status && searchParams.status.length > 0) ||
    searchParams.startDate ||
    searchParams.endDate;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      status: undefined,
      roleTemplateId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<
      GetCompanyUsersParams,
      "status" | "roleTemplateId"
    >
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

      {/* Filtros aplicados: plantillas */}
      {searchParams.roleTemplateId &&
        searchParams.roleTemplateId.map((plantilla) => {
          const plantillaOption = plantillasOptions.find(
            (opt) => opt.value === plantilla
          );
          return (
            <Chip
              key={plantilla}
              label={plantillaOption?.label}
              onDelete={() => removeFilter(plantilla, "roleTemplateId")}
            />
          );
        })}

      {/* Filtros aplicados: estatus */}
      {searchParams.status &&
        searchParams.status.map((status) => {
          const statusOption = statusOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "status")}
            />
          );
        })}

      {/* Filtros aplicados: Rango de fechas */}
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

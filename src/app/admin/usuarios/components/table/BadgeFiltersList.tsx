import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Chip, Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { GetAdminUsersParams } from "../../services/adminUsersTypes";
import { Paintbrush } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: GetAdminUsersParams;
  setSearchParams: Dispatch<SetStateAction<GetAdminUsersParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  empresasOptions: Option[];
  plantillasOptions: Option[];
  statusOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  empresasOptions,
  plantillasOptions,
  statusOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.companyId && searchParams.companyId.length > 0) ||
    (searchParams.roleTemplateIds && searchParams.roleTemplateIds.length > 0) ||
    (searchParams.status && searchParams.status.length > 0) ||
    searchParams.startDate ||
    searchParams.endDate;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      status: undefined,
      roleTemplateIds: undefined,
      companyId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<
      GetAdminUsersParams,
      "status" | "companyId" | "roleTemplateIds"
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
            <TooltipContent>
              <p>Limpiar filtros</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Filtros aplicados: departamentos */}
      {searchParams.companyId &&
        searchParams.companyId.map((company) => {
          const empresaOption = empresasOptions.find(
            (option) => option.value === company
          );

          return (
            <Chip
              key={company}
              label={empresaOption?.label || company}
              onDelete={() => removeFilter(company, "companyId")}
            />
          );
        })}

      {/* Filtros aplicados: plantillas */}
      {searchParams.roleTemplateIds &&
        searchParams.roleTemplateIds.map((template) => {
          const plantillaOption = plantillasOptions.find(
            (option) => option.value === template
          );

          return (
            <Chip
              key={template}
              label={plantillaOption?.label || template}
              onDelete={() => removeFilter(template, "roleTemplateIds")}
            />
          );
        })}

      {/* Filtros aplicados: estatus */}
      {searchParams.status &&
        searchParams.status.map((status) => {
          const statusOption = statusOptions.find(
            (option) => option.value === status
          );

          return (
            <Chip
              key={status}
              label={statusOption?.label || status}
              onDelete={() => removeFilter(status, "status")}
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

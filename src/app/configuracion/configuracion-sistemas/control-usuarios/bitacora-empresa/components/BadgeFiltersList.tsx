import { Chip, Stack } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { GetActivityCompanyHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";
import { ModulesSubmodules } from "@/lib/services/departments/submodules";
import { SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: GetActivityCompanyHistoryRequest;
  setSearchParams: (
    value: SetStateAction<GetActivityCompanyHistoryRequest>
  ) => void;
  setInputValue: (value: SetStateAction<string>) => void;
  moduleOptions: Option[];
  subModuleOptions: ModulesSubmodules;
  actionOptions: Option[];
}

export const BadgeFiltersList = ({
  searchParams,
  setInputValue,
  setSearchParams,
  actionOptions,
  moduleOptions,
  subModuleOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.modules && searchParams.modules.length > 0) ||
    (searchParams.subModules && searchParams.subModules.length > 0) ||
    (searchParams.actionTypes && searchParams.actionTypes.length > 0) ||
    searchParams.startDate ||
    searchParams.endDate ||
    searchParams.startTime ||
    searchParams.endTime;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      startDate: undefined,
      endDate: undefined,
      actionTypes: undefined,
      modules: undefined,
      subModules: undefined,
      startTime: undefined,
      endTime: undefined,
    });
    setInputValue("");
  };

  // Elimina un filtro específico
  const removeFilter = (
    field: keyof Pick<
      GetActivityCompanyHistoryRequest,
      "modules" | "subModules" | "actionTypes"
    >,
    value: string
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

      {/* Renderizado de filtros aplicados: Modules */}
      {searchParams.modules &&
        searchParams.modules.map((moduleValue) => {
          const moduleOption = moduleOptions.find(
            (option) => option.value === moduleValue
          );
          if (!moduleOption) return null;
          return (
            <Chip
              key={`${moduleValue}`}
              label={moduleOption.label}
              onDelete={() => removeFilter("modules", moduleValue)}
            />
          );
        })}

      {/* Renderizado de filtros aplicados: Submodules */}
      {searchParams.subModules &&
        searchParams.subModules.map((subModuleValue) => {
          if (!subModuleValue) return null;
          return (
            <Chip
              key={`${subModuleValue}`}
              label={subModuleValue}
              onDelete={() => removeFilter("subModules", subModuleValue)}
            />
          );
        })}

      {/* Renderizado de filtros aplicados: ActionTypes */}
      {searchParams.actionTypes &&
        searchParams.actionTypes.map((actionTypeValue) => {
          const actionOption = actionOptions.find(
            (option) => option.value === actionTypeValue
          );
          if (!actionOption) return null;
          return (
            <Chip
              key={`${actionTypeValue}`}
              label={actionOption.label}
              onDelete={() => removeFilter("actionTypes", actionTypeValue)}
            />
          );
        })}

      {/* Renderizado de filtro de rango de fechas */}
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

      {/* Renderizado de filtro rango de horas */}
      {(searchParams.startTime || searchParams.endTime) && (
        <Chip
          label="Hora"
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              startTime: undefined,
              endTime: undefined,
            }))
          }
        />
      )}
    </Stack>
  );
};

import { GetDepartmentsRequest } from "@/lib/services/departments/departmentsTypes";
import { Chip, Stack } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
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
  searchParams: GetDepartmentsRequest;
  setSearchParams: Dispatch<SetStateAction<GetDepartmentsRequest>>;
  setInputValue: (value: SetStateAction<string>) => void;
  departmentOptions: Option[];
  areaOptions: Option[];
  statusOptions: Option[];
  responsableOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  departmentOptions,
  areaOptions,
  statusOptions,
  responsableOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.Names && searchParams.Names.length > 0) ||
    (searchParams.Areas && searchParams.Areas.length > 0) ||
    (searchParams.Status && searchParams.Status.length > 0) ||
    (searchParams.Responsibles && searchParams.Responsibles.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      SearchTerm: undefined,
      Names: undefined,
      Status: undefined,
      Areas: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<
      GetDepartmentsRequest,
      "Status" | "Areas" | "Names" | "Responsibles"
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

      {/* Filtros aplicados: departamentos */}
      {searchParams.Names &&
        searchParams.Names?.map((department) => {
          const departmentOption = departmentOptions.find(
            (option) => option.value === department
          );

          return (
            <Chip
              key={department}
              label={departmentOption?.label}
              onDelete={() => removeFilter(department, "Names")}
            />
          );
        })}

      {/* Filtros aplicados: áreas */}
      {searchParams.Areas &&
        searchParams.Areas?.map((area) => {
          const areaOption = areaOptions.find(
            (option) => option.value === area
          );

          return (
            <Chip
              key={area}
              label={areaOption?.label}
              onDelete={() => removeFilter(area, "Areas")}
            />
          );
        })}

      {/* Filtros aplicados: estatus */}
      {searchParams.Status &&
        searchParams.Status?.map((status) => {
          const statusOption = statusOptions.find(
            (option) => option.value === status
          );

          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "Status")}
            />
          );
        })}

      {/* Filtros aplicados: responsable */}
      {searchParams.Responsibles &&
        searchParams.Responsibles?.map((responsable) => {
          const responsableOption = responsableOptions.find(
            (option) => option.value === responsable
          );

          return (
            <Chip
              key={responsable}
              label={responsableOption?.label}
              onDelete={() => removeFilter(responsable, "Responsibles" as any)}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

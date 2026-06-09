import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Chip, Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Paintbrush } from "lucide-react";

import { Option } from "@/components/ui/multiselect";
import { ColaboradorParams } from "../../services/colaboradoresTypes";

interface Props {
  searchParams: ColaboradorParams;
  setSearchParams: Dispatch<SetStateAction<ColaboradorParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  tipoColaboradorOptions: Option[];
  puestosOptions: Option[];
  departamentosOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  tipoColaboradorOptions,
  puestosOptions,
  departamentosOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.estatus && searchParams.estatus.length > 0) ||
    (searchParams.tipoColaborador && searchParams.tipoColaborador.length > 0) ||
    (searchParams.puestos && searchParams.puestos.length > 0) ||
    (searchParams.departamentos && searchParams.departamentos.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      estatus: undefined,
      tipoColaborador: undefined,
      puestos: undefined,
      departamentos: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<
      ColaboradorParams,
      "estatus" | "tipoColaborador" | "puestos" | "departamentos"
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

      {/* Filtros aplicados: estatus */}
      {searchParams.estatus &&
        searchParams.estatus.map((status) => {
          const statusOption = statusOptions.find(
            (opt) => opt.value === status
          );
          return (
            <Chip
              key={status}
              label={statusOption?.label}
              onDelete={() => removeFilter(status, "estatus")}
            />
          );
        })}

      {/* Filtros aplicados: tipo de colaborador */}
      {searchParams.tipoColaborador &&
        searchParams.tipoColaborador.map((tipo) => {
          const tipoOption = tipoColaboradorOptions.find(
            (opt) => opt.value === tipo
          );
          return (
            <Chip
              key={tipo}
              label={tipoOption?.label}
              onDelete={() => removeFilter(tipo, "tipoColaborador")}
            />
          );
        })}

      {/* Filtros aplicados: puesto */}
      {searchParams.puestos &&
        searchParams.puestos.map((puesto) => {
          const puestoOption = puestosOptions.find(
            (opt) => opt.value === puesto
          );
          return (
            <Chip
              key={puesto}
              label={puestoOption?.label}
              onDelete={() => removeFilter(puesto, "puestos")}
            />
          );
        })}

      {/* Filtros aplicados: departamento */}
      {searchParams.departamentos &&
        searchParams.departamentos.map((departamento) => {
          const departamentoOption = departamentosOptions.find(
            (opt) => opt.value === departamento
          );
          return (
            <Chip
              key={departamento}
              label={departamentoOption?.label}
              onDelete={() => removeFilter(departamento, "departamentos")}
            />
          );
        })}

      {/* Filtro de búsqueda */}
    </Stack>
  );
};

export default BadgeFiltersList;

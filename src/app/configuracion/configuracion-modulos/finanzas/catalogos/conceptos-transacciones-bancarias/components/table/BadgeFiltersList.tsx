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
import { ConceptoTransaccionBancariaTypeParams } from "../../services/conceptosTransaccionesBancariasTypes";

interface Props {
  searchParams: ConceptoTransaccionBancariaTypeParams;
  setSearchParams: Dispatch<
    SetStateAction<ConceptoTransaccionBancariaTypeParams>
  >;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  tiposTransaccionesOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  tiposTransaccionesOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.estatus && searchParams.estatus.length > 0) ||
    (searchParams.tipoTransaccion && searchParams.tipoTransaccion.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      estatus: undefined,
      tipoTransaccion: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<
      ConceptoTransaccionBancariaTypeParams,
      "estatus" | "tipoTransaccion"
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

      {/* Filtros aplicados: tipos de transacción */}
      {searchParams.tipoTransaccion &&
        searchParams.tipoTransaccion.map((tipo) => {
          const tipoOption = tiposTransaccionesOptions.find(
            (opt) => opt.value === tipo
          );
          return (
            <Chip
              key={tipo}
              label={tipoOption?.label}
              onDelete={() => removeFilter(tipo, "tipoTransaccion")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

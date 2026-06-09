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
import { MovimientoInventarioTypeParams } from "../../services/movimientosInventarioTypes";

interface Props {
  searchParams: MovimientoInventarioTypeParams;
  setSearchParams: Dispatch<SetStateAction<MovimientoInventarioTypeParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  origenOptions: Option[];
  aplicaParaOptions: Option[];
  tipoMovimientoOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  origenOptions,
  aplicaParaOptions,
  tipoMovimientoOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.estatus && searchParams.estatus.length > 0) ||
    (searchParams.origen && searchParams.origen.length > 0) ||
    (searchParams.aplicaPara && searchParams.aplicaPara.length > 0) ||
    (searchParams.tipoMovimiento && searchParams.tipoMovimiento.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      estatus: undefined,
      origen: undefined,
      aplicaPara: undefined,
      tipoMovimiento: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<
      MovimientoInventarioTypeParams,
      "estatus" | "origen" | "aplicaPara" | "tipoMovimiento"
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

      {/* Filtros aplicados: origen */}
      {searchParams.origen &&
        searchParams.origen.map((origen) => {
          const origenOption = origenOptions.find(
            (opt) => opt.value === origen
          );
          return (
            <Chip
              key={origen}
              label={origenOption?.label}
              onDelete={() => removeFilter(origen, "origen")}
            />
          );
        })}

      {/* Filtros aplicados: aplicaPara */}
      {searchParams.aplicaPara &&
        searchParams.aplicaPara.map((aplica) => {
          const aplicaOption = aplicaParaOptions.find(
            (opt) => opt.value === aplica
          );
          return (
            <Chip
              key={aplica}
              label={aplicaOption?.label}
              onDelete={() => removeFilter(aplica, "aplicaPara")}
            />
          );
        })}

      {/* Filtros aplicados: tipoMovimiento */}
      {searchParams.tipoMovimiento &&
        searchParams.tipoMovimiento.map((tipo) => {
          const tipoOption = tipoMovimientoOptions.find(
            (opt) => opt.value === tipo
          );
          return (
            <Chip
              key={tipo}
              label={tipoOption?.label}
              onDelete={() => removeFilter(tipo, "tipoMovimiento")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

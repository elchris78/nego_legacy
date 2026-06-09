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

import type { TransaccionesDXCParams } from "../../services/transaccionesDXCTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: TransaccionesDXCParams;
  setSearchParams: Dispatch<SetStateAction<TransaccionesDXCParams>>;
  statusOptions: Option[];
  setInputValue: Dispatch<SetStateAction<string>>;
  tiposRelacion: Option[];
  formasPago: Option[];
  vendedorOptions: Option[];
  origenOptions: Option[]; 
  transaccionesDXC: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  statusOptions,
  setInputValue,
  tiposRelacion,
  formasPago,
  vendedorOptions,
  origenOptions,
  transaccionesDXC
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
const hasFiltersApplied =
  (searchParams.origen && searchParams.origen.length > 0) ||
  (searchParams.contraPartida && searchParams.contraPartida.length > 0) ||
  (searchParams.tipoTransaccion && searchParams.tipoTransaccion.length > 0) ||
  (searchParams.tipoRelacionSat && searchParams.tipoRelacionSat.length > 0) ||
  (searchParams.formaPago && searchParams.formaPago.length > 0) ||
  (searchParams.isActive && searchParams.isActive.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
      origen: undefined,
      contraPartida: undefined,
      tipoTransaccion: undefined,
      tipoRelacionSat: undefined,
      formaPago: undefined,
    });
    setInputValue(""); // Limpia el input de búsqueda
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<TransaccionesDXCParams, "isActive" | "origen" | "contraPartida" | "tipoTransaccion" | "tipoRelacionSat" | "formaPago">
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
        searchParams.origen.map((origen) => {
          const origenOption =   origenOptions.find(
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
        
      {searchParams.contraPartida &&
        searchParams.contraPartida.map((contraPartida) => {
          const contrapartidaOption = transaccionesDXC.find(
            (opt) => opt.value === contraPartida
          );
          return (
            <Chip
              key={contraPartida}
              label={contrapartidaOption?.label}
              onDelete={() => removeFilter(contraPartida, "contraPartida")}
            />
          );
        })}
        
      {searchParams.tipoTransaccion &&
        searchParams.tipoTransaccion.map((tipoTransaccion) => {
          const tipoTransaccionOption = vendedorOptions.find(
            (opt) => opt.value === tipoTransaccion
          );
          return (
            <Chip
              key={tipoTransaccion}
              label={tipoTransaccionOption?.label}
              onDelete={() => removeFilter(tipoTransaccion, "tipoTransaccion")}
            />
          );
        })}

      {searchParams.tipoRelacionSat &&
        searchParams.tipoRelacionSat.map((tipoRelacionSat) => {
          const tipoRelacionSatOption = tiposRelacion.find(
            (opt) => opt.value === tipoRelacionSat
          );
          return (
            <Chip
              key={tipoRelacionSat}
              label={tipoRelacionSatOption?.label}
              onDelete={() => removeFilter(tipoRelacionSat, "tipoRelacionSat")}
            />
          );
        })}

      {searchParams.formaPago &&
        searchParams.formaPago.map((formaPago) => {
          const formaPagoOption = formasPago.find(
            (opt) => opt.value === formaPago
          );
          return (
            <Chip
              key={formaPago}
              label={formaPagoOption?.label}
              onDelete={() => removeFilter(formaPago, "formaPago")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

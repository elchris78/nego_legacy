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
import { CuentaBancariaTypeParams } from "../../services/cuentasBancariasTypes";

interface Props {
  searchParams: CuentaBancariaTypeParams;
  setSearchParams: Dispatch<SetStateAction<CuentaBancariaTypeParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  bancosOptions: Option[];
  monedasOptions: Option[];
  tipoInstrumentosBancariosOptions: Option[];
  cuentasContablesOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  bancosOptions,
  monedasOptions,
  tipoInstrumentosBancariosOptions,
  cuentasContablesOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.estatus && searchParams.estatus.length > 0) ||
    (searchParams.bancoIds && searchParams.bancoIds.length > 0) ||
    (searchParams.monedaIds && searchParams.monedaIds.length > 0) ||
    (searchParams.tipoInstrumentoBancario &&
      searchParams.tipoInstrumentoBancario.length > 0) ||
    (searchParams.cuentaContable && searchParams.cuentaContable.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchTerm: undefined,
      estatus: undefined,
      bancoIds: undefined,
      monedaIds: undefined,
      tipoInstrumentoBancario: undefined,
      cuentaContable: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<
      CuentaBancariaTypeParams,
      | "estatus"
      | "bancoIds"
      | "monedaIds"
      | "tipoInstrumentoBancario"
      | "cuentaContable"
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

      {/* Filtros aplicados: bancos */}
      {searchParams.bancoIds &&
        searchParams.bancoIds.map((banco) => {
          const bancoOption = bancosOptions.find((opt) => opt.value === banco);
          return (
            <Chip
              key={banco}
              label={bancoOption?.label}
              onDelete={() => removeFilter(banco, "bancoIds")}
            />
          );
        })}

      {/* Filtros aplicados: monedas */}
      {searchParams.monedaIds &&
        searchParams.monedaIds.map((moneda) => {
          const monedaOption = monedasOptions.find(
            (opt) => opt.value === moneda
          );
          return (
            <Chip
              key={moneda}
              label={monedaOption?.label}
              onDelete={() => removeFilter(moneda, "monedaIds")}
            />
          );
        })}

      {/* Filtros aplicados: tipo de instrumento bancario */}
      {searchParams.tipoInstrumentoBancario &&
        searchParams.tipoInstrumentoBancario.map((tipo) => {
          const tipoOption = tipoInstrumentosBancariosOptions.find(
            (opt) => opt.value === tipo
          );
          return (
            <Chip
              key={tipo}
              label={tipoOption?.label}
              onDelete={() => removeFilter(tipo, "tipoInstrumentoBancario")}
            />
          );
        })}

      {/* Filtros aplicados: cuenta contable */}
      {searchParams.cuentaContable &&
        searchParams.cuentaContable.map((cuenta) => {
          const cuentaOption = cuentasContablesOptions.find(
            (opt) => opt.value === cuenta
          );
          return (
            <Chip
              key={cuenta}
              label={cuentaOption?.label}
              onDelete={() => removeFilter(cuenta, "cuentaContable")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

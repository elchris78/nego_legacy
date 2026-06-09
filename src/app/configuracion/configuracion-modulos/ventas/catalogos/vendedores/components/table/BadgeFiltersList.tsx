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

import type { SellersParams } from "../../services/sellersTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: SellersParams;
  setSearchParams: Dispatch<SetStateAction<SellersParams>>;
  statusOptions: Option[];
  setInputValue: Dispatch<SetStateAction<string>>;
  zonaOptions: Option[];
  subZonaOptions: Option[];
  vendedorOptions: Option[];
  tipoVendedorOptions: Option[];
  colaboradoresOptions: Option[];
  comisionOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  statusOptions,
  setInputValue,
  zonaOptions,
  subZonaOptions,
  vendedorOptions,
  tipoVendedorOptions,
  colaboradoresOptions,
  comisionOptions
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
const hasFiltersApplied =
  (searchParams.searchQuery && searchParams.searchQuery.length > 0) ||
  (searchParams.zonas && searchParams.zonas.length > 0) ||
  (searchParams.subzonas && searchParams.subzonas.length > 0) ||
  (searchParams.colaboradorIds && searchParams.colaboradorIds.length > 0) ||
  (searchParams.tipoVendedorIds && searchParams.tipoVendedorIds.length > 0) ||
  (searchParams.supervisorIds && searchParams.supervisorIds.length > 0) ||
  (searchParams.tipoComision && searchParams.tipoComision.length > 0) ||
  (searchParams.isActive && searchParams.isActive.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
      zonas: undefined,
      subzonas: undefined,
      colaboradorIds: undefined,
      tipoVendedorIds: undefined,
    });
    setInputValue(""); // Limpia el input de búsqueda
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<SellersParams, "isActive" | "zonas" | "subzonas" | "colaboradorIds" | "tipoVendedorIds" | "supervisorIds" | "tipoComision">
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
      
      {searchParams.zonas &&
        searchParams.zonas.map((zona) => {
          const zonaOption = zonaOptions.find(
            (opt) => opt.value === zona
          );
          return (
            <Chip
              key={zona}
              label={zonaOption?.label}
              onDelete={() => removeFilter(zona, "zonas")}
            />
          );
        })}
        
      {searchParams.subzonas &&
        searchParams.subzonas.map((subZona) => {
          const subZonaOption = subZonaOptions.find(
            (opt) => opt.value === subZona
          );
          return (
            <Chip
              key={subZona}
              label={subZonaOption?.label}
              onDelete={() => removeFilter(subZona, "subzonas")}
            />
          );
        })}
        
      {searchParams.colaboradorIds &&
        searchParams.colaboradorIds.map((vendedor) => {
          const vendedorOption = vendedorOptions.find(
            (opt) => opt.value === vendedor
          );
          return (
            <Chip
              key={vendedor}
              label={vendedorOption?.label}
              onDelete={() => removeFilter(vendedor, "colaboradorIds")}
            />
          );
        })}

      {searchParams.tipoVendedorIds &&
        searchParams.tipoVendedorIds.map((tipoVendedor) => {
          const tipoVendedorOption = tipoVendedorOptions.find(
            (opt) => opt.value === tipoVendedor
          );
          return (
            <Chip
              key={tipoVendedor}
              label={tipoVendedorOption?.label}
              onDelete={() => removeFilter(tipoVendedor, "tipoVendedorIds")}
            />
          );
        })}

      {searchParams.supervisorIds &&
        searchParams.supervisorIds.map((supervisorIds) => {
          const supervisorIdsOption = colaboradoresOptions.find(
            (opt) => opt.value === supervisorIds
          );
          return (
            <Chip
              key={supervisorIds}
              label={supervisorIdsOption?.label}
              onDelete={() => removeFilter(supervisorIds, "supervisorIds")}
            />
          );
        })}

      {searchParams.tipoComision &&
        searchParams.tipoComision.map((tipoComision) => {
          const comisioOption = comisionOptions.find(
            (opt) => opt.value === tipoComision
          );
          return (
            <Chip
              key={tipoComision}
              label={comisioOption?.label}
              onDelete={() => removeFilter(tipoComision, "tipoComision")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

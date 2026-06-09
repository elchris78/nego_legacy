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
import { SucursalesParams } from "../../services/sucursalesTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: SucursalesParams;
  setSearchParams: Dispatch<SetStateAction<SucursalesParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  statusOptions: Option[];
  responsableOptions: Option[];
  paisOptions: Option[];
  estadoOptions: Option[];
  ciudadOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  statusOptions,
  responsableOptions,
  paisOptions,
  estadoOptions,
  ciudadOptions,
}: Props) => {
  const hasFiltersApplied =
    (searchParams.isActive && searchParams.isActive.length > 0) ||
    (searchParams.responsableId && searchParams.responsableId.length > 0) ||
    (searchParams.pais && searchParams.pais.length > 0) ||
    (searchParams.codigoPostal && searchParams.codigoPostal.length > 0) ||
    (searchParams.estado && searchParams.estado.length > 0) ||
    (searchParams.ciudad && searchParams.ciudad.length > 0);

  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
      responsableId: undefined,
      pais: undefined,
      codigoPostal: undefined,
      estado: undefined,
      ciudad: undefined,
    });
    setInputValue("");
  };

  const removeFilter = (
    value: string,
    field: keyof Pick<
      SucursalesParams,
      "isActive" | "responsableId" | "pais" | "codigoPostal" | "estado" | "ciudad"
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

      {/* Estatus */}
      {searchParams.isActive &&
        searchParams.isActive.map((status) => {
          const statusOption = statusOptions.find((opt) => opt.value === status);
          return (
            <Chip
              key={status}
              label={statusOption?.label || status}
              onDelete={() => removeFilter(status, "isActive")}
            />
          );
        })}

      {/* Responsable */}
      {searchParams.responsableId &&
        searchParams.responsableId.map((responsableId) => {
          const responsableOption = responsableOptions.find((opt) => opt.value === responsableId);
          return (
            <Chip
              key={responsableId}
              label={responsableOption?.label || responsableId}
              onDelete={() => removeFilter(responsableId, "responsableId")}
            />
          );
        })}

      {/* País */}
      {searchParams.pais &&
        searchParams.pais.map((pais) => {
          const paisOption = paisOptions.find((opt) => opt.value === pais);
          return (
            <Chip
              key={pais}
              label={paisOption?.label || pais}
              onDelete={() => removeFilter(pais, "pais")}
            />
          );
        })}

      {/* Estado */}
      {searchParams.estado &&
        searchParams.estado.map((estado) => {
          const estadoOption = estadoOptions.find((opt) => opt.value === estado);
          return (
            <Chip
              key={estado}
              label={estadoOption?.label || estado}
              onDelete={() => removeFilter(estado, "estado")}
            />
          );
        })}

      {/* Ciudad */}
      {searchParams.ciudad &&
        searchParams.ciudad.map((ciudad) => {
          const ciudadOption = ciudadOptions.find((opt) => opt.value === ciudad);
          return (
            <Chip
              key={ciudad}
              label={ciudadOption?.label || ciudad}
              onDelete={() => removeFilter(ciudad, "ciudad")}
            />
          );
        })}

      {/* Código Postal */}
      {searchParams.codigoPostal &&
        searchParams.codigoPostal.map((codigo) => (
          <Chip
            key={codigo}
            label={codigo}
            onDelete={() => removeFilter(codigo, "codigoPostal")}
          />
        ))}
    </Stack>
  );
};

export default BadgeFiltersList;

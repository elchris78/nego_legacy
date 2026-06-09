import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Chip, Stack } from "@mui/material";
import { GetActivityHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";
import { Paintbrush } from "lucide-react";
import { SetStateAction } from "react";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: GetActivityHistoryRequest;
  setSearchParams: (value: SetStateAction<GetActivityHistoryRequest>) => void;
  setInputValue: (value: SetStateAction<string>) => void;
  connectionStatuses: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  connectionStatuses,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.connectionStatuses &&
      searchParams.connectionStatuses.length > 0) ||
    searchParams.loginStartDate ||
    searchParams.loginEndDate ||
    searchParams.loginStartTime ||
    searchParams.loginEndTime ||
    searchParams.logoutStartDate ||
    searchParams.logoutEndDate ||
    searchParams.logoutStartTime ||
    searchParams.logoutEndTime ||
    searchParams.activePeriodStart ||
    searchParams.activePeriodEnd ||
    searchParams.minActiveHours ||
    searchParams.inactivePeriodStart ||
    searchParams.inactivePeriodEnd ||
    searchParams.minInactiveHours;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      connectionStatuses: undefined,
      loginStartDate: undefined,
      loginEndDate: undefined,
      loginStartTime: undefined,
      loginEndTime: undefined,
      logoutStartDate: undefined,
      logoutEndDate: undefined,
      logoutStartTime: undefined,
      logoutEndTime: undefined,
      activePeriodStart: undefined,
      activePeriodEnd: undefined,
      minActiveHours: undefined,
      inactivePeriodStart: undefined,
      inactivePeriodEnd: undefined,
      minInactiveHours: undefined,
    });
    setInputValue("");
  };

  // Elimina un filtro específico
  const removeFilter = (
    field: keyof Pick<GetActivityHistoryRequest, "connectionStatuses">,
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

      {/* Filtros aplicados: Estatus */}
      {searchParams.connectionStatuses &&
        searchParams.connectionStatuses.map((status) => (
          <Chip
            key={status}
            label={
              connectionStatuses.find((item) => item.value === status)?.label
            }
            onDelete={() => removeFilter("connectionStatuses", status)}
          />
        ))}

      {/* Filtros aplicados: Inicio de sesión por fecha */}
      {(searchParams.loginStartDate || searchParams.loginEndDate) && (
        <Chip
          label="Inicio de sesión por fecha"
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              loginStartDate: undefined,
              loginEndDate: undefined,
            }))
          }
        />
      )}

      {/* Filtros aplicados: Inicio de sesión por hora */}
      {(searchParams.loginStartTime || searchParams.loginEndTime) && (
        <Chip
          label="Inicio de sesión por hora"
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              loginStartTime: undefined,
              loginEndTime: undefined,
            }))
          }
        />
      )}

      {/* Filtros aplicados: Cierre de sesión por fecha */}
      {(searchParams.logoutStartDate || searchParams.logoutEndDate) && (
        <Chip
          label="Cierre de sesión por fecha"
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              logoutStartDate: undefined,
              logoutEndDate: undefined,
            }))
          }
        />
      )}

      {/* Filtros aplicados: Cierre de sesión por hora */}
      {(searchParams.logoutStartTime || searchParams.logoutEndTime) && (
        <Chip
          label="Cierre de sesión por hora"
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              logoutStartTime: undefined,
              logoutEndTime: undefined,
            }))
          }
        />
      )}

      {/* Filtros aplicados: Tiempo activo por rango */}
      {(searchParams.activePeriodStart || searchParams.activePeriodEnd) && (
        <Chip
          label="Tiempo activo por rango"
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              activePeriodStart: undefined,
              activePeriodEnd: undefined,
            }))
          }
        />
      )}

      {/* Filtros aplicado: Tiempo activo */}
      {searchParams.minActiveHours && (
        <Chip
          label={`Tiempo activo`}
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              minActiveHours: undefined,
            }))
          }
        />
      )}

      {/* Filtros aplicados: Tiempo inactivo por rango */}
      {(searchParams.inactivePeriodStart || searchParams.inactivePeriodEnd) && (
        <Chip
          label="Tiempo inactivo por rango"
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              inactivePeriodStart: undefined,
              inactivePeriodEnd: undefined,
            }))
          }
        />
      )}

      {/* Filtros aplicado: Tiempo inactivo */}
      {searchParams.minInactiveHours && (
        <Chip
          label={`Tiempo inactivo`}
          onDelete={() =>
            setSearchParams((prevState) => ({
              ...prevState,
              minInactiveHours: undefined,
            }))
          }
        />
      )}
    </Stack>
  );
};

export default BadgeFiltersList;

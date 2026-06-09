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

import type { RestrictionConceptTypeParams } from "../../services/restrictionConceptsTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: RestrictionConceptTypeParams;
  setSearchParams: Dispatch<SetStateAction<RestrictionConceptTypeParams>>;
  statusOptions: Option[];
  authorizationOptions: Option[];
  notificationOptions: Option[];
  applyToOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  statusOptions,
  authorizationOptions,
  notificationOptions,
  applyToOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    (searchParams.isActive && searchParams.isActive.length > 0) ||
    (searchParams.requiereAutorizacion &&
      searchParams.requiereAutorizacion.length > 0) ||
    (searchParams.requiereNotificacion &&
      searchParams.requiereNotificacion.length > 0) ||
    (searchParams.aplicaPara && searchParams.aplicaPara.length > 0);

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      isActive: undefined,
      requiereAutorizacion: undefined,
      requiereNotificacion: undefined,
      aplicaPara: undefined,
    });
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<
      RestrictionConceptTypeParams,
      | "isActive"
      | "requiereAutorizacion"
      | "requiereNotificacion"
      | "aplicaPara"
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

      {/* Filtros aplicados: requireAutorizacion */}
      {searchParams.requiereAutorizacion &&
        searchParams.requiereAutorizacion.map((authorization) => {
          const authorizationOption = authorizationOptions.find(
            (opt) => opt.value === authorization
          );
          return (
            <Chip
              key={authorization}
              label={"Requiere Autorización: " + authorizationOption?.label}
              onDelete={() =>
                removeFilter(authorization, "requiereAutorizacion")
              }
            />
          );
        })}

      {/* Filtros aplicados: requireNotification */}
      {searchParams.requiereNotificacion &&
        searchParams.requiereNotificacion.map((notification) => {
          const notificationOption = notificationOptions.find(
            (opt) => opt.value === notification
          );
          return (
            <Chip
              key={notification}
              label={"Requiere Notificación: " + notificationOption?.label}
              onDelete={() =>
                removeFilter(notification, "requiereNotificacion")
              }
            />
          );
        })}

      {/* Filtros aplicados: applyTo */}
      {searchParams.aplicaPara &&
        searchParams.aplicaPara.map((apply) => {
          const applyOption = applyToOptions.find((opt) => opt.value === apply);
          return (
            <Chip
              key={apply}
              label={applyOption?.label}
              onDelete={() => removeFilter(apply, "aplicaPara")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

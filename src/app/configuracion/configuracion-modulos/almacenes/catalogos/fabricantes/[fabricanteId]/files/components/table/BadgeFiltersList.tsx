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
import { FabricanteDocumentoTypeParams } from "../../services/fabricantesDocumentosTypes";

interface Props {
  searchParams: FabricanteDocumentoTypeParams;
  setSearchParams: Dispatch<SetStateAction<FabricanteDocumentoTypeParams>>;
  setInputValue: (value: SetStateAction<string>) => void;
  formatoOptions: Option[];
}

const BadgeFiltersList = ({
  searchParams,
  setSearchParams,
  setInputValue,
  formatoOptions,
}: Props) => {
  // Verifica si hay algún filtro aplicado (excepto el de búsqueda)
  const hasFiltersApplied =
    searchParams.formatos && searchParams.formatos.length > 0;

  // Limpia todos los filtros aplicados
  const cleanAllFilters = () => {
    setSearchParams({
      searchQuery: undefined,
      formatos: undefined,
    });
    setInputValue("");
  };

  // Eliminar un filtro específico
  const removeFilter = (
    value: string,
    field: keyof Pick<FabricanteDocumentoTypeParams, "formatos">
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

      {/* Filtros aplicados: Formato */}
      {searchParams.formatos &&
        searchParams.formatos.map((formato) => {
          const formatoOption = formatoOptions.find(
            (opt) => opt.value === formato
          );
          return (
            <Chip
              key={formato}
              label={formatoOption?.label}
              onDelete={() => removeFilter(formato, "formatos")}
            />
          );
        })}
    </Stack>
  );
};

export default BadgeFiltersList;

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Checkbox, FormControlLabel } from "@mui/material";
import { CircleXIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { EmpaqueTypeParams } from "../../services/empaquesTypes";
import MultipleSelector, { Option } from "@/components/ui/multiselect";

interface Props {
  searchParams: EmpaqueTypeParams;
  setSearchParams: Dispatch<SetStateAction<EmpaqueTypeParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  unidadesSatOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  unidadesSatOptions,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<Option[]>([]);

  useEffect(() => {
    // Si no hay unidades SAT seleccionadas, se asigna un array vacío
    // Colocar el label compuesto por el valor y el nombre de la unidad SAT
    const selectedOptions = searchParams.unidadSat?.map((value) => {
      const option = unidadesSatOptions.find((opt) => opt.value === value);
      return option ? { value: option.value, label: option.label } : null;
    });
    setSelectedValues(selectedOptions?.filter(Boolean) as Option[]);
  }, [searchParams.unidadSat, unidadesSatOptions]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<EmpaqueTypeParams, "isActive" | "unidadSat">
  ) => {
    const checked = e.target.checked;

    setSearchParams((prevState) => {
      // Obtenemos el array actual o usamos un array vacío si es undefined
      const currentArray = prevState[field] || [];
      let updatedArray: string[];

      if (checked) {
        // Si se marca, agregamos el valor solo si aún no existe
        updatedArray = currentArray.includes(value)
          ? currentArray
          : [...currentArray, value];
      } else {
        // Si se desmarca, eliminamos el valor
        updatedArray = currentArray.filter((item) => item !== value);
      }

      // Si el array actualizado tiene elementos, lo asignamos; de lo contrario, asignamos undefined
      return {
        ...prevState,
        [field]: updatedArray.length > 0 ? updatedArray : undefined,
      };
    });
  };

  return (
    <div>
      {/* Close icon */}
      <div className="flex justify-end p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleXIcon
                size={24}
                color="#4197CB"
                className="cursor-pointer"
                onClick={onClosePopover}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Cerrar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Accordion type="multiple" className="px-3 py-1">
        {/* Status */}
        <AccordionItem value="status">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Estatus</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {statusOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.isActive?.includes(option.value)}
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "isActive")
                    }
                    name={option.label}
                    color="primary"
                  />
                }
                label={option.label}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Unidades Sat */}
        <AccordionItem value="authorization">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Unidades Sat</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 overflow-visible h-screen">
            <div className="relative overflow-visible">
              <MultipleSelector
                options={unidadesSatOptions}
                defaultOptions={unidadesSatOptions}
                value={selectedValues}
                inputReadOnly={false}
                placeholder="Seleccionar unidad SAT"
                triggerSearchOnFocus
                onSearch={async (searchTerm) => {
                  return unidadesSatOptions?.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                }}
                onChange={(values) => {
                  setSelectedValues(values);
                  setSearchParams((prevState) => ({
                    ...prevState,
                    unidadSat: values.map((item) => item.value),
                  }));
                }}
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    No hay resultados
                  </p>
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

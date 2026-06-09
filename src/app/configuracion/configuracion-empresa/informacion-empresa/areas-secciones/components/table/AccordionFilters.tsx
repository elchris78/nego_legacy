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
import MultipleSelector, { Option } from "@/ui/multiselect";

import { AreaParams } from "../../services/areaTypes";

// type Option = {
//   value: string;
//   label: string;
// };

interface Props {
  searchParams: AreaParams;
  setSearchParams: Dispatch<SetStateAction<AreaParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  responsableOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  responsableOptions,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<Option[]>([]);

  useEffect(() => {
    // Si no hay responsables seleccionados, se asigna un array vacío
    setSelectedValues(
      (searchParams.responsibleId?.map((value) => ({
        value,
        label: responsableOptions.find(
          (option) => option.value === value
        )?.label || "", // Si no se encuentra el label, se asigna una cadena vacía
      })) ?? [])
    );
  }, [searchParams.responsibleId]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<AreaParams, "isActive" | "responsibleId">
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

        {/* Responsanle */}
        <AccordionItem value="responsable">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Responsable</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 h-52 overflow-y-auto">
            <div className="relative">
              <MultipleSelector
                options={responsableOptions}
                value={selectedValues}
                inputReadOnly={false}
                triggerSearchOnFocus
                
                placeholder="Seleccionar responsable"
                onChange={(values) => {
                  setSelectedValues(values);
                  setSearchParams((prevState) => ({
                    ...prevState,
                    responsibleId: values.map((item) => item.value),
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

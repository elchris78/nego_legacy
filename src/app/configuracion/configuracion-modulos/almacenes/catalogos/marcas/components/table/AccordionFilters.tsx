import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
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

import type { MarcasParams } from "../../services/MarcasTypes";
import DownArrow from "@/Asset/downArrow.svg";

interface Props {
  searchParams: MarcasParams;
  setSearchParams: Dispatch<SetStateAction<MarcasParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  fabricanteOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  fabricanteOptions,
}: Props) => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<MarcasParams, "isActive" | "fabricante">,
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

          <AccordionItem value="fabricante">
            <AccordionTrigger className="flex-row-reverse justify-end gap-2">
              <div className="flex justify-between items-center">
                <span>Fabricante</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-2">
              <div className="relative">
                <MultipleSelector
                  options={fabricanteOptions}
                  defaultOptions={fabricanteOptions}
                  value={fabricanteOptions.filter((opt) =>
                    searchParams.fabricante?.includes(opt.value)
                  )}
                  placeholder="Seleccionar fabricante"
                  triggerSearchOnFocus
                  inputReadOnly={false}
                  usePortal
                  showCheckboxes
                  onSearch={async (term) =>
                    fabricanteOptions.filter((opt) =>
                      opt.label.toLowerCase().includes(term.toLowerCase())
                    )
                  }
                  onChange={(values) => {
                    setSearchParams((prev) => ({
                      ...prev,
                      fabricante: values.length > 0 ? values.map((v) => v.value) : undefined,
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
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

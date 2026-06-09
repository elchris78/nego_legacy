import { Dispatch, SetStateAction } from "react";

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

import type { CancelConceptsParams } from "../../services/cancelConceptsTypes";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: CancelConceptsParams;
  setSearchParams: Dispatch<SetStateAction<CancelConceptsParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  afectaOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  afectaOptions
}: Props) => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<CancelConceptsParams, "isActive" | "affectTo">
  ) => {
    const checked = e.target.checked;

    setSearchParams((prevState) => {
      if (field === "isActive") {
        return {
          ...prevState,
          isActive: checked ? [value] : undefined,
        };
      }
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
                    checked={searchParams.isActive?.[0] === option.value}
                    onChange={(e) => handleCheckboxChange(e, option.value, "isActive")}
                    name={option.label}
                    color="primary"
                  />
                }
                label={option.label}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="multiple" className="px-3 py-1">
        {/* Status */}
        <AccordionItem value="status">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Afecta a</span>
            </div>
          </AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 gap-2 lg:grid-cols-2 px-3">
            {afectaOptions.map((option) => (
              <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                checked={searchParams.affectTo?.includes(option.value)}
                onChange={(e) =>
                  handleCheckboxChange(e, option.value, "affectTo")
                }
                name={option.label}
                color="primary"
                />
              }
              label={option.label}
              className="whitespace-nowrap"
              />
            ))}
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

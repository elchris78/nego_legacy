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

import type { CXCParams } from "../../services/cxcsTypes";

type Option = { value: string; label: string };
type Origin = { value: string; label: string };

interface Props {
  searchParams: CXCParams;
  setSearchParams: Dispatch<SetStateAction<CXCParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  originOptions: Origin[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  originOptions,
}: Props) => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<CXCParams, "isActive" | "origen">
  ) => {
    const checked = e.target.checked;
    setSearchParams((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      let updated: string[];

      if (checked) {
        updated = currentArray.includes(value)
          ? currentArray
          : [...currentArray, value];
      } else {
        updated = currentArray.filter((item) => item !== value);
      }

      return {
        ...prev,
        [field]: updated.length > 0 ? updated : undefined,
      };
    });
  };

  return (
    <div>
      {/* Icono cerrar */}
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
        {/* -- Estatus -- */}
        <AccordionItem value="status">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <span>Estatus</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {statusOptions.map((opt) => (
              <FormControlLabel
                key={opt.value}
                control={
                  <Checkbox
                    checked={
                      Array.isArray(searchParams.isActive) &&
                      searchParams.isActive.includes(opt.value)
                    }
                    onChange={(e) =>
                      handleCheckboxChange(e, opt.value, "isActive")
                    }
                    name={opt.label}
                    color="primary"
                  />
                }
                label={opt.label}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* -- Origen -- */}
        <AccordionItem value="origen">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <span>Origen</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-3 px-3">
            {originOptions.map((opt) => (
              <FormControlLabel
                key={opt.value}
                control={
                  <Checkbox
                    checked={
                      Array.isArray(searchParams.origen) &&
                      searchParams.origen.includes(opt.value)
                    }
                    onChange={(e) =>
                      handleCheckboxChange(e, opt.value, "origen")
                    }
                    name={opt.label}
                    color="primary"
                  />
                }
                label={<span className="whitespace-nowrap">{opt.label}</span>}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

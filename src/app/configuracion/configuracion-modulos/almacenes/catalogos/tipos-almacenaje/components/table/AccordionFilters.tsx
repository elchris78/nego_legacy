import { Dispatch, SetStateAction } from "react";

import { Checkbox, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
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
import { Option } from "@/ui/multiselect";

import type { TipoAlmacenajeParams } from "../../services/tipoAlmacenaje";

interface Props {
  searchParams: TipoAlmacenajeParams;
  setSearchParams: Dispatch<SetStateAction<TipoAlmacenajeParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
}: Props) => {



  const handleStatusChange = (value: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      isActive: [value],
    }));
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
          <AccordionContent className="px-3">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="cuentas-bancarias-row-radio-buttons-group-label"
                name="estatus-cuentas-bancarias"
                value={
                  Array.isArray(searchParams.isActive)
                    ? searchParams.isActive[0]
                    : searchParams.isActive
                }
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

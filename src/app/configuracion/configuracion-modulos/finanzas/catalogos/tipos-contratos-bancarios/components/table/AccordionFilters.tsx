import { Dispatch, SetStateAction, useEffect, useState } from "react";

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

import type { TiposContratosBParams } from "../../services/tiposContratosBTypes";
import MultipleSelector from "@/components/ui/multiselect";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: TiposContratosBParams;
  setSearchParams: Dispatch<SetStateAction<TiposContratosBParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
}: Props) => {



  const handleRadioChange = (value: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      estatus: [value],
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
                  Array.isArray(searchParams.estatus)
                    ? searchParams.estatus[0]
                    : searchParams.estatus
                }
                onChange={(e) => handleRadioChange(e.target.value)}
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

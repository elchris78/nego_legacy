import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Autocomplete, Checkbox, FormControlLabel, TextField } from "@mui/material";
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

import type { CategoriesParams } from "../../services/categoriesTypes"; 
import DownArrow from "@/Asset/downArrow.svg"

interface Props {
  searchParams: CategoriesParams;
  setSearchParams: Dispatch<SetStateAction<CategoriesParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
}: Props) => {
 

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: "isActive"
  ) => {
    const checked = e.target.checked;

    setSearchParams((prevState) => ({
      ...prevState,
      isActive: checked ? [value] : undefined,
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
    </div>
  );
};

export default AccordionFilters;

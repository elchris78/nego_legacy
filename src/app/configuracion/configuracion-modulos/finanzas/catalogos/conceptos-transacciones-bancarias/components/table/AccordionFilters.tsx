"use client";

import { Dispatch, SetStateAction } from "react";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
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
import { Option } from "@/ui/multiselect";

import type { ConceptoTransaccionBancariaTypeParams } from "../../services/conceptosTransaccionesBancariasTypes";

interface Props {
  searchParams: ConceptoTransaccionBancariaTypeParams;
  setSearchParams: Dispatch<
    SetStateAction<ConceptoTransaccionBancariaTypeParams>
  >;
  onClosePopover: () => void;
  statusOptions: Option[];
  tiposTransaccionesOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  tiposTransaccionesOptions,
}: Props) => {
  const handleRadioChange = (name: string, value: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: [value],
    }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<
      ConceptoTransaccionBancariaTypeParams,
      "estatus" | "tipoTransaccion"
    >
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
          <AccordionContent className="px-3">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="conceptos-transacciones-bancarias-row-radio-buttons-group-label"
                name="estatus-conceptos-transacciones-bancarias"
                value={
                  Array.isArray(searchParams.estatus)
                    ? searchParams.estatus[0]
                    : searchParams.estatus
                }
                onChange={(e) => handleRadioChange("estatus", e.target.value)}
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

        {/* Tipo de transacción */}
        <AccordionItem value="tipo-transaccion">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo de transacción</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="conceptos-transacciones-bancarias-row-radio-buttons-group-label-tipo-transaccion"
                name="tipo-transaccion-conceptos-transacciones-bancarias"
                value={
                  Array.isArray(searchParams.tipoTransaccion)
                    ? searchParams.tipoTransaccion[0]
                    : searchParams.tipoTransaccion
                }
                onChange={(e) =>
                  handleRadioChange("tipoTransaccion", e.target.value)
                }
              >
                {tiposTransaccionesOptions.map((option) => (
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

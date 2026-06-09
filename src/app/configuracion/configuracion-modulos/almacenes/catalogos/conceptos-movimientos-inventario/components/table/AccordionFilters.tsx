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

import type { MovimientoInventarioTypeParams } from "../../services/movimientosInventarioTypes";

interface Props {
  searchParams: MovimientoInventarioTypeParams;
  setSearchParams: Dispatch<SetStateAction<MovimientoInventarioTypeParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  origenOptions: Option[];
  aplicaParaOptions: Option[];
  tipoMovimientoOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  origenOptions,
  aplicaParaOptions,
  tipoMovimientoOptions,
}: Props) => {
  const handleRadioChange = (
    field: keyof Pick<
      MovimientoInventarioTypeParams,
      "estatus" | "origen" | "aplicaPara" | "tipoMovimiento"
    >,
    value: string
  ) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: [value],
    }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<
      MovimientoInventarioTypeParams,
      "estatus" | "origen" | "aplicaPara" | "tipoMovimiento"
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
                aria-labelledby="cuentas-bancarias-row-radio-buttons-group-label"
                name="estatus-cuentas-bancarias"
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

        {/* Origen */}
        <AccordionItem value="origen">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Origen</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="cuentas-bancarias-row-radio-buttons-group-label-origin"
                name="origin-cuentas-bancarias"
                value={
                  Array.isArray(searchParams.origen)
                    ? searchParams.origen[0]
                    : searchParams.origen
                }
                onChange={(e) => handleRadioChange("origen", e.target.value)}
              >
                {origenOptions.map((option) => (
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

        {/* Aplica Para */}
        <AccordionItem value="aplicaPara">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Aplica Para</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {aplicaParaOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.aplicaPara?.includes(option.value)}
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "aplicaPara")
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

        {/* Tipo Movimiento */}
        <AccordionItem value="tipoMovimiento">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo Movimiento</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="cuentas-bancarias-row-radio-buttons-group-label-tipo-movimiento"
                name="tipo-movimiento-cuentas-bancarias"
                value={
                  Array.isArray(searchParams.tipoMovimiento)
                    ? searchParams.tipoMovimiento[0]
                    : searchParams.tipoMovimiento
                }
                onChange={(e) =>
                  handleRadioChange("tipoMovimiento", e.target.value)
                }
              >
                {tipoMovimientoOptions.map((option) => (
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

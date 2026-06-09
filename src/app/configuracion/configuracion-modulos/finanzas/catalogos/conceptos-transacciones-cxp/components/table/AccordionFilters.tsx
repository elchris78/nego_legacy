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

import type { TransaccionesDXPParams } from "../../services/transaccionesDXPTypes";
import MultipleSelector from "@/components/ui/multiselect";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: TransaccionesDXPParams;
  setSearchParams: Dispatch<SetStateAction<TransaccionesDXPParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  formasPago: Option[];
  vendedorOptions: Option[];
  origenOptions: Option[];
  transaccionesDXP: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  formasPago,
  vendedorOptions,
  origenOptions,
  transaccionesDXP
}: Props) => {

  const [selectedFormaPago, setSelectedFormaPago] = useState<Option[]>([]);
  const [selectedContrapartida, setSelectedContrapartida] = useState<Option[]>([]);
useEffect(() => {
  const getSelected = (selected: string[] | undefined, options: Option[]) =>
    (selected?.map(value => options.find(opt => opt?.value === value))
      .filter(Boolean) as Option[]) || [];

  setSelectedContrapartida(getSelected(searchParams.contraPartida, transaccionesDXP));
  setSelectedFormaPago(getSelected(searchParams.formaPago, formasPago));
}, [searchParams.contraPartida, transaccionesDXP, searchParams.tipoRelacionSat, searchParams.formaPago, formasPago  ]);


  

const handleParamChange = (key: 'isActive' | 'origen' | 'tipoTransaccion', value: string) => {
  setSearchParams((prevState) => ({
    ...prevState,
    [key]: [value],
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
                onChange={(e) => handleParamChange('isActive', e.target.value)}
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
                aria-labelledby="cuentas-bancarias-row-radio-buttons-group-label"
                name="estatus-cuentas-bancarias"
                value={
                  Array.isArray(searchParams.origen)
                    ? searchParams.origen[0]
                    : searchParams.origen
                }
                onChange={(e) => handleParamChange('origen', e.target.value)}
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

        <AccordionItem value="contrapartida">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Contrapartida</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={transaccionesDXP}
              defaultOptions={transaccionesDXP}
              inputReadOnly={false}
              placeholder="Seleccionar módulos"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              value={selectedContrapartida ?? []}
              onSearch={async (searchTerm) => {
                return transaccionesDXP.filter((option) =>
                  option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedContrapartida(values);
                setSearchParams((prev) => ({
                  ...prev,
                  contraPartida: values.length > 0 ? values.map((v) => v.value) : undefined,
                }));
              }}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  No hay resultados
                </p>
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tipoTransaccion">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo de transacción</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="cuentas-bancarias-row-radio-buttons-group-label"
                name="estatus-cuentas-bancarias"
                value={
                  Array.isArray(searchParams.tipoTransaccion)
                    ? searchParams.tipoTransaccion[0]
                    : searchParams.tipoTransaccion
                }
                onChange={(e) => handleParamChange('tipoTransaccion', e.target.value)}
              >
                {vendedorOptions.map((option) => (
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

        <AccordionItem value="formaPago">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Forma de pago</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={formasPago}
              defaultOptions={formasPago}
              value={selectedFormaPago}
              inputReadOnly={false}
              placeholder="Seleccionar módulos"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              onSearch={async (searchTerm) => {
                return formasPago.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedFormaPago(values);
                setSearchParams((prev) => ({
                  ...prev,
                  formaPago: values.length > 0 ? values.map((v) => v.value) : undefined,
                }));
              }}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  No hay resultados
                </p>
              }
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

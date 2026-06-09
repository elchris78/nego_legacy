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

import type { TransaccionesDXCParams } from "../../services/transaccionesDXCTypes";
import MultipleSelector from "@/components/ui/multiselect";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: TransaccionesDXCParams;
  setSearchParams: Dispatch<SetStateAction<TransaccionesDXCParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  tiposRelacion: Option[];
  formasPago: Option[];
  vendedorOptions: Option[];
  origenOptions: Option[];
  transaccionesDXC: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  tiposRelacion,
  formasPago,
  vendedorOptions,
  origenOptions,
  transaccionesDXC
}: Props) => {

  const [selectedTipoVendedor, setSelectedTipoVendedor] = useState<Option[]>([]);
  const [selectedFormaPago, setSelectedFormaPago] = useState<Option[]>([]);
  const [selectedContrapartida, setSelectedContrapartida] = useState<Option[]>([]);
useEffect(() => {
  const getSelected = (selected: string[] | undefined, options: Option[]) =>
    (selected?.map(value => options.find(opt => opt?.value === value))
      .filter(Boolean) as Option[]) || [];

  setSelectedContrapartida(getSelected(searchParams.contraPartida, transaccionesDXC));
  setSelectedTipoVendedor(getSelected(searchParams.tipoRelacionSat, tiposRelacion));
  setSelectedFormaPago(getSelected(searchParams.formaPago, formasPago));
}, [searchParams.contraPartida, transaccionesDXC, searchParams.tipoRelacionSat, tiposRelacion, searchParams.formaPago, formasPago  ]);


    const handleCheckboxChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  value: string,
  field: "isActive" | "origen" | "contraPartida" | "tipoTransaccion" | "tipoRelacionSat" | "formaPago"
) => {
  const checked = e.target.checked;

  setSearchParams((prevState) => {
    let updatedValue: string[] | undefined;

    // Para campos que deben tener solo un valor
    const singleSelectFields = ["isActive", "origen", "tipoTransaccion"];

    if (singleSelectFields.includes(field)) {
      updatedValue = checked ? [value] : undefined;
    } else {
      const currentArray = prevState[field] || [];
      updatedValue = checked
        ? [...currentArray, value]
        : currentArray.filter((item) => item !== value);
    }

    return {
      ...prevState,
      [field]: updatedValue?.length ? updatedValue : undefined,
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

        

        <AccordionItem value="origen">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Origen</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {origenOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.origen?.[0] === option.value}
                    onChange={(e) => handleCheckboxChange(e, option.value, "origen")}
                    name={option.label}
                    color="primary"
                  />
                }
                label={option.label}
              />
            ))}
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
              options={transaccionesDXC}
              defaultOptions={transaccionesDXC}
              inputReadOnly={false}
              placeholder="Seleccionar módulos"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              value={selectedContrapartida ?? []}
              onSearch={async (searchTerm) => {
                return transaccionesDXC.filter((option) =>
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
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {vendedorOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.tipoTransaccion?.[0] === option.value}
                    onChange={(e) => handleCheckboxChange(e, option.value, "tipoTransaccion")}
                    name={option.label}
                    color="primary"
                  />
                }
                label={option.label}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tipoRelacionSat">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo de relación SAT</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={tiposRelacion}
              defaultOptions={tiposRelacion}
              value={selectedTipoVendedor}
              inputReadOnly={false}
              placeholder="Seleccionar módulos"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              onSearch={async (searchTerm) => {
                return tiposRelacion.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedTipoVendedor(values);
                setSearchParams((prev) => ({
                  ...prev,
                  tipoRelacionSat: values.length > 0 ? values.map((v) => v.value) : undefined,
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

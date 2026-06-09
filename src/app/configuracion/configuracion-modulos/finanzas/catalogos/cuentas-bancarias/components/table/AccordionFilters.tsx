"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
import MultipleSelector, { Option } from "@/ui/multiselect";

import type { CuentaBancariaTypeParams } from "../../services/cuentasBancariasTypes";

interface Props {
  searchParams: CuentaBancariaTypeParams;
  setSearchParams: Dispatch<SetStateAction<CuentaBancariaTypeParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  bancosOptions: Option[];
  monedasOptions: Option[];
  tipoInstrumentosBancariosOptions: Option[];
  cuentasContablesOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  bancosOptions,
  monedasOptions,
  tipoInstrumentosBancariosOptions,
  cuentasContablesOptions,
}: Props) => {
  const [selectedBancos, setSelectedBancos] = useState<Option[]>([]);
  const [selectedMonedas, setSelectedMonedas] = useState<Option[]>([]);
  const [selectedCuentaContable, setselectedCuentaContable] = useState<
    Option[]
  >([]);

  // Inicializar selectedBancos con los valores de searchParams.bancos
  useEffect(() => {
    const selectedOptions = searchParams.bancoIds?.map((value) => {
      const option = bancosOptions.find((opt) => opt.value === value);
      return option ? { value: option.value, label: option.label } : null;
    });
    setSelectedBancos(selectedOptions?.filter(Boolean) as Option[]);
  }, [searchParams.bancoIds, bancosOptions]);

  // Inicializar selectedMonedas con los valores de searchParams.monedas
  useEffect(() => {
    const selectedOptions = searchParams.monedaIds?.map((value) => {
      const option = monedasOptions.find((opt) => opt.value === value);
      return option ? { value: option.value, label: option.label } : null;
    });
    setSelectedMonedas(selectedOptions?.filter(Boolean) as Option[]);
  }, [searchParams.monedaIds, monedasOptions]);

  // Inicializar selectedCuentaContable con los valores de searchParams.cuentaContable
  useEffect(() => {
    const selectedOptions = searchParams.cuentaContable?.map((value) => {
      const option = cuentasContablesOptions.find((opt) => opt.value === value);
      return option ? { value: option.value, label: option.label } : null;
    });
    setselectedCuentaContable(selectedOptions?.filter(Boolean) as Option[]);
  }, [searchParams.cuentaContable, cuentasContablesOptions]);

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
      CuentaBancariaTypeParams,
      "bancoIds" | "monedaIds" | "tipoInstrumentoBancario" | "cuentaContable"
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

        {/* Bancos */}
        <AccordionItem value="bancos">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Bancos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 overflow-visible h-[30vh]">
            <div className="relative overflow-visible">
              <MultipleSelector
                options={bancosOptions}
                defaultOptions={bancosOptions}
                value={selectedBancos}
                inputReadOnly={false}
                placeholder="Seleccionar bancos"
                triggerSearchOnFocus
                onSearch={async (searchTerm) => {
                  return bancosOptions?.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                }}
                onChange={(values) => {
                  setSelectedBancos(values);
                  setSearchParams((prevState) => ({
                    ...prevState,
                    bancoIds: values.map((item) => item.value),
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

        {/* Monedas */}
        <AccordionItem value="monedas">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Monedas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 overflow-visible h-[30vh]">
            <div className="relative overflow-visible">
              <MultipleSelector
                options={monedasOptions}
                defaultOptions={monedasOptions}
                value={selectedMonedas}
                inputReadOnly={false}
                placeholder="Seleccionar monedas"
                triggerSearchOnFocus
                onSearch={async (searchTerm) => {
                  return monedasOptions?.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                }}
                onChange={(values) => {
                  setSelectedMonedas(values);
                  setSearchParams((prevState) => ({
                    ...prevState,
                    monedaIds: values.map((item) => item.value),
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

        {/* Tipo de instrumento bancario */}
        <AccordionItem value="tipo-instrumento">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo de instrumento bancario</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="cuentas-bancarias-row-radio-buttons-group-label-tipo-instrumento"
                name="tipo-instrumento-cuentas-bancarias"
                value={
                  Array.isArray(searchParams.tipoInstrumentoBancario)
                    ? searchParams.tipoInstrumentoBancario[0]
                    : searchParams.tipoInstrumentoBancario
                }
                onChange={(e) =>
                  handleRadioChange("tipoInstrumentoBancario", e.target.value)
                }
              >
                {tipoInstrumentosBancariosOptions.map((option) => (
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
          {/* <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {tipoInstrumentosBancariosOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.tiposInstrumentoBancario?.includes(
                      option.value
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e,
                        option.value,
                        "tiposInstrumentoBancario"
                      )
                    }
                    name={option.label}
                    color="primary"
                  />
                }
                label={option.label}
              />
            ))}
          </AccordionContent> */}
        </AccordionItem>

        {/* Cuenta contable */}
        <AccordionItem value="cuenta-contable">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Cuenta contable</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 overflow-visible h-[30vh]">
            <div className="relative overflow-visible">
              <MultipleSelector
                options={cuentasContablesOptions}
                defaultOptions={cuentasContablesOptions}
                value={selectedCuentaContable}
                inputReadOnly={false}
                placeholder="Seleccionar cuentas contables"
                triggerSearchOnFocus
                onSearch={async (searchTerm) => {
                  return cuentasContablesOptions?.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                }}
                onChange={(values) => {
                  setselectedCuentaContable(values);
                  setSearchParams((prevState) => ({
                    ...prevState,
                    cuentasContables: values.map((item) => item.value),
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
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

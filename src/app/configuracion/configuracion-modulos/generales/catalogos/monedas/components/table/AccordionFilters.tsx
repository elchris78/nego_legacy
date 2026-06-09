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

import type { MonedasParams } from "../../services/monedasTypes";
import MultipleSelector from "@/components/ui/multiselect";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: MonedasParams;
  setSearchParams: Dispatch<SetStateAction<MonedasParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  countriesOptions: Option[];
  catMonedas: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  countriesOptions,
  catMonedas,
}: Props) => {
  const [selectedMoneda, setSelectedMoneda] = useState<Option[]>([]);
  const [selectedPais, setSelectedPais] = useState<Option[]>([]);
  const handleParamChange = (key: 'estatus', value: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [key]: [value],
    }));
  };

  useEffect(() => {
    const getSelected = (selected: string[] | undefined, options: Option[]) =>
      (selected?.map(value => options.find(opt => opt?.value === value))
        .filter(Boolean) as Option[]) || [];

    setSelectedMoneda(getSelected(searchParams.monedaSatIds, catMonedas || []));
    setSelectedPais(getSelected(searchParams.paisIds, countriesOptions || []));
  }, [searchParams.paisIds, countriesOptions, searchParams.monedaSatIds  ]);
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
                onChange={(e) => handleParamChange('estatus', e.target.value)}
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

        <AccordionItem value="Moneda">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Monedas Sat</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={catMonedas}
              defaultOptions={catMonedas}
              inputReadOnly={false}
              placeholder="Seleccionar módulos"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              value={selectedMoneda ?? []}
              onSearch={async (searchTerm) => {
                return catMonedas.filter((option) =>
                  option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedMoneda(values);
                setSearchParams((prev) => ({
                  ...prev,
                  monedaSatIds: values.length > 0 ? values.map((v) => v.value) : undefined,
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

        <AccordionItem value="Pais">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>País</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={countriesOptions}
              defaultOptions={countriesOptions}
              inputReadOnly={false}
              placeholder="Seleccionar módulos"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              value={selectedPais ?? []}
              onSearch={async (searchTerm) => {
                return countriesOptions.filter((option) =>
                  option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedPais(values);
                setSearchParams((prev) => ({
                  ...prev,
                  paisIds: values.length > 0 ? values.map((v) => v.value) : undefined,
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

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CircleXIcon } from 'lucide-react';

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

import type { KeyConfigurationParams } from "../../services/keyConfigurationTypes";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { Checkbox, FormControlLabel } from "@mui/material";

interface Props {
  searchParams: KeyConfigurationParams;
  setSearchParams: Dispatch<SetStateAction<KeyConfigurationParams>>;
  onClosePopover: () => void;
  moduloOptions: Option[];
  catalgoOptions: Option[];
  tipoClaveOptions: Option[];
  tipoPrefOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  moduloOptions,
  catalgoOptions,
  tipoClaveOptions,
  tipoPrefOptions
}: Props) => {

  
  const [selectedModulo, setSelectedModulo] = useState<Option[]>([]);
  const [selectedSubModulo, setSelectedSubModulo] = useState<Option[]>([]);

  useEffect(() => {
    const getSelected = (selected: string[] | undefined, options: Option[]) =>
      selected?.map(value => options.find(opt => opt.value === value))
        .filter(Boolean) as Option[] || [];

    setSelectedModulo(getSelected(searchParams.Modulo, moduloOptions));
    setSelectedSubModulo(getSelected(searchParams.Catalogo, catalgoOptions));
  }, [searchParams, moduloOptions, catalgoOptions, tipoClaveOptions, tipoPrefOptions]);

 const handleCheckboxChange = (
     e: React.ChangeEvent<HTMLInputElement>,
     value: string,
     field: keyof Pick<KeyConfigurationParams, "Modulo" | "Catalogo" | "TipoClave" | "TipoPrefijo">
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
        {/* Modulo */}
        <AccordionItem value="Modulo">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Modulo</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 overflow-visible h-[12vh]">
            <MultipleSelector
              options={moduloOptions}
              defaultOptions={moduloOptions}
              value={selectedModulo}
              inputReadOnly={false}
              placeholder="Seleccionar módulos"
              triggerSearchOnFocus
              showCheckboxes
              onSearch={async (searchTerm) => {
                return moduloOptions.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedModulo(values);
                setSearchParams((prev) => ({
                  ...prev,
                  Modulo: values.length > 0 ? values.map((v) => v.value) : undefined,
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

        {/* Catalogo */}
        <AccordionItem value="Catalogo">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Catálogo</span>
            </div>
          </AccordionTrigger>
          <AccordionContent
            className={`px-3 py-2 overflow-visible ${
              selectedModulo.length > 0
                ? "h-[45vh] md:h-[47vh] lg:h-[50vh]"
                : "h-[12vh]"
            }`}
          >
            {selectedModulo.length > 0 ? (
              <MultipleSelector
                options={catalgoOptions}
                defaultOptions={catalgoOptions}
                value={selectedSubModulo}
                inputReadOnly={false}
                placeholder="Seleccionar submódulo"
                triggerSearchOnFocus
                showCheckboxes
                onSearch={async (searchTerm) => {
                  return catalgoOptions.filter((option) =>
                    option.label.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                }}
                onChange={(values) => {
                  setSelectedSubModulo(values);
                  setSearchParams((prev) => ({
                    ...prev,
                    Catalogo: values.length > 0 ? values.map((v) => v.value) : undefined,
                  }));
                }}
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    No hay resultados
                  </p>
                }
              />
            ) : (
              <p className="text-sm text-gray-500 italic">
                Selecciona primero un módulo para ver los submódulos disponibles.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>


        {/* Tipo de clave */}
        <AccordionItem value="TipoClave">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo de clave</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {tipoClaveOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.TipoClave?.includes(option.value)}
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "TipoClave")
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

        <AccordionItem value="TipoPrefijo">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo de prefijo</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {tipoPrefOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.TipoPrefijo?.includes(option.value)}
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "TipoPrefijo")
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
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

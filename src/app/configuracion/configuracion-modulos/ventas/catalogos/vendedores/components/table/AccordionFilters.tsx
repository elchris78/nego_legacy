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

import type { SellersParams } from "../../services/sellersTypes";
import MultipleSelector from "@/components/ui/multiselect";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: SellersParams;
  setSearchParams: Dispatch<SetStateAction<SellersParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  zonaOptions: Option[];
  subZonaOptions: Option[];
  vendedorOptions: Option[];
  tipoVendedorOptions: Option[];
  colaboradoresOptions: Option[];
  comisionOptions: Option[];
  setZonaSeleccionada: Dispatch<SetStateAction<string>>;
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  zonaOptions,
  subZonaOptions,
  vendedorOptions,
  tipoVendedorOptions,
  colaboradoresOptions,
  comisionOptions,
  setZonaSeleccionada
}: Props) => {

  const [selectedZona, setSelectedZona] = useState<Option[]>([]);
  const [selectedSubZona, setSelectedSubZona] = useState<Option[]>([]);
  const [selectedVenvedor, setSelectedVendedor] = useState<Option[]>([]);
  const [selectedTipoVendedor, setSelectedTipoVendedor] = useState<Option[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Option[]>([]);

  useEffect(() => {
    const getSelected = (selected: string[] | undefined, options: Option[]) =>
      selected?.map(value => options.find(opt => opt.value === value))
        .filter(Boolean) as Option[] || [];

    setSelectedZona(getSelected(searchParams.zonas, zonaOptions));
    setSelectedSubZona(getSelected(searchParams.subzonas, subZonaOptions));
    setSelectedVendedor(getSelected(searchParams.colaboradorIds, vendedorOptions));
    setSelectedTipoVendedor(getSelected(searchParams.tipoVendedorIds, tipoVendedorOptions));
    setSelectedSupervisor(getSelected(searchParams.supervisorIds, colaboradoresOptions))
  }, [searchParams, zonaOptions, subZonaOptions]);

    const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: "isActive" | "zonas" | "subzonas" | "colaboradorIds" | "tipoVendedorIds" | "supervisorIds" | "tipoComision"
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

        

        <AccordionItem value="Zona">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Zona</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={zonaOptions}
              defaultOptions={zonaOptions}
              value={selectedZona}
              inputReadOnly={false}
              placeholder="Seleccionar zona"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              onSearch={async (searchTerm) => {
                return zonaOptions.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedZona(values);
                setZonaSeleccionada(values.length > 0 ? values[0].value : "");
                setSearchParams((prev) => ({
                  ...prev,
                  zonas: values.length > 0 ? values.map((v) => v.value) : undefined,
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

        <AccordionItem value="SubZona">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>SubZona</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={subZonaOptions}
              defaultOptions={subZonaOptions}
              value={selectedSubZona}
              inputReadOnly={false}
              placeholder="Seleccionar subZona"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              onSearch={async (searchTerm) => {
                return subZonaOptions.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedSubZona(values);
                setSearchParams((prev) => ({
                  ...prev,
                  subzonas: values.length > 0 ? values.map((v) => v.value) : undefined,
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

        <AccordionItem value="vendedor">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Vendedor</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={vendedorOptions}
              defaultOptions={vendedorOptions}
              value={selectedVenvedor}
              inputReadOnly={false}
              placeholder="Seleccionar vendedor"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              onSearch={async (searchTerm) => {
                return vendedorOptions.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedVendedor(values);
                setSearchParams((prev) => ({
                  ...prev,
                  colaboradorIds: values.length > 0 ? values.map((v) => v.value) : undefined,
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

        <AccordionItem value="tippVendedor">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo vendedor</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={tipoVendedorOptions}
              defaultOptions={tipoVendedorOptions}
              value={selectedTipoVendedor}
              inputReadOnly={false}
              placeholder="Seleccionar tipo de vendedor"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              onSearch={async (searchTerm) => {
                return tipoVendedorOptions.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSelectedTipoVendedor(values);
                setSearchParams((prev) => ({
                  ...prev,
                  tipoVendedorIds: values.length > 0 ? values.map((v) => v.value) : undefined,
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

        <AccordionItem value="Supervisor">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Supervisor</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={colaboradoresOptions}
              defaultOptions={colaboradoresOptions}
              value={selectedSupervisor}
              inputReadOnly={false}
              placeholder="Seleccionar supervisor"
              triggerSearchOnFocus
              showCheckboxes
              usePortal
              onSearch={async (searchTerm) => {
                return colaboradoresOptions.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onChange={(values) => {
                setSearchParams((prev) => ({
                  ...prev,
                  supervisorIds: values.length > 0 ? values.map((v) => v.value) : undefined,
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

        <AccordionItem value="Tipo de comisión">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo de comisión</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {comisionOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.tipoComision?.[0] === option.value}
                    onChange={(e) => handleCheckboxChange(e, option.value, "tipoComision")}
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

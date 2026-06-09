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
import MultipleSelector, { Option } from "@/ui/multiselect";

import { SucursalesParams } from "../../services/sucursalesTypes"; 

// type Option = {
//   value: string;
//   label: string;
// };

interface Props {
  searchParams: SucursalesParams;
  setSearchParams: Dispatch<SetStateAction<SucursalesParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  responsableOptions: Option[];
  paisOptions: Option[];
  cpOptions: Option[]
  estadoOptions: Option[];
  ciudadOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  responsableOptions,
  paisOptions,
  cpOptions,
  estadoOptions,
  ciudadOptions,
}: Props) => {
  const [selectedResponsables, setSelectedResponsables] = useState<Option[]>([]);
  const [selectedPaises, setSelectedPaises] = useState<Option[]>([]);
  const [selectedCodigos, setSelectedCodigos] = useState<Option[]>([]);
  const [selectedEstados, setSelectedEstados] = useState<Option[]>([]);
  const [selectedCiudades, setSelectedCiudades] = useState<Option[]>([]);

  useEffect(() => {
    setSelectedResponsables(
      searchParams.responsableId?.map((value) => responsableOptions.find(opt => opt.value === value) || { value, label: value }) || []
    );
    setSelectedPaises(
      searchParams.pais?.map((value) => paisOptions.find(opt => opt.value === value) || { value, label: value }) || []
    );
    setSelectedCodigos(
      searchParams.codigoPostal?.map((value) => cpOptions.find(opt => opt.value === value) || { value, label: value }) || []
    );
    setSelectedEstados(
      searchParams.estado?.map((value) => estadoOptions.find(opt => opt.value === value) || { value, label: value }) || []
    );
    setSelectedCiudades(
      searchParams.ciudad?.map((value) => ciudadOptions.find(opt => opt.value === value) || { value, label: value }) || []
    );
  }, [
    searchParams.responsableId,
    searchParams.pais,
    searchParams.codigoPostal,
    searchParams.estado,
    searchParams.ciudad
  ]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<SucursalesParams, "isActive">
  ) => {
    const checked = e.target.checked;
    setSearchParams((prevState) => {
      let updatedArray: string[] = [];
      if (field === "isActive") {
        updatedArray = checked ? [value] : [];
      }
      return {
        ...prevState,
        [field]: updatedArray.length > 0 ? updatedArray : undefined,
      };
    });
  };

  return (
    <div>
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
        {/* Estatus */}
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
                    checked={searchParams.isActive?.includes(option.value)}
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "isActive")
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

        {/* Responsable principal */}
        <AccordionItem value="responsable">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <span>Responsable principal</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={responsableOptions}
              defaultOptions={responsableOptions}
              value={selectedResponsables}
              placeholder="Seleccionar responsable principal"
              triggerSearchOnFocus
              inputReadOnly={false}
              usePortal
              onSearch={async (term) =>
                responsableOptions.filter((opt) =>
                  opt.label.toLowerCase().includes(term.toLowerCase())
                )
              }
              onChange={(values) => {
                setSelectedResponsables(values);
                setSearchParams((prev) => ({
                  ...prev,
                  responsableId: values.length > 0 ? values.map((v) => v.value) : undefined,
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

        {/* País */}
        <AccordionItem value="pais">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <span>País</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={paisOptions}
              defaultOptions={paisOptions}
              value={selectedPaises}
              placeholder="Seleccionar país"
              triggerSearchOnFocus
              inputReadOnly={false}
              usePortal
              onSearch={async (term) =>
                paisOptions.filter((opt) =>
                  opt.label.toLowerCase().includes(term.toLowerCase())
                )
              }
              onChange={(values) => {
                setSelectedPaises(values);
                setSearchParams((prev) => ({
                  ...prev,
                  pais: values.length > 0 ? values.map((v) => v.value) : undefined,
                }));
              }}
              emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">No hay resultados</p>}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Código Postal */}
        <AccordionItem value="codigo">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <span>Código Postal</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={cpOptions}
              defaultOptions={cpOptions}
              value={selectedCodigos}
              placeholder="Seleccionar código postal"
              triggerSearchOnFocus
              inputReadOnly={false}
              usePortal
              onSearch={async (term) =>
                cpOptions.filter((opt) =>
                  opt.label.toLowerCase().includes(term.toLowerCase())
                )
              }
              onChange={(values) => {
                setSelectedCodigos(values);
                setSearchParams((prev) => ({
                  ...prev,
                  codigoPostal: values.length > 0 ? values.map((v) => v.value) : undefined,
                }));
              }}
              emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">No hay resultados</p>}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Estado */}
        <AccordionItem value="estado">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <span>Estado</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={estadoOptions}
              defaultOptions={estadoOptions}
              value={selectedEstados}
              placeholder="Seleccionar estado"
              triggerSearchOnFocus
              inputReadOnly={false}
              usePortal
              onSearch={async (term) =>
                estadoOptions.filter((opt) =>
                  opt.label.toLowerCase().includes(term.toLowerCase())
                )
              }
              onChange={(values) => {
                setSelectedEstados(values);
                setSearchParams((prev) => ({
                  ...prev,
                  estado: values.length > 0 ? values.map((v) => v.value) : undefined,
                }));
              }}
              emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">No hay resultados</p>}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Ciudad */}
        <AccordionItem value="ciudad">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <span>Ciudad</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <MultipleSelector
              options={ciudadOptions}
              defaultOptions={ciudadOptions}
              value={selectedCiudades}
              placeholder="Seleccionar ciudad"
              triggerSearchOnFocus
              inputReadOnly={false}
              usePortal
              onSearch={async (term) =>
                ciudadOptions.filter((opt) =>
                  opt.label.toLowerCase().includes(term.toLowerCase())
                )
              }
              onChange={(values) => {
                setSelectedCiudades(values);
                setSearchParams((prev) => ({
                  ...prev,
                  ciudad: values.length > 0 ? values.map((v) => v.value) : undefined,
                }));
              }}
              emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">No hay resultados</p>}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

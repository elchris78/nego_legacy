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

import { ColaboradorParams } from "../../services/colaboradoresTypes";

interface Props {
  searchParams: ColaboradorParams;
  setSearchParams: Dispatch<SetStateAction<ColaboradorParams>>;
  onClosePopover: () => void;
  statusOptions: Option[];
  tipoColaboradorOptions: Option[];
  puestosOptions: Option[];
  departamentosOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  statusOptions,
  tipoColaboradorOptions,
  puestosOptions,
  departamentosOptions,
}: Props) => {
  const [selectedPuestos, setSelectedPuestos] = useState<Option[]>([]);
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<Option[]>(
    []
  );

  // Inicializar selectedPuestos con los valores de searchParams.puesto
  useEffect(() => {
    const selectedOptions = searchParams.puestos?.map((value) => {
      const option = puestosOptions.find((opt) => opt.value === value);
      return option ? { value: option.value, label: option.label } : null;
    });
    setSelectedPuestos(selectedOptions?.filter(Boolean) as Option[]);
  }, [searchParams.puestos, puestosOptions]);

  // Inicializar selectedDepartamentos con los valores de searchParams.departamento
  useEffect(() => {
    const selectedOptions = searchParams.departamentos?.map((value) => {
      const option = departamentosOptions.find((opt) => opt.value === value);
      return option ? { value: option.value, label: option.label } : null;
    });
    setSelectedDepartamentos(selectedOptions?.filter(Boolean) as Option[]);
  }, [searchParams.departamentos, departamentosOptions]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<
      ColaboradorParams,
      "estatus" | "tipoColaborador" | "puestos" | "departamentos"
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
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {statusOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.estatus?.includes(option.value)}
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "estatus")
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

        {/* Tipo Colaborador */}
        <AccordionItem value="tipoColaborador">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Tipo Colaborador</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {tipoColaboradorOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={searchParams.tipoColaborador?.includes(
                      option.value
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "tipoColaborador")
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

        {/* Puestos */}
        <AccordionItem value="puestos">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Puestos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 overflow-visible h-[30vh]">
            <div className="relative overflow-visible">
              <MultipleSelector
                options={puestosOptions}
                defaultOptions={puestosOptions}
                value={selectedPuestos}
                inputReadOnly={false}
                placeholder="Seleccionar puestos"
                triggerSearchOnFocus
                onSearch={async (searchTerm) => {
                  return puestosOptions?.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                }}
                onChange={(values) => {
                  setSelectedPuestos(values);
                  setSearchParams((prevState) => ({
                    ...prevState,
                    puestos: values.map((item) => item.value),
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

        {/* Departamentos */}
        <AccordionItem value="departamentos">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Departamentos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 overflow-visible h-[30vh]">
            <div className="relative overflow-visible">
              <MultipleSelector
                options={departamentosOptions}
                defaultOptions={departamentosOptions}
                value={selectedDepartamentos}
                inputReadOnly={false}
                placeholder="Seleccionar departamentos"
                triggerSearchOnFocus
                onSearch={async (searchTerm) => {
                  return departamentosOptions?.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                }}
                onChange={(values) => {
                  setSelectedDepartamentos(values);
                  setSearchParams((prevState) => ({
                    ...prevState,
                    departamentos: values.map((item) => item.value),
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

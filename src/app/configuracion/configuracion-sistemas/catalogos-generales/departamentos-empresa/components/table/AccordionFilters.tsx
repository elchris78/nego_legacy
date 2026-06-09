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
import {
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";
import { CircleXIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GetDepartmentsRequest } from "@/lib/services/departments/departmentsTypes";
import MultipleSelector from "@/components/ui/multiselect";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: GetDepartmentsRequest;
  setSearchParams: Dispatch<SetStateAction<GetDepartmentsRequest>>;
  onClosePopover: () => void;
  departmentOptions: Option[];
  areaOptions: Option[];
  statusOptions: Option[];
  responsableOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  departmentOptions,
  statusOptions,
  areaOptions,
  responsableOptions,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<Option[]>([]);

  useEffect(() => {
    const selectedOptions = searchParams.Responsibles?.map((value) => {
      const option = responsableOptions.find((opt) => opt.value === value);
      return option ? { value: option.value, label: option.label } : null;
    });
    setSelectedValues(selectedOptions?.filter(Boolean) as Option[]);
  }, [searchParams.Responsibles]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<
      GetDepartmentsRequest,
      "Status" | "Areas" | "Names" | "Responsibles"
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

  const handleRadioChange = (name: string, value: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: [value],
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
        {/* Department */}
        <AccordionItem value="department">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Departamento
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {departmentOptions.map((option) => (
              <FormControlLabel
                value={option.value}
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "Names")
                    }
                    checked={
                      !!searchParams.Names &&
                      searchParams.Names.includes(option.value)
                    }
                  />
                }
                label={option.label}
                labelPlacement="end"
              />
            ))}
            {departmentOptions.length === 0 && (
              <div className="flex items-center justify-center col-span-2 lg:col-span-4 text-sm text-gray-500">
                No hay departamentos disponibles
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Area */}
        <AccordionItem value="area">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Área
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {areaOptions.map((option) => (
              <FormControlLabel
                value={option.value}
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "Areas")
                    }
                    checked={
                      !!searchParams.Areas &&
                      searchParams.Areas.includes(option.value)
                    }
                  />
                }
                label={option.label}
                labelPlacement="end"
              />
            ))}
            {areaOptions.length === 0 && (
              <div className="flex items-center justify-center col-span-2 lg:col-span-4 text-sm text-gray-500">
                No hay áreas disponibles
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Status */}
        <AccordionItem value="status">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Estatus
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="cuentas-bancarias-row-radio-buttons-group-label"
                name="estatus-cuentas-bancarias"
                value={
                  Array.isArray(searchParams.Status)
                    ? searchParams.Status[0]
                    : searchParams.Status
                }
                onChange={(e) => handleRadioChange("Status", e.target.value)}
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

        {/* Responsanle */}
        <AccordionItem value="responsable">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            <div className="flex justify-between items-center">
              <span>Responsable</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 h-52 overflow-y-auto">
            <div className="relative">
              <MultipleSelector
                options={responsableOptions}
                value={selectedValues}
                inputReadOnly={false}
                triggerSearchOnFocus
                placeholder="Seleccionar responsable"
                onChange={(values) => {
                  setSelectedValues(values);
                  setSearchParams((prevState) => ({
                    ...prevState,
                    Responsibles: values.map((item) => item.value),
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

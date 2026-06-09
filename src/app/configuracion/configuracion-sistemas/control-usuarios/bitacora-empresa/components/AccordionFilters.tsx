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
import { ModulesSubmodules } from "@/lib/services/departments/submodules";
import { GetActivityCompanyHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CircleXIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: GetActivityCompanyHistoryRequest;
  setSearchParams: Dispatch<SetStateAction<GetActivityCompanyHistoryRequest>>;
  onClosePopover: () => void;
  moduleOptions: Option[];
  subModuleOptions: ModulesSubmodules;
  actionOptions: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  actionOptions,
  moduleOptions,
  subModuleOptions,
}: Props) => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<
      GetActivityCompanyHistoryRequest,
      "modules" | "subModules" | "actionTypes"
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

      {/* Accordion content */}
      <Accordion type="multiple" className="px-3 py-1">
        {/* Module */}
        <AccordionItem value="module">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Módulo
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {moduleOptions.map((option) => (
              <FormControlLabel
                value={option.value}
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "modules")
                    }
                    checked={
                      !!searchParams.modules &&
                      searchParams.modules.includes(option.value)
                    }
                  />
                }
                label={option.label}
                labelPlacement="end"
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Submodule */}
        <AccordionItem value="submodule">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Submódulo
          </AccordionTrigger>
          <AccordionContent>
            {/* Seccionar submódulos por módulos */}
            {Object.keys(subModuleOptions).map((module) => (
              <div key={module} className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">{module}</h3>
                <div className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
                  {subModuleOptions[module].map((submodule) => (
                    <FormControlLabel
                      key={submodule}
                      value={submodule}
                      control={
                        <Checkbox
                          onChange={(e) =>
                            handleCheckboxChange(e, submodule, "subModules")
                          }
                          checked={
                            !!searchParams.subModules &&
                            searchParams.subModules.includes(submodule)
                          }
                        />
                      }
                      label={submodule}
                      labelPlacement="end"
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Texto en caso de no haber ningún submódulo */}
            {Object.keys(subModuleOptions).length === 0 && (
              <p className="text-sm text-center text-gray-500">
                No hay submódulos disponibles, por favor selecciona un módulo.
              </p>
            )}
          </AccordionContent>
          {/* <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {subModuleOptions.map((option) => (
              <FormControlLabel
                value={option.value}
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "subModules")
                    }
                    checked={
                      !!searchParams.subModules &&
                      searchParams.subModules.includes(option.value)
                    }
                  />
                }
                label={option.label}
                labelPlacement="end"
              />
            ))}
          </AccordionContent> */}
        </AccordionItem>

        {/* Action */}
        <AccordionItem value="action">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Acción
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {actionOptions.map((option) => (
              <FormControlLabel
                value={option.value}
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleCheckboxChange(e, option.value, "actionTypes")
                    }
                    checked={
                      !!searchParams.actionTypes &&
                      searchParams.actionTypes.includes(option.value)
                    }
                  />
                }
                label={option.label}
                labelPlacement="end"
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

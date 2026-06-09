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
import { Checkbox, FormControlLabel } from "@mui/material";
import { CircleXIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { GetActivityHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";
import ActiveTimeAccordionContent from "./ActiveTimeAccordionContent";
import InactiveTimeAccordionContent from "./InactiveTimeAccordionContent";
import LoginAccordionContent from "./LoginAccordionContent";
import LogoutAccordionContent from "./LogoutAccordionContent";

type Option = {
  value: string;
  label: string;
};

interface Props {
  searchParams: GetActivityHistoryRequest;
  setSearchParams: Dispatch<SetStateAction<GetActivityHistoryRequest>>;
  onClosePopover: () => void;
  connectionStatuses: Option[];
}

const AccordionFilters = ({
  searchParams,
  setSearchParams,
  onClosePopover,
  connectionStatuses,
}: Props) => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    field: keyof Pick<GetActivityHistoryRequest, "connectionStatuses">
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
        {/* Estatus de conexión */}
        <AccordionItem value="connectionStatus">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Estatus de conexión
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-1 lg:grid-cols-4 px-3">
            {connectionStatuses.map((status) => (
              <FormControlLabel
                key={status.value}
                control={
                  <Checkbox
                    checked={searchParams.connectionStatuses?.includes(
                      status.value
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e,
                        status.value,
                        "connectionStatuses"
                      )
                    }
                    name={status.value}
                    color="primary"
                  />
                }
                label={status.label}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Inicio de sesión */}
        <AccordionItem value="login">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Inicio de sesión
          </AccordionTrigger>
          <AccordionContent>
            <LoginAccordionContent
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Cierre de sesión */}
        <AccordionItem value="logout">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Cierre de sesión
          </AccordionTrigger>
          <AccordionContent>
            <LogoutAccordionContent
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Tiempo inactivo */}
        <AccordionItem value="inactiveTime">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Tiempo inactivo
          </AccordionTrigger>
          <AccordionContent>
            <InactiveTimeAccordionContent
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Tiempo activo */}
        <AccordionItem value="activeTime">
          <AccordionTrigger className="flex-row-reverse justify-end gap-2">
            Tiempo activo
          </AccordionTrigger>
          <AccordionContent>
            <ActiveTimeAccordionContent
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFilters;

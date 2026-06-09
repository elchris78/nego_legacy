import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { GeneralDataForm } from "./GeneralDataForm";

export const GeneralData = () => {
  return (
    <div>
      {/* <div className="flex justify-start items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-[#4197CB] text-xl font-semibold antialiased mr-3">
            Datos generales
          </h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                <span>
                  <HelpCircle className="mr-1 mt-1" color="#BDC3C7" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Datos generales</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div> */}

      <div>
        <GeneralDataForm />
      </div>
      <div className="flex justify-center items-center mt-4">
        <p>* Campos obligatorios</p>
      </div>
    </div>
  );
};

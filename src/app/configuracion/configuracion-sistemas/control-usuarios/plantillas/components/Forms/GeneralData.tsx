import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { GeneralDataForm } from "./GeneralDataForm";
import { Typography } from "@mui/material";

export const GeneralData = () => {
  return (
    <div>
      <div className="flex justify-start items-center mb-6">
        <div className="flex items-center">
          <Typography color="#5B6670" variant="h5" fontWeight={700}>
            Datos generales
          </Typography>
        </div>
      </div>

      <div>
        <GeneralDataForm />
      </div>
    </div>
  );
};

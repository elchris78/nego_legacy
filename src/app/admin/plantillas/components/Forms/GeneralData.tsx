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
    <div className=" px-6 py-3">
      <div className="pb-3">
        <Typography color="#5B6670" variant="h5" fontWeight={700}>
          Datos generales
        </Typography>
      </div>

      <div className="md:col-span-3 row-span-10 md:row-span-1">
        <GeneralDataForm />
      </div>
    </div>
  );
};
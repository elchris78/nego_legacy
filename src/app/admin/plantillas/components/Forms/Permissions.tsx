import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { PermissionsForm } from "./PermissionsForm";
import { usePlantillaForm } from "./PlantillaFormContext";
import { Typography } from "@mui/material";

export const Permissions = () => {
  const { permissionsError, claims } = usePlantillaForm();

  return (
    <div className="p-6">
      <div className="pb-6">
          <Typography color="#5B6670" variant="h5" fontWeight={700}>
            Permisos
          </Typography>
      </div>

      <div className="md:col-span-3 row-span-10 md:row-span-1">
        {permissionsError && claims?.length === 0 && (
          <span className="text-[#CF5459] text-xs">{permissionsError}</span>
        )} 
        <PermissionsForm  />
      </div>
    </div>
  );
};
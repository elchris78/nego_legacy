import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Typography } from "@mui/material";
import { HelpCircle } from "lucide-react";

interface Props {
  mode: string;
}

const titleMap: Record<string, string> = {
  new: "Crear plantilla de perfil",
  edit: "Editar plantilla de perfil",
  view: "Consultar plantilla de perfil",
};

export const TitleForm = ({ mode }: Props) => {
  const label = titleMap[mode];

  return (
    <div className="flex items-center justify-center space-x-2 mt-5">
      <Typography variant="h3" color="#5B6670" fontWeight={500}>
        {label}
      </Typography>
    </div>
  );
};
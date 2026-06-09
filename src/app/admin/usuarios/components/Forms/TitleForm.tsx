import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface Props {
  mode: string;
}

const titleMap: Record<string, string> = {
  new: "Crear nuevo usuario",
  edit: "Editar usuario",
  view: "Datos Generales", 
};

export const TitleForm = ({ mode }: Props) => {
  const label = titleMap[mode];

  return (
    <div className="flex items-center justify-center  space-x-2 pb-14 mt-5">
      <h1 className="text-[#5B6670] text-5xl font-semibold antialiased">
        {label}
      </h1>
    </div>
  );
};

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
  new: "Crear Nueva Sucursal",
  edit: "Editar Sucursal",
  view: "Visualizar Sucursal",
};

export const TitleForm = ({ mode }: Props) => {
  const label = titleMap[mode];

  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      <h1 className="text-[#3c98cb] text-5xl font-semibold antialiased mt-5">
        {label}
      </h1>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <span>
              <HelpCircle className="mr-1 mt-6" color="#BDC3C7" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

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
  edit: "Editar datos de usuario",
  view: "Datos generales",
  editw: "Asignar Permisos"
};

export const TitleForm = ({ mode }: Props) => {
  const label = titleMap[mode];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-start space-x-2 mb-2 mt-4">
        <h1 className="text-[#5B6670] text-5xl font-semibold antialiased">
          {label}
        </h1>

        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center">
              <span>
                <HelpCircle className="mr-1 mt-1" color="#BDC3C7" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>
    </div>
  );
};

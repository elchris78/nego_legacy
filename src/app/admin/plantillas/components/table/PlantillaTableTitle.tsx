import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export const PlantillaTableTitle = () => {
  return (
    <div className="px-4">
      <div className="flex items-center justify-start space-x-2 mb-8">
        <h1 className="text-[#5B6670] text-5xl font-semibold antialiased">
          Plantillas de perfiles
        </h1>
{/* 
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center">
              <span>
                <HelpCircle className="mr-1 mt-3" color="#BDC3C7" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Plantilla de perfiles</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>
    </div>
  );
};

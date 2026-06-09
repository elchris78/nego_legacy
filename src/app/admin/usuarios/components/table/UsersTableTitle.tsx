import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export const UsersTableTitle = () => {
  return (
    <div className="px-4">
      <div className="flex items-center justify-center space-x-2 mb-8">
        <h1 className="text-[#3c98cb] text-5xl font-semibold antialiased">
          Usuarios
        </h1>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center">
              <span>
                <HelpCircle className="mr-1 mt-1" color="#BDC3C7" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Usuarios</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

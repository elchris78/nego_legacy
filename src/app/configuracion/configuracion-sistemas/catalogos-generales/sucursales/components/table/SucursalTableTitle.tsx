import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { sucursales } from "../../data/sucursales";

interface PlantillaTableTitleProps {
  title: string;
  sucursales: any[];
}

export const PlantillaTableTitle = ({
  title,
  sucursales,
}: PlantillaTableTitleProps) => {
  return (
    <div className="px-4">
      <div className="flex flex-row items-center justify-start space-x-2 mb-8">
        <h1 className="text-[#5B6670] text-5xl font-semibold antialiased mt-4 flex items-end">
          {title}
          <span className="text-xl font-normal text-[#5B6670] ml-2">
            ({sucursales.length} resultados)
          </span>
        </h1>
      </div>
    </div>
  );
};

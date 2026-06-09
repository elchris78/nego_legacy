import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface UsuariosTableTitleProps {
  title?: string;
  usuarios: any[];
}

export const UsersTableTitle = ({
  title="Usuarios",
  usuarios,
}: UsuariosTableTitleProps) => {
  return (
    <div className="px-4">
      <div className="flex flex-row items-center justify-start space-x-2 mb-8">
        <h1 className="text-[#5B6670] text-5xl font-semibold antialiased mt-4 flex items-end">
          {title}
          <span className="text-xl font-normal text-[#5B6670] ml-2">
            ({usuarios.length} resultados)
          </span>
        </h1>
      </div>  
    </div>
    // <div className="px-4">
    //   <div className="flex items-center justify-center space-x-2 mb-8">
    //     <h1 className="text-[#3c98cb] text-5xl font-semibold antialiased">
    //       Usuarios
    //     </h1>

    //     <TooltipProvider>
    //       <Tooltip>
    //         <TooltipTrigger className="flex items-center">
    //           <span>
    //             <HelpCircle className="mr-1 mt-1" color="#BDC3C7" />
    //           </span>
    //         </TooltipTrigger>
    //         <TooltipContent>
    //           <p>Usuarios</p>
    //         </TooltipContent>
    //       </Tooltip>
    //     </TooltipProvider>
    //   </div>
    // </div>
  )
}

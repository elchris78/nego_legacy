import { EllipsisVertical } from "lucide-react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";
import { usePlantillasFiles } from "../../hooks/usePlantillasFiles";
import alerta from "@/Asset/alerta 1.png";

const DropdownButton = () => {
  const templates = useSelector(
    (state: RootState) => state.plantillasCompany.roleTemplates
  );

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const { handlePdf, handleExcel, handlePrint } = usePlantillasFiles({
    templates,
  });

  const handleDownload = (type: "pdf" | "excel") => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn-success",
        cancelButton: "btn-danger",
        container: "swal2-container",
        popup: "swal-popup-error",
        title: "swal-title",
        actions: "swal-actions",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "¡Atención!",
        text: `Al dar aceptar se descargará el total de ${templates.length} registros. Puede modificar en la parte inferior `,
        imageUrl: alerta.src, // Usar imageUrl en lugar de icon
        imageWidth: 120,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (type === "pdf") {
            handlePdf(); // Ejecutar función para PDF
          } else if (type === "excel") {
            handleExcel(); // Ejecutar función para Excel
          }
        }
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-gray-400 text-gray-700 hover:text-gray-700 hover:border-gray-400"
        >
          <EllipsisVertical />
          Opciones
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(hasClaim("Configuración.Plantillas de perfiles.Imprimir") ||
          hasClaim(
            "Configuración.Configuración del sistema.Usuarios.Plantillas de perfiles.Imprimir"
          )) && (
          <DropdownMenuItem
            className="font-semibold cursor-pointer hover:!bg-[#4197CB42] rounded-sm"
            onClick={handlePrint}
            disabled={templates?.length === 0}
          >
            Imprimir
          </DropdownMenuItem>
        )}
        <DropdownMenuLabel>Exportar</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-[#4197CB42]"
          onClick={() => handleDownload("pdf")}
          disabled={templates?.length === 0}
        >
          <span className="text-xs ml-2 mr-2">•</span> PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-[#4197CB42]"
          onClick={() => handleDownload("excel")}
          disabled={templates?.length === 0}
        >
          <span className="text-xs ml-2 mr-2">•</span>EXCEL
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownButton;

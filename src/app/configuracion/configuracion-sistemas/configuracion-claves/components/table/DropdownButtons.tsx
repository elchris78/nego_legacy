import { useState } from "react";

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
import alerta from "@/Asset/alerta 1.png";

import { usekeyConfigurationFiles } from "../../hooks/useKeyConfigurationFiles";

const printClaim =
  "Configuración.Configuración del sistema.Definición de claves de catálogos.Imprimir";

const DropdownButtons = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const keyConfiguration = useSelector(
    (state: RootState) => state.keyConfigurationReducer.keyConfiguration
  );
  const claims = useSelector((state: RootState) => state.claims.data);

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const { handleExcel, handlePdf, handlePrint } = usekeyConfigurationFiles({
    keyConfiguration,
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
        text: `Al dar aceptar se descargará el total de ${keyConfiguration?.length} registros. Puede modificar en la parte inferior `,
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
    <>
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
          {hasClaim(printClaim) && (
            <DropdownMenuItem
              className="font-semibold cursor-pointer hover:!bg-[#4197CB42] rounded-sm"
              onClick={handlePrint}
              disabled={keyConfiguration?.length === 0}
            >
              Imprimir
            </DropdownMenuItem>
          )}
          <DropdownMenuLabel>Exportar</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("pdf")}
            disabled={keyConfiguration?.length === 0}
          >
            <span className="text-xs ml-2 mr-2">•</span> PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("excel")}
            disabled={keyConfiguration?.length === 0}
          >
            <span className="text-xs ml-2 mr-2">•</span>EXCEL
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-semibold cursor-pointer hover:!bg-[#4197CB42] rounded-sm"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Importar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      
    </>
  );
};

export default DropdownButtons;

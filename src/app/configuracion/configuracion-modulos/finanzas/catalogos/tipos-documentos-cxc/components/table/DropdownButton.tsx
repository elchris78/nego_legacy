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
import UploadDataModal from "./carga-masiva/UploadDataModal";
import { useFiles } from "../../hooks/useCXCFiles";

const DropdownButton = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  // Claim consts
  const printClaim = "Configuración.Configuración de módulos.Ventas.Catálogos.Subclasificación de clientes.Imprimir";

  const tipoDocumento = useSelector(
    (state: RootState) => state.cxcs.cxcsData
  );
  const claims = useSelector((state: RootState) => state.claims.data);

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const { handleExcel, handlePdf, handlePrint } = useFiles({
    tipoDocumento,
  });

  const launchSwal = (type: "pdf" | "excel") => {
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
        text: `Al dar aceptar se descargará el total de ${tipoDocumento?.length} registros. Puede modificar en la parte inferior`,
        imageUrl: alerta.src,
        imageWidth: 120,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          type === "pdf" ? handlePdf() : handleExcel();
        }
      });
  };

  const handleDownload = (type: "pdf" | "excel") => {
    setOpen(false);
    setTimeout(() => launchSwal(type), 200);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger id="mi-trigger" asChild>
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
              disabled={tipoDocumento?.length === 0}
            >
              Imprimir
            </DropdownMenuItem>
          )}
          <DropdownMenuLabel>Exportar</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("pdf")}
            disabled={tipoDocumento?.length === 0}
          >
            <span className="text-xs ml-2 mr-2">•</span> PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("excel")}
            disabled={tipoDocumento?.length === 0}
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

      {/* Carga masiva */}
      {isUploadModalOpen && (
        <UploadDataModal
          isModalOpen={isUploadModalOpen}
          onCloseModal={() => setIsUploadModalOpen(false)}
        />
      )}
    </>
  );
};

export default DropdownButton;

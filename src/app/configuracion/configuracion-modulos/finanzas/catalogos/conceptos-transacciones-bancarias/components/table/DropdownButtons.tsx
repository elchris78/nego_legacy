import { useState } from "react";

import { EllipsisVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppDispatch, RootState } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { conceptosTransaccionesBancariasActions } from "../../services/conceptosTransaccionesBancariasSlice";
import { useConceptosTransaccionesBancariasFiles } from "../../hooks/useConceptosTransaccionesBancariasFiles";
import alerta from "@/Asset/alerta 1.png";
import UploadDataModal from "@/components/ui/Modals/carga-masiva/UploadDataModal";
import showAlert from "@/lib/utils/alerts";

const printClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos de transacciónes bancarias.Imprimir";

interface Props {
  getData: () => Promise<void>;
}

const DropdownButtons = ({ getData }: Props) => {
  const token = Cookies.get("auth-token");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const conceptos = useSelector(
    (state: RootState) =>
      state.conceptosTransaccionesBancarias.conceptosTransaccionesBancarias
  );
  const isPending = useSelector(
    (state: RootState) => state.conceptosTransaccionesBancarias.pending
  );

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const { handleExcel, handlePdf, handlePrint } =
    useConceptosTransaccionesBancariasFiles({
      conceptos,
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
        text: `Al dar aceptar se descargará el total de ${conceptos?.length} registros. Puede modificar en la parte inferior `,
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

  const handleFile = async (file: File) => {
    const resultAction = await dispatch(
      conceptosTransaccionesBancariasActions.importConceptosTransaccionesBancariasFromExcel(
        {
          token,
          file,
        }
      )
    );
    if (
      conceptosTransaccionesBancariasActions.importConceptosTransaccionesBancariasFromExcel.rejected.match(
        resultAction
      )
    ) {
      throw resultAction.payload;
    }

    showAlert({
      success: true,
      message: resultAction.payload.message,
    });

    setIsUploadModalOpen(false);
    await getData();
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
              disabled={conceptos?.length === 0}
            >
              Imprimir
            </DropdownMenuItem>
          )}
          <DropdownMenuLabel>Exportar</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("pdf")}
            disabled={conceptos?.length === 0}
          >
            <span className="text-xs ml-2 mr-2">•</span> PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("excel")}
            disabled={conceptos?.length === 0}
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
          handleFile={handleFile}
          getData={getData}
          urlFormatFile={"/formatos/formato-transacciones-bancarias.xlsx"}
          formatFileName={"formato-transacciones-bancarias.xlsx"}
          isLoading={isPending}
        />
      )}
    </>
  );
};

export default DropdownButtons;

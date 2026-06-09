import { useState } from "react";

import { EllipsisVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/lib/store/store";
import alerta from "@/Asset/alerta 1.png";
import { useEstatusProdFiles } from "../../hooks/useTypesWarehousesFiles";
import Cookies from "js-cookie";
import { typesWarehousesActions } from "../../services/typesWarehousesSlice";
import UploadDataModal from "@/components/ui/Modals/carga-masiva/UploadDataModal";

// Custom class names for the SweetAlert2 popup
const customClassSuccess = {
  container: "swal2-container",
  popup: "swal-popup-succes",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const DropdownButton = () => {
  const token = Cookies.get("auth-token");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const typesWarehouses = useSelector(
    (state: RootState) => state.typesWarehouses.typesWarehouses
  );
  const isLoading = useSelector((state: RootState) => state.typesWarehouses.loading);

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const { handlePdf, handleExcel, handlePrint } = useEstatusProdFiles({
    typesWarehouses,
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
        text: `Al dar aceptar se descargará el total de ${typesWarehouses?.length} registros. Puede modificar en la parte inferior `,
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
      typesWarehousesActions.importTypesWarehouses({ token, file })
    );
    if (typesWarehousesActions.importTypesWarehouses.rejected.match(resultAction)) {
      throw resultAction.payload;
    }

    Swal.fire({
      title: "¡Éxito!",
      text: resultAction.payload.message,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
      customClass: customClassSuccess,
    });
    setIsUploadModalOpen(false);
    await getData();
  };

  const getData = async () => {
    await dispatch(
      typesWarehousesActions.getTypesWarehouses({
        token,
        params: { page: 1, size: 20 },
      })
    );
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
          {hasClaim(
            "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipo de almacén.Imprimir"
          ) && (
            <DropdownMenuItem
              className="font-semibold cursor-pointer hover:!bg-[#4197CB42] rounded-sm"
              onClick={handlePrint}
              disabled={typesWarehouses?.length === 0}
            >
              Imprimir
            </DropdownMenuItem>
          )}
          <DropdownMenuLabel>Exportar</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("pdf")}
            disabled={typesWarehouses?.length === 0}
          >
            <span className="text-xs ml-2 mr-2">•</span> PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("excel")}
            disabled={typesWarehouses?.length === 0}
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
          urlFormatFile={"/formatos/Formato-TiposAlmacen.xlsx"}
          formatFileName={"Formato-TiposAlmacen.xlsx"}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default DropdownButton;

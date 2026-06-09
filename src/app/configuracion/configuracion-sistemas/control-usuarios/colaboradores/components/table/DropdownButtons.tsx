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
import { colaboradoresActions } from "../../services/colaboradoresSlice";
import { useColaboradoresFiles } from "../../hooks/useColaboradoresFiles";
import alerta from "@/Asset/alerta 1.png";
import UploadDataModal from "@/components/ui/Modals/carga-masiva/UploadDataModal";
import showAlert from "@/lib/utils/alerts";
import { getColaboradoresDetailed } from "../../services/colaboradoresActions";
import { ColaboradorParams } from "../../services/colaboradoresTypes";

const printClaim =
  "Configuración.Configuración del sistema.Usuarios.Colaboradores.Imprimir";

interface Props {
  searchParams: ColaboradorParams;
}

const DropdownButtons = ({ searchParams }: Props) => {
  const token = Cookies.get("auth-token");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const colaboradores = useSelector(
    (state: RootState) => state.colaboradores.colaboradores
  );
  const isPending = useSelector(
    (state: RootState) => state.colaboradores.isPending
  );

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const { handlePdf, handleExcel, handlePrint } = useColaboradoresFiles({
    colaboradores,
  });

  const handleDownload = async (type: "pdf" | "excel") => {
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

    const result = await swalWithBootstrapButtons.fire({
      title: "¡Atención!",
      text: `Al dar aceptar se descargará el total de ${colaboradores?.length} registros. Puede modificar en la parte inferior `,
      imageUrl: alerta.src,
      imageWidth: 120,
      imageHeight: 100,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      if (type === "pdf") {
        handlePdf();
      } else if (type === "excel") {
        // Loader dentro del modal
        Swal.fire({
          title: "Procesando...",
          text: "Por favor espera mientras se genera el archivo.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          const colaboradoresDetallados = await getDetailedData();
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "El archivo se generó correctamente.",
            timer: 2000,
            showConfirmButton: false,
          });
          handleExcel(colaboradoresDetallados);
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error?.message ?? "Error al obtener los datos detallados",
          });
        }
      }
    }
  };

  const handleFile = async (file: File) => {
    const resultAction = await dispatch(
      colaboradoresActions.importColaboradores({ token, file })
    );

    if (colaboradoresActions.importColaboradores.rejected.match(resultAction)) {
      throw resultAction.payload;
    }

    showAlert({
      success: true,
      message:
        resultAction.payload.message ??
        "Colaboradores importados correctamente",
    });

    setIsUploadModalOpen(false);
    await getData();
  };

  const getData = async () => {
    await dispatch(
      colaboradoresActions.getColaboradores({
        token,
        params: {
          page: 1,
          size: 20,
        },
      })
    );
  };

  const getDetailedData = async () => {
    try {
      const { colaboradores } = await getColaboradoresDetailed({
        token,
        params: searchParams,
      });
      return colaboradores;
    } catch (error: any) {
      showAlert({
        success: false,
        message: error?.message ?? "Error al obtener los datos detallados",
      });
    }
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
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
              disabled={colaboradores?.length === 0}
            >
              Imprimir
            </DropdownMenuItem>
          )}
          <DropdownMenuLabel>Exportar</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("pdf")}
            disabled={colaboradores?.length === 0}
          >
            <span className="text-xs ml-2 mr-2">•</span> PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4197CB42]"
            onClick={() => handleDownload("excel")}
            disabled={colaboradores?.length === 0}
          >
            <span className="text-xs ml-2 mr-2">•</span>
            EXCEL
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
          urlFormatFile={"/formatos/formato-colaboradores.xlsx"}
          formatFileName={"formato-colaboradores.xlsx"}
          isLoading={isPending}
        />
      )}
    </>
  );
};

export default DropdownButtons;

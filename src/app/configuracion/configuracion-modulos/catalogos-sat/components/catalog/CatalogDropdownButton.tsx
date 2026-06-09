import { EllipsisVertical } from "lucide-react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getCatalogsSatExport } from "../../services/catalogSatApi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface Props {
  catalogValue: string;
}

type CatalogFormat = "pdf" | "excel";

// Custom class names for the SweetAlert2 popup
const customClassSuccess = {
  container: "swal2-container",
  popup: "swal-popup-succes",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const customClassError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

// Function to handle the success alert after downloading the file
const handleSuccessDownloadAlert = () => {
  Swal.fire({
    title: "¡Éxito!",
    text: "El archivo se ha descargado correctamente.",
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
    customClass: customClassSuccess,
  });
};

// Function to handle the error alert when downloading the file
const handleDownloadError = () => {
  Swal.fire({
    title: "¡ERROR!",
    text: "No se pudo descargar el archivo ya que hubo un error en el servidor.",
    icon: "error",
    confirmButtonText: "Aceptar",
    customClass: customClassError,
  });
};

const CatalogDropdownButton = ({ catalogValue }: Props) => {
  const token = Cookies.get("auth-token");
  const claims = useSelector((state: RootState) => state.claims.data);

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };
  // Function to handle the download of the catalog in PDF or Excel format
  const handleDownload = async (format: CatalogFormat) => {
    Swal.fire({
      title: "Generando archivo",
      text: "Por favor espera un momento",
      customClass: customClassSuccess,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();

        try {
          const response = await handleResponseBlob(format);

          const url = window.URL.createObjectURL(response);
          const link = document.createElement("a");

          link.href = url;
          response.type === "application/pdf"
            ? link.setAttribute("download", `${catalogValue}.pdf`)
            : link.setAttribute("download", `${catalogValue}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // Limpiar el elemento link
          window.URL.revokeObjectURL(url); // Limpiar el Object URL

          Swal.close(); // Cerrar el Swal de "Generando archivo"
          handleSuccessDownloadAlert(); // Mostrar alerta de éxito solo si todo fue bien
        } catch (error) {
          Swal.close(); // Cerrar el Swal de "Generando archivo" en caso de error
          // Handle error when downloading the file
          handleDownloadError();
        }
      },
    });
  };

  // Function to handle the print of the catalog
  const handlePrint = () => {
    Swal.fire({
      title: "Generando archivo",
      text: "Por favor espera un momento. Recuerda mantener habilitadas las ventanas emergentes",
      allowOutsideClick: false,
      customClass: customClassSuccess,
      didOpen: async () => {
        Swal.showLoading();

        try {
          const blob = await handleResponseBlob("pdf");

          const blobUrl = URL.createObjectURL(blob);
          const printWindow = window.open(blobUrl);

          if (printWindow) {
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
              URL.revokeObjectURL(blobUrl);
            };
          } else {
            // Manejar el caso en que la ventana emergente es bloqueada
            Swal.close(); // Cerrar el Swal de "Generando archivo"
            Swal.fire({
              title: "Error de Impresión",
              text: "No se pudo abrir la ventana de impresión. Asegúrese de que las ventanas emergentes estén habilitadas.",
              icon: "warning",
              confirmButtonText: "Aceptar",
              customClass: customClassError,
            });
            return; // Salir para evitar la alerta de éxito
          }
          Swal.close(); // Cerrar el Swal de "Generando archivo"
          handleSuccessDownloadAlert(); // Mostrar alerta de éxito solo si todo fue bien
        } catch (error) {
          Swal.close(); // Cerrar el Swal de "Generando archivo" en caso de error
          handleDownloadError();
        }
      },
    });
  };

  // Function to get the catalog data as a Blob
  const handleResponseBlob = async (format: CatalogFormat) => {
    const blob = await getCatalogsSatExport(token, {
      catalog: catalogValue,
      format,
    });
    return blob;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:border-2 hover:border-gray-300 hover:bg-white"
          size={"icon"}
        >
          <EllipsisVertical color="#5B6670" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {hasClaim(
          "Configuración.Configuración de módulos.Catálogos SAT.Imprimir"
        ) && (
          <DropdownMenuItem
            className="font-semibold cursor-pointer hover:!bg-[#4197CB42] rounded-sm"
            onClick={handlePrint}
          >
            Imprimir
          </DropdownMenuItem>
        )}
        <DropdownMenuLabel>Exportar</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-[#4197CB42]"
          onClick={() => handleDownload("pdf")}
        >
          <span className="text-xs ml-2 mr-2">•</span> PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-[#4197CB42]"
          onClick={() => handleDownload("excel")}
        >
          <span className="text-xs ml-2 mr-2">•</span>EXCEL
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CatalogDropdownButton;

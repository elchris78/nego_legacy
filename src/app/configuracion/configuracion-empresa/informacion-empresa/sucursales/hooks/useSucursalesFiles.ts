import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { Sucursal } from "../services/sucursalesTypes";

interface Props {
  sucursal: Sucursal[] | null;
}

export const useSucursalFiles = ({ sucursal = [] }: Props) => {
  const [pdfMake, setPdfMake] = useState<any>(null);

  //TODO: Sustituir campos faltantes de ciudad y estado

  useEffect(() => {
    const loadPdfMake = async () => {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFonts = await import("pdfmake/build/vfs_fonts");
      pdfMakeModule.vfs = pdfFonts.vfs;
      setPdfMake(pdfMakeModule);
    };
    loadPdfMake();
  }, []);

  // Extrae la definición del documento PDF
  const getDocDefinition = () => {
    const tableHeaders = [
      "Prefijo",
      "Clave sucursal",
      "Nombre de la sucursal",
      "Télefono",
      "Responsable principal",
      "Correo de contacto",
      "País",
      "Código postal",
      "Estado",
      "Ciudad",
      "Colonia",
      "Estatus"
    ];
    const tableBody = [
      tableHeaders,
      ...(sucursal
        ? sucursal.map((item) => {
            return [
              item.id && item.id.includes("-") ? item.id.split("-")[0] : "-",
              item.id || "-",
              { text: item.nombre || "-", color: "#3C98CB" },
              item.telefono || "-",
              item.responsablePrincipalNombre || "-",
              item.correoContacto || "-",
              item.domicilioFiscal?.paisNombre || "-",
              item.domicilioFiscal?.codigoPostal || "-",
              item.domicilioFiscal?.estadoNombre || "-",
              item.domicilioFiscal?.ciudadNombre || "-",
              item.domicilioFiscal?.colonia || "-",
              item.estatus ? "Activo" : "Inactivo",
            ];
          })
        : []),
    ];
    return {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        overflow: "break",
      },
      content: [
        { text: "Sucursales", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: [
              "7%",  // Prefijo
              "9%",  // Clave sucursal
              "14%", // Nombre
              "9%",  // Teléfono
              "11%", // Responsable
              "11%", // Correo
              "6%",  // País
              "6%",  // CP
              "7%",  // Estado
              "7%",  // Ciudad
              "7%",  // Colonia
              "6%",  // Estatus
            ],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? "#f2f2f2" : null,
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => "#e0e0e0",
            vLineColor: () => "#e0e0e0",
          },
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        tableExample: {
          fontSize: 9,
          margin: [0, 5, 0, 15],
        },
      },
    };
  };

  // Función genérica para exportar PDF
  const exportPdf = async (mode: "download" | "print") => {
    if (!pdfMake) return;

    try {
      const docDefinition = getDocDefinition();
      await new Promise<void>((resolve) => {
        const pdf = pdfMake.createPdf(docDefinition);
        if (mode === "download") {
          pdf.download("Sucursales.pdf", () => resolve());
        } else {
          pdf.print();
          resolve();
        }
      });

      mode === "download"
        ? await setLogOnBackend("pdf")
        : await setLogOnBackend("pdf", "Impresión");
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

  const handlePdf = () => exportPdf("download");
  const handlePrint = () => exportPdf("print");

  const handleExcel = async () => {
    if (sucursal && sucursal.length > 0) {
      const renamedData = sucursal.map((item) => ({
        UID: item.uidSucursal,
        Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
        "Clave": item.id,
        "Nombre": item.nombre,
        "Telefono": item.telefono,
        "ResponsablePrincipal": item.responsablePrincipal,
        "ResponsableSecundario": item.responsableSecundario,
        "Horario de atención": item.horarioAtencion,
        "CorreoContacto": item.correoContacto,
        Zona: item.zonaId,
        Subzona: item.subzonaId,
        "DomicilioFiscal.Pais": item.domicilioFiscal.pais,
        "DomicilioFiscal.CodigoPostal": item.domicilioFiscal.codigoPostal,
        "DomicilioFiscal.Estado": item.domicilioFiscal.estado || item.domicilioFiscal.estadoNombre,
        "DomicilioFiscal.Ciudad": item.domicilioFiscal.ciudad || item.domicilioFiscal.ciudadNombre,
        "DomicilioFiscal.Colonia": item.domicilioFiscal.coloniaCode || item.domicilioFiscal.colonia,
        "DomicilioFiscal.Calle": item.domicilioFiscal.calle,
        "DomicilioFiscal.NumeroExterior": item.domicilioFiscal.numeroExterior,
        "DomicilioFiscal.NumeroInterior": item.domicilioFiscal.numeroInterior,
        Estatus: item.estatus ? "Activo" : "Inactivo",
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sucursales");

      XLSX.writeFile(workbook, "Sucursales.xlsx");

      await setLogOnBackend("excel"); // Log de actividad en el backend
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay datos para descargar.",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton: "btn-success",
          container: "swal2-container",
          popup: "swal-popup-error",
          title: "swal-title",
          actions: "swal-actions",
        },
      });
    }
  };



  const setLogOnBackend = async (
    type: "pdf" | "excel",
    activityType: "Descarga" | "Impresión" = "Descarga"
  ) => {
    const activityDescription =
      activityType === "Impresión" ? "Impresión" : `Descarga ${type}`;

    await registerUserActivity({
      activity: activityDescription,
      description: activityDescription,
      module: "Configuración de la empresa",
      subModule: "Sucursales",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

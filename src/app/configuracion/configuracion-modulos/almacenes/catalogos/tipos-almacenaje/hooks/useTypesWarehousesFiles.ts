import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { TipoAlmacenaje } from "../services/tipoAlmacenaje";

interface Props {
  tipoAlmacenaje: TipoAlmacenaje[] | null;
}

export const useEstatusProdFiles = ({ tipoAlmacenaje = [] }: Props) => {
  const [pdfMake, setPdfMake] = useState<any>(null);

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
        "Clave",
        "Tipo de almacenaje",
        "Estatus",
      ];

      const tableBody = [
        tableHeaders,
        ...(tipoAlmacenaje || []).map((item) => [ 
            item.id && item.id.includes("-")
            ? item.id.split("-")[0]
            : "-",
            item.id || "-",
            { text: item.tipo || "-", color: "#3C98CB" },
            item.estatus ? "Activo" : "Inactivo",
          ]),
      ];

      return {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [40, 60, 40, 60],
        defaultStyle: {
          overflow: "break",
        },
        content: [
          { text: "Tipos de Almacenaje", style: "header" },
          {
            style: "tableExample",
            table: {
              headerRows: 1,
              keepWithHeaderRows: 1,
              dontBreakRows: true,
              widths: ["25%", "25%", "25%", "25%"],
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
          pdf.download("Tipos_Almacenaje.pdf", () => resolve());
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
    if (tipoAlmacenaje && tipoAlmacenaje.length > 0) {
      const renamedData = tipoAlmacenaje.map((item) => ({
          UID: item.uid,
          Clave: item.id,
          "Tipo de almacenaje": item.tipo,
          Estatus: item.estatus ? "Activo" : "Inactivo",
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tipos_Almacenaje");

      XLSX.writeFile(workbook, "Tipos_Almacenaje.xlsx");

      await setLogOnBackend("excel");
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
      module: "Configuración de módulos",
      subModule: "Tipos de almacenaje",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { KeyConfiguration } from "../services/keyConfigurationTypes";

interface Props {
  keyConfiguration: KeyConfiguration[] | null;
}

export const usekeyConfigurationFiles = ({ keyConfiguration = [] }: Props) => {
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
      "Módulo",
      "Catálogo",
      "Tipo de clave",
      "Tipo de prefijo",
      "Prefijo",
    ];
    const tableBody = [
      tableHeaders,
      ...(keyConfiguration || []).map((classification) => [
        classification.modulo,
        { text: classification.catalogo || "-", color: "#3C98CB" },
        classification.tipoClave || "-",
        classification.tipoPrefijo || "-",
        classification.prefijo || "-",
      ]),
    ];
    return {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        overflow: "break", // forza el quiebre de línea cuando el contenido es muy largo
      },
      content: [
        { text: "Definición de claves de catálogo", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: ["20%", "20%", "20%", "20%", "20%"],
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
          pdf.download("Definición-de-claves-de-catálogo.pdf", () => resolve());
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
    if (keyConfiguration && keyConfiguration.length > 0) {
      const renamedData = keyConfiguration.map((item) => ({
        "Módulo": item.modulo,
        "Catálogo": item.catalogo,
        "Tipo de clave": item.tipoClave,
        "Tipo de prefijo": item.tipoPrefijo,
        "Prefijo": item.prefijo,
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Definicióndeclavesdecatálogo");

      XLSX.writeFile(workbook, "Definicióndeclavesdecatálogo.xlsx");

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
      module: "Configuración del sistema",
      subModule: "Definición de claves de catálogos",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";
import { transformDate, transformToTime } from "@/lib/utils/dates";

import type { ActionsActivityHistoryDto } from "@/lib/services/userActivity/userActivityTypes";

interface Props {
  actions: ActionsActivityHistoryDto[] | null;
}

export const useBitacoraEmpresaFiles = ({ actions = [] }: Props) => {
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
      "Folio de registro",
      "Usuario",
      "Módulo",
      "Submódulo",
      "Acción",
      "ID del documento",
      "Nombre de equipo",
      "Fecha",
      "Hora",
    ];
    const tableBody = [
      tableHeaders,
      ...(actions || []).map((item) => [
        item.folio || "-",
        { text: item.userName || "-", color: "#3C98CB" },
        item.module || "-",
        item.subModule || "-",
        item.activity || "-",
        item.idDocumento || "-",
        { text: `${item.deviceType} ${item.ipAddress}` || "-" },
        transformDate(item.date) || "-",
        transformToTime(item.date) || "-",
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
        { text: "Bitácora de la empresa", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: Array(tableHeaders.length).fill("auto"),
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
          pdf.download("bitacora-empresa.pdf", () => resolve());
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
    if (actions && actions.length > 0) {
      const renamedData = actions.map((item) => ({
        Folio: item.folio,
        "Nombre de Usuario": item.userName,
        Módulo: item.module,
        Submódulo: item.subModule,
        Acción: item.activity,
        "ID del Documento": item.idDocumento,
        "Nombre del Equipo": item.nombreEquipo,
        Fecha: transformDate(item.date),
        Hora: transformToTime(item.date),
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Bitácora de la Empresa"
      );

      XLSX.writeFile(workbook, "bitacora-empresa.xlsx");

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
      module: "Bitácora de la empresa",
      subModule: "Descarga",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

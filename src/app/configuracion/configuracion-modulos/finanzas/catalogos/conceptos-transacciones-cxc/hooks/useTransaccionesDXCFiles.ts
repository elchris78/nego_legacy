import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { TransaccionesDXC } from "../services/transaccionesDXCTypes";

interface Props {
  transaccionesDXC: TransaccionesDXC[] | null;
}

export const useTransaccionesDXCFiles = ({ transaccionesDXC = [] }: Props) => {
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
      "Clave concepto",
      "Concepto de transacción CXC",
      "Origen",
      "Contrapartida",
      "Tipo de transacción",
      "Tipo de realción SAT",
      "Forma de pago",
      "Requiere autorización",
      "Genera documento",
      "Afecta depósitos",
      "Valida referencias",
      "Observaciones",
      "Cancela Nota de crédito",
      "Cancela pago",
      "Estatus",
    ];

    const tableBody = [
      tableHeaders,
      ...(transaccionesDXC || []).map((item) => [
        item.userProvidedId || item.id || "-",
        item.conceptoTransaccion || "-",
        item.origen || "-",
        item.contrapartidaNombre || "-", 
        item.tipoTransaccion || "-",
        item.tipoRelacionSatNombre || "-",
        item.formaPagoNombre || "-",
        item.requiereAutorizacion ? "Sí" : "No",
        item.generaDocumento || "-",
        item.afectaDepositos ? "Sí" : "No",
        item.validaReferencias ? "Sí" : "No",
        item.observaciones || "-",
        item.cancelaNotaCredito ? "Sí" : "No",
        item.cancelaPago ? "Sí" : "No",
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
        { text: "Conceptos de transacciones a cuentas por cobrar", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: Array(15).fill("6.5%"), // Puedes ajustar los % si quieres tamaños fijos
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
          pdf.download("TransaccionesCXC.pdf", () => resolve());
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
  if (transaccionesDXC && transaccionesDXC.length > 0) {
    const renamedData = transaccionesDXC.map((item) => ({
      UID: item.uid,
      Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
      "Clave concepto": item.userProvidedId || item.id,
      "Concepto de transacción CXC": item.conceptoTransaccion,
      Contrapartida: item.contrapartidaId || "",
      "Tipo de transacción": item.tipoTransaccion,
      "Tipo de relación SAT": item.tipoRelacionSat,
      "Forma de pago": item.formaPago,
      "Requiere autorización": item.requiereAutorizacion ? "Sí" : "No",
      "Genera documento": item.generaDocumento,
      "Afecta depósitos": item.afectaDepositos ? "Sí" : "No",
      "Valida referencias": item.validaReferencias ? "Sí" : "No",
      Observaciones: item.observaciones || "",
      "Cancela Nota de crédito": item.cancelaNotaCredito ? "Sí" : "No",
      "Cancela pago": item.cancelaPago ? "Sí" : "No",
      Estatus: item.estatus ? "Activo" : "Inactivo",
    }));

    const worksheet = XLSX.utils.json_to_sheet(renamedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones CXC");

    XLSX.writeFile(workbook, "Transacciones_CXC.xlsx");

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
      module: "Configuración de módulos",
      subModule: "Conceptos transacciones cuentas por cobrar",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

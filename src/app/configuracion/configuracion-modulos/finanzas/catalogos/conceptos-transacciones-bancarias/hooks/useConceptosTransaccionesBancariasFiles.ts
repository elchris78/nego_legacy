import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { ConceptoTransaccionBancaria } from "../services/conceptosTransaccionesBancariasTypes";

interface Props {
  conceptos: ConceptoTransaccionBancaria[] | null;
}

export const useConceptosTransaccionesBancariasFiles = ({ conceptos = [] }: Props) => {
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
      "Concepto de transacción bancaria",
      "Tipo de transacción",
      "Válida referencia",
      "Observaciones",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(conceptos || []).map((concepto) => [
        concepto.id && concepto.id.includes("-")
          ? concepto.id.split("-")[0]
          : "-",
        concepto.id || "-",
        { text: concepto.concepto || "-", color: "#3C98CB" },
        concepto.tipoTransaccion,
        concepto.validaReferencia ? "Sí" : "No",
        concepto.observaciones || "-",
        concepto.estatus ? "Activo" : "Inactivo",
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
        { text: "Conceptos de transacciones bancarias", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: ["10%", "20%", "20%", "20%", "10%", "10%", "10%"],
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
    if (!conceptos || conceptos.length === 0) return;

    try {
      const docDefinition = getDocDefinition();
      await new Promise<void>((resolve) => {
        const pdf = pdfMake.createPdf(docDefinition);
        if (mode === "download") {
          pdf.download("conceptos-transacciones-bancarias.pdf", () =>
            resolve()
          );
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
    if (!conceptos || conceptos.length === 0) return;

    const renamedData = conceptos.map((item) => ({
      UID: item.uid,
      Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
      Clave: item.id,
      "Concepto de transacción bancaria": item.concepto,
      "Tipo de transacción": item.tipoTransaccion,
      "Valida referencia": item.validaReferencia ? "Sí" : "No",
      Observaciones: item.observaciones,
      Estatus: item.estatus ? "Activo" : "Inactivo",
    }));

    const worksheet = XLSX.utils.json_to_sheet(renamedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Transacciones bancarias"
    );

    XLSX.writeFile(workbook, "conceptos-transacciones-bancarias.xlsx");

    await setLogOnBackend("excel"); // Log de actividad en el backend
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
      subModule: "Conceptos transacciones bancarias",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

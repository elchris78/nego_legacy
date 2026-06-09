import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { CuentaBancaria } from "../services/cuentasBancariasTypes";

interface Props {
  cuentasBancarias: CuentaBancaria[] | null;
}

export const useCuentasBancariasFiles = ({ cuentasBancarias = [] }: Props) => {
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
      "Número de cuenta",
      "Descripción",
      "Banco",
      "Moneda",
      "Sucursal",
      "Plaza",
      "Tipo de instrumento bancario",
      "Cuenta contable",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(cuentasBancarias || []).map((cuenta) => [
        cuenta.id && cuenta.id.includes("-") ? cuenta.id.split("-")[0] : "-",
        cuenta.id || "-",
        cuenta.numeroCuenta,
        { text: cuenta.descripcion || "-", color: "#3C98CB" },
        cuenta.banco || "-",
        cuenta.moneda || "-",
        cuenta.sucursal || "-",
        cuenta.plaza || "-",
        cuenta.tipoInstrumentoBancario || "-",
        cuenta.cuentaContable || "-",
        cuenta.estatus ? "Activo" : "Inactivo",
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
        { text: "Cuentas bancarias", style: "header" },
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
    if (!cuentasBancarias || cuentasBancarias.length === 0) return;

    try {
      const docDefinition = getDocDefinition();
      await new Promise<void>((resolve) => {
        const pdf = pdfMake.createPdf(docDefinition);
        if (mode === "download") {
          pdf.download("cuentas-bancarias.pdf", () => resolve());
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
    if (!cuentasBancarias || cuentasBancarias.length === 0) return;

    const renamedData = cuentasBancarias.map((item) => ({
      UID: item.uid,
      Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
      Clave: item.id,
      "Número de cuenta": item.numeroCuenta,
      Descripción: item.descripcion,
      Banco: item.bancoId,
      Moneda: item.monedaId,
      Sucursal: item.sucursal,
      Plaza: item.plaza,
      "Tipo de instrumento bancario": item.tipoInstrumentoBancario,
      "Cuenta contable": item.cuentaContable,
      Estatus: item.estatus ? "Activo" : "Inactivo",
    }));

    const worksheet = XLSX.utils.json_to_sheet(renamedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "cuentas bancarias");

    XLSX.writeFile(workbook, "cuentas-bancarias.xlsx");

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
      subModule: "Cuentas bancarias",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { Sellers } from "../services/sellersTypes";

interface Props {
  sellers: Sellers[] | null;
}

export const useSellersFiles = ({ sellers = [] }: Props) => {
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
      "Clave de vendedor",
      "Tipo de vendedor",
      "Colaborador",
      "Correo electrónico",
      "Teléfono",
      "Supervisor",
      "Zona",
      "SubZona",
      "Tipo de comisión",
      "% de comisión global",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(sellers || []).map((classification) => [
        classification.id && classification.id.includes("-")
          ? classification.id.split("-")[0]
          : "-",
        classification.id || "-",
        { text: classification.tipoVendedor || "-" },
        {
          text: classification.colaboradorId && classification.colaboradorNombre
            ? `${classification.colaboradorId} - ${classification.colaboradorNombre}`
            : "-",
          color: "#3C98CB"
        },
        classification.colaboradorCorreo || "-",
        classification.colaboradorTelefono || "-",
        classification.supervisor || "-",
        classification.zonaId && classification.zona
          ? `${classification.zonaId} - ${classification.zona}`
          : "-",
        classification.subzonaId && classification.subzona
          ? `${classification.subzonaId} - ${classification.subzona}`
          : "-",
        classification.tipoComision || "-",
        classification.porcentajeComisionGlobal || "-",
        classification.estatus ? "Activo" : "Inactivo",
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
        { text: "Vendedores", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: [
              "7%", "10%","10%","10%","10%","8%", "8%", "7%", "7%", "8%", "8%", "7%", 
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
          pdf.download("Vendedores.pdf", () => resolve());
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
    if (sellers && sellers.length > 0) {
      const renamedData = sellers.map((item) => ({
      UID: item.uid,
      Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
      "Clave vendedor": item.id || "-",
      "Tipo de vendedor": item.tipoVendedorId || "-",
      Colaborador: item.colaboradorId || "-",
      Supervisor: item.supervisorId || "-",
      Zona: item.zonaId || "-",
      SubZona: item.subzonaId || "-",
      "Tipo de comisión": item.tipoComision || "-",
      "% de comisión global": item.porcentajeComisionGlobal || "-",
      Estatus: item.estatus ? "Activo" : "Inactivo",
    }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Vendedores");

      XLSX.writeFile(workbook, "Vendedores.xlsx");

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
      subModule: "Vendedores",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

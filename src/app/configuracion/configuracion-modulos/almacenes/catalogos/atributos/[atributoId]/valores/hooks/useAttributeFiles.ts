"use client";

import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { AttributeValue } from "../services/attributesValueTypes";

interface Props {
  attributeValue: AttributeValue[] | null;
  currentAttributeName?: string; // Nombre del atributo actual, opcional
}

export const useAttributesFiles = ({
  attributeValue = [],
  currentAttributeName,
}: Props) => {
  const { atributoId } = useParams();

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
      "Clave Valor",
      "Atributo",
      "Valor",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(attributeValue
        ? attributeValue.map((item) => {
            return [
              item.id && item.id.includes("-") ? item.id.split("-")[0] : "-",
              item.id || "-",
              currentAttributeName || "-",
              { text: item.nombre || "-", color: "#3C98CB" },
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
        { text: "Valores del atributo", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: ["10%", "20%", "20%", "30%", "20%"],
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
          pdf.download("Valores.pdf", () => resolve());
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
    if (attributeValue && attributeValue.length > 0) {
      const renamedData = attributeValue.map((item) => ({
        UID: item.uid,
        Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
        "Clave de valor": item.id,
        Valor: item.nombre,
        Estatus: item.estatus ? "Activo" : "Inactivo",
        "Clave Atributo": atributoId,
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Valores");

      XLSX.writeFile(workbook, "Valores.xlsx");

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
      subModule: "Valores",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

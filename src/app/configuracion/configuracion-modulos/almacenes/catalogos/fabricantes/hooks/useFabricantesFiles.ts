import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { Fabricante } from "../services/fabricantesTypes";

interface Props {
  fabricantes: Fabricante[] | null;
}

export const useFabricantesFiles = ({ fabricantes = [] }: Props) => {
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
      "Clave del fabricante",
      "Nombre del fabricante",
      "País",
      "Código postal",
      "Estado",
      "Ciudad",
      "Colonia",
      "Calle",
      "Número exterior",
      "Correo electrónico",
      "Teléfono",
      "Contacto adicional",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(fabricantes || []).map((fabricante) => [
        fabricante.id && fabricante.id.includes("-")
          ? fabricante.id.split("-")[0]
          : "-",
        fabricante.id || "-",
        { text: fabricante.nombre || "-", color: "#3C98CB" },
        fabricante.paisNombre || "-",
        fabricante.codigoPostal || "-",
        fabricante.estado || "-",
        fabricante.ciudad || "-",
        fabricante.colonia || "-",
        fabricante.calle || "-",
        fabricante.numeroExterior || "-",
        fabricante.correo || "-",
        fabricante.telefono || "-",
        fabricante.contactoAdicional || "-",
        fabricante.estatus ? "Activo" : "Inactivo",
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
        { text: "Fabricantes", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: Array(tableHeaders.length).fill("auto"), // Ancho automático para cada columna
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
          pdf.download("fabricantes.pdf", () => resolve());
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
    if (fabricantes && fabricantes.length > 0) {
      const renamedData = fabricantes.map((item) => ({
        UID: item.uidFabricante,
        Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
        "Clave del fabricante": item.id,
        "Nombre del fabricante": item.nombre,
        País: item.paisClave,
        "Código postal": item.codigoPostal,
        Estado: item.estado,
        Ciudad: item.ciudad,
        Colonia: item.colonia,
        Calle: item.calle,
        "Número exterior": item.numeroExterior,
        "Correo": item.correo,
        Teléfono: item.telefono,
        "Contacto adicional": item.contactoAdicional,
        Estatus: item.estatus ? "Activo" : "Inactivo",
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Fabricantes");

      XLSX.writeFile(workbook, "fabricantes.xlsx");

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
      subModule: "Fabricantes",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

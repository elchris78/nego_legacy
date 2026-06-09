import { useEffect, useState } from "react";

import { es } from "date-fns/locale";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { RoleTemplateResponse } from "../services/plantillasTypes";

const transformDate = (date?: string) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, "dd/MM/yy", {
      locale: es,
    });
  }
};

interface Props {
  templates: RoleTemplateResponse[] | null;
}

export const usePlantillasFiles = ({ templates = [] }: Props) => {
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
      "ID",
      "Nombre de la plantilla",
      "Descripción",
      "Empresas",
      "Fecha de creación",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(templates || []).map((template) => [
        template.roleTemplateId,
        { text: template.roleTemplateName || "-", color: "#3C98CB" },
        template.description || "-",
        template.companies.map((company: any) => company.item2).join(", "),
        transformDate(template.createdAt),
        template.active ? "Activo" : "Inactivo",
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
        { text: "Plantillas", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: ["*", "*", "*", "auto", "auto", "auto"],
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
          pdf.download("plantillas.pdf", () => resolve());
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
    if (templates && templates.length > 0) {
      const renamedData = templates.map((item) => ({
        "UID Plantilla": "",
        "ID Plantilla": item.roleTemplateId,
        "Nombre de la plantilla": item.roleTemplateName,
        Descripción: item.description,
        Empresas: item.companies
          .map((company) => company.item1 && company.item2)
          .join(", "),
        "Fecha creación": transformDate(item.createdAt),
        Estatus: item.active ? "Activo" : "Inactivo",
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Plantillas");

      XLSX.writeFile(workbook, "plantillas.xlsx");

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
      module: "PlantillasAdmin",
      subModule: "Descarga",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

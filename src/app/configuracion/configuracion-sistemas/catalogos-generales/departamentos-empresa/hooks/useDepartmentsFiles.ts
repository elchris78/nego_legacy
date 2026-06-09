import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { transformDate } from "@/lib/utils/dates";
import { registerUserActivity } from "@/lib/services/download/downAction";

import type { DepartmentDto } from "@/lib/services/departments/departmentsTypes";

interface Props {
  departments: DepartmentDto[] | null;
}

export const useDepartmentsFiles = ({ departments = [] }: Props) => {
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
      "Departamento",
      "Área",
      "Responsable",
      "Fecha de creación",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(departments || []).map((area) => [
        area.id,
        { text: area.name || "-", color: "#3C98CB" },
        area.area,
        { text: area.responsible || "-", color: "#3C98CB" },
        transformDate(area.creationDate),
        area.status ? "Activo" : "Inactivo",
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
        { text: "Departamentos", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: ["auto", "*", "auto", "auto", "auto", "auto"],
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
          pdf.download("Departamentos.pdf", () => resolve());
        } else {
          pdf.print();
          resolve();
        }
      });

      if (mode === "download") await setLogOnBackend("pdf"); // Log de actividad en el backend
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

  const handlePdf = () => exportPdf("download");
  const handlePrint = () => exportPdf("print");

  const handleExcel = async () => {
    if (departments && departments.length > 0) {
      const renamedData = departments.map((item) => ({
        UID: "",
        Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
        Clave: item.id,
        "Nombre del departamento": item.name,
        Descripción: item.description,
        Responsable: item.responsibleId,
        Área: item.areaId,
        Estatus: item.status ? "Activo" : "Inactivo",
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Departamentos");

      XLSX.writeFile(workbook, "Departamentos.xlsx");

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

  const setLogOnBackend = async (type: "pdf" | "excel") => {
    await registerUserActivity({
      activity: `Descarga ${type}`,
      description: `Descarga ${type}`,
      module: "Departamentos",
      subModule: "Descarga",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

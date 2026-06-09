import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import type { AttributeValue } from "../services/attributesValueTypes";
import { generateTimestampedFileName } from "./fileName";

interface Props {
  attributes: AttributeValue[] | null;
}

export const generateAttributeFiles = ({ attributes = [] }: Props) => {
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


  // TODO: Si la fuente es incorrecta, importar la fuente (Como el logo principal usa roboto, ni le moví)
  // pdfMake.fonts = {
  //   SecularOne: { normal: 'SecularOne-Regular.ttf' },
  //   Roboto: { normal: 'Roboto-Regular.ttf', bold: 'Roboto-Medium.ttf' }
  // };
  const getDocDefinition = (
    attributes: AttributeValue[],
    forPrint: boolean
  ) => {
    // Construimos la cabecera tipográfica solo para impresión
    const content: any[] = [];

    if (forPrint) {
      content.push({
        text: 'NEGO',
        font: 'Roboto',
        fontSize: 48,
        color: '#3C98CB',
        bold: false,
        lineHeight: 1.0,
        characterSpacing: 0,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      });
    }

    // Ahora el título estándar
    content.push({
      text: 'Valores',
      style: 'title',
    });

    // Definimos cuerpo de la tabla
    const tableHeaders = [
      'ID',
      'Valor',
      'Valores',
      'Estatus',
    ];
    const tableBody = [
      tableHeaders,
      ...attributes.map((c) => [
        c.id,
        { text: c.nombre || '-', color: '#3C98CB' },
        c.estatus ? 'Activo' : 'Inactivo',
      ]),
    ];

    content.push({
      style: 'tableStyle',
      table: {
        headerRows: 1,
        widths: ['20%', '40%', '20%', '20%'],
        body: tableBody,
      },
      layout: {
        fillColor: (rowIndex: number) =>
          rowIndex === 0 ? '#f2f2f2' : null,
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => '#e0e0e0',
        vLineColor: () => '#e0e0e0',
      },
    });

    // Devolvemos la definición completa
    return {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      content,
      styles: {
        title: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        tableStyle: {
          fontSize: 9,
          margin: [0, 5, 0, 15],
        },
      },
      defaultStyle: {
        font: 'Roboto', // o la que uses por defecto
      },
    };
  };

  // Función genérica para exportar PDF
  const exportPdf = async (mode: "download" | "print") => {
    if (!pdfMake) return;
    try {
      const docDefinition = getDocDefinition(attributes || [], mode === 'print');
      await new Promise<void>((resolve) => {
        const pdf = pdfMake.createPdf(docDefinition);
        if (mode === "download") {
          const fileName = generateTimestampedFileName(
            "Valores"
          );
          pdf.download(fileName, () => resolve());
        } else {
          pdf.print();
          resolve();
        }
      });
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

  const handlePdf = () => exportPdf("download");
  const handlePrint = () => exportPdf("print");

  const handleExcel = async () => {
    if (!attributes || attributes.length === 0) {
      return Swal.fire({
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
  
    const renamedData = attributes.map((item, index) => ({
      "Clave Valor": index+1,
      "Ingresa la clave del valor": item.id,
      "Valor": item.nombre || "-",
      Estatus: item.estatus ? "Activo" : "Inactivo",
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(renamedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Valores"
    );
  
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      const cell = worksheet[cellAddress];
      if (cell) {
        cell.s = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "FFD3D3D3" },
          },
          font: {
            bold: true,
          },
        };
      }
    }
  
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxLength = 0;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        const value = cell?.v?.toString() || "";
        if (value.length > maxLength) maxLength = value.length;
      }
      colWidths.push({ wch: maxLength + 2 });
    }
    worksheet["!cols"] = colWidths;
  
    const fileName = generateTimestampedFileName(
      "Valores",
      "xlsx"
    );
    XLSX.writeFile(workbook, fileName);
  };
  

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

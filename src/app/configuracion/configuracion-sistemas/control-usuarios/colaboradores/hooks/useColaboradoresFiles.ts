import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import { registerUserActivity } from "@/lib/services/download/downAction";
import { transformDate, transformRangeDate } from "@/lib/utils/dates";

import type { Colaborador } from "../services/colaboradoresTypes";

interface Props {
  colaboradores: Colaborador[] | null;
}

export const useColaboradoresFiles = ({ colaboradores = [] }: Props) => {
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
      "Clave Colaborador",
      "Tipo de colaborador",
      "Tiene usuario en el sistema",
      "Nombre completo",
      "Fecha de nacimiento",
      "Teléfono",
      "Correo electrónico",
      "Curp",
      "INE",
      "No. Seguro social",
      "Conyugue",
      "Referencia",
      "Referencia bancaria",
      "Departamento",
      "Puesto",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(colaboradores || []).map((colaborador) => [
        colaborador.id && colaborador.id.includes("-")
          ? colaborador.id.split("-")[0]
          : "",
        colaborador.id ?? "",
        colaborador.tipoColaborador ?? "",
        colaborador.tieneUsuarioSistema ? "Sí" : "No",
        colaborador.nombreCompleto ?? "",
        transformDate(colaborador.fechaNacimiento) ?? "",
        colaborador.telefono ?? "",
        colaborador.correoElectronico ?? "",
        colaborador.curp ?? "",
        colaborador.ine ?? "",
        colaborador.numeroSeguroSocial ?? "",
        colaborador.conyuge ?? "",
        colaborador.referencias ?? "",
        colaborador.referenciaBancaria ?? "",
        colaborador.departamento ?? "",
        colaborador.puesto ?? "",
        colaborador.estatus ? "Activo" : "Inactivo",
      ]),
    ];
    return {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [10, 15, 10, 15], // Márgenes un poco más amplios
      defaultStyle: {
        fontSize: 7, // Aumenta el tamaño de fuente
        overflow: "linebreak",
      },
      content: [
        { text: "Colaboradores", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: [
              20, // Prefijo
              45, // Clave Colaborador
              38, // Tipo de colaborador
              38, // Tiene usuario en el sistema
              60, // Nombre completo
              35, // Fecha de nacimiento
              35, // Teléfono
              70, // Correo electrónico
              38, // Curp
              25, // INE
              45, // No. Seguro social
              38, // Conyugue
              38, // Referencia
              40, // Referencia bancaria
              35, // Departamento
              30, // Puesto
              30, // Estatus
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
          fontSize: 11,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 8],
        },
        tableExample: {
          fontSize: 7,
          margin: [0, 4, 0, 8],
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
          pdf.download("colaboradores.pdf", () => resolve());
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

  const handleExcel = async (colaboradoresDetallados: Colaborador[] = []) => {
    if (!colaboradoresDetallados || colaboradoresDetallados.length === 0)
      return;

    const workbook = XLSX.utils.book_new();

    // Define las hojas y sus datos
    const sheets = [
      {
        name: "Información general",
        data: informacionGeneralData(colaboradoresDetallados),
      },
      {
        name: "Domicilio fiscal",
        data: domicilioFiscalData(colaboradoresDetallados),
      },
      {
        name: "Datos laborales",
        data: datosLaboralesData(colaboradoresDetallados),
      },
      {
        name: "Historial laboral",
        data: historialLaboralData(colaboradoresDetallados),
      },
    ];

    sheets.forEach(({ name, data }) => {
      const sheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, sheet, name);
    });

    const fileName = `colaboradores.xlsx`;

    XLSX.writeFile(workbook, fileName);
    await setLogOnBackend("excel");
  };

  // Función para transformar los datos de información general
  const informacionGeneralData = (colaboradores: Colaborador[]) => {
    return colaboradores.map((item) => ({
      UID: item.uid,
      Prefijo: item.id && item.id.includes("-") ? item.id.split("-")[0] : "",
      "Clave colaborador": item.id,
      "Tipo de colaborador": item.tipoColaborador,
      "Tiene usuario en el sistema": item.tieneUsuarioSistema ? "Sí" : "No",
      "Nombre completo": item.nombreCompleto,
      "Fecha de nacimiento": item.fechaNacimiento,
      Teléfono: item.telefono,
      "Correo electrónico": item.correoElectronico,
      Curp: item.curp,
      INE: item.ine,
      "No. Seguro social": item.numeroSeguroSocial,
      Conyugue: item.conyuge,
      Referencia: item.referencias,
      "Referencia bancaria": item.referenciaBancaria,
      Estatus: item.estatus ? "Activo" : "Inactivo",
    }));
  };

  // Función para transformar los datos de domicilio fiscal
  const domicilioFiscalData = (colaboradores: Colaborador[]) => {
    return colaboradores.map((item) => ({
      País: item?.domicilioFiscal?.pais,
      "Código postal": item?.domicilioFiscal?.codigoPostal,
      Estado: item?.domicilioFiscal?.estado,
      Ciudad: item?.domicilioFiscal?.ciudad,
      Colonia: item?.domicilioFiscal?.colonia,
      Calle: item?.domicilioFiscal?.calle,
      "No. exterior": item?.domicilioFiscal?.numeroExterior,
      "No. interior": item?.domicilioFiscal?.numeroInterior,
      RFC: item?.domicilioFiscal?.rfc,
      "Correo buzón tributario": item?.domicilioFiscal?.correoBuzonTributario,
    }));
  };

  // Función para transformar los datos de datos laborales
  const datosLaboralesData = (colaboradores: Colaborador[]) => {
    return colaboradores.map((item) => ({
      Puesto: item.datosLaborales?.puesto,
      Departamento: item.datosLaborales?.departamento,
      "Supervisor directo": item.datosLaborales?.supervisorDirecto,
      "Fecha de contratación": transformDate(
        item.datosLaborales?.fechaContratacion ?? "",
        "yyyy/MM/dd"
      ),
      "Fecha de inicio": transformDate(
        item.datosLaborales?.fechaIngreso ?? "",
        "yyyy/MM/dd"
      ),
      "Fecha de fin": transformDate(
        item.datosLaborales?.fechaFin ?? "",
        "yyyy/MM/dd"
      ),
      "Horario de trabajo": item.datosLaborales?.horarioTrabajo,
      "No. cuenta bancaria": item.datosLaborales?.numeroCuentaBancaria,
      Banco: item.datosLaborales?.banco,
    }));
  };

  // Función para transformar los datos de historial laboral
  const historialLaboralData = (colaboradores: Colaborador[]) => {
    return colaboradores.map((item) => ({
      "Último trabajo": item.historialLaboral?.ultimoTrabajo,
      "Periodo de último trabajo": transformRangeDate(
        item.historialLaboral?.periodoUltimoTrabajo?.from ?? "",
        item.historialLaboral?.periodoUltimoTrabajo?.to ?? ""
      ),
      "Puesto último trabajo": item.historialLaboral?.ultimoPuestoTrabajo,
      "Observaciones último trabajo":
        item.historialLaboral?.observacionesUltimoTrabajo,
      "Penúltimo trabajo": item.historialLaboral?.penultimoTrabajo,
      "Periodo penúltimo trabajo": transformRangeDate(
        item.historialLaboral?.periodoPenultimoTrabajo?.from ?? "",
        item.historialLaboral?.periodoPenultimoTrabajo?.to ?? ""
      ),
      "Puesto penúltimo trabajo": item.historialLaboral?.penultimoPuestoTrabajo,
      "Observaciones penúltimo trabajo":
        item.historialLaboral?.observacionesPenultimoTrabajo,
    }));
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
      module: "Configuración del sistema",
      subModule: "Colaboradores",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

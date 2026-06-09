import { useEffect, useState } from "react";

import { es } from "date-fns/locale";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { registerUserActivity } from "@/lib/services/download/downAction";

import type { GetAdminUserResponse } from "../services/adminUsersTypes";

const transformDate = (date?: string) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, "dd/MM/yy", {
      locale: es,
    });
  }
};

interface Props {
  users: GetAdminUserResponse[] | null;
}

export const useUsersFiles = ({ users = [] }: Props) => {
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
      "Nombre completo",
      "Usuario",
      "Empresas",
      "Plantillas",
      "Fecha creación",
      "Estatus",
    ];
    const tableBody = [
      tableHeaders,
      ...(users || []).map((user) => [
        user.id,
        { text: user.fullName || "-", color: "#3C98CB" },
        user.userName || "-",
        user.companies
          ?.map((company) => {
            return company.name ? `${company.name}` : company.name || "-";
          })
          .join(", ") || "-",
        user?.companies
          ?.map((company: any) => {
            const hasRoleTemplateNames =
              Array.isArray(company?.roleTemplateNames) &&
              company.roleTemplateNames.length > 0;
            const hasIndividualClaims =
              Array.isArray(company?.individualClaims) &&
              company.individualClaims.length > 0;

            if (hasIndividualClaims && company.individualClaims.length > 1628) {
              return "Rol Administrador";
            }

            if (hasRoleTemplateNames) {
              return company.roleTemplateNames.join(", ");
            }

            if (hasIndividualClaims) {
              return "Perfil Personalizado";
            }

            return "No cuenta con permisos";
          })
          .join(" / ") || "No cuenta con permisos",
        transformDate(user.createdAt),
        user.isActive ? "Activo" : "Inactivo",
      ]),
    ];
    return {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [40, 60, 40, 60],

      // forza el quiebre de línea cuando el contenido es muy largo
      defaultStyle: {
        overflow: "break",
      },

      content: [
        { text: "Usuarios", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            keepWithHeaderRows: 1,
            dontBreakRows: true,
            widths: [
              "20%", // ID
              "30%", // Nombre completo
              "10%", // Usuario
              "10%", // Empresas (suele ser la más ancha y wrap)
              "10%", // Plantillas
              "10%", // Fecha creación
              "10%", // Estatus
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
          pdf.download("usuarios.pdf", () => resolve());
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
    if (users && users.length > 0) {
      const renamedData = users.map((item) => ({
        UID: "",
        ID: item.id,
        "Nombre completo": item.fullName,
        Usuario: item.userName,
        Empresas: item.companies.map((company) => company.name).join(", "),
        Plantillas: item.roleTemplateName || "Personalizado",
        "Fecha de creación": transformDate(item.createdAt),
        Estatus: item.isActive ? "Activo" : "Inactivo",
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

      XLSX.writeFile(workbook, "usuarios.xlsx");

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
      module: "UsuariosAdmin",
      subModule: "Descarga",
    });
  };

  return {
    handlePdf,
    handleExcel,
    handlePrint,
  };
};

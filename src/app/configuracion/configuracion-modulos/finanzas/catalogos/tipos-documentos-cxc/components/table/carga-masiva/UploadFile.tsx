"use client";

import { useRef, useState } from "react";

import Swal from "sweetalert2";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import Cookies from "js-cookie";
import { getCuentasPorCobrar, importCuentasPorCobrar } from "../../../services/CXCSlice";
// import { generateTimestampedFileName } from "../../../utils/fileName";
// Custom class names for the SweetAlert2 popup
const customClassSuccess = {
  container: "swal2-container",
  popup: "swal-popup-succes",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const customClassError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

interface FormValues {
  file: FileList;
}

interface Props {
  onCloseModal: () => void;
}

const UploadFile = ({ onCloseModal }: Props) => {
  // Cookies
  const token = Cookies.get("auth-token") || "";

  // Global
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.cxcs.loading);

  const [fileName, setFileName] = useState<string | null>(null);
  const retryRef = useRef<FormValues | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    clearErrors,
    setError,
  } = useForm<FormValues>();

  // Validar el archivo
  const validateFile = (files: FileList) => {
    const file = files[0];
    if (!file) return "Debes seleccionar un archivo.";

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Solo se permiten archivos de Excel (.xls o .xlsx).";
    }

    return true;
  };

  const submitFile = async (data: FormValues) => {
  const file = data.file[0];
  try {
    await dispatch(importCuentasPorCobrar({ token, file })).unwrap();

    Swal.fire({
      title: "ÉXITO!",
      text: "Se ha realizado la importación masiva de registros de forma exitosa.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
      customClass: customClassSuccess,
    });

    onCloseModal();
  } catch (error) {
    handleError(error);
  } finally {
    await dispatch(
      getCuentasPorCobrar({ token, requestParams: { page: 1, size: 20 } })
    );
  }
};


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    retryRef.current = data;
    await submitFile(data);
  };

  const handleError = (error: any) => {
    // Manejo de errores
    const errorMessage =
      error?.message || "Ha ocurrido un error importando el archivo.";
    const fileBase64 = error?.errorReportBase64;
    const fileName = "Reporte-error.xlsx";

    let downloadLinkHtml = "";

    if (fileBase64) {
      // Decodificar Base64 a Blob
      const byteCharacters = atob(fileBase64);
      const byteNumbers = Array.from(byteCharacters).map((char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Crear enlace temporal para descargar
      const blobUrl = URL.createObjectURL(blob);
      downloadLinkHtml = `
      <a href="${blobUrl}" download="${fileName}" style="display: inline-block; margin-top: 1rem; color: #4197CB; text-decoration: underline;">
        Descargar reporte de registros no importados
      </a>
    `;
    }

    Swal.fire({
      title: "¡ERROR!",
      html: `
        <p>${errorMessage}</p>
        ${downloadLinkHtml}
      `,
      icon: "error",
      confirmButtonText: "Cerrar",
      customClass: customClassError,
      willClose: () => {
        if (fileBase64) URL.revokeObjectURL(downloadLinkHtml); // Limpia el objeto URL
      },
    }).then((result) => {
     onCloseModal()
    });
  };

  const handleDownloadFormat = async () => {
    if (isLoading) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = "/formatos/formato-tipo-documentos-cxc.xlsx"; // URL del archivo
    downloadLink.download = "Formato-CuentasPorCobrar.xlsx";
    downloadLink.click();
  }

  const handleDownloadInstructions = () => {
    if (isLoading) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = "/formatos/Instrucciones.pdf";
    downloadLink.download = "Instrucciones.pdf";
    downloadLink.click();
  };

  return (
    <>
      <form className="px-3 md:px-10" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="uppercase text-xl font-semibold text-center mb-4 text-[#5D6D7E]">
            Importación masiva
          </h2>
          {/* icon */}
          <img
            src={"/assets/upload.svg"}
            alt="Upload Icon"
            className="w-28 h-28 mx-auto mb-4"
          />
          {/* file picker hidden */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="masive-file">*Archivo</Label>
            <input
              id="masive-file"
              type="file"
              accept=".xls, .xlsx"
              hidden
              disabled={isLoading}
              {...register("file", {
                validate: validateFile,
                onChange: (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files && files.length > 0) {
                    const validation = validateFile(files);
                    if (validation === true) {
                      clearErrors("file");
                      setFileName(files[0].name);
                    } else {
                      setError("file", { message: validation as string });
                      setFileName(null);
                    }
                  }
                },
              })}
            />
            {/* Pick file button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("masive-file")?.click()}
              disabled={isLoading}
              className="flex justify-start gap-2 py-5 border-2 border-[#BDC3C7] text-gray-900 text-lg font-light hover:text-gray-900"
            >
              <span>
                {fileName ? "Archivo seleccionado" : "Selecciona el archivo"}
              </span>
              {fileName && (
                <>
                  <span>-</span>
                  <span className="block truncate overflow-hidden whitespace-nowrap"
                    title={fileName}
                  >
                    {fileName}
                  </span>
                </>
              )}
            </Button>
            {errors.file && (
              <span className="text-red-500 text-sm">{errors.file.message}</span>
            )}
            {/* file info */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4197CB]">
                Selecciona un archivo XLS O XLSX
              </span>
              <div className="flex flex-col items-end">
                <span
                  onClick={handleDownloadFormat}
                  className={`text-sm ${
                    isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#4197CB] underline hover:cursor-pointer"
                  }`}
                >
                  Descargar el formato
                </span>
                <span
                  onClick={handleDownloadInstructions}
                  className={`text-sm ${
                    isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#4197CB] underline hover:cursor-pointer"
                  }`}
                >
                  Descargar instructivo
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 mt-14 sm:gap-8 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="px-12"
            onClick={onCloseModal}
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="default"
            className="px-12"
            disabled={!isValid || isLoading}
            loading={isLoading}
          >
            Cargar
          </Button>
        </div>
      </form>
    </>
  );
};

export default UploadFile;

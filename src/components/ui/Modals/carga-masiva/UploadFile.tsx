"use client";

import { useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import cx from "classnames";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  handleFile: (file: File) => Promise<void>;
  getData: () => Promise<void>;
  urlFormatFile: string;
  formatFileName: string;
  urlInstructionsFile?: string;
  isLoading: boolean;
}

const UploadFile = ({
  onCloseModal,
  handleFile,
  getData,
  urlFormatFile,
  formatFileName,
  urlInstructionsFile = "/formatos/Instrucciones.pdf",
  isLoading,
}: Props) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    clearErrors,
    setError,
    reset,
  } = useForm<FormValues>();

  const validateFile = (files: FileList) => {
    if (files === undefined) return;

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const file = data.file[0];
    try {
      await handleFile(file);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    console.error("Error al enviar el archivo:", error);

    const errorMessage =
      error?.message || "Ha ocurrido un error importando el archivo.";
    const fileBase64 = error?.errorReportBase64;
    const fileName = "reporte-error.xlsx";

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
      confirmButtonText: "Volver a intentar",
      customClass: customClassError,
      willClose: () => {
        // Liberar memoria del blob cuando se cierre
        if (fileBase64) URL.revokeObjectURL(downloadLinkHtml);
      },
    });

    if (fileBase64) getData();

    // Reset file input and errors
    reset();
    setFileName(null);
  };

  const handleDownloadFormat = async () => {
    if (isLoading) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = urlFormatFile; // URL del archivo
    downloadLink.download = formatFileName;
    downloadLink.click();
  };

  const handleDownloadInstr = async () => {
    if (isLoading) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = urlInstructionsFile || "";
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
            <Label htmlFor="masive-file" className="text-[#5D6D7E]">
              *Archivo
            </Label>
            <input
              id="masive-file"
              type="file"
              accept=".xls, .xlsx"
              hidden
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
              className={cx(
                "flex justify-start gap-2 py-5 border-2 text-gray-900 text-lg font-light hover:text-gray-900",
                errors.file ? "border-red-500" : "border-[#BDC3C7]"
              )}
            >
              <span>
                {fileName ? "Archivo seleccionado" : "Selecciona el archivo"}
              </span>
              {fileName && (
                <>
                  <span>-</span>
                  <span
                    className="truncate max-w-[200px] overflow-hidden whitespace-nowrap"
                    title={fileName}
                  >
                    {fileName}
                  </span>
                </>
              )}
            </Button>
            {errors.file && (
              <span className="text-red-500 text-sm">
                {errors.file.message}
              </span>
            )}
            {/* file info */}
            <div className="flex">
              <div className="flex flex-1">
                <span className="text-sm text-[#4197CB]">
                  Selecciona un archivo XLS o XLSX
                </span>
              </div>
              <div className="flex flex-1 flex-col items-end">
                <span
                  onClick={handleDownloadFormat}
                  className={cx(
                    "text-sm text-[#4197CB] underline cursor-default hover:cursor-pointer",
                    isLoading && "text-[#4197CB]/70 hover:cursor-not-allowed"
                  )}
                >
                  Descargar el formato
                </span>
                {urlInstructionsFile && (
                  <span
                    onClick={handleDownloadInstr}
                    className={cx(
                      "text-sm text-[#4197CB] underline cursor-default hover:cursor-pointer",
                      isLoading && "text-[#4197CB]/70 hover:cursor-not-allowed"
                    )}
                  >
                    Descargar instructivo
                  </span>
                )}
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

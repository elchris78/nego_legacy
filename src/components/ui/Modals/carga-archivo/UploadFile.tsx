"use client";

import { useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import cx from "classnames";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColaboradorDocumentacion } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/components/form/documentacion-adicional/services/colaboradorDocumentacionTypes";

const customClassError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

interface FormValues {
  file: FileList;
  name: string;
}

interface Props {
  onCloseModal: () => void;
  handleFile: (file: File | undefined, name: string) => Promise<void>;
  getData: () => Promise<void>;
  isLoading: boolean;
  currentDocument?: ColaboradorDocumentacion | null; // Optional, if you want to handle existing documents
  isLoadingDocument?: boolean; // Optional, if you want to handle loading state for existing documents
  readOnly?: boolean; // Optional, if you want to make the modal read-only
}

const UploadFile = ({
  onCloseModal,
  handleFile,
  getData,
  isLoading,
  currentDocument = null,
  isLoadingDocument = false,
  readOnly = false,
}: Props) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    clearErrors,
    setError,
    resetField,
    setValue,
    trigger,
  } = useForm<FormValues>({
    mode: "all",
  });

  useEffect(() => {
    // If there is a current document, set the file name
    if (currentDocument && !isLoadingDocument) {
      setFileName(`${currentDocument.nombre}.${currentDocument.formato}`);
      setValue("name", currentDocument.nombre);

      trigger();
    } else {
      setFileName(null);
      resetField("name");
    }
  }, [currentDocument, isLoadingDocument]);

  const validateFile = (files: FileList) => {
    // Si hay documento actual, no es obligatorio subir archivo
    if (currentDocument && (!files || files.length === 0)) {
      return true;
    }

    if (files === undefined) return;

    const file = files[0];
    if (!file) return "Debes seleccionar un archivo.";

    // Only .png, .jpg, .jpeg, .xls, .xlsx, .doc, .docx, .pdf
    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/pdf", // .pdf
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "image/png", // .png
      "image/jpeg", // .jpg
      "image/jpg", // .jpeg
    ];

    if (!allowedTypes.includes(file.type)) {
      return "El archivo debe ser de tipo .xls, .xlsx, .doc, .docx, .pdf, .png, .jpg o .jpeg.";
    }

    return true;
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let file;
    if (data?.file !== undefined) file = data?.file[0];
    try {
      await handleFile(file, data.name);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    console.log("🚀 ~ handleError ~ error:", error);

    Swal.fire({
      title: "¡ERROR!",
      icon: "error",
      text: error?.message || "Ocurrió un error al cargar el archivo.",
      confirmButtonText: "Volver a intentar",
      customClass: customClassError,
    });
  };

  return (
    <>
      <form className="px-3 md:px-10" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="uppercase text-xl font-semibold text-center mb-4 text-[#5D6D7E]">
            Carga documento adicional
          </h2>
          {/* icon */}
          <img
            src={"/assets/upload.svg"}
            alt="Upload Icon"
            className="w-28 h-28 mx-auto mb-4"
          />
          {/* file picker hidden */}
          <div className="flex flex-col gap-1 mb-4">
            <Label htmlFor="name" className="text-[#5D6D7E]">
              *Nombre
            </Label>
            <Input
              id="name"
              type="text"
              isError={!!errors.name}
              placeholder="Ingresa el nombre"
              disabled={isLoading || readOnly}
              {...register("name", {
                required: "El nombre es obligatorio.",
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres.",
                },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="masive-file" className="text-[#5D6D7E]">
              *Archivo
            </Label>
            <input
              id="masive-file"
              type="file"
              accept=".xls,.xlsx,.doc,.docx,.pdf,.png,.jpg,.jpeg"
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
              disabled={isLoading || readOnly}
              className={cx(
                "flex justify-start gap-2 py-5 border text-gray-900 text-lg font-light hover:text-gray-900",
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
            {readOnly ? "Cerrar" : "Cancelar"}
          </Button>

          {!readOnly && (
            <Button
              type="submit"
              variant="default"
              className="px-12"
              disabled={!isValid || isLoading}
              loading={isLoading}
            >
              {currentDocument ? "Actualizar" : "Cargar"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default UploadFile;

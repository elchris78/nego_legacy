import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import cx from "classnames";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddDocumentSucursal } from "../../../../services/sucursalesTypes";

interface Props {
  onSubmit: (data: { fileName: string; file: FileList }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  modoEdicion: boolean;
  onEditar: () => void;
  documento: AddDocumentSucursal | null;
}

interface FormValues {
  fileName: string;
  file: FileList;
}

const AddFileForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  modoEdicion,
  onEditar,
  documento,
}: Props) => {
  const [fileDisplayName, setFileDisplayName] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
    setError,
    clearErrors,
    resetField,
    watch,
  } = useForm<FormValues>({ mode: "all" });

  useEffect(() => {
    if (documento) {
      setValue("fileName", documento.nombreDocumento || "");
      setFileDisplayName(`${documento.nombreDocumento}${documento.formato}`);
    }
  }, [documento, setValue]);

  const validateFile = (files: FileList) => {
    const file = files?.[0];
    if (!file) return "Debes seleccionar un archivo.";
    const allowedTypes = [
      "image/png", "image/jpeg", "image/jpg",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Formato de archivo no permitido.";
    }
    return true;
  };

  const onSubmitForm = async (data: FormValues) => {
    await onSubmit(data);
  };

  return (
    <form className="px-3 md:px-10" onSubmit={handleSubmit(onSubmitForm)}>
      <div>
        <h2 className="uppercase text-xl font-semibold text-center mb-4 text-[#5D6D7E]">
          {modoEdicion ? "Editar documento" : "Visualizar documento"}
        </h2>

        <img
          src="/assets/upload.svg"
          alt="Upload Icon"
          className="w-28 h-28 mx-auto mb-6"
        />

        {/* Nombre archivo */}
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="fileName" className="text-[#5D6D7E] font-medium">
            *Nombre del archivo
          </label>
          <Input
            id="fileName"
            placeholder="Ingresa el nombre"
            disabled={!modoEdicion || isLoading}
            isError={!!errors.fileName}
            {...register("fileName", {
              required: "Este campo es obligatorio.",
              minLength: {
                value: 2,
                message: "Debe tener al menos 2 caracteres.",
              },
            })}
          />
          {errors.fileName && (
            <span className="text-red-500 text-sm">
              {errors.fileName.message}
            </span>
          )}
        </div>

        {/* Selector archivo */}
        <div className="flex flex-col gap-1">
          <label htmlFor="file-upload" className="text-[#5D6D7E] font-medium">
            *Archivo
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.pdf"
            hidden
            disabled={!modoEdicion || isLoading}
            onChange={(e) => {
              const input = e.target as HTMLInputElement;
              const files = input.files;

              if (!files || files.length === 0) {
                resetField("file");
                setFileDisplayName(null);
                return;
              }

              const file = files[0];
              const validation = validateFile(files);

              if (validation === true) {
                clearErrors("file");
                // ✅ Aquí se guarda el archivo correctamente en React Hook Form
                setValue("file", files, { shouldValidate: true, shouldDirty: true });
                setFileDisplayName(file.name);
              } else {
                setError("file", { message: validation as string });
                resetField("file");
                setFileDisplayName(null);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={!modoEdicion || isLoading}
            className={cx(
              "flex justify-start gap-2 py-5 border text-gray-900 text-lg font-light hover:text-gray-900",
              errors.file ? "border-red-500" : "border-[#BDC3C7]"
            )}
          >
            <span>
              {fileDisplayName ? "Archivo seleccionado" : "Selecciona el archivo"}
            </span>
            {fileDisplayName && (
              <>
                <span>-</span>
                <span
                  className="truncate max-w-[200px] overflow-hidden whitespace-nowrap"
                  title={fileDisplayName}
                >
                  {fileDisplayName}
                </span>
              </>
            )}
          </Button>
          {errors.file && (
            <span className="text-red-500 text-sm">{errors.file.message}</span>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col justify-center gap-4 mt-14 sm:gap-8 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="px-12"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        {!modoEdicion ? (
          <Button
            type="button"
            variant="default"
            className="px-12"
            onClick={onEditar}
            disabled={isLoading}
          >
            Ir a actualizar
          </Button>
        ) : (
          <Button
            type="submit"
            variant="default"
            className="px-12"
            disabled={!isValid || isLoading}
            loading={isLoading}
          >
            Actualizar
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddFileForm;

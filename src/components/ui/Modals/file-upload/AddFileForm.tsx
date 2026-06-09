import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import cx from "classnames";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormValues {
  fileName: string;
  file: FileList;
}

interface Props {
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const allowedTypes = [
  "image/png", "image/jpeg", "image/jpg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/pdf"
];

const AddFileForm = ({ onSubmit, onCancel, isLoading = false }: Props) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setError,
    clearErrors,
    resetField,
  } = useForm<FormValues>({ mode: "all" });

  const validateFile = (files: FileList) => {
    if (!files || files.length === 0) return "Debes seleccionar un archivo.";
    const file = files[0];
    if (!allowedTypes.includes(file.type)) {
      return "Formato de archivo no permitido.";
    }
    return true;
  };

  return (
    <form className="px-3 md:px-10" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="uppercase text-xl font-semibold text-center mb-4 text-[#5D6D7E]">
          Agregar archivo
        </h2>

        {/* Icono */}
        <img
          src="/assets/upload.svg"
          alt="Upload Icon"
          className="w-28 h-28 mx-auto mb-6"
        />

        {/* Nombre del archivo */}
        <div className="flex flex-col gap-1 mb-4">
          <Label htmlFor="fileName" className="text-[#5D6D7E]">
            *Nombre del archivo
          </Label>
          <Input
            id="fileName"
            type="text"
            placeholder="Ingresa el nombre"
            disabled={isLoading}
            isError={!!errors.fileName}
            {...register("fileName", {
              required: "El nombre es obligatorio.",
              minLength: {
                value: 2,
                message: "Mínimo 2 caracteres.",
              },
            })}
          />
          {errors.fileName && (
            <span className="text-red-500 text-sm">
              {errors.fileName.message}
            </span>
          )}
        </div>

        {/* Archivo */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="file-upload" className="text-[#5D6D7E]">
            *Archivo
          </Label>
          <input
            id="file-upload"
            type="file"
            accept=".png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.pdf"
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
            disabled={isLoading}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isLoading}
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
            <span className="text-red-500 text-sm">{errors.file.message}</span>
          )}
          <div className="text-xs text-[#4197CB] mt-1">
            Formatos permitidos: PNG, JPG, JPEG, XLS, XLSX, DOC, DOCX, PDF
          </div>
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

        <Button
          type="submit"
          variant="default"
          className="px-12"
          disabled={!isValid || isLoading}
          loading={isLoading}
        >
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default AddFileForm;

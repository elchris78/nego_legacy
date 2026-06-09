"use client";

import { useEffect } from "react";

import { FieldArrayWithId } from "react-hook-form";
import { Tooltip as MUITooltip } from "@mui/material";
import { useSearchParams } from "next/navigation";
import cx from "classnames";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidFileType } from "../../../utils/validateFile";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { rfcRegex } from "@/lib/utils/regex";
import { useColaboradorFormContext } from "../ColaboradorFormContext";
import SquareArrowTop from "@/components/ui/icons/SquareArrowTop";

import { DocumentacionAvalesColaboradorFormValues } from "../../../services/colaboradoresFormsTypes";
import { cn } from "@/lib/utils";

interface Props {
  field: FieldArrayWithId<
    DocumentacionAvalesColaboradorFormValues,
    "documentacionAvales",
    "id"
  >;
  idx: number;
}

const DocumentacionAvalFields = ({ field, idx }: Props) => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { documentacionAvalesForm, avalColaboradorForm, currentColaborador } =
    useColaboradorFormContext();
  const {
    register,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
  } = documentacionAvalesForm;

  // Utilidad para saber si hay algún campo con valor
  const anyFieldFilled = () => {
    const fields = avalColaboradorForm.watch(`avales.${idx}`);
    return Object.values(fields).some((v) => v && v !== "");
  };

  useEffect(() => {
    documentacionAvalesForm.register(
      `documentacionAvales.${idx}.constanciaSituacionFiscalFile`,
      {
        validate: (value) => {
          if (anyFieldFilled() && !value) {
            if (
              mode === "edit" &&
              currentColaborador?.documentacionAvales?.[idx]
                ?.constanciaSituacionFiscalUrl
            ) {
              return true; // Si ya hay un archivo cargado, no es obligatorio
            } else {
              return "La constancia de situación fiscal es obligatoria";
            }
          }
          return true;
        },
      }
    );
    documentacionAvalesForm.register(
      `documentacionAvales.${idx}.referenciaFile`,
      {
        validate: (value) => {
          if (anyFieldFilled() && !value) {
            if (
              mode === "edit" &&
              currentColaborador?.documentacionAvales?.[idx]?.referenciaFileUrl
            ) {
              return true; // Si ya hay un archivo cargado, no es obligatorio
            } else {
              return "La referencia es obligatoria";
            }
          }
          return true;
        },
      }
    );
  }, [documentacionAvalesForm, idx, mode, currentColaborador, anyFieldFilled]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* RFC */}
      <div>
        <LabelTooltip
          label="*RFC"
          // tooltip="Teléfono de contacto del colaborador"
          htmlFor={`rfc-aval.${idx}.doc`}
        />
        <Input
          id={`rfc-aval.${idx}.doc`}
          type="text"
          placeholder="Ingrese rfc"
          isError={!!errors.documentacionAvales?.[idx]?.rfc}
          disabled={mode === "view"}
          {...register(`documentacionAvales.${idx}.rfc`, {
            pattern: {
              value: rfcRegex,
              message:
                "El RFC no es válido, debe tener el formato correcto (ABC123456789)",
            },
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El RFC es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.documentacionAvales?.[idx]?.rfc && (
          <span className="text-[#CF5459] text-xs">
            {errors.documentacionAvales[idx].rfc?.message}
          </span>
        )}
      </div>

      {/* Constancia de situcación fiscal */}
      <div>
        <LabelTooltip
          label="*Constancia de situación fiscal"
          // tooltip="Ingresa el comprobante de domicilio del colaborador."
          htmlFor={`constancia-situacion-fiscal-file-input-${idx}.doc`}
        />
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            disabled={mode === "view"}
            onClick={() =>
              document
                .getElementById(
                  `constancia-situacion-fiscal-file-input-${idx}.doc`
                )
                ?.click()
            }
            className={cx(
              "flex justify-start gap-2 py-5 mt-1 border w-full text-gray-600 text-base font-normal hover:text-gray-600",
              errors.documentacionAvales?.[idx]?.constanciaSituacionFiscalFile
                ? "border-red-500"
                : "border-[#BDC3C7]"
            )}
          >
            <span>
              {watch(
                `documentacionAvales.${idx}.constanciaSituacionFiscalFile`
              ) instanceof File ||
              ((mode === "edit" || mode === "view") &&
                currentColaborador?.documentacionAvales?.[idx]
                  ?.constanciaSituacionFiscalUrl)
                ? "Archivo seleccionado"
                : "Selecciona el archivo"}
            </span>
            <span
              className={cn(
                "absolute inset-y-0 right-2 flex items-center",
                mode === "new" || mode === "edit"
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              )}
            >
              <MUITooltip
                title={
                  mode === "view"
                    ? undefined
                    : watch(
                          `documentacionAvales.${idx}.constanciaSituacionFiscalFile`
                        ) instanceof File ||
                        (mode === "edit" &&
                          currentColaborador?.documentacionAvales?.[idx]
                            ?.constanciaSituacionFiscalUrl)
                      ? "Reemplazar archivo constancia de situación fiscal"
                      : "Subir archivo constancia de situación fiscal"
                }
                placement="top"
              >
                <span>
                  {watch(
                    `documentacionAvales.${idx}.constanciaSituacionFiscalFile`
                  ) instanceof File ||
                  ((mode === "edit" || mode === "view") &&
                    currentColaborador?.documentacionAvales?.[idx]
                      ?.constanciaSituacionFiscalUrl) ? (
                    <SquareArrowTop color="#4197CB" />
                  ) : (
                    <SquareArrowTop />
                  )}
                </span>
              </MUITooltip>
            </span>
          </Button>
        </div>
        <input
          hidden
          id={`constancia-situacion-fiscal-file-input-${idx}.doc`}
          type="file"
          accept="application/pdf"
          disabled={mode === "view"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && isValidFileType(file)) {
              setValue(
                `documentacionAvales.${idx}.constanciaSituacionFiscalFile`,
                file
              );
              clearErrors(
                `documentacionAvales.${idx}.constanciaSituacionFiscalFile`
              );
            } else if (file && !isValidFileType(file)) {
              setError(
                `documentacionAvales.${idx}.constanciaSituacionFiscalFile`,
                {
                  type: "manual",
                  message: "El archivo debe ser un PDF",
                }
              );
            }
          }}
        />
        {errors.documentacionAvales?.[idx]?.constanciaSituacionFiscalFile && (
          <span className="text-[#CF5459] text-xs">
            {
              errors.documentacionAvales[idx].constanciaSituacionFiscalFile
                ?.message
            }
          </span>
        )}
      </div>

      {/* CURP */}
      <div>
        <LabelTooltip
          label="*CURP"
          // tooltip="Teléfono de contacto del colaborador"
          htmlFor={`curp-colaborador${idx}.doc`}
        />
        <Input
          id={`curp-colaborador${idx}.doc`}
          type="text"
          placeholder="Ingrese CURP"
          isError={!!errors.documentacionAvales?.[idx]?.curp}
          disabled={mode === "view"}
          {...register(`documentacionAvales.${idx}.curp`, {
            minLength: {
              value: 18,
              message: "La CURP debe tener 18 caracteres",
            },
            maxLength: {
              value: 18,
              message: "La CURP no puede tener más de 18 caracteres",
            },
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "La CURP es obligatoria";
              }
              return true;
            },
          })}
        />
        {errors.documentacionAvales?.[idx]?.curp && (
          <span className="text-[#CF5459] text-xs">
            {errors.documentacionAvales[idx].curp?.message}
          </span>
        )}
      </div>

      {/* INE */}
      <div>
        <LabelTooltip
          label="*INE"
          // tooltip="Teléfono de contacto del colaborador"
          htmlFor={`ine-colaborador${idx}.doc`}
        />
        <Input
          id={`ine-colaborador${idx}.doc`}
          type="text"
          placeholder="Ingrese INE"
          isError={!!errors.documentacionAvales?.[idx]?.ine}
          disabled={mode === "view"}
          {...register(`documentacionAvales.${idx}.ine`, {
            minLength: {
              value: 13,
              message: "El INE debe tener 13 caracteres",
            },
            maxLength: {
              value: 13,
              message: "El INE no puede tener más de 13 caracteres",
            },
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El INE es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.documentacionAvales?.[idx]?.ine && (
          <span className="text-[#CF5459] text-xs">
            {errors.documentacionAvales[idx].ine?.message}
          </span>
        )}
      </div>

      {/* Conyuge */}
      <div>
        <LabelTooltip
          label="*Cónyuge"
          // tooltip="Teléfono de contacto del colaborador"
          htmlFor={`conyuge-colaborador${idx}.doc`}
        />
        <Input
          id={`conyuge-colaborador${idx}.doc`}
          type="text"
          placeholder="Ingrese nombre del cónyuge"
          isError={!!errors.documentacionAvales?.[idx]?.conyuge}
          disabled={mode === "view"}
          {...register(`documentacionAvales.${idx}.conyuge`, {
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El nombre del cónyuge es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.documentacionAvales?.[idx]?.conyuge && (
          <span className="text-[#CF5459] text-xs">
            {errors.documentacionAvales[idx].conyuge?.message}
          </span>
        )}
      </div>

      {/* Referencia */}
      <div>
        <LabelTooltip
          label="*Referencia"
          // tooltip="Ingresa el comprobante de domicilio del colaborador."
          htmlFor={`referencia-file-input${idx}`}
        />
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            disabled={mode === "view"}
            onClick={() =>
              document
                .getElementById(`referencia-file-input${idx}.doc`)
                ?.click()
            }
            className={cx(
              "flex justify-start gap-2 py-5 mt-1 border w-full text-gray-600 text-base font-normal hover:text-gray-600",
              errors.documentacionAvales?.[idx]?.referenciaFile
                ? "border-red-500"
                : "border-[#BDC3C7]"
            )}
          >
            <span>
              {watch(`documentacionAvales.${idx}.referenciaFile`) instanceof
                File ||
              ((mode === "edit" || mode === "view") &&
                currentColaborador?.documentacionAvales?.[idx]
                  ?.referenciaFileUrl)
                ? "Archivo seleccionado"
                : "Selecciona el archivo"}
            </span>
            <span
              className={cn(
                "absolute inset-y-0 right-2 flex items-center",
                mode === "new" || mode === "edit"
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              )}
            >
              <MUITooltip
                title={
                  mode === "view"
                    ? undefined
                    : watch(
                          `documentacionAvales.${idx}.referenciaFile`
                        ) instanceof File ||
                        (mode === "edit" &&
                          currentColaborador?.documentacionAvales?.[idx]
                            ?.referenciaFileUrl)
                      ? "Reemplazar archivo referencia"
                      : "Subir archivo referencia"
                }
                placement="top"
              >
                <span>
                  {watch(`documentacionAvales.${idx}.referenciaFile`) instanceof
                    File ||
                  ((mode === "edit" || mode === "view") &&
                    currentColaborador?.documentacionAvales?.[idx]
                      ?.referenciaFileUrl) ? (
                    <SquareArrowTop color="#4197CB" />
                  ) : (
                    <SquareArrowTop />
                  )}
                </span>
              </MUITooltip>
            </span>
          </Button>
        </div>
        <input
          hidden
          id={`referencia-file-input${idx}.doc`}
          type="file"
          accept="application/pdf"
          disabled={mode === "view"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && isValidFileType(file)) {
              setValue(`documentacionAvales.${idx}.referenciaFile`, file);
              clearErrors(`documentacionAvales.${idx}.referenciaFile`);
            } else if (file && !isValidFileType(file)) {
              setError(`documentacionAvales.${idx}.referenciaFile`, {
                type: "manual",
                message: "El archivo debe ser un PDF",
              });
            }
          }}
        />
        {errors.documentacionAvales?.[idx]?.referenciaFile && (
          <span className="text-[#CF5459] text-xs">
            {errors.documentacionAvales[idx].referenciaFile?.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default DocumentacionAvalFields;

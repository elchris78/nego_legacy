"use client";

import { cn } from "@/lib/utils";
import { Tooltip as MUITooltip } from "@mui/material";
import cx from "classnames";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidFile } from "../../utils/validateFiles";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useEmpresaForm } from "../EmpresaFormContext";
import SquareArrowTop from "@/components/ui/icons/SquareArrowTop";
import { Trash2Icon, Image } from "lucide-react";
import { useState, useEffect } from "react";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";
import ViewImageModal from "@/components/ui/Modals/ViewImageModal";

const DatosComercialesForm = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageToShow, setImageToShow] = useState<string>("");

  const { datosComercialesForm } = useEmpresaForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch,
  } = datosComercialesForm;

  const currentCompanyData = useSelector(
    (state: RootState) => state.empresa.company
  );

  // Determina la imagen a mostrar cuando se abre el modal
  useEffect(() => {
    if (showImage) {
      const logoGeneral = watch("logoGeneral");
      if (logoGeneral instanceof File) {
        const url = URL.createObjectURL(logoGeneral);
        setImageToShow(url);
        return () => URL.revokeObjectURL(url);
      } else if (currentCompanyData?.datosComerciales?.logoGeneral) {
        setImageToShow(currentCompanyData.datosComerciales.logoGeneral);
      } else {
        setImageToShow("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showImage, watch("logoGeneral"), currentCompanyData]);

  // Maneja la eliminación de la imagen seleccionada
  const handleDeleteImageSelected = () => {
    setValue(`logoGeneral`, null, {
      shouldValidate: true,
    });

    const input = document.getElementById(
      "logo-empresa-file-input"
    ) as HTMLInputElement;

    if (input) {
      input.value = "";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Logo de la empresa */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <LabelTooltip
              label="Logo de la empresa"
              tooltip="Selecciona la imagen que representa el logo de la empresa"
              htmlFor="logo-empresa"
            />
            {/* Iconos de acciones */}
            <div className="flex items-center gap-2">
              {watch(`logoGeneral`) instanceof File && (
                <MUITooltip
                  title="Eliminar el logo de la empresa"
                  placement="top"
                >
                  <Trash2Icon
                    className="h-4 w-4 cursor-pointer text-gray-500 hover:text-[#CF5459]"
                    onClick={handleDeleteImageSelected}
                  />
                </MUITooltip>
              )}
              {(watch(`logoGeneral`) ||
                currentCompanyData?.datosComerciales.logoGeneral) && (
                <MUITooltip
                  title="Visualizar logo de la empresa"
                  placement="top"
                >
                  <Image
                    className="h-4 w-4 cursor-pointer text-gray-500 hover:text-[#3C98CB]"
                    onClick={() => setShowImage(true)}
                  />
                </MUITooltip>
              )}
            </div>
          </div>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                document.getElementById(`logo-empresa-file-input`)?.click()
              }
              className={cx(
                "flex justify-start gap-2 py-5 mt-1 border w-full text-gray-600 text-base font-normal hover:text-gray-600",
                errors.logoGeneral ? "border-red-500" : "border-[#BDC3C7]"
              )}
            >
              <span>
                {watch(`logoGeneral`) instanceof File ||
                currentCompanyData?.datosComerciales.logoGeneral
                  ? "Archivo seleccionado"
                  : "Selecciona el archivo"}
              </span>
              <span
                className={cn(
                  "absolute inset-y-0 right-2 flex items-center cursor-pointer"
                )}
              >
                <MUITooltip
                  title={
                    watch(`logoGeneral`) instanceof File ||
                    currentCompanyData?.datosComerciales.logoGeneral
                      ? "Reemplazar archivo logo de la empresa"
                      : "Subir archivo logo de la empresa"
                  }
                  placement="top"
                >
                  <span>
                    {watch(`logoGeneral`) instanceof File ||
                    currentCompanyData?.datosComerciales.logoGeneral ? (
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
            id={`logo-empresa-file-input`}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (
                file &&
                isValidFile(file, [".png", ".jpg", ".jpeg"], 5 * 1024 * 1024)
              ) {
                setValue(`logoGeneral`, file);
                clearErrors(`logoGeneral`);
              } else if (
                file &&
                !isValidFile(file, [".png", ".jpg", ".jpeg"], 5 * 1024 * 1024)
              ) {
                setError(`logoGeneral`, {
                  type: "manual",
                  message:
                    "El archivo debe ser una imagen (PNG, JPG, JPEG) y no debe exceder 5MB",
                });
              }
            }}
          />
          {errors.logoGeneral && (
            <span className="text-[#CF5459] text-xs">
              {errors.logoGeneral?.message}
            </span>
          )}
        </div>

        {/* Nombre comercial */}
        <div>
          <LabelTooltip
            label="Nombre comercial"
            tooltip="Nombre comercial de la empresa"
            htmlFor="nombre-comercial-empresa"
          />
          <Input
            id="nombre-comercial-empresa"
            type="text"
            placeholder="Ingresa nombre comercial de la empresa"
            isError={!!errors.nombreComercial}
            {...register("nombreComercial", {
              maxLength: {
                value: 100,
                message:
                  "El nombre comercial no puede exceder los 100 caracteres",
              },
            })}
          />
          {errors.nombreComercial && (
            <span className="text-[#CF5459] text-xs">
              {errors.nombreComercial?.message}
            </span>
          )}
        </div>

        {/* Teléfono fijo */}
        <div>
          <LabelTooltip
            label="Teléfono fijo"
            tooltip="Ingresa el número de teléfono fijo incluyendo clave lada, si aplica."
            htmlFor="telefono-fijo-empresa"
          />
          <Input
            id="telefono-fijo-empresa"
            type="text"
            placeholder="Ingresa el teléfono fijo"
            isError={!!errors.telefonoFijo}
            {...register("telefonoFijo", {
              minLength: {
                value: 10,
                message: "El teléfono fijo debe tener al menos 10 caracteres",
              },
              maxLength: {
                value: 10,
                message: "El teléfono fijo no puede exceder los 10 caracteres",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "El teléfono fijo debe contener solo números",
              },
            })}
          />
          {errors.telefonoFijo && (
            <span className="text-[#CF5459] text-xs">
              {errors.telefonoFijo?.message}
            </span>
          )}
        </div>

        {/* Celular */}
        <div>
          <LabelTooltip
            label="Celular"
            tooltip="Introduce un número móvil válido con WhatsApp. Incluye la lada sin espacios ni símbolos."
            htmlFor="celular-empresa"
          />
          <Input
            id="celular-empresa"
            type="text"
            placeholder="Ingresa el número de celular"
            isError={!!errors.telefonoCelular}
            {...register("telefonoCelular", {
              minLength: {
                value: 10,
                message: "El número celular debe tener al menos 10 caracteres",
              },
              maxLength: {
                value: 10,
                message: "El número celular no puede exceder los 10 caracteres",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "El número celular debe contener solo números",
              },
            })}
          />
          {errors.telefonoCelular && (
            <span className="text-[#CF5459] text-xs">
              {errors.telefonoCelular?.message}
            </span>
          )}
        </div>

        {/* Correo electrónico */}
        <div>
          <LabelTooltip
            label="Correo electrónico"
            tooltip="Proporciona un correo electrónico de contacto válido. Ejemplo: contacto@empresa.com."
            htmlFor="correo-empresa"
          />
          <Input
            id="correo-empresa"
            type="email"
            placeholder="Ingresa el correo electrónico"
            isError={!!errors.correoContacto}
            {...register("correoContacto", {
              maxLength: {
                value: 100,
                message:
                  "El correo electrónico no puede exceder los 100 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "El correo electrónico no es válido",
              },
            })}
          />
          {errors.correoContacto && (
            <span className="text-[#CF5459] text-xs">
              {errors.correoContacto?.message}
            </span>
          )}
        </div>

        {/* Página web */}
        <div>
          <LabelTooltip
            label="Página web"
            tooltip="Introduce la URL del sitio web de la organización, iniciando con “https://”. Ejemplo: https://www.empresa.com."
            htmlFor="pagina-web-empresa"
          />
          <Input
            id="pagina-web-empresa"
            type="url"
            placeholder="Ingrese la página web"
            isError={!!errors.paginaWeb}
            {...register("paginaWeb", {
              maxLength: {
                value: 200,
                message: "La URL no puede exceder los 200 caracteres",
              },
              pattern: {
                value:
                  /^(https?:\/\/)([\wñÑ-]+(\.[\wñÑ-]+)+)(\/[\wñÑ\-./?%&=]*)?$/,
                message:
                  "La URL no es válida, debe comenzar con http:// o https://",
              },
            })}
          />
          {errors.paginaWeb && (
            <span className="text-[#CF5459] text-xs">
              {errors.paginaWeb?.message}
            </span>
          )}
        </div>
      </div>

      {/* Modal para ver la imagen */}
      <ViewImageModal
        open={showImage}
        onClose={() => setShowImage(false)}
        imagen={imageToShow}
      />
    </>
  );
};

export default DatosComercialesForm;

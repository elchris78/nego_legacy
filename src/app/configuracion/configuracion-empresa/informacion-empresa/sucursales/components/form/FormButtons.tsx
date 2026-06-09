"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { useSucursalForm } from "./SucursalesFormContext";
import { sucursalActions } from "../../services/sucursalesSlice";

import { AppDispatch, RootState } from "@/lib/store/store";
import showAlert from "@/lib/utils/alerts";
import { useState } from "react";
import { objectToFormData } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/utils/formStructure"; 
import { cleanArrays } from "../../services/formStructure";
import Swal from "sweetalert2";
import { flatObject } from "../../utils/flatObject";

const customClassesSuccess = {
  container: "swal2-container",
  popup: "swal-popup-succes",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const customClassesError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};
const FormButtons = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const token = Cookies.get("auth-token") || "";
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmitForms,
    isFormComplete,
    currentSucursal,
    keyConfig,
  } = useSucursalForm();

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        await onAddSucursal();
        break;
      case "edit":
        await onEditSucursal();
        break;
      default:
        break;
    }
  };

 const onAddSucursal = async () => {
  const result = await handleSubmitForms();

  if (!result?.isValid) {
    console.error("Errores en los formularios:", result.errors);
    return;
  }

  try {
    setIsLoading(true);

    // 👇 Aquí preparamos el cuerpo combinado
  const combinedObject = {
    ...result.values.infoGeneral, // Campos planos
    DomicilioFiscal: result.values.domicilioFiscal, // Campos anidados
    DomicilioParticular: result.values.domicilioParticular, // Campos anidados
  };

  const cleanBody = cleanArrays(combinedObject, keyConfig, mode);

  // 🔁 Aplanamos solo las claves anidadas para que funcionen en FormData
  const flattened = flatObject(cleanBody); // usa la función que te pasé antes

  const formData = objectToFormData(flattened)

    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });

    const resultAction = await dispatch(
      sucursalActions.createSucursal({ token, formData })
    );

    if (sucursalActions.createSucursal.rejected.match(resultAction)) {
      throw resultAction.payload;
    }

    // Show success message
    Swal.fire({
      title: "¡ÉXITO!",
      text: resultAction.payload.message,
      icon: "success",
      confirmButtonText: "Cerrar",
      customClass: customClassesSuccess,
    });

    // Redirect
    router.push(
      "/configuracion/configuracion-empresa/informacion-empresa/sucursales/"
    );
  } catch (error: any) {
    console.error("🚀 ~ onAddSucursal ~ error:", error);
    Swal.fire({
      title: "¡Error!",
      text: error?.message || "Ocurrió un error al crear la sucursal.",
      icon: "error",
      confirmButtonText: "Volver a intentar",
      customClass: customClassesError,
    });
  } finally {
    setIsLoading(false);
  }
};

const onEditSucursal = async () => {
  const result = await handleSubmitForms();

  if (!result?.isValid) {
    console.error("Errores en los formularios:", result.errors);
    return;
  }

  try {
    setIsLoading(true);

    const combinedObject = {
      ...result.values.infoGeneral,
      DomicilioFiscal: result.values.domicilioFiscal,
      DomicilioParticular: result.values.domicilioParticular,
    };

    if (!keyConfig || typeof keyConfig !== "object") {
      console.error("❌ keyConfig no está disponible:", keyConfig);
      throw new Error("La configuración de claves no está cargada correctamente.");
    }

    if (!combinedObject || typeof combinedObject !== "object") {
      console.error("❌ combinedObject inválido:", combinedObject);
      throw new Error("Los datos del formulario no son válidos.");
    }

    const cleanBody = cleanArrays(combinedObject, keyConfig, mode);

    // ✅ Agregar el campo Id explícitamente para el edit
    cleanBody.id = id; // Este es el ID requerido por la API

    const flattened = flatObject(cleanBody);
    const formData = objectToFormData(flattened);


    const resultAction = await dispatch(
      sucursalActions.updateSucursal({ token, id: id!, formData })
    );

    if (sucursalActions.updateSucursal.rejected.match(resultAction)) {
      throw resultAction.payload;
    }

    Swal.fire({
      title: "¡ÉXITO!",
      text: resultAction.payload.message,
      icon: "success",
      confirmButtonText: "Cerrar",
      customClass: customClassesSuccess,
    });

    router.push(
      "/configuracion/configuracion-empresa/informacion-empresa/sucursales"
    );
  } catch (error: any) {
    console.error("🚀 ~ onEditSucursal ~ error:", error);
    Swal.fire({
      title: "¡Error!",
      text: error?.message || "Ocurrió un error al editar la sucursal.",
      icon: "error",
      confirmButtonText: "Volver a intentar",
      customClass: customClassesError,
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-36"
          onClick={() =>
            router.push(
              "/configuracion/configuracion-empresa/informacion-empresa/sucursales"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>

        {mode === "view" && (
          <Link
            href={`/configuracion/configuracion-empresa/informacion-empresa/sucursales/form?mode=edit&id=${currentSucursal?.id}`}
          >
            <Button type="button" variant="default" className="w-full sm:w-36">
              Ir a actualizar
            </Button>
          </Link>
        )}

        {(mode === "new" || mode === "edit") && (
          <Button
            type="button"
            variant="default"
            className="min-w-36"
            onClick={onHandleSubmit}
            disabled={isLoading || !isFormComplete}
            loading={isLoading}
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormButtons;

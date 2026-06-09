"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { useZonasForm } from "./ZonasContext";

import { zonasActions } from "../../services/zonasSlice";
import { AppDispatch, RootState } from "@/lib/store/store";

const updateClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Zonas.Actualizar";

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
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const { handleSubmitForms, currentZona, isFormComplete } = useZonasForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isLoading = useSelector((state: RootState) => state.zonas.loading);

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddZona();
        break;
      case "edit":
        onEditZona();
        break;
      default:
        break;
    }
  };

  const onAddZona = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to create the area
      const resultAction = await dispatch(
        zonasActions.createZona({
          token,
          zona: body,
        })
      );
      if (zonasActions.createZona.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      Swal.fire({
        title: "¡Éxito!",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
        confirmButtonText: "Aceptar",
      });

      // Redirect to the list of return concepts
      router.push(
        "/configuracion/configuracion-modulos/generales/catalogos/zonas"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddZona ~ error:", error);
      let errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Error al crear la zona";
      if (
        errorMsg === "Failed to fetch" ||
        errorMsg === "NetworkError when attempting to fetch resource." ||
        errorMsg === "Network Error"
      ) {
        errorMsg = "No se pudo actuaalizar el registro de Zonas";
      }

      Swal.fire({
        title: "¡Error!",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };

  const onEditZona = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to update the area
      const resultAction = await dispatch(
        zonasActions.updateZona({
          token,
          id,
          zona: body,
        })
      );
      if (zonasActions.updateZona.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      Swal.fire({
        title: "¡Éxito!",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
        confirmButtonText: "Aceptar",
      });

      // Redirect to the list of return concepts
      router.push(
        "/configuracion/configuracion-modulos/generales/catalogos/zonas"
      );
    } catch (error: any) {
      let errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Error al crear la zona";
      if (
        errorMsg === "Failed to fetch" ||
        errorMsg === "NetworkError when attempting to fetch resource." ||
        errorMsg === "Network Error"
      ) {
        errorMsg = "No se pudo actuaalizar el registro de Zonas";
      }

      Swal.fire({
        title: "¡Error!",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
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
              "/configuracion/configuracion-modulos/generales/catalogos/zonas"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-modulos/generales/catalogos/zonas/form?mode=edit&id=${currentZona?.id}`}
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
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormButtons;

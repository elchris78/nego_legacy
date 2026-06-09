"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { useEmpaquesContextForm } from "./EmpaquesContext";

import { empaquesActions } from "../../services/empaquesSlice";
import { AppDispatch, RootState } from "@/lib/store/store";

const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Empaques.Actualizar";

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

  const { handleSubmitForms, isFormComplete } = useEmpaquesContextForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isLoading = useSelector((state: RootState) => state.empaques.loading);

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddEmpaque();
        break;
      case "edit":
        onEditEmpaque();
        break;
      default:
        break;
    }
  };

  const onAddEmpaque = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to create the area
      const resultAction = await dispatch(
        empaquesActions.createEmpaque({
          token,
          empaque: body,
        })
      );
      if (empaquesActions.createEmpaque.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      Swal.fire({
        title: "Éxito",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
        confirmButtonText: "Aceptar",
      });

      // Redirect to the list of return concepts
      router.push(
        "/configuracion/configuracion-modulos/almacenes/catalogos/empaques"
      );
    } catch (error: any) {
      console.error("Error al agregar el empaque:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };

  const onEditEmpaque = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to update the area
      const resultAction = await dispatch(
        empaquesActions.updateEmpaque({
          token,
          id,
          empaque: body,
        })
      );
      if (empaquesActions.updateEmpaque.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      Swal.fire({
        title: "Éxito",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
        confirmButtonText: "Aceptar",
      });

      // Redirect to the list of return concepts
      router.push(
        "/configuracion/configuracion-modulos/almacenes/catalogos/empaques"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditEmpaque ~ error:", error);

      Swal.fire({
        title: "Error",
        text: error?.message,
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
              "/configuracion/configuracion-modulos/almacenes/catalogos/empaques"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-modulos/almacenes/catalogos/empaques/form?mode=edit&id=${id}`}
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

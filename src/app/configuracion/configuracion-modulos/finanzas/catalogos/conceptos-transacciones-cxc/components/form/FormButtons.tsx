"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { useTransaccionesDXCForm } from "./TransaccionesDXCContext";

import { transaccionesDXCActions } from "../../services/transaccionesDXCSlice";
import { AppDispatch, RootState } from "@/lib/store/store";

const updateClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos transacciones CXC.Actualizar"; 

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

  const { handleSubmitForms, isFormComplete } = useTransaccionesDXCForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isLoading = useSelector(
    (state: RootState) => state.transaccionesDXC.loading
  );

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddTransaccionesDXC();
        break;
      case "edit":
        onEditTransaccionesDXC();
        break;
      default:
        break;
    }
  };

  const onAddTransaccionesDXC = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to create the area
      const resultAction = await dispatch(
        transaccionesDXCActions.createTransaccionesDXC({
          token,
          transaccionesDXC: body,
        })
      );
      if (transaccionesDXCActions.createTransaccionesDXC.rejected.match(resultAction)) {
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
        "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddTransaccionesDXC ~ error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };

  const onEditTransaccionesDXC = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to update the area
      const resultAction = await dispatch(
        transaccionesDXCActions.updateTransaccionesDXC({
          token,
          id,
          transaccionesDXC: body,
        })
      );
      if (transaccionesDXCActions.updateTransaccionesDXC.rejected.match(resultAction)) {
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
        "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditTransaccionesDXCType ~ error:", error);

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
              "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc/form?mode=edit&id=${id}`}
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

"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { useSellersForm } from "./SellersContext";

import { sellersActions } from "../../services/sellersSlice";
import { AppDispatch, RootState } from "@/lib/store/store";

const updateClaim =
  "Configuración.Configuración de módulos.Ventas.Catálogos.Vendedores.Actualizar"; 

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

  const { handleSubmitForms, isFormComplete } = useSellersForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isLoading = useSelector(
    (state: RootState) => state.sellers.loading
  );

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddSellers();
        break;
      case "edit":
        onEditSellers();
        break;
      default:
        break;
    }
  };

  const onAddSellers = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to create the area
      const resultAction = await dispatch(
        sellersActions.createSellers({
          token,
          sellers: body,
        })
      );
      if (sellersActions.createSellers.rejected.match(resultAction)) {
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
        "/configuracion/configuracion-modulos/ventas/catalogos/vendedores"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddSellers ~ error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };

  const onEditSellers = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to update the area
      const resultAction = await dispatch(
        sellersActions.updateSellers({
          token,
          id,
          sellers: body,
        })
      );
      if (sellersActions.updateSellers.rejected.match(resultAction)) {
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
        "/configuracion/configuracion-modulos/ventas/catalogos/vendedores"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditSellersType ~ error:", error);

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
              "/configuracion/configuracion-modulos/ventas/catalogos/vendedores"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-modulos/ventas/catalogos/vendedores/form?mode=edit&id=${id}`}
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

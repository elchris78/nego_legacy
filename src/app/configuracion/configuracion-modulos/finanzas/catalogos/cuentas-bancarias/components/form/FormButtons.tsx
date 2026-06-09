"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCuentaBancariaContext } from "./CuentaBancariaFormContext";
import showAlert from "@/lib/utils/alerts";

import { cuentasBancariasActions } from "../../services/cuentasBancariasSlice";
import { AppDispatch, RootState } from "@/lib/store/store";

const updateClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Cuentas bancarias.Actualizar";

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

  const { handleSubmitForms, isFormComplete } = useCuentaBancariaContext();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isLoading = useSelector(
    (state: RootState) => state.cuentasBancarias.pending
  );

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddCuentaBancaria();
        break;
      case "edit":
        onEditCuentaBancaria();
        break;
      default:
        break;
    }
  };

  const onAddCuentaBancaria = async () => {
    if (!isFormComplete) return;
    try {
      const resp = await handleSubmitForms();
      if (resp === undefined) return;
      const body = resp.values;

      // Call the API to create the area
      const resultAction = await dispatch(
        cuentasBancariasActions.createCuentaBancaria({
          token,
          body,
        })
      );
      if (
        cuentasBancariasActions.createCuentaBancaria.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      // Show success message
      showAlert({
        success: true,
        message: resultAction.payload.message,
      });

      // Redirect to the list of return concepts
      router.push(
        "/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddCuentaBancaria ~ error:", error);

      showAlert({
        success: false,
        message: error?.message || "Error al agregar la cuenta bancaria",
      });
    }
  };

  const onEditCuentaBancaria = async () => {
    if (!isFormComplete) return;
    try {
      const resp = await handleSubmitForms();
      if (resp === undefined) return;
      const body = resp.values;

      // Call the API to update the area
      const resultAction = await dispatch(
        cuentasBancariasActions.updateCuentaBancaria({
          token,
          id,
          body,
        })
      );
      if (
        cuentasBancariasActions.updateCuentaBancaria.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      // Show success message
      showAlert({
        success: true,
        message: resultAction.payload.message,
      });

      // Redirect to the list of return concepts
      router.push(
        "/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditCuentaBancaria ~ error:", error);

      showAlert({
        success: false,
        message: error?.message || "Error al editar la cuenta bancaria",
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
              "/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias/form?mode=edit&id=${id}`}
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
            disabled={!isFormComplete}
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

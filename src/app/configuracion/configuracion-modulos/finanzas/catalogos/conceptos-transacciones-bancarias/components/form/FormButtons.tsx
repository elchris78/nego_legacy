"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useConceptosTransaccionesBancariasContext } from "./ConceptosTransaccionesBancariasFormContext";
import showAlert from "@/lib/utils/alerts";

import { conceptosTransaccionesBancariasActions } from "../../services/conceptosTransaccionesBancariasSlice";
import { AppDispatch, RootState } from "@/lib/store/store";

const updateClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos de transacciónes bancarias.Actualizar";

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

  const { handleSubmitForms, isFormComplete } =
    useConceptosTransaccionesBancariasContext();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isPending = useSelector(
    (state: RootState) => state.conceptosTransaccionesBancarias.pending
  );

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddConceptoTransaccionBancaria();
        break;
      case "edit":
        onEditConceptoTransaccionBancaria();
        break;
      default:
        break;
    }
  };

  const onAddConceptoTransaccionBancaria = async () => {
    if (!isFormComplete) return;
    try {
      const resp = await handleSubmitForms();
      if (resp === undefined) return;
      const body = resp.values;

      // Call the API to create the area
      const resultAction = await dispatch(
        conceptosTransaccionesBancariasActions.createConceptoTransaccionBancaria(
          {
            token,
            body,
          }
        )
      );
      if (
        conceptosTransaccionesBancariasActions.createConceptoTransaccionBancaria.rejected.match(
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
        "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddConceptoTransaccionBancaria ~ error:", error);

      showAlert({
        success: false,
        message:
          error?.message ||
          "Error al agregar el concepto de transacción bancaria",
      });
    }
  };

  const onEditConceptoTransaccionBancaria = async () => {
    if (!isFormComplete) return;
    try {
      const resp = await handleSubmitForms();
      if (resp === undefined) return;
      const body = resp.values;

      // Call the API to update the area
      const resultAction = await dispatch(
        conceptosTransaccionesBancariasActions.updateConceptoTransaccionBancaria(
          {
            token,
            id: id!,
            body,
          }
        )
      );
      if (
        conceptosTransaccionesBancariasActions.updateConceptoTransaccionBancaria.rejected.match(
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
        "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditConceptoTransaccionBancaria ~ error:", error);

      showAlert({
        success: false,
        message:
          error?.message ||
          "Error al editar el concepto de transacción bancaria",
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
              "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias"
            )
          }
          disabled={isPending}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias/form?mode=edit&id=${id}`}
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
            loading={isPending}
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormButtons;

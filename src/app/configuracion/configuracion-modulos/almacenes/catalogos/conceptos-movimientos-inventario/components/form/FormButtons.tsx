"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useMovimientoInventarioContext } from "./MovimientoInventarioFormContext";
import showAlert from "@/lib/utils/alerts";

import { movimientosInventarioActions } from "../../services/movimientosInventariosSlice";
import { AppDispatch, RootState } from "@/lib/store/store";

const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Conceptos de movimientos al inventario.Actualizar";

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
    useMovimientoInventarioContext();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isLoading = useSelector(
    (state: RootState) => state.movimientosInventario.pending
  );

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddMovimiento();
        break;
      case "edit":
        onEditMovimiento();
        break;
      default:
        break;
    }
  };

  const onAddMovimiento = async () => {
    if (!isFormComplete) return;
    try {
      const resp = await handleSubmitForms();
      if (resp === undefined) return;
      const body = resp.values;

      // Call the API to create the area
      const resultAction = await dispatch(
        movimientosInventarioActions.createMovimientoInventario({
          token,
          body,
        })
      );
      if (
        movimientosInventarioActions.createMovimientoInventario.rejected.match(
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
        "/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddMovimiento ~ error:", error);

      showAlert({
        success: false,
        message: error?.message || "Error al agregar el movimiento",
      });
    }
  };

  const onEditMovimiento = async () => {
    if (!isFormComplete) return;
    try {
      const resp = await handleSubmitForms();
      if (resp === undefined) return;
      const body = resp.values;

      // Call the API to update the area
      const resultAction = await dispatch(
        movimientosInventarioActions.updateMovimientoInventario({
          token,
          id,
          body,
        })
      );
      if (
        movimientosInventarioActions.updateMovimientoInventario.rejected.match(
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
        "/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditMovimiento ~ error:", error);

      showAlert({
        success: false,
        message: error?.message || "Error al editar el movimiento",
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
              "/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario/form?mode=edit&id=${id}`}
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

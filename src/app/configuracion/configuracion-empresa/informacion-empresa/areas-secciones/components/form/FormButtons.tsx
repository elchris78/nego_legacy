import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { useAreaForm } from "./AreaFormContext";
import { areasActions } from "../../services/areasSlice";

import { AppDispatch, RootState } from "@/lib/store/store";
import Swal from "sweetalert2";

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

const updateClaim =
  "Configuración.Configuración empresa.Información de la empresa.Áreas / Secciones.Actualizar";

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

  const { handleSubmitForms, currentArea, isFormComplete } = useAreaForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isLoading = useSelector((state: RootState) => state.areas.loading);

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddArea();
        break;
      case "edit":
        onEditArea();
        break;
      default:
        break;
    }
  };

  const onAddArea = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to create the area
      const resultAction = await dispatch(
        areasActions.createArea({ token, area: body })
      );

      if (areasActions.createArea.rejected.match(resultAction)) {
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

      // redirect to the areas list page
      router.push(
        "/configuracion/configuracion-empresa/informacion-empresa/areas-secciones"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddArea ~ error:", error);

      // Show error message
      Swal.fire({
        title: "¡Error!",
        text: error?.message,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };

  const onEditArea = async () => {
    if (!isFormComplete) return;
    try {
      // setIsLoading(true);
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to update the area
      const resultAction = await dispatch(
        areasActions.updateArea({ token, id: id!, area: body })
      );

      if (areasActions.updateArea.rejected.match(resultAction)) {
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

      // redirect to the areas list page
      router.push(
        "/configuracion/configuracion-empresa/informacion-empresa/areas-secciones"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditArea ~ error:", error);

      // Show error message
      Swal.fire({
        title: "¡Error!",
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
              "/configuracion/configuracion-empresa/informacion-empresa/areas-secciones"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/form?id=${id}&mode=edit`}
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

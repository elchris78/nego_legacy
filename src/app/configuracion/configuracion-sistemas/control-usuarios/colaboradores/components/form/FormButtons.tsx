import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { useColaboradorFormContext } from "./ColaboradorFormContext";
import { colaboradoresActions } from "../../services/colaboradoresSlice";

import { AppDispatch, RootState } from "@/lib/store/store";
import Swal from "sweetalert2";
import { cleanArrays, objectToFormData } from "../../utils/formStructure";

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
  "Configuración.Configuración del sistema.Usuarios.Colaboradores.Actualizar";

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

  const { handleSubmitForms, isFormComplete, activeTab, keyConfig } =
    useColaboradorFormContext();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const isLoading = useSelector(
    (state: RootState) => state.colaboradores.isPending
  );

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddColaborador();
        break;
      case "edit":
        onEditColaborador();
        break;
      default:
        break;
    }
  };

  const onAddColaborador = async () => {
    const result = await handleSubmitForms();
    if (!result.isValid) {
      console.error("Errores en los formularios:", result.errors);
      return;
    }

    const cleanBody = cleanArrays(result.values, keyConfig, mode); // Limpia los arrays vacíos y organiza el objeto
    const formData = objectToFormData(cleanBody); // Convierte el objeto a FormData

    // Imprimir fdormData para depuración
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      // Call the API to create the colaborador
      const resultAction = await dispatch(
        colaboradoresActions.createColaborador({ token, formData })
      );

      if (colaboradoresActions.createColaborador.rejected.match(resultAction)) {
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
        "/configuracion/configuracion-sistemas/control-usuarios/colaboradores"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddColaborador ~ error:", error);
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

  const onEditColaborador = async () => {
    const result = await handleSubmitForms();
    if (!result.isValid) {
      console.error("Errores en los formularios:", result.errors);
      return;
    }

    const cleanBody = cleanArrays(result.values, keyConfig, mode); // Limpia los arrays vacíos y organiza el objeto
    const formData = objectToFormData(cleanBody); // Convierte el objeto a FormData

    // Imprimir fdormData para depuración
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      // Call the API to update the area
      const resultAction = await dispatch(
        colaboradoresActions.updateColaborador({ token, id: id!, formData })
      );

      if (colaboradoresActions.updateColaborador.rejected.match(resultAction)) {
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
        "/configuracion/configuracion-sistemas/control-usuarios/colaboradores"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditColaborador ~ error:", error);
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

  if (activeTab === 5) return null; //* Ocultar los botones si estamos en la pestaña de Documentación Adicional

  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-36"
          onClick={() =>
            router.push(
              "/configuracion/configuracion-sistemas/control-usuarios/colaboradores"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-sistemas/control-usuarios/colaboradores/form?id=${id}&mode=edit`}
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
            // disabled={!isFormComplete}
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

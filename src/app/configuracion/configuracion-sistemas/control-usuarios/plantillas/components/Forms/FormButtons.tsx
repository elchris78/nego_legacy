import {
  fetchCreatePlantilla,
  fetchEditPlantilla,
} from "../../services/plantillasActions";
import { Button } from "@/ui/button";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { ToastSuccessMsg } from "@/components/ui/Toast/ToastSuccessMsg";
import { usePlantillaForm } from "./PlantillaFormContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Link from "next/link";
 
export const FormButtons = () => {
  const { handleSubmitForms, currentPlantilla, isFormIncomplete } = usePlantillaForm();

  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddPlantilla();
        break;
      case "edit":
        onEditPlantilla();
        break;
      default:
        break;
    }
  };

  const onAddPlantilla = async () => {
    if (isFormIncomplete) return;
    try {
      setIsLoading(true);
  
      const body = await handleSubmitForms();
      if (body === undefined) return;
  
      const resp = await fetchCreatePlantilla({
        token,
        body,
      });
  
      if (resp !== undefined && resp.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: "Se ha creado la plantilla de forma exitosa",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
        router.push("/configuracion/configuracion-sistemas/control-usuarios/plantillas");
      } else {
        throw new Error(resp?.message || "No se pudo guardar la plantilla.");
      }
    } catch (error: any) {
      let errorMsg = "No se pudo guardar la plantilla de forma exitosa"; 
  
      if (error.message === "Failed to fetch" || error.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo guardar la plantilla de forma exitosa";
      } else {
        errorMsg = error?.message || errorMsg;
      }
  
      Swal.fire({
        title: "¡ERROR!",
        text: errorMsg || "No se pudo guardar la plantilla de forma exitosa",
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-error',
          confirmButton: 'swal-confirm-button',
          title: 'swal-title',
        }
      });
  
      console.error("🚀 ~ onAddPlantilla ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const onEditPlantilla = async () => {
    if (isFormIncomplete) return;
    try {
      setIsLoading(true);
  
      const body = await handleSubmitForms();
      if (body === undefined) return;
  
      const resp = await fetchEditPlantilla({
        id,
        token,
        body,
      });
  
      if (resp !== undefined && resp.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: "Se ha actualizado la plantilla de forma exitosa",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
        router.push(
          "/configuracion/configuracion-sistemas/control-usuarios/plantillas"
        );
      }
    } catch (error: any) {
      let errorMsg = "No se pudo actualizar la plantilla de forma exitosa";
  
      // Manejo de errores de conexión
      if (error.message === "Failed to fetch" || error.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo actualizar la plantilla de forma exitosa";
      } else {
        errorMsg = error?.message || errorMsg;
      }
  
      Swal.fire({
        title: "¡ERROR!",
        text: errorMsg ||  "No se pudo actualizar la plantilla de forma exitosa",
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-error',
          confirmButton: 'swal-confirm-button',
          title: 'swal-title',
        }
      });
  
      console.error("🚀 ~ onEditPlantilla ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // console.log("que chucas es esto", currentPlantilla)

  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-36"
          onClick={() =>
            router.push(
              "/configuracion/configuracion-sistemas/control-usuarios/plantillas"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {(mode === "new" || mode === "edit") && (
          <Button
            type="button"
            variant="default"
            className="min-w-36"
            onClick={onHandleSubmit}
            disabled={isLoading || isFormIncomplete}
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        )}
        {mode === "view" && currentPlantilla.roleTemplateType === 'Exclusiva' && (
          <Button
            type="button"
            variant={"default"}
            className="min-w-36"
            disabled={isLoading || isFormIncomplete}
          >
            <Link
              href={
                `/configuracion/configuracion-sistemas/control-usuarios/plantillas/form?mode=edit&id=${id}`
              }
            >
              Ir a actualizar
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { usePresentacionesForm } from "./PresentacionesFormContext"; 
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { createPresentaciones, updatePresentaciones } from "../../services/presentacionesAction"; 
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const FormButtons = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = Cookies.get("auth-token") || "";
  const { handleSubmitForms, currentPresentaciones, isFormComplete } = usePresentacionesForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const claims = useSelector((state: RootState) => state.claims.data);

  const [isLoading, setIsLoading] = useState(false);

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddPresentaciones();
        break;
      case "edit":
        onEditPresentaciones();
        break;
      default:
        break;
    }
  };

  const onAddPresentaciones = async () => {
    if (!isFormComplete) return;
  
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onAddPresentaciones ~ body:", body);
  
      const resp = await createPresentaciones({ token, body });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "Presentaciones creado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones");
      }
    } catch (error: any) {
      let errorMsg = "Ocurrió un error al crear el puesto.";
  
      if (error?.message === "Failed to fetch" || error?.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo crear el Puesto de forma exitosa por un problema de red.";
      } else if (error?.message) {
        errorMsg = error.message;
      }
  
      Swal.fire({
        title: '¡ERROR!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-error',
          confirmButton: 'swal-confirm-button',
          title: 'swal-title',
        },
      });
  
      console.error("🚀 ~ onAddPresentaciones ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const onEditPresentaciones = async () => {
    if (!isFormComplete) return;
  
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onEditPresentaciones ~ body:", body);
  
      const resp = await updatePresentaciones({ token, body, id });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "Presentaciones actualizado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones");
      } else {
        Swal.fire({
          title: '¡ERROR!',
          text: resp?.message || "Ocurrió un error al actualizar el puesto.",
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-error',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          },
        });
      }
    } catch (error: any) {
      let errorMsg = "Ocurrió un error al actualizar el puesto.";
  
      if (error?.message === "Failed to fetch" || error?.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo actualizar el Puesto por un problema de red.";
      } else if (error?.message) {
        errorMsg = error.message;
      }
  
      Swal.fire({
        title: '¡ERROR!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-error',
          confirmButton: 'swal-confirm-button',
          title: 'swal-title',
        },
      });
  
      console.error("🚀 ~ onEditPresentaciones ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
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
              "/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones"
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
            disabled={isLoading || !isFormComplete} 
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        )}
        {mode === "view"  && hasClaim("Configuración.Configuración de módulos.Almacenes.Catálogos.Presentaciones.Actualizar") && (
          <Button
            type="button"
            variant={"default"}
            className="min-w-36"
            disabled={isLoading}
          > 
            <Link
              href={
                `/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones/form?mode=edit&id=${id}`
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

export default FormButtons;

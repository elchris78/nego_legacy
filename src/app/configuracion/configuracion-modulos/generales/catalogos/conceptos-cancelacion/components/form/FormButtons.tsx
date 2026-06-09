"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCancelacionConceptForm } from "./CancelacionContext";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { updateCancelConcepts, createCancelConcepts } from "../../services/conceptosCancelAction";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const FormButtons = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = Cookies.get("auth-token") || "";
  const { handleSubmitForms, isFormComplete } =
    useCancelacionConceptForm();


  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const claims = useSelector((state: RootState) => state.claims.data);

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddReturnConcept();
        break;
      case "edit":
        onEditReturnConcept();
        break;
      default:
        break;
    }
  };

  const onAddReturnConcept = async () => {
    // if (!isFormComplete) return;
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onAddReturnConcept ~ body:", body);
  
      const resp = await createCancelConcepts({ token, body });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "Concepto de cancelación creado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion");
      } else {
        Swal.fire({
          title: '¡ERROR!',
          text: resp?.message || "Ocurrió un error al crear el concepto.",
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
      let errorMsg = "Ocurrió un error al crear el concepto.";
  
      if (error?.message === "Failed to fetch" || error?.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo crear el concepto por un problema de red.";
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
  
      console.error("🚀 ~ onAddReturnConcept ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onEditReturnConcept = async () => {
    // if (!isFormComplete) return;
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onEditReturnConcept ~ body:", body);
  
      const resp = await updateCancelConcepts({ token, body, id });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "Concepto de cancelación actualizado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion");
      } else {
        Swal.fire({
          title: '¡ERROR!',
          text: resp?.message || "Ocurrió un error al actualizar el concepto.",
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
      let errorMsg = "Ocurrió un error al actualizar el concepto.";
  
      if (error?.message === "Failed to fetch" || error?.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo actualizar el concepto por un problema de red.";
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
  
      console.error("🚀 ~ onEditReturnConcept ~ error:", error);
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
              "/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim("Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Cancelación.Actualizar") && (
          <Link 
            href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion/form?mode=edit&id=${id}`}
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
            disabled={isLoading} 
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormButtons;

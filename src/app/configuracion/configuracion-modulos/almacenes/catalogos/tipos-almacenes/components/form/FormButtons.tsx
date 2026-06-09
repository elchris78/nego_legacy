"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useTypesWarehousesForm } from "./TypesWarehousesFormContext"; 
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { createTypesWarehouses, updateTypesWarehouses } from "../../services/typesWarehousesAction";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const FormButtons = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = Cookies.get("auth-token") || "";
  const { handleSubmitForms, currentTypesWarehouses, isFormComplete } = useTypesWarehousesForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const claims = useSelector((state: RootState) => state.claims.data);

  const [isLoading, setIsLoading] = useState(false);

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddTypesWarehouses();
        break;
      case "edit":
        onEditTypesWarehouses();
        break;
      default:
        break;
    }
  };

  const onAddTypesWarehouses = async () => {
    if (!isFormComplete) return;
  
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onAddTypesWarehouses ~ body:", body);
  
      const resp = await createTypesWarehouses({ token, body });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "TypesWarehouses creado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes");
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
  
      console.error("🚀 ~ onAddTypesWarehouses ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const onEditTypesWarehouses = async () => {
    if (!isFormComplete) return;
  
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onEditTypesWarehouses ~ body:", body);
  
      const resp = await updateTypesWarehouses({ token, body, id });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "TypesWarehouses actualizado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes");
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
  
      console.error("🚀 ~ onEditEstatusProd ~ error:", error);
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
              "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes"
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
        {mode === "view"  && hasClaim("Configuración.Configuración de módulos.Almacenes.Catálogos.Tipo de almacén.Actualizar") && (
          <Button
            type="button"
            variant={"default"}
            className="min-w-36"
            disabled={isLoading}
          > 
            <Link
              href={
                `/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes/form?mode=edit&id=${id}`
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

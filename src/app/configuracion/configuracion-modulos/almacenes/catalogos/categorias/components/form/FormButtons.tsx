"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCategoriesForm } from "./CategoriesFormContext"; 
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { createCategories, createSubCategories, updateCategories } from "../../services/categoriesAction"; 
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const FormButtons = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = Cookies.get("auth-token") || "";
  const { handleSubmitForms, currentCategories, isFormComplete } = useCategoriesForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const parentId = searchParams.get("id");

  const claims = useSelector((state: RootState) => state.claims.data);

  const [isLoading, setIsLoading] = useState(false);

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddCategories();
        break;
      case "edit":
        onEditCategories();
        break;
      case "newsubcat":
        onAddSubCategories();
        break;
      case "editsubcat":
        onEditCategories();
        break;
      default:
        break;
    }
  };

  const onAddCategories = async () => {
    if (!isFormComplete) return;
  
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onAddCategories ~ body:", body);
  
      const resp = await createCategories({ token, body });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "Categories creado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/almacenes/catalogos/categorias");
      }
    } catch (error: any) {
      let errorMsg = "Ocurrió un error al crear el puesto.";
  
      if (error?.message === "Failed to fetch" || error?.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo crear el Categories de forma exitosa por un problema de red.";
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
  
      console.error("🚀 ~ onAddCategories ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddSubCategories = async () => {
    if (!isFormComplete) return;
  
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onAddCategories ~ body:", body);
  
      const resp = await createSubCategories({ token, parentId, body });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "Categories creado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/almacenes/catalogos/categorias");
      }
    } catch (error: any) {
      let errorMsg = "Ocurrió un error al crear el puesto.";
  
      if (error?.message === "Failed to fetch" || error?.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo crear el Categories de forma exitosa por un problema de red.";
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
  
      console.error("🚀 ~ onAddCategories ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const onEditCategories = async () => {
    if (!isFormComplete) return;
  
    setIsLoading(true);
  
    try {
      const body = await handleSubmitForms();
      if (!body) return;
  
      console.log("🚀 ~ onEditCategories ~ body:", body);
  
      const resp = await updateCategories({ token, body, id });
  
      if (resp?.success) {
        Swal.fire({
          title: '¡ÉXITO!',
          text: resp.message || "Categories actualizado exitosamente",
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
  
        router.push("/configuracion/configuracion-modulos/almacenes/catalogos/categorias");
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
  
      console.error("🚀 ~ onEditCategories ~ error:", error);
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
              "/configuracion/configuracion-modulos/almacenes/catalogos/categorias"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {(mode === "new" || mode === "edit" || mode === "newsubcat" || mode === "editsubcat") && (
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
        {(mode === "view" || mode === "viewsubcat") &&
          hasClaim("Configuración.Configuración de módulos.Almacenes.Catálogos.Categorías.Actualizar") && (
            <Button
              type="button"
              variant="default"
              className="min-w-36"
              disabled={isLoading}
            >
              <Link
                href={`/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=${
                  mode === "viewsubcat" ? "editsubcat" : "edit"
                }&id=${id}`}
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

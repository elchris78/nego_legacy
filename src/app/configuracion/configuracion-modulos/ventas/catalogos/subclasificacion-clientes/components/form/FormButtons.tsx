"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useClientSubclassifications } from "./ClientSubclassificationsContext";
import { useDispatch } from "react-redux";
import { createClientSubclassification, updateClientSubclassification } from "../../services/clientsSubclassificationSlice";
import { AppDispatch } from "@/lib/store/store";
import Cookies from "js-cookie";
import showAlert from "@/lib/utils/alerts";

const FormButtons = () => {
  // router
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = Number(searchParams.get("id"));

  // Cookies
  const token = Cookies.get("auth-token") || "";

  // redux
  const dispatch = useDispatch<AppDispatch>()




  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmitForms, currentClientSubclassification, isFormComplete } =
    useClientSubclassifications();



  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddClientSubclassification();
        break;
      case "edit":
        onEditClientSubclassification();
        break;
      default:
        break;
    }
  };

  const onAddClientSubclassification = async () => {
    if (!isFormComplete) return;
    try {
      setIsLoading(true);
      const body = await handleSubmitForms();
      if (body === undefined) return;
      // Call the API to create the area
      await dispatch(
        createClientSubclassification({
          token,
          request: body
        })
      ).unwrap()
      setIsLoading(false);

      showAlert({
        success: true, message: "La Subclasificación de cliente ha sido registrada exitosamente.",
        onClose: () => {
          router.push("/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes")
        },
      })
    } catch (error) {
      setIsLoading(false);
      showAlert({ success: false, message: `No se pudo agregar la nueva Subclasificación de Cliente.` })
    }
  };

  const onEditClientSubclassification = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;
      // Call the API to update the area
      await dispatch(
        updateClientSubclassification({
          id,
          token,
          request: {
            nombre: body.nombre,
            descripcion: body.descripcion,
            estatus: body.estatus === "true" ? true : false
          }
        })
      ).unwrap()
      setIsLoading(false);

      showAlert({
        success: true, message: "La Subclasificación de cliente ha sido actualizada exitosamente.",
        onClose: () => {
          router.push("/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes")
        },
      })
    } catch (error) {
      showAlert({ success: false, message: `No se pudo actualizar el registro de Subclasificación de Cliente.` })
      setIsLoading(false);
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
              "/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && (
          <Link
            href={`/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes/form?mode=edit&id=${currentClientSubclassification?.id}`}
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

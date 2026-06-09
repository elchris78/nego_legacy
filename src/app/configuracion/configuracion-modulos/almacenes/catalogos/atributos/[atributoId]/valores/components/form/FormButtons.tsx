"use client";

import { useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAttributes } from "./AttributesContext";
import { useDispatch } from "react-redux";
import { createAttribute, updateAttribute } from "../../services/AttributeValueSlice";
import { AppDispatch } from "@/lib/store/store";
import Cookies from "js-cookie";
import showAlert from "@/lib/utils/alerts";

const FormButtons = () => {
  // router
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = (searchParams.get("id"));
  const { atributoId } = useParams() as { atributoId: string }; // Atributo ID (Pre valores) desde URL params
  // Cookies
  const token = Cookies.get("auth-token") || "";

  // redux
  const dispatch = useDispatch<AppDispatch>()

  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmitForms, currentAttribute, isFormComplete } =
    useAttributes();



  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddAttribute();
        break;
      case "edit":
        onEditAttribute();
        break;
      default:
        break;
    }
  };

  const onAddAttribute = async () => {
    if (!isFormComplete) return;
    try {
      setIsLoading(true);
      const body = await handleSubmitForms();
      if (body === undefined) return;
      // Call the API to create the area
      await dispatch(
        createAttribute({
          token,
          atributoId,
          request: {
            userProvidedId: body.userProvidedId ?? 'x',
            userProvidedPrefix: body.userProvidedPrefix ?? 'x',
            nombre: body.nombre,
            estatus: body.estatus === "true" ? true : false
          }
        })
      ).unwrap()
      setIsLoading(false);

      showAlert({
        success: true, message: "El Valor ha sido registrado exitosamente.",
        onClose: () => {
          router.push(`/configuracion/configuracion-modulos/almacenes/catalogos/atributos/${atributoId}/valores`)
        },
      })
    } catch (error) {
      setIsLoading(false);
      showAlert({ success: false, message: `${error}` })
    }
  };

  const onEditAttribute = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;
      // Call the API to update the area
      await dispatch(
        updateAttribute({
          atributoId,
          id: id || "",
          token,
          request: {
            nombre: body.nombre,
            estatus: body.estatus === "true" ? true : false
          }
        })
      ).unwrap()
      setIsLoading(false);

      showAlert({
        success: true, message: "El Valor ha sido actualizado exitosamente.",
        onClose: () => {
          router.push(`/configuracion/configuracion-modulos/almacenes/catalogos/atributos/${atributoId}/valores`)
        },
      })
    } catch (error) {
      showAlert({ success: false, message: `No se pudo actualizar el registro del Valor: ${error}` })
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
            router.push(`/configuracion/configuracion-modulos/almacenes/catalogos/atributos/${atributoId}/valores`)
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && (
          <Link
            href={`/configuracion/configuracion-modulos/almacenes/catalogos/atributos/${atributoId}/valores/form?mode=edit&id=${currentAttribute?.id}`}
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

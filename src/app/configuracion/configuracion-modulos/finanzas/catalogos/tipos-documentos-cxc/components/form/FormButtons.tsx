"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCXCs } from "./CXCContext";
import { useDispatch, useSelector } from "react-redux";
import { createCuentaPorCobrar, getCuentaPorCobrarById, updateCuentaPorCobrar } from "../../services/CXCSlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import Cookies from "js-cookie";
import showAlert from "@/lib/utils/alerts";
const updateClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Tipos de documentos CXC.Actualizar"; 

const FormButtons = () => {
  // router
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = (searchParams.get("id"));

  // Cookies
  const token = Cookies.get("auth-token") || "";

  // redux
  const dispatch = useDispatch<AppDispatch>()
  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmitForms, currentCXC, isFormComplete } =
  useCXCs();

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAdd();
        break;
      case "edit":
        onEdit();
        break;
      default:
        break;
    }
  };

  const onAdd = async () => {
    if (!isFormComplete) return;
    try {
      setIsLoading(true);
      const body = await handleSubmitForms();
      if (body === undefined) return;
      console.log("body", body);
      // Call the API to create the area
      const responseCreation = await dispatch(
        createCuentaPorCobrar({
          token,
          request: {
            userProvidedId: body.userProvidedId ?? 'x',
            userProvidedPrefix: body.userProvidedPrefix ?? 'x',
            tipoDocumento: body.tipoDocumento,
            estatus: body.estatus === "true" ? true : false
          }
        })
      ).unwrap()
      // try {
      //   await dispatch(getCuentaPorCobrarById({ token, request: { id: responseCreation.id } }));
      // } catch (error) {
      //   showAlert({success: false, message: `Ocurrió un error al recuperar la información. ${error}`})
      // }
      setIsLoading(false);

      showAlert({
        success: true, message: "El Tipo de documento de cuentas por cobrar ha sido registrado exitosamente.",
        onClose: () => {
          router.push(`/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc`)
        },
      })
    } catch (error) {
      setIsLoading(false);
      showAlert({ success: false, message: `${error}` })
    }
  };

  const onEdit = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;
      // Call the API to update item
      await dispatch(
        updateCuentaPorCobrar({
          id: id || "",
          token,
          request: {
            tipoDocumento: body.tipoDocumento,
            estatus: body.estatus === "true" ? true : false
          }
        })
      ).unwrap()
      setIsLoading(false);

      showAlert({
        success: true, message: "El Tipo de documento de cuentas por cobrar ha sido actualizado correctamente.",
        onClose: () => {
          router.push("/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc")
        },
      })
    } catch (error) {
      showAlert({ success: false, message: `No se pudo actualizar el registro del tipo de documento: ${error}` })
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
              "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && (
          <Link
            href={`/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc/form?mode=edit&id=${currentCXC?.id}`}
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

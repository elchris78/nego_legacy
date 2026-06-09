"use client";

import { useEffect } from "react";

import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

import { useKeyConfigurationForm } from "./KeyConfigurationContext";
import FormButtons from "./FormButtons";
import GeneralDataForm from "./GeneralDataForm";
import Loading from "@/components/ui/Modals/loading";
import TitleForm from "@/components/ui/Forms/TitleForm";

import { RootState } from "@/lib/store/store";

const labelPageMap: Record<string, string> = {
  new: "Crear nueva Definición de claves de catálogos",
  edit: "Editar datos de Definición de claves de catálogos",
  view: "Consultar datos de Definición de claves de catálogos",
};

const createClaim =
  "Configuración.Configuración del sistema.Definición de claves de catálogos.Crear";
const updateClaim =
  "Configuración.Configuración del sistema.Definición de claves de catálogos.Actualizar";

const KeyConfigurationFormComponents = () => {
  const { isLoadingKeyConfiguration } = useKeyConfigurationForm();

  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode");

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

   useEffect(() => {
     // Check if the user has the required claims
     if (
       (mode === "new" || mode === "edit") &&
       (!hasClaim(createClaim) || !hasClaim(updateClaim))
     ) {
       Swal.fire({
         icon: "error",
         title: "Acceso denegado",
         text: "No tienes permisos para crear o leer. Solicítalos con tu administrador.",
         confirmButtonText: "Entendido",
         customClass: {
           container: "swal2-container",
           popup: "swal-popup-error",
           confirmButton: "swal-confirm-button",
           title: "swal-title",
         },
       }).then(() => {
         router.push(
           "/configuracion/configuracion-sistemas/configuracion-claves"
         );
       });
     }
   }, []);

   if (isLoadingKeyConfiguration && !mode) return <Loading />;

  return (
    <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
      <div className="flex flex-col gap-8">
        <TitleForm label={labelPageMap[mode!]} />
        <GeneralDataForm />
      </div>
      <FormButtons />
    </section>
  );
};

export default KeyConfigurationFormComponents;

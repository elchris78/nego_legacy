 "use client";
 
 import { useEffect, useState } from "react";
 
 import { Box } from "@mui/material";
 import { useDispatch, useSelector } from "react-redux";
 import { useRouter, useSearchParams } from "next/navigation";
 import Cookies from "js-cookie";
 import Swal from "sweetalert2";
 
 import { AppDispatch, RootState } from "@/lib/store/store";
 import { fetchClaims } from "@/lib/services/claims/claimsSlices";
 import FormButtons from "./FormButtons";
 import GeneralDataForm from "./GeneralDataForm";
 import Loading from "@/components/ui/Modals/loading";
 import TitleForm from "@/components/ui/Forms/TitleForm";
import { usePresentacionesForm } from "./PresentacionesFormContext";
 
 const labelPageMap: Record<string, string> = {
   new: "Crear nueva Presentación",
   edit: "Editar dato de Presentación",
   view: "Consulta de datos de Presentación",
 };

const createClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Presentaciones.Crear";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Presentaciones.Actualizar";
 
 
 const PresentacionesFormComponents = () => {
   const { isLoadingPresentaciones } = usePresentacionesForm();
 
   const token = Cookies.get("auth-token") || "";
   const searchParams = useSearchParams();
   const router = useRouter();
 
   const mode = searchParams.get("mode");
   const id = searchParams.get("id");
 
   const dispatch: AppDispatch = useDispatch();
   const userType = Cookies.get("user-type");
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
          "/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones"
        );
      });
    }
  }, []);
 
   if (isLoadingPresentaciones && !mode) return <Loading />;
 
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
 
 export default PresentacionesFormComponents;
 
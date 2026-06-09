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
import { useTypesWarehousesForm } from "./TypesWarehousesFormContext";
 
 const labelPageMap: Record<string, string> = {
   new: "Crear nuevo Tipo de almacén",
   edit: "Editar Tipo de almacén",
   view: "Consultar Tipo de almacén",
 };

const createClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipo de almacén.Crear";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipo de almacén.Actualizar";
 
 
 const TypesWarehousesFormComponents = () => {
   const { isLoadingTypesWarehouses } = useTypesWarehousesForm();
 
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
          "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes"
        );
      });
    }
  }, []);
 
   if (isLoadingTypesWarehouses && !mode) return <Loading />;
 
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
 
 export default TypesWarehousesFormComponents;
 
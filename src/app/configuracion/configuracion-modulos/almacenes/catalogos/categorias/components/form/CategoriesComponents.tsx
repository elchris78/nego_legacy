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
import { useCategoriesForm } from "./CategoriesFormContext";
 
 const labelPageMap: Record<string, string> = {
    new: "Crear nueva categoría",
    newsubcat: "Crear Subcategoría",
    edit: "Editar categoría",
    view: "Consultar categoría",
    editsubcat: "Editar Subcategoría",
    viewsubcat: "Consultar Subcategoría",
 };

const createClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Categorías.Crear";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Categorías.Actualizar";
 
 const CategoriesFormComponents = () => {
   const { isLoadingCategories } = useCategoriesForm();
 
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
    const noTienePermiso =
      (mode === "new" || mode === "newsubcat") && !hasClaim(createClaim) ||
      (mode === "edit" || mode === "editsubcat") && !hasClaim(updateClaim);

    if (noTienePermiso) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permisos para realizar esta acción. Solicítalos con tu administrador.",
        confirmButtonText: "Entendido",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-error",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
        },
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/almacenes/catalogos/categorias"
        );
      });
    }
  }, [mode, claims]);

 
   if (isLoadingCategories && !mode) return <Loading />;
 
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
 
 export default CategoriesFormComponents;
 
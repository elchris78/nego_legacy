"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
//import { useAttributes } from "./AttributesContext";
import { useSucursalForm } from "./SucursalesFormContext";
import FormButtons from "./FormButtons";
import GeneralDataForm from "./GeneralDataForm";
import Loading from "@/components/ui/Modals/loading";
import TitleForm from "@/components/ui/Forms/TitleForm";
import showAlert from "@/lib/utils/alerts";
import TabLayout from "../TabLayout";
import Swal from "sweetalert2";
import { sucursalActions } from "../../services/sucursalesSlice";

const labelPageMap: Record<string, string> = {
  new: "Agregar sucursal",
  edit: "Editar sucursal",
  view: "Consultar sucursal",
};

const createClaim =
  "Configuración.Configuración empresa.Información de la empresa.Sucursales.Crear";
const updateClaim =
  "Configuración.Configuración empresa.Información de la empresa.Sucursales.Actualizar";


const SucursalesFormComponents = () => {
  const { isLoadingSucursal } = useSucursalForm();


  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode");
  const dispatch = useDispatch<AppDispatch>();
  const claims = useSelector((state: RootState) => state.claims.data);
  const currentSucursal = useSelector(
      (state: RootState) => state.sucursales.currentSucursal
    );
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
           "/configuracion/configuracion-empresa/informacion-empresa/sucursales"
         );
       });
     }
   }, [])

   useEffect(() => {
       if (mode === "edit" || mode === "view" && currentSucursal) {
         dispatch(sucursalActions.setSavedSucursalMode (mode));
       } else if (mode === "new") {
         dispatch(sucursalActions.setSavedSucursalMode (mode));
       } else {
         dispatch(sucursalActions.setSavedSucursalMode(null));
       }
     }, [mode, currentSucursal, dispatch]);

   if (isLoadingSucursal && !mode) return <Loading />;
  return (
    <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
      <div className="flex flex-col gap-8">
        <TitleForm label={labelPageMap[mode!]} />
        <TabLayout exists={true} disabledValTab={mode == 'new'} tab={"informacion"} spacingClasses={{ informacion: "mt-[-40px] mb-4", documentacion: "mt-6 mb-4" }}/>
        <GeneralDataForm />
      </div>
      <FormButtons />
    </section>
  );
};

export default SucursalesFormComponents;

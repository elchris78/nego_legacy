"use client";
import { Box } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { FormButtons } from "./FormButtons";
import { GeneralData } from "./GeneralData";
import { NavBar2 } from "@/components/layout/menus/Nav";
import { Permissions } from "./Permissions";
import { TitleForm } from "./TitleForm";
import { usePlantillaForm } from "./PlantillaFormContext";
import Loading from "@/components/ui/Modals/loading";
import { DividerSection } from "./DividerSection";

import NavbarHome from "@/menus/NavbarMenuP";

import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import Swal from "sweetalert2";



const textPageMap: Record<string, string> = {
  new: "Crear plantilla de perfil",
  edit: "Editar plantilla de perfil",
  view: "Consultar plantilla de perfil",
};

export const PlantillasFormComponents = () => {
  const token = Cookies.get("auth-token");
  
  const { isLoadingPlantilla, currentPlantilla } = usePlantillaForm();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isRow3MenuOpen, setIsRow3MenuOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const userType = Cookies.get("user-type");
  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };
  // useEffect(() => {
  //   if (!userType) return;

  //   const token = Cookies.get("auth-token") || "";

  //   dispatch(fetchClaims(token));
  // }, [dispatch, userType]);
 
useEffect(() => {
    if (!token) {
      router.push("/not-authorized");
      return;
    }
  
    if (mode === "new" && !hasClaim("Configuración.Plantillas de perfiles.Crear") && !hasClaim("Configuración.Configuración del sistema.Usuarios.Plantillas de perfiles.Crear") && !showAlert) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permisos para crear. Solicítalos con tu administrador.",
        confirmButtonText: "Entendido",
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-error',
          confirmButton: 'swal-confirm-button',
          title: 'swal-title',
        }
      }).then(() => {
        router.push("/configuracion/configuracion-sistemas/control-usuarios/plantillas");
      });
      setShowAlert(true)
      return;
    }
  }, [token, mode, claims, showAlert]);

  if (isLoadingPlantilla && !mode) return <Loading />;

  if (!isLoadingPlantilla && mode) {
    if (mode === "edit" || mode === "view") {
      if (currentPlantilla === null) return null;
    }

    return (
        
       
        <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
          <div className="flex flex-col gap-8">
            <TitleForm mode={mode.toString()} />
            <GeneralData />
            <DividerSection />
            <Permissions />
            <FormButtons />
          </div>
          
        </section>
    );
  }
};

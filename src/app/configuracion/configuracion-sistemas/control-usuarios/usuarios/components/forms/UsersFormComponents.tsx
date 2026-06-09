"use client";

// Imagenes del menu principal
import Ventas from "@/Asset/Ventas.png";
import Almacenes from "@/Asset/Almacenes.png";
import Compras from "@/Asset/Compras.png";
import Distribucion from "@/Asset/Distribucion.png";
import Finanzas from "@/Asset/Finanzas.png";
import Proyectos from "@/Asset/Proyectos.png";
import PuntoVenta from "@/Asset/PuntoVenta.png";
import box from "@/Asset/box.png";

import NavbarHome from "@/menus/NavbarMenuP";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import HelpCircle from "@/Asset/HelpCircle.png";
import Loading from "@/components/ui/Modals/loading";
import MoreHorizontal from "@/Asset/MoreHorizontal.png";
import Settings from "@/Asset/Settings.png";
import User from "@/Asset/User.png";
import { TitleForm } from "./TitleForm";
import { GeneralData } from "./GeneralData";
import { DividerSection } from "./DividerSection";
import { Permissions } from "./Permissions";
import { FormButtons } from "./FormButtons";
import Cookies from "js-cookie";
import { useUserForm } from "./UsersFormContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useFilteredNavigation } from "@/components/layout/menus/config/rutasConfiguracionClaims";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import Swal from "sweetalert2";



export const UsersFormComponents = () => {
  const token = Cookies.get("auth-token");

  const { isLoadingUser, currentUser } = useUserForm();

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
  
    if (mode === "new" &&  !hasClaim("Configuración.Configuración del sistema.Usuarios.Usuario.Crear") && !showAlert) {
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
        router.push("/configuracion/configuracion-sistemas/control-usuarios/usuarios");
      });
      setShowAlert(true)
      return;
    }
  }, [token, mode, claims, showAlert]);
  if (isLoadingUser && !mode) return <Loading />;

  if (!isLoadingUser && mode) {
    if (mode === "edit" || mode === "view") {
      if (currentUser === null) return null;
    }

    return (
        
        
          <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
            <div className="flex flex-col gap-8">
              <TitleForm mode={mode.toString()} />
              <GeneralData />
              <FormButtons />
            </div>
          </section>
    );
  }
};

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



export const UsersFormComponents = () => {
  const token = Cookies.get("auth-token");

  const { isLoadingUser, currentUser } = useUserForm();

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isRow3MenuOpen, setIsRow3MenuOpen] = useState(false);



  useEffect(() => {
    if (!token && !mode) {
      router.push("/not-authorized");
      return;
    }
  }, [token, mode]);

  if (isLoadingUser && !mode) return <Loading />;

  if (!isLoadingUser && mode) {
    if (mode === "edit" || mode === "view") {
      if (currentUser === null) return null;
    }

    return (

       
          <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
            <div className="flex flex-col gap-8">
              <TitleForm mode={mode.toString()} />
              <Permissions />
              <FormButtons />
            </div>
          </section>
    );
  }
};

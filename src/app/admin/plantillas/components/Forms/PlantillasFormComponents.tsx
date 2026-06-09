"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

import { FormButtons } from "./FormButtons";
import { GeneralData } from "./GeneralData";
import { NavBar2 } from "@/components/layout/menus/Nav";
import { Permissions } from "./Permissions";
import { TitleForm } from "./TitleForm";
import { usePlantillaForm } from "./PlantillaFormContext";
import Loading from "@/components/ui/Modals/loading";
import { DividerSection } from "./DividerSection";

const textPageMap: Record<string, string> = {
  new: " Inicio > Plantillas > Crear plantilla de perfil",
  edit: " Inicio > Plantillas > Editar plantilla de perfil",
  view: " Inicio > Plantillas > Consultar plantilla de perfil",
};

export const PlantillasFormComponents = () => {
  const token = Cookies.get("auth-token");

  const { isLoadingPlantilla, currentPlantilla } = usePlantillaForm();

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (!token && mode) {
      router.push("/not-authorized");
      return;
    }
  }, [token, mode]);

  if (isLoadingPlantilla && !mode && currentPlantilla === null)
    return <Loading />;

  if (!isLoadingPlantilla && mode && currentPlantilla !== null)
    return (
      <>
        {/* <NavBar2
          textPagina={`${textPageMap[mode.toString()]}`}
        /> */}
        <div className="flex flex-col gap-8 px-4">
          <TitleForm mode={mode.toString()} />
          <GeneralData />
          <DividerSection />
          <Permissions />
          <FormButtons />
        </div>
      </>
    );
};

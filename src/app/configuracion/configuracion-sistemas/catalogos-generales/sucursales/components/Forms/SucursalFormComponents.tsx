"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { FormButtons } from "./FormButtons";
import { GeneralData } from "./GeneralData";
import { NavBar2 } from "@/components/layout/menus/Nav";
import { TitleForm } from "./TitleForm";
import { usePlantillaForm } from "./SucursalFormContext";
import Loading from "@/components/ui/Modals/loading";
import { DividerSection } from "./DividerSection";
import { DocumentacionData } from "./DocumentacionData";
import NavbarHome from "@/menus/NavbarMenuP";
import { DocumentacionDataForm } from "./DocumentacionDataForm";

// Imagenes del menu principal
import Ventas from "@/Asset/Ventas.png";
import Almacenes from "@/Asset/Almacenes.png";
import Compras from "@/Asset/Compras.png";
import Distribucion from "@/Asset/Distribucion.png";
import Finanzas from "@/Asset/Finanzas.png";
import Proyectos from "@/Asset/Proyectos.png";
import PuntoVenta from "@/Asset/PuntoVenta.png";
import box from "@/Asset/box.png";

const buttons = [
  { label: "Inicio", route: "/", imgSrc: Ventas.src },
  { label: "Almacen", route: "/", imgSrc: Almacenes.src },
  { label: "Compras", route: "/Compras", imgSrc: Compras.src },
  { label: "Distribución", route: "/", imgSrc: Distribucion.src },
  { label: "Finanzas", route: "/", imgSrc: Finanzas.src },
  { label: "Proyectos", route: "/", imgSrc: Proyectos.src },
  { label: "Punto de venta", route: "/ventas", imgSrc: PuntoVenta.src },
  { label: "Configuración", route: "/", imgSrc: box.src },
];

const textPageMap: Record<string, string> = {
  new: "Crear plantilla de perfil",
  edit: "Editar plantilla de perfil",
  view: "Visualizar plantilla de perfil",
};

export const PlantillasFormComponents = () => {
  const token = Cookies.get("auth-token");
  const { isLoadingPlantilla, currentPlantilla } = usePlantillaForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [showDocumentationForm, setShowDocumentationForm] = useState(false);

  useEffect(() => {
    if (!token && mode) {
      router.push("/not-authorized");
      return;
    }
  }, [token, mode]);

  if (isLoadingPlantilla && !mode) return <Loading />;

  if (!isLoadingPlantilla && mode) {
    if (mode === "edit" || mode === "view") {
      if (currentPlantilla === null) return null;
    }

    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-100">
          <NavbarHome textPagina="Inicio" />
        </header>

        <section className="flex flex-col gap-8 px-4 lg:ml-14">
          <TitleForm mode={mode.toString()} />
          <GeneralData />
          <DividerSection />
          <DocumentacionData onAddClick={() => setShowDocumentationForm(true)} />

          {showDocumentationForm && <DocumentacionDataForm />}
          <FormButtons />
        </section>
      </div>
    );
  }
};

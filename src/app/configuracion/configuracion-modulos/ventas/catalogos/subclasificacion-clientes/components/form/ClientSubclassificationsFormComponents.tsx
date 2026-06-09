"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import { useClientSubclassifications } from "./ClientSubclassificationsContext";
import FormButtons from "./FormButtons";
import GeneralDataForm from "./GeneralDataForm";
import Loading from "@/components/ui/Modals/loading";
import TitleForm from "@/components/ui/Forms/TitleForm";
import showAlert from "@/lib/utils/alerts";

const labelPageMap: Record<string, string> = {
  new: "Crear nueva Subclasificación de Clientes",
  edit: "Editar datos de Subclasificación de Clientes",
  view: "Consulta de datos de Subclasificación de Clientes",
};

const ClientSubclassificationsFormComponents = () => {
  const { isLoadingClientSubclassification } =
    useClientSubclassifications();

  // Cookies
  const token = Cookies.get("auth-token") || "";

  // URL params
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode");

  // Redux
  const dispatch: AppDispatch = useDispatch();
  const userType = Cookies.get("user-type");
  const claims = useSelector((state: RootState) => state.claims.data);

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  useEffect(() => {
    if (!mode) return;

    let requiredClaim = "";
    let actionLabel = "";
    switch (mode) {
      case "view":
        requiredClaim =
          "Configuración.Configuración de módulos.Ventas.Catálogos.Subclasificación de clientes.Leer";
        actionLabel = "leer";
        break;
      case "edit":
        requiredClaim =
          "Configuración.Configuración de módulos.Ventas.Catálogos.Subclasificación de clientes.Actualizar";
        actionLabel = "editar";
        break;
      case "new":
        requiredClaim =
          "Configuración.Configuración de módulos.Ventas.Catálogos.Subclasificación de clientes.Crear";
        actionLabel = "crear";
        break;
      default:
        return;
    }

    if (!hasClaim(requiredClaim)) {
      showAlert({
        success: false,
        message: `No tienes permisos para ${actionLabel}. Solicítalos con tu administrador.`,
        confirmText: "Entendido",
        onClose: () => {
          router.push(
            "/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes"
          );
        },
      });
    }
  }, [mode, claims]);

  if (isLoadingClientSubclassification && !mode) return <Loading />;

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

export default ClientSubclassificationsFormComponents;

"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

import { useFabricantesContextForm } from "./FabricantesContext";
import FormButtons from "./FormButtons";
import GeneralDataForm from "./GeneralDataForm";
import Loading from "@/components/ui/Modals/loading";
import TitleForm from "@/components/ui/Forms/TitleForm";

import { AppDispatch, RootState } from "@/lib/store/store";
import { fabricanteActions } from "../../services/fabricanteSlice";
import TabLayout from "../TabLayout";

const labelPageMap: Record<string, string> = {
  new: "Crear nuevo fabricante",
  edit: "Editar datos de fabricante",
  view: "Consulta de datos de fabricante",
};

const createClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Fabricantes.Crear";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Fabricantes.Actualizar";

const FabricantesFormComponents = () => {
  const { isLoadingFabricante, currentFabricante } =
    useFabricantesContextForm();

  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode");

  const dispatch = useDispatch<AppDispatch>();
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
          "/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes"
        );
      });
    }
  }, []);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentFabricante) {
      dispatch(fabricanteActions.setSavedAttributeMode(mode));
    } else if (mode === "new") {
      dispatch(fabricanteActions.setSavedAttributeMode(mode));
    } else {
      dispatch(fabricanteActions.setSavedAttributeMode(null));
    }
  }, [mode, currentFabricante]);

  if (isLoadingFabricante && !mode) return <Loading />;

  return (
    <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
      <div className="flex flex-col gap-1">
        <TitleForm label={labelPageMap[mode!]} />
        <TabLayout
          disabledValTab={mode == "new"}
          tab={"form"}
          spacingClasses={{ form: "mt-0 mb-4", files: "mt-0 mb-4" }}
        />
        <GeneralDataForm />
      </div>
      <FormButtons />
    </section>
  );
};

export default FabricantesFormComponents;

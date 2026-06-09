"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

import { AppDispatch, RootState } from "@/lib/store/store";
import { useColaboradorFormContext } from "./ColaboradorFormContext";
import ColaboradorFormTabs from "./ColaboradorFormTabs";
import FormButtons from "./FormButtons";
import Loading from "@/components/ui/Modals/loading";
import TitleForm from "@/components/ui/Forms/TitleForm";

const labelPageMap: Record<string, string> = {
  new: "Crear un nuevo Colaborador",
  edit: "Editar datos de Colaborador",
  view: "Consulta de datos de Colaborador",
};

const createClaim =
  "Configuración.Configuración del sistema.Usuarios.Colaboradores.Crear";
const updateClaim =
  "Configuración.Configuración del sistema.Usuarios.Colaboradores.Actualizar";

const ColaboradorFormComponents = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const dispatch = useDispatch<AppDispatch>();
  const { isLoadingColaborador } = useColaboradorFormContext();

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  useEffect(() => {
    if (!mode || claims.length === 0) return;
    // Check if the user has the required claims
    if (
      (mode === "new" || mode === "edit") &&
      (!hasClaim(createClaim) || !hasClaim(updateClaim))
    ) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permisos para crear o editar. Solicítalos con tu administrador.",
        confirmButtonText: "Entendido",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-error",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
        },
      }).then(() => {
        router.push(
          "/configuracion/configuracion-sistemas/control-usuarios/colaboradores"
        );
      });
    }
  }, [mode, claims, router]);

  if (isLoadingColaborador && !mode) return <Loading />;

  return (
    <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
      <div className="flex flex-col gap-1">
        <TitleForm label={labelPageMap[mode!]} />
        <ColaboradorFormTabs />
      </div>
      <div className="mb-8">
        <FormButtons />
      </div>
    </section>
  );
};

export default ColaboradorFormComponents;

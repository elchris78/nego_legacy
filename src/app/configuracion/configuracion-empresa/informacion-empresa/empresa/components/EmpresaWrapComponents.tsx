"use client";

import { useSelector } from "react-redux";

import { RootState } from "@/lib/store/store";
import EmpresaFormTabs from "./EmpresaFormTabs";
import FormButtons from "./FormButtons";
import Loading from "@/components/ui/Modals/loading";
import TitleForm from "@/components/ui/Forms/TitleForm";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const updateClaim =
  "Configuración.Configuración empresa.Información de la empresa.Empresa.Actualizar";

const EmpresaWrapComponents = () => {
  const router = useRouter();
  const isLoading = useSelector((state: RootState) => state.empresa.loading);

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  useEffect(() => {
    if (claims.length === 0) return;
    // Check if the user has the required claims
    if (!hasClaim(updateClaim)) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permisos para editar. Solicítalos con tu administrador.",
        confirmButtonText: "Entendido",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-error",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
        },
      }).then(() => {
        router.push("/configuracion");
      });
    }
  }, [claims, router]);

  if (isLoading) return <Loading />;

  return (
    <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
      <div className="flex flex-col gap-1">
        <TitleForm label="Empresa" />
        <EmpresaFormTabs />
      </div>
      <div className="mb-8">
        <FormButtons />
      </div>
    </section>
  );
};

export default EmpresaWrapComponents;

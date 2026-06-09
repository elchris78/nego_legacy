"use client";

import { useEffect } from "react";

import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import FormButtons from "./FormButtons";
import GeneralDataForm from "./GeneralDataForm";
import Loading from "@/components/ui/Modals/loading";
import showAlert from "@/lib/utils/alerts";
import TitleForm from "@/components/ui/Forms/TitleForm";

import { RootState } from "@/lib/store/store";

const labelPageMap: Record<string, string> = {
  new: "Crear nueva cuenta bancaria",
  edit: "Editar datos de cuenta bancaria",
  view: "Consulta de datos de cuenta bancaria",
};

const createClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Cuentas bancarias.Crear";
const updateClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Cuentas bancarias.Actualizar";

const CuentaBancariaFormComponents = () => {
  const isLoadingCuentaBancaria = useSelector(
    (state: RootState) => state.cuentasBancarias.loading
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode");

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
      showAlert({
        success: false,
        message:
          "No tienes permisos para crear o editar. Solicítalos con tu administrador.",
      });
      router.push(
        "/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias"
      );
    }
  }, [mode, claims, router]);

  if (isLoadingCuentaBancaria) {
    return <Loading />;
  }

  return (
    <section className="flex flex-col gap-4 justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
      <div className="flex flex-col gap-8">
        <TitleForm label={labelPageMap[mode!]} />
        <GeneralDataForm />
      </div>
      <FormButtons />
    </section>
  );
};

export default CuentaBancariaFormComponents;

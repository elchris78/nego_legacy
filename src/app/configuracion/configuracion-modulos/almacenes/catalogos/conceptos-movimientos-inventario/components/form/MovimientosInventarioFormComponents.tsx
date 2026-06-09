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
  new: "Crear nuevo concepto de movimiento de inventario",
  edit: "Editar datos de concepto de movimiento de inventario",
  view: "Consulta de datos de concepto de movimiento de inventario",
};

const createClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Empaques.Crear";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Empaques.Actualizar";

const MovimientosInventarioFormComponents = () => {
  const isLoadingMovimientosInventario = useSelector(
    (state: RootState) => state.movimientosInventario.loading
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
        "/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario"
      );
    }
  }, [mode, claims, router]);

  if (isLoadingMovimientosInventario) {
    return <Loading />;
  }

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

export default MovimientosInventarioFormComponents;

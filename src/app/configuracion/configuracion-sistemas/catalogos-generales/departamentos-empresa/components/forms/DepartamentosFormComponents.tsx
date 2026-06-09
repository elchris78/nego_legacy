"use client";

import { useEffect } from "react";

import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";

import { FormButtons } from "./FormButtons";
import { GeneralData } from "./GeneralData";
import { useDepartamentoForm } from "./DepartamentosFormContext";
import Loading from "@/components/ui/Modals/loading";
import TitleForm from "@/components/ui/Forms/TitleForm";

const labelPageMap: Record<string, string> = {
  new: "Crear Nuevo Departamento",
  edit: "Editar datos del departamento",
  view: "Consulta de datos del departamento",
};

export const DepartamentosFormComponents = () => {
  const token = Cookies.get("auth-token");

  const { isLoadingDepartamento, currentDepartamento } = useDepartamentoForm();

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (!token && mode) {
      router.push("/not-authorized");
      return;
    }
  }, [token, mode]);

  if (isLoadingDepartamento && !mode) return <Loading />;

  if (!isLoadingDepartamento && mode) {
    if (mode === "edit" || mode === "view") {
      if (currentDepartamento === null) return null;
    }

    return (
      <section className="flex flex-col justify-between h-screen px-4 mt-0 md:mt-8 md:h-[80vh]">
        <div className="flex flex-col gap-8">
          <TitleForm label={labelPageMap[mode!]} />
          <GeneralData />
        </div>
        <FormButtons />
      </section>
    );
  }
};

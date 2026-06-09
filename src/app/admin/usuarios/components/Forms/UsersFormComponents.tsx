"use client";

import { FormButtons } from "./FormButtons";
import { GeneralData } from "./GeneralData";
import { NavBar2 } from "@/menus/Nav";
import { Permissions } from "./Permissions";
import { TitleForm } from "./TitleForm";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserForm } from "./UserFormContext";
import Cookies from "js-cookie";
import Loading from "@/Modals/loading";
import { DividerSection } from "./DividerSection";
import { Box } from "@mui/material";

const textPageMap: Record<string, string> = {
  new: "Crear nuevo usuario",
  edit: "Editar usuario",
  view: "Datos Generales",
};

export const UsersFormComponents = () => {
  const token = Cookies.get("auth-token");

  const { isLoadingUser, currentUser } = useUserForm();

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

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
      <div className="min-h-screen flex flex-col">
        {/* <header className="bg-gray-100">
          <NavBar2
            textPagina={`Inicio > Usuarios > ${textPageMap[mode?.toString()!]}`}
            goBackPath="/admin/usuarios"
          />
        </header> */}
        <Box flexGrow={1} display="flex" flexDirection="column">
          <section className="flex flex-col flex-grow gap-8 px-4">
            <TitleForm mode={mode?.toString()!} />
            <GeneralData />
          </section>

          <FormButtons />
        </Box>
      </div>
    );
  }
};

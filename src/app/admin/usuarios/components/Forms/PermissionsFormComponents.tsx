"use client";

// Imagenes del menu principal
import Loading from "@/components/ui/Modals/loading";
import { Permissions } from "./Permissions";
import { FormButtons } from "./FormButtons";
import Cookies from "js-cookie";
import { useUserForm } from "./UserFormContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const textPageMap: Record<string, string> = {
  editw: "Asignar Permisos",
};

export const UsersFormComponents = () => {
  const token = Cookies.get("auth-token");

  const { isLoadingUser, currentUser } = useUserForm();

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

 
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("hasRefreshed");
  
    if (!hasRefreshed) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
    }, []);
    
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
        
          <section className="flex flex-col gap-8 px-4">
            <div className="flex items-center justify-center  space-x-2 pb-14 pt-5">
              <h1 className="text-[#5B6670] text-5xl font-semibold antialiased">
              Asignar Permisos
              </h1>
            </div>
            <Permissions />
            <FormButtons />
          </section>
      </div>
    );
  }
};

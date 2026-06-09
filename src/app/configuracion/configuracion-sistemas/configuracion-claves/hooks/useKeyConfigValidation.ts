"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { GetCatalogoClave } from "../services/keyConfigurationTypes";
import { GetCatalogoClaves } from "../services/keyConfigurationActions";

const customClassesError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

export const useKeyConfigValidation = (catalogName: string) => {
  const token = Cookies.get("auth-token");
  const router = useRouter();

  const [keyConfig, setKeyConfig] = useState<GetCatalogoClave | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) return;
    getConfig();
  }, [token]);

  const getConfig = async () => {
    try {
      setIsLoading(true);
      const resp = await GetCatalogoClaves({
        token,
        params: { catalogo: catalogName },
      });
      setKeyConfig(resp);
    } catch (error) {
      console.error("Error al obtener la configuración de claves:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "No puedes acceder al catálogo debido a que no se ha configurado la clave a utilizar. Favor de ir a completar la configuración correspondiente o, en caso de que no tengas acceso, solicítalo con tu administrador.",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Ir a configuración",
        customClass: customClassesError,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(
            "/configuracion/configuracion-sistemas/configuracion-claves"
          );
        }
      });
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    keyConfig,
    isLoading,
  };
};

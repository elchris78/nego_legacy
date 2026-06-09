"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { useKeyConfigurationForm } from "./KeyConfigurationContext";

import { keyConfigurationActions } from "../../services/keyConfigurationSlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import ConfirmConfigurationModal from "../table/ConfirmConfigurationModal";
import { useState } from "react";

const updateClaim =
  "Configuración.Configuración del sistema.Definición de claves de catálogos.Actualizar";

const customClassesSuccess = {
  container: "swal2-container",
  popup: "swal-popup-succes",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const customClassesError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const FormButtons = () => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const { handleSubmitForms, isFormComplete, currentKeyConfiguration } = useKeyConfigurationForm();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoading = useSelector(
    (state: RootState) => state.keyConfigurationReducer.loading
  );

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddKeyConfiguration();
        break;
      case "edit":
        onEditKeyConfiguration();
        break;
      default:
        break;
    }
  };

  const onAddKeyConfiguration = async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to create the area
      const resultAction = await dispatch(
        keyConfigurationActions.createKeyConfiguration({
          token,
          keyConfiguration: body,
        })
      );
      if (keyConfigurationActions.createKeyConfiguration.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      Swal.fire({
        title: "¡Éxito!",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
        confirmButtonText: "Aceptar",
      });

      // Redirect to the list of return concepts
      router.push(
        "/configuracion/configuracion-sistemas/configuracion-claves"
      );
    } catch (error: any) {
      console.log("🚀 ~ onAddKeyConfiguration ~ error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };

  const onEditKeyConfiguration= async () => {
    if (!isFormComplete) return;
    try {
      const body = await handleSubmitForms();
      if (body === undefined) return;

      // Call the API to update the area
      const resultAction = await dispatch(
        keyConfigurationActions.updateKeyConfiguration({
          token,
          id,
          keyConfiguration: body,
        })
      );
      if (keyConfigurationActions.updateKeyConfiguration.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      Swal.fire({
        title: "¡Éxito!",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
        confirmButtonText: "Aceptar",
      });

      // Redirect to the list of return concepts
      router.push(
        "/configuracion/configuracion-sistemas/configuracion-claves"
      );
    } catch (error: any) {
      console.log("🚀 ~ onEditKeyConfiguration ~ error:", error);

      Swal.fire({
        title: "Error",
        text: error?.message,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };
  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-36"
          onClick={() =>
            router.push(
              "/configuracion/configuracion-sistemas/configuracion-claves"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {mode === "view" && hasClaim(updateClaim) && currentKeyConfiguration?.isEmpty && (
          <Link
            href={`/configuracion/configuracion-sistemas/configuracion-claves/form?mode=edit&id=${id}`}
          >
            <Button type="button" variant="default" className="w-full sm:w-36">
              Ir a actualizar
            </Button>
          </Link>
        )}
        {(mode === "new" || mode === "edit") && (
          <Button
            type="button"
            variant="default"
            className="min-w-36"
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading || !isFormComplete}
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        )}
      </div>
      {(mode === "new" || mode === "edit") && isModalOpen && (
        <ConfirmConfigurationModal
          isOpenModal={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}
          handleCreate={() => {
            setIsModalOpen(false);
            onHandleSubmit(); // ✅ Se centraliza aquí la lógica
          }}
        />
      )}

    </div>
  );
};

export default FormButtons;

import {
  fetchCreatePlantilla,
  fetchEditPlantilla,
} from "../../services/plantillasActions";
import { Button } from "@/ui/button";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { ToastSuccessMsg } from "@/components/ui/Toast/ToastSuccessMsg";
import { usePlantillaForm } from "./SucursalFormContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import Cookies from "js-cookie";
export const FormButtons = () => {
  const { handleSubmitForms } = usePlantillaForm();

  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);
  const claims = useSelector((state: RootState) => state.claims.data);

  const hasClaim = (claimValue: string) => {
    return claims?.some((claim: { claimValue: string }) => claim.claimValue === claimValue);
  };

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddSucursal();
        break;
      case "edit":
        onEditSucursal();
        break;
      default:
        break;
    }
  };

  const onAddSucursal = async () => {
    try {
      setIsLoading(true);

      // const body = await handleSubmitForms();
      // if (body === undefined) return;

      // const resp = await fetchCreatePlantilla({
      //   token,
      //   body,
      // });

      // if (resp !== undefined && resp.success) {
      //   toast(
          // <ToastSuccessMsg description="Se ha creado la sucursal de forma exitosa" />
        // );
        router.push(
          "/configuracion/configuracion-sistemas/catalogos-generales/sucursales"
        );
      // }
    } catch (error: any) {
      const errorMsg = error?.message;
      // toast(
      //   <ToastErrorMsg
      //     description={
      //       errorMsg ?? "No se pudo crear la sucursal de forma exitosa"
      //     }
      //   />
      // );
      console.log("🚀 ~ onAddUser ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEditSucursal = async () => {
    try {
      setIsLoading(true);

      // const body = await handleSubmitForms();
      // if (body === undefined) return;

      // const resp = await fetchEditPlantilla({
      //   id,
      //   token,
      //   body,
      // });

      // if (resp !== undefined && resp.success) {
        // toast(
        //   <ToastSuccessMsg description="Se ha editado la sucursal de forma exitosa" />
        // );
        router.push(
          `/configuracion/configuracion-sistemas/catalogos-generales/sucursales/form?mode=edit&id=${5}`
        );
      // }
    } catch (error: any) {
      const errorMsg = error?.message;
      // toast(
      //   <ToastErrorMsg
      //     description={
      //       errorMsg ?? "No se pudo editar la sucursal de forma exitosa"
      //     }
      //   />
      // );
      console.log("🚀 ~ onAddUser ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
      {mode === "view" && hasClaim("Configuración.Sucursales.Actualizar") && (
          <Button
            type="button"
            variant={"default"}
            className="bg-[#3C98CB] hover:bg-[#3788b4] min-w-36"
            disabled={isLoading}
            onClick={() =>
              router.push(
                `/configuracion/configuracion-sistemas/catalogos-generales/sucursales/form?mode=edit&id=${id}`
              )
            }
          >
            Editar
          </Button>
        )}
        <Button
          type="button"
          variant={"outline"}
          className="text-[#3C98CB] border-[#3C98CB] hover:text-[#3C98CB] w-full sm:w-36"
          onClick={() =>
            router.push(
              "/configuracion/configuracion-sistemas/catalogos-generales/sucursales"
            )
          }
          disabled={isLoading}
        >
          Cancelar
        </Button>
        {(mode === "new" || mode === "edit") && (
          <Button
            type="button"
            variant={"default"}
            className="bg-[#3C98CB] hover:bg-[#3788b4] min-w-36"
            onClick={onHandleSubmit}
            disabled={isLoading}
          >
            Guardar
          </Button>
        )}
      </div>
    </div>
  );
};

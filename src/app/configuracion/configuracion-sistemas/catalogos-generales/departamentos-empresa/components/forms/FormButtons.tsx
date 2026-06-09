import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import {
  createDepartment,
  updateDepartment,
} from "@/services/departments/departmentsSlice";
import { Button } from "@/ui/button";
import { useDepartamentoForm } from "./DepartamentosFormContext";

import { AppDispatch, RootState } from "@/lib/store/store";
import showAlert from "@/lib/utils/alerts";

export const FormButtons = () => {
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const { handleOnSubmit, isFormComplete } = useDepartamentoForm();

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const isPending = useSelector(
    (state: RootState) => state.departments.pending
  );
  const claims = useSelector((state: RootState) => state.claims.data);
  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        await onAddDepartamento();
        break;
      case "edit":
        await onEditDepartamento();
        break;
      default:
        break;
    }
  };

  const onAddDepartamento = async () => {
    try {
      const body = await handleOnSubmit();
      if (body === undefined) return;

      const resp = await dispatch(
        createDepartment({ token, request: body })
      ).unwrap();

      if (resp) {
        // Si la respuesta tiene éxito
        if (resp.success) {
          showAlert({
            success: true,
            message: resp?.message || "Departamento agregado exitosamente",
          });

          router.push(
            "/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa"
          );
        } else {
          // Si la respuesta indica fallo, mostramos el mensaje de error
          showAlert({
            success: false,
            message:
              resp?.message ||
              "No se pudo agregar el departamento de forma exitosa",
          });
        }
      }
    } catch (error: any) {
      showAlert({
        success: false,
        message: error?.message || "Error al agregar el departamento",
      });
    }
  };

  const onEditDepartamento = async () => {
    try {
      const departmentId = id;

      if (!departmentId) {
        showAlert({
          success: false,
          message: "No se ha proporcionado un ID de departamento válido.",
        });

        return;
      }
      const body = await handleOnSubmit();
      if (body === undefined) return;

      const requestBody = { ...body, departmentId };
      const resp = await dispatch(
        updateDepartment({ token, request: requestBody })
      ).unwrap();

      if (resp.success) {
        showAlert({
          success: true,
          message: resp?.message || "Departamento actualizado exitosamente",
        });

        router.push(
          "/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa"
        );
      } else {
        showAlert({
          success: false,
          message:
            resp?.message ||
            "No se pudo actualizar el departamento de forma exitosa",
        });
      }
    } catch (error: any) {
      console.log("🚀 ~ onEditDepartamento ~ error:", error);
      showAlert({
        success: false,
        message: error?.message || "Error al editar el departamento",
      });
    }
  };

  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
        <Button
          type="button"
          variant={"outline"}
          className="text-[#3C98CB] border-[#3C98CB] hover:text-[#3C98CB] w-full sm:w-36"
          onClick={() =>
            router.push(
              "/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa"
            )
          }
          disabled={isPending}
        >
          Cancelar
        </Button>
        {(mode === "new" || mode === "edit") && (
          <Button
            type="button"
            variant={"default"}
            className="bg-[#3C98CB] hover:bg-[#3788b4] min-w-36"
            onClick={onHandleSubmit}
            disabled={!isFormComplete}
            loading={isPending}
          >
            {mode === "new" ? "Guardar" : "Actualizar"}
          </Button>
        )}
        {mode === "view" &&
          (hasClaim(
            "Configuración.Configuración empresa.Información de la empresa.Departamentos.Actualizar"
          ) ||
            hasClaim("Configuración.Departamentos.Actualizar")) && (
            <Button
              type="button"
              variant={"default"}
              className="bg-[#3C98CB] hover:bg-[#3788b4] min-w-36"
              onClick={() =>
                router.push(
                  `/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa/form?mode=edit&id=${id}`
                )
              }
            >
              Ir a actualizar
            </Button>
          )}
      </div>
    </div>
  );
};

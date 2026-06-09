"use client";

import { Button } from "@/components/ui/button";
import { useEmpresaForm } from "./EmpresaFormContext";
import { objectToFormData } from "../utils/formStructure";
import showAlert from "@/lib/utils/alerts";
import Cookies from "js-cookie";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { empresaActions } from "../services/empresaSlice";
import { useRouter } from "next/navigation";

const FormButtons = () => {
  const token = Cookies.get("auth-token");
  const companyId = Cookies.get("companyId");
  const dispatch: AppDispatch = useDispatch();

  const router = useRouter();

  const { handleSubmitForms, isFormComplete, activeTab, getCompanyInfo } =
    useEmpresaForm();
  const isPending = useSelector((state: RootState) => state.empresa.isPending);

  const onHandleSubmit = async () => {
    const result = await handleSubmitForms();
    if (!result.isValid) {
      console.error("Errores en los formularios:", result.errors);
      return;
    }

    const formData = objectToFormData(result.values); // Convierte el objeto a FormData

    // Imprimir formData para depuración
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    updateCompanyInfo(formData);
  };

  const updateCompanyInfo = async (formData: FormData) => {
    try {
      // Call the API to update the company information
      const resultAction = await dispatch(
        empresaActions.updateCompanyInfo({ token, companyId, formData })
      );

      if (empresaActions.updateCompanyInfo.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      showAlert({
        success: true,
        message:
          resultAction.payload.message ||
          "Información de la empresa actualizada correctamente",
      });

      // Refresh company info
      await getCompanyInfo();
    } catch (error: any) {
      console.error("Error updating company info:", error);
      showAlert({
        success: false,
        message:
          error.message || "Error al actualizar la información de la empresa",
      });
    }
  };

  if (activeTab === 2) return null; //* Ocultar los botones si estamos en la pestaña de Documentación Adicional

  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-36"
          disabled={isPending}
          onClick={() =>
            router.push(
              "/configuracion"
            )
          }
        >
          Cancelar
        </Button>

        <Button
          type="button"
          variant="default"
          className="min-w-36"
          onClick={onHandleSubmit}
          disabled={!isFormComplete}
          loading={isPending}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default FormButtons;

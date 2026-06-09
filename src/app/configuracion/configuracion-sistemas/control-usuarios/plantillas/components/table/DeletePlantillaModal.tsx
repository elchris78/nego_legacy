"use client";

import { useState } from "react";

import { Dialog, styled } from "@mui/material";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { fetchDeletePlantilla } from "../../services/plantillasActions";
import WarningIcon from "@/components/ui/icons/WarningIcon";

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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "15px",
    maxWidth: "590px",
    border: "3px solid #FF0008",
  },
}));

interface DeletePlantillaModalProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
  id: string;
  getPlantillas: () => Promise<void>;
}

export const DeletePlantillaModal: React.FC<DeletePlantillaModalProps> = ({
  isOpenModal,
  onCloseModal,
  id,
  getPlantillas,
}) => {
  const token = Cookies.get("auth-token");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const resp = await fetchDeletePlantilla({ token, id });
      // Show success message
      Swal.fire({
        title: "¡ÉXITO!",
        text: resp.message,
        icon: "success",
        confirmButtonText: "Cerrar",
        customClass: customClassesSuccess,
      });
      await getPlantillas();
      onCloseModal();
    } catch (error: any) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpenModal) return null;

  return (
    <StyledDialog
      open={isOpenModal}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onCloseModal();
        }
      }}
      fullWidth
    >
      <div className="flex flex-col gap-4 py-5 px-5 sm:px-16 lg:px-24">
        {/* Icon */}
        <div className="flex justify-center items-center">
          <WarningIcon />
        </div>

        {/* Title */}
        <div className="text-center text-[#5D6D7E]">
          <h3 className="uppercase font-semibold text-xl">¡ATENCIÓN!</h3>
          <span className="text-xl font-light">
            ¿Estás seguro que deseas eliminar la plantilla de forma definitiva?
          </span>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-8 mt-4">
          <Button
            variant="outline"
            className="px-8"
            onClick={onCloseModal}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button className="px-8" onClick={handleDelete} disabled={isLoading}>
            Eliminar
          </Button>
        </div>
      </div>
    </StyledDialog>
  );
};

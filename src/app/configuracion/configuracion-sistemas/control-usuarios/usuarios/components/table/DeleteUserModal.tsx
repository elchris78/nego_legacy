"use client";

import type React from "react";
import { useState } from "react";
import { Dialog, styled } from "@mui/material";
import { fetchDeleteUser } from "../../services/usersActions";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import WarningIcon from "@/components/ui/icons/WarningIcon";
import { Button } from "@/components/ui/button";

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

interface DeleteUserModalProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
  id: string;
  getUsers: () => Promise<void>;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpenModal,
  onCloseModal,
  id,
  getUsers,
}) => {
  const token = Cookies.get("auth-token");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await fetchDeleteUser({ token, id });
      Swal.fire({
        title: "¡Éxito!",
        text: "El usuario ha sido eliminado correctamente.",
        icon: "success",
        customClass: customClassesSuccess,
      });
      await getUsers();
      onCloseModal();
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el usuario.",
        icon: "error",
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
          <h3 className="uppercase font-semibold text-xl">¡Atención!</h3>
          <span className="text-xl font-light">
            ¿Estás seguro que deseas eliminar el usuario de forma definitiva?
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

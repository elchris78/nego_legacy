import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, styled } from "@mui/material";

import { Button } from "@/components/ui/button";
import { zonasActions } from "../../services/zonasSlice";
import WarningIcon from "@/components/ui/icons/WarningIcon";

import { AppDispatch, RootState } from "@/lib/store/store";

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

interface Props {
  isOpenModal: boolean;
  onCloseModal: () => void;
  id: string;
}

const DeleteZonaModal = ({ isOpenModal, onCloseModal, id }: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const isLoading = useSelector((state: RootState) => state.zonas.loading);

  const handleDelete = async () => {
    try {
      const resultAction = await dispatch(
        zonasActions.deleteZona({ token, id })
      );
      if (zonasActions.deleteZona.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      Swal.fire({
        title: "¡ÉXITO!",
        text: resultAction.payload.message,
        icon: "success",
        confirmButtonText: "Cerrar",
        customClass: customClassesSuccess,
      });

      onCloseModal();
    } catch (error: any) {
      console.log("🚀 ~ handleDelete ~ error:", error);

      Swal.fire({
        title: "¡Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };

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
            ¿Estás seguro que deseas eliminar la zona de forma definitiva?
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

export default DeleteZonaModal;

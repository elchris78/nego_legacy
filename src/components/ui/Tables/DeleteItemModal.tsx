import { Dialog, styled } from "@mui/material";
import { Button } from "@/components/ui/button";
import WarningIcon from "../icons/WarningIcon";

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
  isLoading: boolean;
  onHandleDelete: () => void;
  label: string;
}

const DeleteItemModal = ({
  isOpenModal,
  onCloseModal,
  onHandleDelete,
  isLoading,
  label,
}: Props) => {
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
          <span className="text-xl font-light">{label}</span>
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
          <Button
            className="px-8"
            onClick={onHandleDelete}
            disabled={isLoading}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </StyledDialog>
  );
};

export default DeleteItemModal;

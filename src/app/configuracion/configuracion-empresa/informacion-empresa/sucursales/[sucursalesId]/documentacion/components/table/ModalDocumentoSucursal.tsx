import { Dialog, styled } from "@mui/material";
import AddFileForm from "./AddFileForm";
import { AddDocumentSucursal } from "../../../../services/sucursalesTypes";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "15px",
    border: "3px solid #007AFF",
    maxWidth: "500px",
    padding: theme.spacing(2),
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { fileName: string; file: FileList }) => Promise<void>;
  isLoading?: boolean;
  modoEdicion: boolean;
  onEditar: () => void;
  documento: AddDocumentSucursal | null;
}


const ModalDocumentoSucursal = ({ open, onClose, onSubmit, isLoading, modoEdicion, documento,onEditar }: Props) => {
  return (
    <StyledDialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      fullWidth
    >
        <AddFileForm
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            modoEdicion={modoEdicion}
            documento={documento}
            onEditar={onEditar}
        />
    </StyledDialog>
  );
};

export default ModalDocumentoSucursal;
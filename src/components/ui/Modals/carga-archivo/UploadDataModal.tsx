import { Dialog, styled } from "@mui/material";
import ReactLoading from "react-loading";

import UploadFile from "./UploadFile";
import { ColaboradorDocumentacion } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/components/form/documentacion-adicional/services/colaboradorDocumentacionTypes";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "15px",
    border: "3px solid #007AFF",
    maxWidth: "590px",
    padding: theme.spacing(2),
  },
}));

interface Props {
  isModalOpen: boolean;
  onCloseModal: () => void;
  handleFile: (file: File | undefined, name: string) => Promise<void>;
  getData: () => Promise<void>;
  isLoading: boolean;
  currentDocument?: ColaboradorDocumentacion | null; // Optional, if you want to handle existing documents
  isLoadingDocument?: boolean; // Optional, if you want to handle loading state for existing documents
  readOnly?: boolean; // Optional, if you want to make the modal read-only
}

const UploadDataModal = ({
  isModalOpen,
  onCloseModal,
  isLoadingDocument,
  ...rest
}: Props) => {
  return (
    <StyledDialog
      open={isModalOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onCloseModal();
        }
      }}
      fullWidth
    >
      {isLoadingDocument ? (
        <div className="flex justify-center items-center h-40">
          <ReactLoading type="spinningBubbles" color="#adadad" />
        </div>
      ) : (
        <UploadFile
          onCloseModal={onCloseModal}
          isLoadingDocument={isLoadingDocument}
          {...rest}
        />
      )}
    </StyledDialog>
  );
};

export default UploadDataModal;

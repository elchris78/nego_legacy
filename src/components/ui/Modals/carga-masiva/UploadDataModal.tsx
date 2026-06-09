import { Dialog, styled } from "@mui/material";

import UploadFile from "./UploadFile";

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
  handleFile: (file: File) => Promise<void>;
  getData: () => Promise<void>;
  urlFormatFile: string;
  formatFileName: string;
  urlInstructionsFile?: string;
  isLoading: boolean;
}

const UploadDataModal = ({ isModalOpen, onCloseModal, ...rest }: Props) => {
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
      <UploadFile onCloseModal={onCloseModal} {...rest} />
    </StyledDialog>
  );
};

export default UploadDataModal;

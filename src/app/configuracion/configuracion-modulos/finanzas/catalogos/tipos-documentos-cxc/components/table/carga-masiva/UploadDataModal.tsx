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
}

const UploadDataModal = ({ isModalOpen, onCloseModal }: Props) => {
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
      <UploadFile
        onCloseModal={onCloseModal}
      />
    </StyledDialog>
  );
};

export default UploadDataModal;

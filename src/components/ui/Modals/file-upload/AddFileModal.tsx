import { Dialog, styled } from "@mui/material";
import AddFileForm from "./AddFileForm";

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
}

const AddFileModal = ({ open, onClose, onSubmit, isLoading }: Props) => {
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
      <AddFileForm onSubmit={onSubmit} onCancel={onClose} isLoading={isLoading} />
    </StyledDialog>
  );
};

export default AddFileModal;
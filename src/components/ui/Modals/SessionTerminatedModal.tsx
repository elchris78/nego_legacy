import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";
import X from "@/assets/X.png";

interface SessionTerminatedModalProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    overflow: "visible",
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#3C98CB",
  padding: theme.spacing(2),
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  position: "relative",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1),
}));

export default function SessionTerminatedModal({ open, onClose }: SessionTerminatedModalProps) {
  return (
    <StyledDialog
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={(event, reason) => {
        // Evitamos cerrar el modal por click en el backdrop o por escape
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
    >
      <HeaderBox>
        <DialogTitle sx={{ color: "white" }}>Sesión finalizada</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <Image src={X} alt="Cerrar" width={30} height={30} />
        </IconButton>
      </HeaderBox>
      <ContentBox>
        <DialogContent>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Tu sesión ha sido finalizada debido a que perdiste la autorización de conexión con el servidor.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: "#4197CB",
              color: "white",
              "&:hover": { backgroundColor: "white", color: "#4197CB" },
              borderRadius: "8px",
              textTransform: "none",
              width: "50%",
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </ContentBox>
    </StyledDialog>
  );
}

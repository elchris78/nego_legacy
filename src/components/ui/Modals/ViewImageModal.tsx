"use client";

import { Dialog, styled } from "@mui/material";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "15px",
    maxWidth: "420px",
    border: "3px solid #4197CB",
    padding: "24px",
    textAlign: "center",
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  imagen: string;
  title?: string;
  altText?: string;
}

const ViewImageModal = ({
  open,
  onClose,
  imagen,
  title = "Inspección de imagen",
  altText = "Imagen",
}: Props) => {
  return (
    <StyledDialog open={open} onClose={onClose} fullWidth>
      <div className="flex flex-col items-center gap-4 py-4">
        <h3 className="font-semibold text-lg text-[#4197CB]">{title}</h3>
        <img
          src={imagen}
          alt={altText}
          className="max-h-60 max-w-full rounded shadow"
          style={{ objectFit: "contain", background: "#F5F6FA" }}
        />
        <Button variant="outline" className="mt-2 px-8" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </StyledDialog>
  );
};

export default ViewImageModal;

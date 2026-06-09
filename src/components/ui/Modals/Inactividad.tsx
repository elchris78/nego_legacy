import React, { useEffect, useRef, useState } from "react";
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

interface LogoutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  onTimeout: () => void;
  refresh: () => void;
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

export default function Inactividad({ open, setOpen, onConfirm, onTimeout, refresh }: LogoutModalProps) {
  const [timeLeft, setTimeLeft] = useState(900000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      const newEndTime = Date.now() + 900000;
      localStorage.setItem("logoutEndTime", String(newEndTime)); // Siempre reiniciar al abrir
      setTimeLeft(900000); // Reiniciar el estado
  
      intervalRef.current = setInterval(() => {
        const endTime = parseInt(localStorage.getItem("logoutEndTime") || "0");
        const remaining = endTime - Date.now();
  
        if (remaining <= 0) {
          clearInterval(intervalRef.current!);
          setTimeLeft(0);
          onTimeout();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
  
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [open, onTimeout]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && open) {
        const savedEndTime = localStorage.getItem("logoutEndTime");
        if (savedEndTime) {
          const remainingTime = parseInt(savedEndTime) - Date.now();
          if (remainingTime > 0) {
            setTimeLeft(remainingTime);
          } else {
            onTimeout();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [open, onTimeout]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.removeItem("logoutEndTime"); // Eliminar el tiempo almacenado
    setTimeLeft(900000);
    onConfirm();
    refresh();
  };
  useEffect(() => {
    let hiddenTime: number | null = null;
  
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTime = Date.now();
      } else if (hiddenTime) {
        const elapsed = Date.now() - hiddenTime;
        
        // Si el tiempo transcurrido es mayor al umbral de inactividad (15 min)
        if (elapsed >= 900000) {
          onTimeout();
        }
        hiddenTime = null; // Resetear el tiempo
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onTimeout]);

  return (
    <StyledDialog
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          // Si el usuario cierra el modal haciendo clic fuera o presionando ESC, también reiniciamos el tiempo
          localStorage.removeItem("logoutEndTime"); // Eliminar el tiempo almacenado
          setTimeLeft(900000); // Reiniciar el contador
        }
        setOpen(false); // Cerrar el modal
      }}
    >
      <HeaderBox>
        <DialogTitle sx={{ color: "white" }}>Inactividad</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <Image src={X} alt="Cerrar" width={30} height={30} />
        </IconButton>
      </HeaderBox>
      <ContentBox>
        <DialogContent>
          <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, textAlign: "center" }}>
            Su sesión se cerrará por inactividad.
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              textAlign: "center",
              marginTop: "16px",
              color: "#FF0000",
            }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "#4197CB",
              color: "white",
              "&:hover": { backgroundColor: "white", color: "#4197CB" },
              borderRadius: "8px",
              textTransform: "none",
              width: "50%",
            }}
          >
            Continuar en la aplicación
          </Button>
        </DialogActions>
      </ContentBox>
    </StyledDialog>
  );
}

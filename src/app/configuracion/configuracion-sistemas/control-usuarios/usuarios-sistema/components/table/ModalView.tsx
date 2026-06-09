import React, { useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  styled,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { Input } from "@/components/ui/input"
import { LabelTooltip } from "@/components/ui/LabelTooltip"
import { Label } from "@/components/ui/label"

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    maxWidth: "1300px",
  },
}))

const HeaderBox = styled("div")(() => ({
  backgroundColor: "#ffffff",
  padding: "16px 24px",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
}))

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: 16,
  top: "30%",
  transform: "translateY(-50%)",
  border: "2px solid #4197CB",
  borderRadius: "50%",
  width: 30,
  height: 30,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#4197CB",
}))

const ContentBox = styled("div")(() => ({
  padding: "16px 32px",
}))

interface ModalViewProps {
  selectedUser: any
  isOpenModal: boolean
  onCloseModal: () => void
  title?: string
}

const ModalView = ({ selectedUser, isOpenModal, onCloseModal, title }: ModalViewProps) => {

    useEffect(() => {
        console.log('este es el usuario a visualizar:', selectedUser)
    }, [selectedUser])
  return (
    <StyledDialog
      open={isOpenModal}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onCloseModal()
        }
      }}
      fullWidth
    >
      <HeaderBox>
        <DialogTitle
          sx={{
            color: "#5D6D7E",
            fontSize: "1.875rem",
            fontWeight: 700,
            padding: 0,
            textAlign: "center",
          }}
        >
          {title || "Datos del usuario"}
        </DialogTitle>
        <CloseButton onClick={onCloseModal}>
          <CloseIcon sx={{ fontSize: 15 }} />
        </CloseButton>
      </HeaderBox>

      <ContentBox>
        <DialogContent
            sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)", // 2 columnas en pantallas pequeñas
                  sm: "repeat(3, 1fr)", // 3 columnas en pantallas medianas en adelante
                },
                gap: 2, // Espaciado entre elementos
                padding: 0,
                paddingTop: 2,
                paddingBottom: 2,
            }}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
            <div className="flex flex-col space-y-1.5" >
                <Label className="text-[#5D6D7E]">ID de Usuario</Label>
                <Input type="text" className="border-[#949DA4] bg-[#E3E1E6]"  disabled value={selectedUser?.user?.userId || ""} />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label className="text-[#5D6D7E]">Fecha de creación</Label>
                <Input 
                className="border-[#949DA4] bg-[#E3E1E6]"
                type="text" 
                disabled 
                value={selectedUser?.user?.createdAt ? new Date(selectedUser.user.createdAt).toLocaleDateString() : ""}
                />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label className="text-[#5D6D7E]">*Estatus</Label>
                <Input 
                className="border-[#949DA4] bg-[#E3E1E6]"
                type="text" 
                disabled 
                value={selectedUser?.user?.isActive ? "Activo" : "Inactivo"} 
                />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label className="text-[#5D6D7E]">*Nombre completo</Label>
                <Input className="border-[#949DA4] bg-[#E3E1E6]" type="text" disabled value={selectedUser?.user?.fullName || ""} />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label className="text-[#5D6D7E]">*Usuario</Label>
                <Input className="border-[#949DA4] bg-[#E3E1E6]" type="text" disabled value={selectedUser?.user?.userName || ""} />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label className="text-[#5D6D7E]">*Correo electrónico</Label>
                <Input className="border-[#949DA4] bg-[#E3E1E6]" type="text" disabled value={selectedUser?.user?.email || ""} />
            </div>
        </DialogContent>



        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={onCloseModal}
            sx={{
              width: "150px",
              borderRadius: "8px",
              backgroundColor: "#4197CB",
              color: "#ffffff",
              textTransform: "none",
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </ContentBox>
    </StyledDialog>
  )
}

export default ModalView

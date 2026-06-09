import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  IconButton, 
  Typography,
  Box,
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Alerta from "@/assets/AlertN.svg";
import Image from 'next/image';
import X from '@/assets/X.png';

interface LogoutModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  handleConfirm: () => void
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    overflow: 'visible',
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#3C98CB',
  padding: theme.spacing(2),
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  position: 'relative',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1),
}));

export default function CerrarSesion({ open, setOpen, handleConfirm }: LogoutModalProps) {
  const handleClose = () =>{
    setOpen(false)
  }


  return (

    <StyledDialog open={open} maxWidth="sm" fullWidth  onClose={(event, reason) => {
      if (reason === "backdropClick" || reason === "escapeKeyDown") {
        return;
      }
      handleClose();
    }}>
      <HeaderBox
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#3C98CB',
          position: 'relative',
          px: {xs: 0, md:1, lg:2},
          py: 1.5,
        }}
      >
        <DialogTitle sx={{ color: 'white', fontSize: {xs: '1.5rem' , md:'1.75rem'}, paddingBottom: {xs: 1, md:0}, pl: {xs: 1.5} }}>
          Cerrar sesión
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
          }}
        >
          <Image src={X} alt="Salir" width={30} height={30} />
        </IconButton>
      </HeaderBox>

      <ContentBox>
        <DialogContent  sx={{
          marginTop: 0,
          '& .MuiTextField-root': {
            width: { xs: '100%', md: '100%' },
          },
        }}>

          <Typography sx={{
            fontSize: '1.25rem', 
            color: '#4B5563',    
            fontWeight: 700 ,   
            textAlign: 'center'
          }}>
            ¿Estás seguro de que deseas cerrar tu sesión?
          </Typography>
        </DialogContent>
        <DialogActions  sx={{
          justifyContent: 'center',
          padding: '16px 0 0 0',
          gap: {xs:2, md:6},
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          '& .MuiButton-root': {
            width: { xs: '90%', md: '150px' },
          },
        }}>
          <Button onClick={handleClose} sx={{ borderColor: '#4197CB', backgroundColor: 'white', color: '#4197CB', '&:hover': { backgroundColor: '#4197CB', color: 'white' }, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="outlined">
          <Typography paddingX={2}>Cancelar</Typography>
          </Button>
          <Button onClick={handleConfirm} sx={{ backgroundColor: '#4197CB', mr: 1, color: 'white', '&:hover': { backgroundColor: 'white', color: '#4197CB' , borderColor: '#4197CB'}, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="contained">
          <Typography paddingX={2}>Confirmar</Typography>
          </Button>
        </DialogActions>
      </ContentBox>
    </StyledDialog>
  )
}

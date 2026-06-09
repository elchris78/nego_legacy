import React, { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { styled } from '@mui/system';
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
import Alerta from "@/assets/AlertN.svg";
import Image from 'next/image';
import X from '@/assets/X.png';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (company: { companyId: number; name: string; token: string }) => void;
  companyId: number | null;
  name: string;
  token: string | null;
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

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  companyId,
  name,
  token
}) => {
  
  const [error, setError] = useState('');
  const [existsError, setExistsError] = useState('');
  
  const handleSubmit = async () => {
    if (companyId && token) {
      setError('');
      setExistsError('');

      if(name.toLowerCase() === 'MedTest'.toLowerCase() ){
        setExistsError('Error al eliminar la empresa.');
      }
      else{
        try {
          await onConfirm({ companyId, name, token });
          onClose(); 
        } catch (err) {
          setExistsError('Error al eliminar la empresa.');
        }
      }
    } else {
      setExistsError('Error al eliminar la empresa.');
    }
  }; 

  return (
    <>
    <StyledDialog open={isOpen} maxWidth="sm" fullWidth  onClose={(event, reason) => {
      if (reason === "backdropClick" || reason === "escapeKeyDown") {
        return;
      }
      onClose
    }}>
      <HeaderBox
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#D05559',
          position: 'relative',
          px: {xs: 0, md:1, lg:2},
          py: 1.5,
        }}
      >
        <DialogTitle sx={{ color: 'white', fontSize: {xs: '1.5rem' , md:'1.75rem'}, paddingBottom: {xs: 1, md:0}, pl: {xs: 1.5} }}>
          Eliminar empresa
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
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
      <DialogContent
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // En columna para pantallas chicas y en fila para grandes
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-start" }, // Centramos para pantallas chicas
            textAlign: { xs: "center", md: "left" }, // Texto centrado en pantallas chicas
            gap: { xs: 2, lg: 4 }, // Espaciado entre elementos
          }}
        >
          <Image
            src={Alerta}
            alt="Alerta"
            width={150}
            height={150}
            className="w-20 h-20 md:w-32 md:h-32 mb-1 md:mb-0"
          />
          <Typography fontWeight={500} paddingBottom={1}>
            ¿Estás seguro de que deseas borrar esta empresa de <b>forma definitiva</b>?
          </Typography>
    </DialogContent>

        <DialogActions  sx={{
          justifyContent: 'center',
          padding: '16px 0 0 0',
          gap: {xs:2, md:6},
          flexDirection: { xs: 'column', md: 'row' }, // Cambia la dirección en pantallas pequeñas
          width: '100%',
          '& .MuiButton-root': {
            width: { xs: '90%', md: '150px' }, // Ajusta el ancho de los botones en pantallas pequeñas
          },
        }}>
          <Button onClick={onClose} sx={{ borderColor: '#D05559', backgroundColor: 'white', color: '#D05559', '&:hover': { backgroundColor: '#D05559', color: 'white' }, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="outlined">
          <Typography paddingX={2}>Cancelar</Typography>
          </Button>
          <Button onClick={handleSubmit} sx={{ backgroundColor: '#D05559', mr: 1, color: 'white', '&:hover': { backgroundColor: 'white', color: '#D05559' , borderColor: '#D05559'}, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="contained">
          <Typography paddingX={2}>Confirmar</Typography>
          </Button>
        </DialogActions>
      </ContentBox>
      {existsError && (
        <Alert 
          severity="error" 
          icon={
            <Image
              src={Alerta}
              alt="Error"
              color='white'
              width={25}
              height={25}
            />
          }
          sx={{ 
            justifyContent: 'center',
            backgroundColor: '#D05C5C', 
            color: 'white',
            borderTopLeftRadius: 0, 
            borderTopRightRadius: 0, 
            borderBottomLeftRadius: '12px', 
            borderBottomRightRadius: '12px', 
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {existsError}
        </Alert>
      )}
    </StyledDialog>


    </>
  );
};

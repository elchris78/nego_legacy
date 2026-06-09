import { TriangleAlert } from 'lucide-react';
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
  Alert,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Alerta from "@/assets/AlertN.svg";
import Image from 'next/image';
import X from '@/assets/X.png';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { LabelTooltip } from "@/components/ui/LabelTooltip";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditCompany: (company: { companyId: number; name: string; token: string }) =>  Promise<string | undefined>;
  companyId: number | null;
  initialName: string;
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

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onEditCompany, companyId, initialName, token }) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [existsError, setExistsError] = useState('');

  const handleSubmit = async () => {
    if (companyId && token) {
      setError('');
      setExistsError('');

      if (!name.trim()) {
        setError('El nombre de la empresa es obligatorio.');
        return;
      } else if (name.trim().length < 3) {
        setError('El nombre de la empresa debe contener al menos 3 caracteres.');
        return;
      }else if(name.length > 80){
        setError('El nombre de la empresa contiene más de 80 caracteres.');
        return;
      } 
      else if (name.trim()[0] !== name.trim()[0].toUpperCase()) {
        setError('La primera letra del nombre de la empresa debe ser mayúscula.');
        return;
      }
      else if(name[0] === " "){
        setError('No puede tener espacio al principio del nombre.');
        return;
      }
      else if(name[(name.length - 1)] === " "){
        setError('No puede tener espacio al final del nombre.');
        return;
      }
      else if(name === initialName){
        setError('No puede dejar el mismo nombre.');
        return;
      }

      const creationError = await onEditCompany({ companyId, name, token });
      
      console.log("Log del modal: " + creationError)

      if (creationError) {
        if (creationError.includes('Ya existe una empresa con este nombre')) {
          setExistsError(creationError);
        } else {
          setExistsError("Error al editar la empresa."); 
        }
      } else {
        onClose(); 
      }
    
    } else {
      setExistsError('Error al editar la empresa.');
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
          bgcolor: '#3C98CB',
          position: 'relative',
          px: {xs: 0, md:1, lg:2},
          py: 0.5,
          justifyContent: 'center',
        }}
      >
        <DialogTitle sx={{ color: 'white', fontSize: {xs: '1.5rem' , md:'1.75rem'}, paddingBottom: {xs: 1, md:0}, pl: {xs: 1.5} }}>
          Editar empresa
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
        <DialogContent  sx={{
          marginTop: 0,
          '& .MuiTextField-root': {
            width: { xs: '100%', md: '100%' }, // Ajusta el ancho del input en pantallas pequeñas
          },
        }}>

        <LabelTooltip
          label="*Nombre de la empresa"
          tooltip="Ingresa el nombre comercial de la empresa. Debe contener mínimo 3 caracteres y empezar con mayúscula, no debe ser el mismo nombre que alguno existente."
          htmlFor="name"
        />
          <TextField
            autoFocus
            margin="dense"
            id="companyName"
            placeholder="Nombre de la empresa"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ marginTop: 0,'& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: existsError ? '#D05C5C' : 'default',
              },
              '&:hover fieldset': {
                borderColor: existsError ? '#D05C5C' : 'default',
              },
              '&.Mui-focused fieldset': {
                borderColor: existsError ? '#D05C5C' : 'primary.main',
              },
              borderRadius: '16px',
            }, }}
          />
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
          <Button onClick={onClose} sx={{ borderColor: '#4197CB', backgroundColor: 'white', color: '#4197CB', '&:hover': { backgroundColor: '#4197CB', color: 'white' }, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="outlined">
          <Typography paddingX={2}>Cancelar</Typography>
          </Button>
          <Button onClick={handleSubmit} sx={{ backgroundColor: '#4197CB', mr: 1, color: 'white', '&:hover': { backgroundColor: 'white', color: '#4197CB' , borderColor: '#4197CB'}, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="contained">
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
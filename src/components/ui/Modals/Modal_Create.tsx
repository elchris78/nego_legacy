import React, { useState, useEffect } from 'react';
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
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Alerta from "@/assets/AlertN.svg";
import Image from 'next/image';
import X from '@/assets/X.png';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { LabelTooltip } from "@/components/ui/LabelTooltip";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCompany: (company: CompanyProps) => Promise<string | undefined>;
}

interface CompanyProps {
  companyId: number;
  name: string;
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

export const CreateModal: React.FC<ModalProps> = ({ isOpen, onClose, onCreateCompany }) => {
  const [company, setCompany] = useState<CompanyProps>({
    companyId: 0,
    name: '',
  });
  const [error, setError] = useState('');
  const [existsError, setExistsError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const isBelow400 = useMediaQuery("(max-width:400px)");

  const validateCompanyName = (name: string) => {
    // Revisión de los requerimientos
    if (!name.trim()) {
      // setError('El nombre de la empresa es obligatorio.');
      setIsValid(false);
    } else if (name.trim().length < 3) {
      // setError('El nombre de la empresa debe contener al menos 3 caracteres.');
      setIsValid(false);
    } else if (name.length > 80) {
      // setError('El nombre de la empresa contiene más de 80 caracteres.');
      setIsValid(false);
    } else if (name.trim()[0] !== name.trim()[0].toUpperCase()) {
      // setError('La primera letra del nombre de la empresa debe ser mayúscula.');
      setIsValid(false);
    } else if (name[0] === " ") {
      // setError('No puede tener espacio al principio del nombre.');
      setIsValid(false);
    } else if (name[name.length - 1] === " ") {
      // setError('No puede tener espacio al final del nombre.');
      setIsValid(false);
    } else {
      setError('');
      setIsValid(true); // Si pasa todas las validaciones, habilitamos el botón
    }
  };

  useEffect(() => {
    validateCompanyName(company.name);
  }, [company.name]); // Se ejecuta cada vez que cambie el nombre de la empresa
  
  const handleSave = async () => {
    setError('');
    setExistsError('');
  
    const creationError = await onCreateCompany(company);

    if (creationError) {
      if (creationError.includes('Ya existe una empresa con este nombre')) {
        setError(creationError);
      } else {
        setError("Error al crear la empresa."); 
      }
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setCompany({ ...company, name: '' });
    setError('');
    setExistsError('');
    onClose();
  };

  return (
    
    <StyledDialog open={isOpen} maxWidth="sm" fullWidth  onClose={(event, reason) => {
      if (reason === "backdropClick" || reason === "escapeKeyDown") {
        return;
      }
      handleClose();
    }}>
      <HeaderBox
        sx={{
          display: 'flex',
          justifyContent: isBelow400 ? 'start' : 'center',
          gap: 2,
          alignItems: 'center',
          bgcolor: '#3C98CB',
          position: 'relative',
          px: {xs: 0, md:1, lg:2},
          py: 0.5,
        }}
      >
        <DialogTitle 
          sx={{
            color: 'white',
            fontSize: { xs: '18px', md: '1.5rem' },
            paddingBottom: { xs: 1, md: 0 },
            pl: { xs: 1.5 },
          }}
        >
          Crear nueva empresa
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
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
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
            }, 
            
          }}
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
          <Button onClick={handleClose} sx={{ borderColor: '#4197CB', backgroundColor: 'white', color: '#4197CB', '&:hover': { backgroundColor: '#4197CB', color: 'white' }, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="outlined">
          <Typography paddingX={2}>Cancelar</Typography>
          </Button>
          <Button onClick={handleSave} disabled={!isValid} sx={{ backgroundColor: '#4197CB', mr: 1, color: 'white', '&:hover': { backgroundColor: 'white', color: '#4197CB' , borderColor: '#4197CB'}, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="contained">
          <Typography paddingX={2}>Guardar</Typography>
          </Button>
        </DialogActions>
      </ContentBox>
    </StyledDialog>
  );
};
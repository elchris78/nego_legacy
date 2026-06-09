import { TriangleAlert } from 'lucide-react';
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton, 
  Typography,
  Box,
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import Alerta from "@/assets/AlertN.svg";
import Image from 'next/image';
import X from '@/assets/X.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarsArray: any[];
  onSelectAvatar: (name: string) => void;
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

export const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, avatarsArray,onSelectAvatar}) => {
  const [error, setError] = useState('');
  const [existsError, setExistsError] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [startIndex, setStartIndex] = useState(0);
  const PAGE_SIZE = 3;
  const visibleAvatars = avatarsArray.slice(startIndex, startIndex + PAGE_SIZE);
  
  const handleNext = () => {
    if (startIndex + PAGE_SIZE < avatarsArray.length) {
      setStartIndex(startIndex + 3);
    }
  };
  
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 3);
    }
  };  

  const handleSelectAvatar = (name: string) => {
    setSelectedAvatar(name);
    console.log(selectedAvatar);
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
          py: 1.5,
        }}
      >
        <DialogTitle sx={{ color: 'white', fontSize: {xs: '1.5rem' , md:'1.75rem'}, paddingBottom: {xs: 1, md:0}, pl: {xs: 1.5} }}>
          Elige un avatar
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

      <ContentBox >
      <DialogContent sx={{ marginTop: 0 }}>
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button
      variant="outlined"
      onClick={handlePrev}
      disabled={startIndex === 0}
      sx={{
        textTransform: 'none',
        width: '40px', // Reduce aún más el ancho
        minWidth: 'unset', // Evita que Material-UI aplique un ancho mínimo predeterminado
        height: '90px', // Mantén la altura necesaria
        padding: 0, // Sin padding
        margin: 0, // Sin márgenes adicionales
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ChevronLeft size={24} style={{margin: '0 0'}} />
    </Button>

    {visibleAvatars.map(({ name, src }, index) => (
      <Box
        key={index}
        sx={{
          textAlign: 'center',
          cursor: 'pointer',
          width: '100%',
          backgroundColor: selectedAvatar === name ? '#4197CB' : 'transparent', // Fondo azul si está seleccionado
          transition: 'background-color 0.3s', // Agregar transición suave
          borderRadius: '10px'
        }}
        onClick={() => handleSelectAvatar(name)}
      >
        <Image
          src={src}
          alt={name}
          width={70}
          height={70}
          style={{
            borderRadius: '50%',
            border: '2px solid #4197CB',
            display: 'block',
            margin: '0 auto',
            marginTop: 3
          }}
        />
        <Typography
          sx={{
            marginTop: 1,
            fontSize: '0.9rem',
            fontWeight: 500,
             color: selectedAvatar === name ? 'white' : 'inherit'
          }}
        >
          {name}
        </Typography>
      </Box>
    ))}

    <Button
      variant="outlined"
      onClick={handleNext}
      disabled={startIndex + PAGE_SIZE >= avatarsArray.length}
      sx={{
        textTransform: 'none',
        width: '40px', // Reduce aún más el ancho
        minWidth: 'unset', // Evita que Material-UI aplique un ancho mínimo predeterminado
        height: '90px', // Mantén la altura necesaria
        padding: 0, // Sin padding
        margin: 0, // Sin márgenes adicionales
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ChevronRight size={24} style={{ margin: 'auto' }} />
    </Button>
  </Box>
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
          <Button  onClick={() => selectedAvatar && onSelectAvatar(selectedAvatar)} sx={{ backgroundColor: '#4197CB', mr: 1, color: 'white', '&:hover': { backgroundColor: 'white', color: '#4197CB' , borderColor: '#4197CB'}, borderRadius: '8px',textTransform: 'none', width:'150px' }} variant="contained">
            <Typography paddingX={2}>Aceptar</Typography>
          </Button>
        </DialogActions>
      </ContentBox>
    </StyledDialog>
    </>
  );
};